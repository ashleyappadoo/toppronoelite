/* global React, Store, MATCHES, flagOf, PHASE_LABEL, leagueStandingsWithTrend, matchStatus, getTimeUntilDeadline, resultFor, scoreProno, Oraculo, Av, OraAv, TpeIcons, Header, fmtCountdown */

/* ===================== HUB LIGUES ===================== */
function LeaguesView({ session, go, actions, toast }) {
  const [nom, setNom] = React.useState("");
  const [code, setCode] = React.useState("");
  const [tab, setTab] = React.useState("create");
  const mine = Store.leagues().filter((l) => l.membres.includes(session.userId));

  return (
    <div className="page fade">
      <Header title="Ligues" sub="Tes compétitions privées" />
      <div className="page-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {mine.map((l) => (
          <div key={l.id} className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => go("league", { leagueId: l.id })}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{l.nom}</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--mut)" }}>{l.code} · {l.membres.length} membres + 🔮</div>
            </div>
            <span className="chip chip-mut">Ouvrir ›</span>
          </div>
        ))}

        <div className="card card-pad">
          <div style={{ display: "flex", gap: 0, background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 11, padding: 4, marginBottom: 14 }}>
            {[["create", "Créer"], ["join", "Rejoindre"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--disp)", fontSize: 16, letterSpacing: 1, background: tab === k ? "var(--gold)" : "transparent", color: tab === k ? "var(--bg)" : "var(--mut)" }}>{l}</button>
            ))}
          </div>
          {tab === "create" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><span className="label">Nom de la ligue</span><input className="field" placeholder="Les Tontons Pronostiqueurs" value={nom} onChange={(e) => setNom(e.target.value)} /></div>
              <button className="btn btn-gold" disabled={nom.trim().length < 2} onClick={() => { const l = actions.createLeague(nom.trim()); setNom(""); go("league", { leagueId: l.id }); }}>Créer & générer le code</button>
              <p style={{ fontSize: 12, color: "var(--mut)", textAlign: "center" }}>Un code <span className="mono">TPE-XXXX</span> sera généré pour inviter tes amis.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div><span className="label">Code d'invitation</span><input className="field mono" placeholder="TPE-X9K3" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} style={{ textTransform: "uppercase", letterSpacing: 2 }} /></div>
              <button className="btn btn-ghost" disabled={code.trim().length < 4} onClick={() => { const r = actions.joinLeague(code.trim()); if (r.ok) go("league", { leagueId: r.id }); else toast(r.msg); }}>Rejoindre la ligue</button>
            </div>
          )}
        </div>

        <div className="oraculo-card card-pad" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Oraculo size={38} />
          <p className="oraculo-quote">"Chaque ligue m'accueille automatiquement. On ne refuse pas l'inévitable, on s'y prépare."</p>
        </div>
      </div>
    </div>
  );
}

/* ===================== VUE LIGUE ===================== */
function LeagueView({ session, go, route, actions, toast }) {
  const league = Store.leagues().find((l) => l.id === route.leagueId);
  React.useEffect(() => { if (league) actions.ensureOraculoPronos(league.id); }, [route.leagueId]);
  if (!league) return <div className="page"><Header title="Ligue" onBack={() => go("ligues")} /><p className="page-pad mut">Ligue introuvable.</p></div>;

  const standings = leagueStandingsWithTrend(league);
  const ora = standings.find((r) => r.kind === "oraculo");
  const oraLast = ora && ora.rank === standings.length;
  const oraFirst = ora && ora.rank === 1;
  const { up: IUp, down: IDown, copy: ICopy } = TpeIcons;

  const matchesWithPronos = MATCHES.filter((m) => Store.pronos().some((p) => p.leagueId === league.id && p.matchId === m.id) || Store.oraculo().some((o) => o.leagueId === league.id && o.matchId === m.id) || matchStatus(m) !== "done");
  const upcoming = MATCHES.filter((m) => ["open", "urgent"].includes(matchStatus(m))).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
  const debriefs = Store.debriefs().filter((d) => d.leagueId === league.id).sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt)).slice(0, 3);

  function copyCode() { navigator.clipboard?.writeText(`Rejoins ma ligue TPE "${league.nom}" avec le code ${league.code} → topprono.elite`); toast("Lien d'invitation copié !"); }

  return (
    <div className="page fade">
      <Header title={league.nom} sub={`${league.membres.length} membres + El Oraculo`} onBack={() => go("dashboard")}
        right={<button onClick={copyCode} className="btn btn-ghost btn-sm"><ICopy style={{ width: 14, height: 14 }} /> <span className="mono">{league.code}</span></button>} />

      <div className="page-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {(oraLast || oraFirst) && (
          <div className="oraculo-card" style={{ padding: "10px 14px", display: "flex", gap: 10, alignItems: "center" }}>
            <Oraculo size={28} glow={false} />
            <p style={{ fontSize: 12.5, color: "var(--purple-2)", fontWeight: 600, lineHeight: 1.4 }}>
              {oraLast ? "🔮 L'Oraculo traverse une période de recalibrage cosmique." : "🔮 La hiérarchie naturelle est rétablie. Vous êtes les bienvenus."}
            </p>
          </div>
        )}

        {/* classement */}
        <div>
          <div className="shead"><div className="t">Classement</div><div className="chip chip-mut">{standings.length} concurrents</div></div>
          {standings.map((r) => {
            const isOra = r.kind === "oraculo", isYou = r.id === session.userId;
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", borderRadius: 14, marginBottom: 7,
                background: isOra ? "linear-gradient(180deg, rgba(139,60,224,0.16), rgba(139,60,224,0.05))" : isYou ? "linear-gradient(180deg, rgba(245,197,24,0.12), var(--surf))" : "var(--surf)",
                border: `1px solid ${isOra ? "rgba(139,60,224,0.4)" : isYou ? "rgba(245,197,24,0.3)" : "var(--line)"}` }}>
                <span className="disp" style={{ fontSize: 24, width: 22, textAlign: "center", color: r.rank === 1 ? "var(--gold)" : "var(--mut)" }}>{r.rank}</span>
                {isOra ? <OraAv size={36} /> : <Av name={r.pseudo} you={isYou} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: isOra ? "var(--purple-2)" : "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.pseudo}</span>
                    {isYou && <span className="chip chip-gold" style={{ padding: "2px 6px", fontSize: 9 }}>TOI</span>}
                    {!isOra && r.rank < (ora ? ora.rank : 99) && <span className="chip chip-purple" style={{ padding: "2px 6px", fontSize: 9 }}>🔮 devancé</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--mut)" }}>{r.exacts} exacts{!isOra && r.beat > 0 && <span style={{ color: "var(--purple-2)" }}> · 🔮 ×{r.beat}</span>}</div>
                </div>
                <div style={{ color: r.trend === "up" ? "var(--green)" : r.trend === "down" ? "var(--red)" : "var(--mut)" }}>
                  {r.trend === "up" ? <IUp style={{ width: 16, height: 16 }} /> : r.trend === "down" ? <IDown style={{ width: 16, height: 16 }} /> : <span style={{ fontSize: 12 }}>—</span>}
                </div>
                <span className="disp" style={{ fontSize: 24, color: "var(--gold)", width: 44, textAlign: "right" }}>{r.pts}</span>
              </div>
            );
          })}
        </div>

        {/* matchs à pronostiquer */}
        <div>
          <div className="shead"><div className="t">À pronostiquer</div></div>
          {upcoming.map((m) => {
            const st = matchStatus(m), mine = Store.pronos().find((p) => p.leagueId === league.id && p.matchId === m.id && p.userId === session.userId);
            return (
              <div key={m.id} className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", marginBottom: 8, cursor: "pointer" }} onClick={() => go("match", { matchId: m.id, leagueId: league.id })}>
                <span className="flag" style={{ fontSize: 22 }}>{flagOf(m.equipeA)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.equipeA} – {m.equipeB}</div>
                  <div className="mono" style={{ fontSize: 11, color: st === "urgent" ? "#FF8A7E" : "var(--mut)" }}>{st === "urgent" ? "⚡ " : ""}{fmtCountdown(getTimeUntilDeadline(m))}{mine ? `  ·  ton prono ${mine.scoreA}-${mine.scoreB}` : ""}</div>
                </div>
                <span className="flag" style={{ fontSize: 22 }}>{flagOf(m.equipeB)}</span>
                <span className={"chip " + (mine ? "chip-green" : "chip-gold")}>{mine ? "✓" : "Go"}</span>
              </div>
            );
          })}
          {upcoming.length === 0 && <div className="card card-pad mut" style={{ textAlign: "center", fontSize: 13 }}>Aucun match ouvert pour l'instant. El Oraculo aiguise ses prédictions.</div>}
        </div>

        {/* débriefings */}
        {debriefs.length > 0 && (
          <div>
            <div className="shead"><div className="t">Débriefings</div></div>
            {debriefs.map((d, i) => {
              const m = MATCHES.find((x) => x.id === d.matchId), res = resultFor(d.matchId);
              return (
                <div key={i} className="oraculo-card card-pad" style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                    <Oraculo size={36} />
                    <div style={{ flex: 1 }}>
                      <div className="oraculo-name">🔮 El Oraculo débriefe</div>
                      {m && res && <div style={{ fontSize: 11, color: "var(--mut)" }}>{m.equipeA} {res.scoreA}-{res.scoreB} {m.equipeB}</div>}
                    </div>
                  </div>
                  <p className="oraculo-quote">{d.texte}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

window.LeaguesView = LeaguesView;
window.LeagueView = LeagueView;
