/* global React, ReactDOM, Store, MATCHES, uuid, genLeagueCode, ensureAdmin,
   aiOraculoProno, aiDebrief, aiPreMatch, aiWrapped, scoreProno, resultFor, leagueStandings,
   AuthView, DashboardView, LeaguesView, LeagueView, MatchView, AdminView, WrappedView, MatchesView, ProfileView,
   StatusBar, BottomNav, Toast */

const preCache = new Map();   // matchId -> {analyse, confiance}
const wrapCache = new Map();  // pseudo  -> card

function App() {
  const [ready, setReady] = React.useState(false);
  const [version, setVersion] = React.useState(0);
  const [session, setSession] = React.useState(null);
  const [route, setRoute] = React.useState({ view: "dashboard" });
  const [toastMsg, setToastMsg] = React.useState("");
  const [, setTick] = React.useState(0);

  const refresh = React.useCallback(() => setVersion((v) => v + 1), []);
  const toast = React.useCallback((m) => { setToastMsg(m); clearTimeout(window.__t); window.__t = setTimeout(() => setToastMsg(""), 2400); }, []);

  // boot
  React.useEffect(() => { (async () => { await ensureAdmin(); setSession(Store.session()); setReady(true); })(); }, []);
  // horloge temps réel (countdowns / statuts)
  React.useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 1000); return () => clearInterval(id); }, []);

  function go(view, params = {}) {
    if (view === "logout") { Store.setSession(null); setSession(null); setRoute({ view: "dashboard" }); return; }
    if (view === "profil") view = "profil";
    setRoute({ view, ...params });
    window.scrollTo(0, 0);
  }
  function onAuthed() { setSession(Store.session()); setRoute({ view: "dashboard" }); }

  // ---------- ACTIONS ----------
  async function genOraProno(leagueId, match) {
    const all = Store.oraculo();
    if (all.some((o) => o.leagueId === leagueId && o.matchId === match.id)) return;
    if (window.isMatchLockedByPhase(match)) return;
    try {
      const p = await aiOraculoProno(match);
      const fresh = Store.oraculo();
      if (fresh.some((o) => o.leagueId === leagueId && o.matchId === match.id)) return;
      Store.setOraculo([...fresh, { leagueId, matchId: match.id, scoreA: p.score_a, scoreB: p.score_b, replique: p.replique, generatedAt: new Date().toISOString() }]);
    } catch (e) { console.warn(e); }
  }

  async function ensureOraculoPronos(leagueId) {
    const now = new Date();
    const targets = MATCHES
      .filter((m) => !window.isMatchLockedByPhase(m))
      .filter((m) => { const st = window.matchStatus(m); return st === "open" || st === "urgent" || st === "awaiting" || st === "live"; })
      .filter((m) => new Date(m.date) - now < 72 * 3600000)
      .slice(0, 8);
    let changed = false;
    for (const m of targets) {
      const before = Store.oraculo().length;
      await genOraProno(leagueId, m);
      if (Store.oraculo().length !== before) changed = true;
    }
    if (changed) refresh();
  }

  function createLeague(nom) {
    const codes = new Set(Store.leagues().map((l) => l.code));
    let code; do { code = genLeagueCode(); } while (codes.has(code));
    const league = { id: uuid(), code, nom, createdBy: session.userId, createdAt: new Date().toISOString(), membres: [session.userId] };
    Store.setLeagues([...Store.leagues(), league]);
    refresh();
    ensureOraculoPronos(league.id);
    return league;
  }

  function joinLeague(code) {
    const leagues = Store.leagues();
    const l = leagues.find((x) => x.code.toUpperCase() === code.toUpperCase());
    if (!l) return { ok: false, msg: "Code introuvable." };
    if (l.membres.includes(session.userId)) return { ok: true, id: l.id };
    l.membres.push(session.userId);
    Store.setLeagues(leagues); refresh();
    return { ok: true, id: l.id };
  }

  async function submitProno({ matchId, leagueId, scoreA, scoreB, justification, bonusX2 }) {
    const pronos = Store.pronos();
    const i = pronos.findIndex((p) => p.matchId === matchId && p.userId === session.userId && p.leagueId === leagueId);
    const entry = { id: i >= 0 ? pronos[i].id : uuid(), userId: session.userId, leagueId, matchId, scoreA, scoreB, justification, bonusX2, soumisAt: new Date().toISOString() };
    if (i >= 0) pronos[i] = entry; else pronos.push(entry);
    Store.setPronos(pronos); refresh();
    const m = MATCHES.find((x) => x.id === matchId);
    if (m) await genOraProno(leagueId, m);
    refresh();
  }

  function vote(matchId, v) {
    const votes = Store.votes();
    const i = votes.findIndex((x) => x.userId === session.userId && x.matchId === matchId);
    if (i >= 0) votes[i].vote = v; else votes.push({ userId: session.userId, matchId, vote: v });
    Store.setVotes(votes); refresh();
  }

  async function getPreMatch(match) {
    if (preCache.has(match.id)) return preCache.get(match.id);
    const p = await aiPreMatch(match);
    preCache.set(match.id, p);
    return p;
  }

  async function getWrapped(stats) {
    if (wrapCache.has(stats.pseudo)) return wrapCache.get(stats.pseudo);
    const c = await aiWrapped(stats);
    wrapCache.set(stats.pseudo, c);
    return c;
  }

  async function validateResult(matchId, scoreA, scoreB) {
    const results = Store.results();
    const i = results.findIndex((r) => r.matchId === matchId);
    const entry = { matchId, scoreA, scoreB, saisiPar: session.userId, saisiAt: new Date().toISOString() };
    if (i >= 0) results[i] = entry; else results.push(entry);
    Store.setResults(results);

    const match = MATCHES.find((m) => m.id === matchId);
    // ligues concernées = celles avec au moins un prono humain sur ce match
    const leagueIds = [...new Set(Store.pronos().filter((p) => p.matchId === matchId).map((p) => p.leagueId))];
    for (const lid of leagueIds) {
      await genOraProno(lid, match);
      const league = Store.leagues().find((l) => l.id === lid);
      if (!league) continue;
      const users = Store.users();
      const lines = Store.pronos().filter((p) => p.matchId === matchId && p.leagueId === lid)
        .map((p) => ({ p, u: users.find((u) => u.id === p.userId), s: scoreProno(p, entry, lid) }))
        .filter((x) => x.u)
        .sort((x, y) => y.s.pts - x.s.pts);
      const ora = Store.oraculo().find((o) => o.matchId === matchId && o.leagueId === lid);
      const oraS = ora ? scoreProno({ scoreA: ora.scoreA, scoreB: ora.scoreB, matchId }, entry, lid) : { pts: 0 };
      const ctx = {
        nomLigue: league.nom, equipeA: match.equipeA, equipeB: match.equipeB, scoreA, scoreB,
        oraA: ora ? ora.scoreA : "?", oraB: ora ? ora.scoreB : "?", ptsOraculo: oraS.pts,
        first: lines[0]?.u.pseudo, last: lines[lines.length - 1]?.u.pseudo,
        lignes: lines.map((x, idx) => `${idx + 1}. ${x.u.pseudo} → ${x.p.scoreA}-${x.p.scoreB} (${x.s.pts} pts)`).join("\n"),
      };
      try {
        const d = await aiDebrief(ctx);
        const debs = Store.debriefs().filter((x) => !(x.matchId === matchId && x.leagueId === lid));
        debs.push({ matchId, leagueId: lid, texte: d.texte, generatedAt: new Date().toISOString() });
        Store.setDebriefs(debs);
      } catch (e) { console.warn(e); }
    }
    refresh();
    return { leagues: leagueIds.length };
  }

  const actions = { createLeague, joinLeague, ensureOraculoPronos, submitProno, vote, getPreMatch, getWrapped, validateResult };

  if (!ready) return <div className="app" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}><div className="spin" /></div>;
  if (!session) return <div className="app"><StatusBar /><AuthView onAuthed={onAuthed} toast={toast} /><Toast msg={toastMsg} /></div>;

  const common = { session, go, route, actions, toast, tick: version };
  let view;
  switch (route.view) {
    case "dashboard": view = <DashboardView {...common} />; break;
    case "ligues":    view = <LeaguesView {...common} />; break;
    case "league":    view = <LeagueView {...common} />; break;
    case "match":     view = <MatchView {...common} />; break;
    case "admin":     view = <AdminView {...common} />; break;
    case "wrapped":   view = <WrappedView {...common} />; break;
    case "matchs":    view = <MatchesView {...common} />; break;
    case "profil":    view = <ProfileView {...common} />; break;
    default:          view = <DashboardView {...common} />;
  }
  const navActive = ["dashboard", "matchs", "ligues", "wrapped", "profil"].includes(route.view) ? route.view
    : route.view === "league" ? "ligues" : route.view === "match" ? "matchs" : "dashboard";

  return (
    <div className="app">
      <StatusBar />
      {view}
      <BottomNav active={navActive} go={go} />
      <Toast msg={toastMsg} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
