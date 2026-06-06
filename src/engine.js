// ============================================================
// TPE — Moteur : deadlines temps réel, points, classements
// ============================================================
/* global MATCHES, Store */

const DEADLINE_MS = 5 * 60 * 1000;     // fermeture 5 min avant
const LIVE_MS = 3 * 60 * 60 * 1000;    // "en direct" jusqu'à kickoff +3h

function kickoff(m) { return new Date(m.date); }
function deadline(m) { return new Date(kickoff(m).getTime() - DEADLINE_MS); }

function isMatchOpen(m) { return new Date() < deadline(m); }

function getTimeUntilDeadline(m) {
  const diff = deadline(m) - new Date();
  if (diff <= 0) return null;
  return {
    total: diff,
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    days: Math.floor(diff / 86400000),
  };
}

function resultFor(matchId) {
  return Store.results().find((r) => r.matchId === matchId) || null;
}

// statut d'affichage
function matchStatus(m) {
  const res = resultFor(m.id);
  if (res) return "done";
  const now = new Date(), ko = kickoff(m);
  if (now >= ko && now <= new Date(ko.getTime() + LIVE_MS)) return "live";
  if (now >= ko) return "awaiting";        // joué, en attente résultat admin
  const t = getTimeUntilDeadline(m);
  if (!t) return "closed";                  // verrouillé, pas encore joué
  if (t.total <= 2 * 3600000) return "urgent";
  return "open";
}

// les phases éliminatoires sont verrouillées tant que les équipes ne sont pas connues
function isPlaceholderTeam(name) {
  return /^(1er|2e|Meilleur|Vainqueur|Perdant)/.test(name);
}
function isMatchLockedByPhase(m) {
  return isPlaceholderTeam(m.equipeA) || isPlaceholderTeam(m.equipeB);
}

// V / N / D
function outcome(a, b) { return a > b ? "A" : a < b ? "B" : "N"; }

// rareté du score exact dans une ligue/un match
function exactRarity(matchId, leagueId, scoreA, scoreB) {
  const all = Store.pronos().filter((p) => p.matchId === matchId && p.leagueId === leagueId);
  const ora = Store.oraculo().find((o) => o.matchId === matchId && o.leagueId === leagueId);
  const total = all.length + (ora ? 1 : 0);
  if (total === 0) return 0;
  let same = 0;
  all.forEach((p) => { if (p.scoreA === scoreA && p.scoreB === scoreB) same++; });
  if (ora && ora.scoreA === scoreA && ora.scoreB === scoreB) same++;
  const ratio = same / total;
  if (ratio < 0.1) return 10;
  if (ratio < 0.3) return 5;
  return 0;
}

// points d'un pronostic donné un résultat
function scoreProno(prono, res, leagueId) {
  if (!res) return { pts: 0, exact: false, parts: [] };
  const goodResult = outcome(prono.scoreA, prono.scoreB) === outcome(res.scoreA, res.scoreB);
  if (!goodResult) return { pts: 0, exact: false, parts: ["Résultat manqué"] };
  let pts = 3;
  const parts = ["Bon résultat +3"];
  let exact = false;
  if (prono.scoreA === res.scoreA && prono.scoreB === res.scoreB) {
    exact = true;
    pts += 3; parts.push("Score exact +3");
    const r = exactRarity(prono.matchId, leagueId, prono.scoreA, prono.scoreB);
    if (r) { pts += r; parts.push(`Rareté +${r}`); }
  }
  if (prono.bonusX2) { parts.push("Bonus ×2"); pts *= 2; }
  return { pts, exact, parts };
}

// classement d'une ligue (humains + El Oraculo), optionnellement en ignorant N derniers matchs résolus
function leagueStandings(league, ignoreLastN = 0) {
  const results = Store.results().slice().sort((a, b) => new Date(a.saisiAt) - new Date(b.saisiAt));
  const active = ignoreLastN > 0 ? results.slice(0, Math.max(0, results.length - ignoreLastN)) : results;
  const activeIds = new Set(active.map((r) => r.matchId));

  const users = Store.users();
  const pronos = Store.pronos().filter((p) => p.leagueId === league.id);
  const oraPronos = Store.oraculo().filter((o) => o.leagueId === league.id);

  const rows = [];

  league.membres.forEach((uid) => {
    const u = users.find((x) => x.id === uid);
    if (!u) return;
    let pts = 0, exacts = 0, beat = 0;
    const ptsByMatch = {};
    pronos.filter((p) => p.userId === uid && activeIds.has(p.matchId)).forEach((p) => {
      const res = active.find((r) => r.matchId === p.matchId);
      const s = scoreProno(p, res, league.id);
      pts += s.pts; if (s.exact) exacts++;
      ptsByMatch[p.matchId] = s.pts;
    });
    rows.push({ kind: "human", id: uid, pseudo: u.pseudo, pts, exacts, beat, ptsByMatch });
  });

  // El Oraculo
  let oPts = 0, oExacts = 0;
  const oByMatch = {};
  oraPronos.filter((o) => activeIds.has(o.matchId)).forEach((o) => {
    const res = active.find((r) => r.matchId === o.matchId);
    const s = scoreProno({ scoreA: o.scoreA, scoreB: o.scoreB, bonusX2: false, matchId: o.matchId }, res, league.id);
    oPts += s.pts; if (s.exact) oExacts++;
    oByMatch[o.matchId] = s.pts;
  });
  const oraRow = { kind: "oraculo", id: "oraculo", pseudo: "El Oraculo", pts: oPts, exacts: oExacts, ptsByMatch: oByMatch };

  // "El Oraculo battu" : matchs résolus où le joueur a fait plus de points que l'Oraculo
  rows.forEach((r) => {
    let beat = 0;
    active.forEach((res) => {
      const mp = r.ptsByMatch[res.matchId];
      if (mp == null) return;
      const op = oByMatch[res.matchId] || 0;
      if (mp > op) beat++;
    });
    r.beat = beat;
  });

  const all = [...rows, oraRow].sort((a, b) => b.pts - a.pts || b.exacts - a.exacts);
  all.forEach((r, i) => (r.rank = i + 1));
  return all;
}

function leagueStandingsWithTrend(league) {
  const now = leagueStandings(league, 0);
  const before = leagueStandings(league, 3);
  const beforeRank = {}; before.forEach((r) => (beforeRank[r.id] = r.rank));
  now.forEach((r) => {
    const prev = beforeRank[r.id];
    if (prev == null || prev === r.rank) r.trend = "flat";
    else r.trend = r.rank < prev ? "up" : "down";
  });
  return now;
}

Object.assign(window, {
  isMatchOpen, getTimeUntilDeadline, resultFor, matchStatus, kickoff, deadline,
  isMatchLockedByPhase, isPlaceholderTeam, outcome, scoreProno,
  leagueStandings, leagueStandingsWithTrend,
});
