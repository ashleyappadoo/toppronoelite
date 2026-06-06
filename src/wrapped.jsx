/* global React, Store, MATCHES, resultFor, scoreProno, outcome, Oraculo, OraAv, Av, TpeIcons, Header */
function computeWrappedStats(session) {
  const myPronos = Store.pronos().filter((p) => p.userId === session.userId);
  const resolved = myPronos.filter((p) => resultFor(p.matchId));
  let bons = 0, exacts = 0, x2used = 0, x2ok = 0, beat = 0;
  const winTeams = {};
  resolved.forEach((p) => {
    const res = resultFor(p.matchId);
    const m = MATCHES.find((x) => x.id === p.matchId);
    const good = outcome(p.scoreA, p.scoreB) === outcome(res.scoreA, res.scoreB);
    if (good) bons++;
    const sb = scoreProno(p, res, p.leagueId);
    if (sb.exact) exacts++;
    if (p.bonusX2) { x2used++; if (sb.pts > 0) x2ok++; }
    // équipe gagnante pronostiquée
    if (m) {
      const win = p.scoreA > p.scoreB ? m.equipeA : p.scoreB > p.scoreA ? m.equipeB : null;
      if (win) winTeams[win] = (winTeams[win] || 0) + 1;
    }
    // El Oraculo battu
    const ora = Store.oraculo().find((o) => o.matchId === p.matchId && o.leagueId === p.leagueId);
    if (ora) {
      const osb = scoreProno({ scoreA: ora.scoreA, scoreB: ora.scoreB, matchId: p.matchId }, res, p.leagueId);
      if (sb.pts > osb.pts) beat++;
    }
  });
  const equipe = Object.entries(winTeams).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  return {
    pseudo: session.pseudo, n: resolved.length,
    bons: resolved.length ? Math.round((bons / resolved.length) * 100) : 0,
    exacts, x2used, x2ok, beat, equipe,
  };
}

function WrappedView({ session, go, actions, toast }) {
  const stats = React.useMemo(() => computeWrappedStats(session), [session.userId]);
  const [card, setCard] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const unlocked = stats.n >= 10;

  React.useEffect(() => {
    if (!unlocked) return;
    setBusy(true);
    actions.getWrapped(stats).then((c) => { setCard(c); setBusy(false); });
  }, [unlocked]);

  const { share: IShare, copy: ICopy } = TpeIcons;

  function copy() {
    if (!card) return;
    const txt = `🔮 TPE Wrapped — ${stats.pseudo}\n${card.titre}\n${card.description}\n\n${stats.bons}% bons résultats · ${stats.exacts} scores exacts · El Oraculo battu ${stats.beat}×\n#TopPronoElite`;
    navigator.clipboard?.writeText(txt); toast("Wrapped copié — balance ça dans le groupe !");
  }

  if (!unlocked) {
    return (
      <div className="page fade">
        <Header title="TPE Wrapped" sub="Ton bilan CdM 2026" />
        <div className="page-pad" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 40 }}>
          <Oraculo size={90} />
          <div className="disp" style={{ fontSize: 40, marginTop: 16 }}>Bientôt…</div>
          <p style={{ color: "var(--ink-2)", fontSize: 14, lineHeight: 1.5, maxWidth: 280, marginTop: 8 }}>
            Ton archétype se débloque après <b style={{ color: "var(--gold)" }}>10 matchs pronostiqués</b>.
          </p>
          <div className="meter" style={{ width: 220, marginTop: 18 }}><i style={{ width: `${Math.min(100, stats.n * 10)}%`, background: "linear-gradient(90deg,#C99A0A,#F5C518)" }} /></div>
          <div className="mono" style={{ fontSize: 12, color: "var(--mut)", marginTop: 8 }}>{stats.n}/10 matchs</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade">
      <Header title="TPE Wrapped" sub="CdM 2026 · partageable" />
      <div className="page-pad">
        <div style={{ borderRadius: 24, padding: "26px 22px 22px", position: "relative", overflow: "hidden",
          background: "radial-gradient(130% 90% at 100% 0%, rgba(139,60,224,0.4), transparent 55%), radial-gradient(120% 90% at 0% 100%, rgba(224,58,43,0.3), transparent 55%), linear-gradient(180deg,#161018,#0C0A0E)",
          border: "1px solid rgba(245,197,24,0.3)", boxShadow: "0 30px 70px -24px rgba(139,60,224,0.6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="logo"><span className="mark">TPE</span></div>
            <Av name={session.pseudo} you />
          </div>
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 12, color: "var(--mut)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Ton archétype</div>
            <div className="disp" style={{ fontSize: 52, lineHeight: 0.92, marginTop: 4 }}><span className="grad-gold">{busy ? "…" : (card ? card.titre : "")}</span></div>
          </div>
          {busy ? <div style={{ marginTop: 16 }}><OraThinkingSafe /></div> : card && <>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, marginTop: 14 }}>"{card.description}"</p>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              {[[stats.bons + "%", "bons résultats"], [stats.exacts, "scores exacts"], [stats.beat + "×", "🔮 battu"]].map(([v, l]) => (
                <div key={l} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid var(--line)", borderRadius: 13, padding: "11px 8px", textAlign: "center" }}>
                  <div className="disp" style={{ fontSize: 30, color: "var(--gold)", lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 9.5, color: "var(--mut)", marginTop: 3, fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>
          </>}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
            <Oraculo size={28} glow={false} />
            <span className="mono" style={{ fontSize: 10.5, color: "var(--mut)", letterSpacing: 0.5 }}>@{session.pseudo} · topprono.elite</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn btn-gold" style={{ flex: 1 }} onClick={copy}><IShare style={{ width: 18, height: 18 }} /> Partager</button>
          <button className="btn btn-ghost" style={{ width: 56, flex: "none" }} onClick={copy}><ICopy style={{ width: 20, height: 20 }} /></button>
        </div>
      </div>
    </div>
  );
}
function OraThinkingSafe() { return <div style={{ display: "flex", alignItems: "center", gap: 9, color: "var(--purple-2)", fontSize: 13, fontWeight: 600 }}><span className="spin" />El Oraculo rédige ton bilan…</div>; }

/* ===================== MATCHS (global) ===================== */
function MatchesView({ session, go }) {
  const { matchStatus, getTimeUntilDeadline, fmtCountdown } = window;
  const leagues = Store.leagues().filter((l) => l.membres.includes(session.userId));
  const lid = leagues[0]?.id || null;
  const [phase, setPhase] = React.useState("all");
  const phases = [["all", "Tous"], ["groupes", "Groupes"], ["1/32", "1/32"], ["1/16", "1/16"], ["QF", "QF"], ["SF", "SF"], ["FINALE", "Finale"]];
  const list = MATCHES.filter((m) => phase === "all" ? true : window.phaseOf(m.groupe) === phase).slice(0, 60);

  return (
    <div className="page fade">
      <Header title="Calendrier" sub="104 matchs · CdM 2026" />
      <div style={{ display: "flex", gap: 7, overflowX: "auto", padding: "0 18px 12px" }}>
        {phases.map(([k, l]) => <button key={k} onClick={() => setPhase(k)} className={"chip " + (phase === k ? "chip-gold" : "chip-mut")} style={{ cursor: "pointer", border: "none", flex: "none" }}>{l}</button>)}
      </div>
      <div className="page-pad">
        {list.map((m) => {
          const st = matchStatus(m), mine = lid && Store.pronos().find((p) => p.leagueId === lid && p.matchId === m.id && p.userId === session.userId);
          return (
            <div key={m.id} className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", marginBottom: 8, cursor: lid ? "pointer" : "default", opacity: window.isMatchLockedByPhase(m) ? 0.6 : 1 }} onClick={() => lid && go("match", { matchId: m.id, leagueId: lid })}>
              <span className="flag" style={{ fontSize: 20 }}>{flagOf(m.equipeA)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.equipeA} – {m.equipeB}</div>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--mut)" }}>{new Date(m.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
              </div>
              <span className="flag" style={{ fontSize: 20 }}>{flagOf(m.equipeB)}</span>
              <span className={"chip " + (st === "done" ? "chip-green" : st === "urgent" ? "chip-red" : mine ? "chip-green" : "chip-mut")}>{st === "done" ? "Fini" : mine ? "✓" : st === "urgent" ? "⚡" : "—"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== PROFIL ===================== */
function ProfileView({ session, go }) {
  const leagues = Store.leagues().filter((l) => l.membres.includes(session.userId));
  const stats = computeWrappedStats(session);
  return (
    <div className="page fade">
      <Header title="Profil" sub={"@" + session.pseudo} right={<button onClick={() => go("logout")} className="chip chip-mut" style={{ border: "none", cursor: "pointer" }}>Déconnexion</button>} />
      <div className="page-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Av name={session.pseudo} you />
          <div style={{ flex: 1 }}><div className="disp" style={{ fontSize: 26 }}>{session.pseudo}</div><div className="mono" style={{ fontSize: 11, color: "var(--mut)" }}>{leagues.length} ligues · {stats.n} pronos</div></div>
          {session.role === "admin" && <button onClick={() => go("admin")} className="chip chip-red" style={{ border: "none", cursor: "pointer" }}>Console admin</button>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[[stats.bons + "%", "bons résultats", "var(--gold)"], [stats.exacts, "scores exacts", "var(--ink)"], [stats.beat + "×", "🔮 battu", "var(--purple-2)"]].map(([v, l, c]) => (
            <div key={l} className="card" style={{ flex: 1, padding: "14px 8px", textAlign: "center" }}><div className="disp" style={{ fontSize: 32, color: c, lineHeight: 1 }}>{v}</div><div style={{ fontSize: 10, color: "var(--mut)", marginTop: 3, fontWeight: 600 }}>{l}</div></div>
          ))}
        </div>
        <button className="btn btn-purple" onClick={() => go("wrapped")}>🔮 Voir mon TPE Wrapped</button>
      </div>
    </div>
  );
}

Object.assign(window, { WrappedView, MatchesView, ProfileView, computeWrappedStats });
