/* global React, Store, MATCHES, flagOf, leagueStandingsWithTrend, leagueStandings, matchStatus, getTimeUntilDeadline, resultFor, Oraculo, Av, OraAv, TpeIcons, Header */
function fmtCountdown(t) {
  if (!t) return "fermé";
  if (t.days >= 1) return `J-${t.days}`;
  return `${String(t.hours).padStart(2, "0")}:${String(t.minutes).padStart(2, "0")}:${String(t.seconds).padStart(2, "0")}`;
}

function StatBox({ value, label, accent, icon }) {
  return (
    <div className="card" style={{ padding: "13px 10px", textAlign: "center", flex: 1 }}>
      <div style={{ color: accent, marginBottom: 2, display: "flex", justifyContent: "center", height: 18 }}>{icon}</div>
      <div className="disp" style={{ fontSize: 32, color: accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--mut)", marginTop: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</div>
    </div>
  );
}

function DashboardView({ session, go, tick, toast }) {
  const { fire: IFire, up: IUp, bolt: IBolt, logout: ILogout } = TpeIcons;
  const allLeagues = Store.leagues().filter((l) => l.membres.includes(session.userId));
  const pronos = Store.pronos();

  // stats agrégées
  let totalPts = 0, beatTotal = 0; const ranks = [];
  allLeagues.forEach((l) => {
    const st = leagueStandings(l);
    const me = st.find((r) => r.id === session.userId);
    if (me) { totalPts += me.pts; beatTotal += me.beat; ranks.push(me.rank); }
  });
  const avgRank = ranks.length ? Math.round(ranks.reduce((a, b) => a + b, 0) / ranks.length) : "—";

  // prochains matchs ouvrables (48h) sans prono dans au moins une ligue
  const now = new Date();
  const upcoming = MATCHES
    .filter((m) => { const st = matchStatus(m); return st === "open" || st === "urgent"; })
    .filter((m) => new Date(m.date) - now < 48 * 3600000)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  const myProno = (mid, lid) => pronos.find((p) => p.matchId === mid && p.userId === session.userId && p.leagueId === lid);
  const anyLeagueId = allLeagues[0] ? allLeagues[0].id : null;

  // alerte urgente
  const urgent = upcoming.find((m) => matchStatus(m) === "urgent" && anyLeagueId && !myProno(m.id, anyLeagueId));

  // feed débriefings récents
  const myLeagueIds = new Set(allLeagues.map((l) => l.id));
  const feed = Store.debriefs().filter((d) => myLeagueIds.has(d.leagueId)).sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt)).slice(0, 2);

  return (
    <div className="page fade">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 18px 12px" }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--mut)", fontWeight: 600 }}>Salut,</div>
          <div className="disp" style={{ fontSize: 30, letterSpacing: 1 }}>{session.pseudo}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {session.role === "admin" && <button onClick={() => go("admin")} className="chip chip-red" style={{ cursor: "pointer", border: "none" }}>ADMIN</button>}
          <button onClick={() => go("logout")} style={{ background: "var(--surf-2)", border: "1px solid var(--line)", borderRadius: 10, width: 38, height: 38, display: "grid", placeItems: "center", color: "var(--mut)", cursor: "pointer" }}><ILogout style={{ width: 18, height: 18 }} /></button>
        </div>
      </div>

      <div className="page-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {urgent && (
          <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 12, borderColor: "rgba(224,58,43,0.4)", background: "linear-gradient(180deg, rgba(224,58,43,0.16), var(--surf))" }}>
            <div style={{ color: "var(--red)", flex: "none" }} className="blink"><IBolt style={{ width: 26, height: 26 }} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{urgent.equipeA} <span style={{ color: "var(--mut)" }}>vs</span> {urgent.equipeB}</div>
              <div style={{ fontSize: 12, color: "#FF8A7E" }}>⚡ Ferme dans {fmtCountdown(getTimeUntilDeadline(urgent))} — pas de prono !</div>
            </div>
            <button className="btn btn-red btn-sm" onClick={() => go("match", { matchId: urgent.id, leagueId: anyLeagueId })}>Go</button>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <StatBox value={totalPts} label="Points" accent="var(--gold)" icon={<IFire style={{ width: 18, height: 18 }} />} />
          <StatBox value={avgRank === "—" ? "—" : "#" + avgRank} label="Rang moyen" accent="var(--ink)" icon={<IUp style={{ width: 18, height: 18 }} />} />
          <StatBox value={beatTotal + "×"} label="Oraculo battu" accent="var(--purple-2)" icon={<span style={{ fontSize: 15 }}>🔮</span>} />
        </div>

        {/* mes ligues */}
        <div>
          <div className="shead"><div className="t">Mes ligues</div><button className="chip chip-gold" style={{ cursor: "pointer", border: "none" }} onClick={() => go("ligues")}>+ Ligue</button></div>
          {allLeagues.length === 0 && (
            <div className="card card-pad" style={{ textAlign: "center", color: "var(--mut)" }}>
              <p style={{ fontSize: 14, margin: "4px 0 12px" }}>Aucune ligue. Crée la tienne et invite tes potes — El Oraculo vous y attend déjà.</p>
              <button className="btn btn-gold btn-sm" style={{ margin: "0 auto" }} onClick={() => go("ligues")}>Créer une ligue</button>
            </div>
          )}
          {allLeagues.map((l) => {
            const st = leagueStandingsWithTrend(l);
            const me = st.find((r) => r.id === session.userId);
            return (
              <div key={l.id} className="card card-pad" style={{ marginBottom: 10, cursor: "pointer" }} onClick={() => go("league", { leagueId: l.id })}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.nom}</div>
                    <div className="mono" style={{ fontSize: 11, color: "var(--mut)" }}>{l.code} · {l.membres.length} membres</div>
                  </div>
                  {me && <div className="chip chip-gold">Tu es #{me.rank}</div>}
                </div>
                {st.slice(0, 3).map((r, i) => (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
                    <span className="disp" style={{ fontSize: 18, width: 16, color: i === 0 ? "var(--gold)" : "var(--mut)" }}>{r.rank}</span>
                    {r.kind === "oraculo" ? <OraAv size={28} /> : <Av name={r.pseudo} you={r.id === session.userId} />}
                    <span style={{ flex: 1, fontWeight: r.id === session.userId ? 700 : 600, fontSize: 13.5, color: r.kind === "oraculo" ? "var(--purple-2)" : "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.pseudo}</span>
                    <span className="disp" style={{ fontSize: 19, color: "var(--gold)" }}>{r.pts}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* prochains matchs */}
        {upcoming.length > 0 && (
          <div>
            <div className="shead"><div className="t">Prochains matchs</div><button className="chip chip-mut" style={{ cursor: "pointer", border: "none" }} onClick={() => go("matchs")}>Tout voir</button></div>
            {upcoming.slice(0, 3).map((m) => {
              const st = matchStatus(m), t = getTimeUntilDeadline(m);
              const done = anyLeagueId && myProno(m.id, anyLeagueId);
              return (
                <div key={m.id} className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", marginBottom: 8, cursor: "pointer" }} onClick={() => anyLeagueId && go("match", { matchId: m.id, leagueId: anyLeagueId })}>
                  <span className="flag" style={{ fontSize: 22 }}>{flagOf(m.equipeA)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.equipeA} – {m.equipeB}</div>
                    <div style={{ fontSize: 11, color: st === "urgent" ? "#FF8A7E" : "var(--mut)" }} className="mono">{st === "urgent" ? "⚡ " : ""}{fmtCountdown(t)}</div>
                  </div>
                  <span className="flag" style={{ fontSize: 22 }}>{flagOf(m.equipeB)}</span>
                  <span className={"chip " + (done ? "chip-green" : "chip-mut")}>{done ? "✓" : "À faire"}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* feed Oraculo */}
        {feed.map((d, i) => (
          <div key={i} className="oraculo-card card-pad" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Oraculo size={38} />
            <div><div className="oraculo-name">El Oraculo commente</div><p className="oraculo-quote" style={{ marginTop: 4 }}>{d.texte}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
window.DashboardView = DashboardView;
window.fmtCountdown = fmtCountdown;
