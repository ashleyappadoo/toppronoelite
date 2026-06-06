/* global React, Store, MATCHES, flagOf, PHASE_LABEL, phaseOf, matchStatus, getTimeUntilDeadline, resultFor, scoreProno, outcome, isMatchLockedByPhase, Oraculo, TpeIcons, Header, OraThinking, fmtCountdown */

function Stepper({ value, set, color, editable }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {editable && <button onClick={() => set(Math.min(20, value + 1))} style={{ width: 42, height: 34, borderRadius: 10, border: "1px solid var(--line-2)", background: "var(--surf-2)", color: "var(--ink)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>+</button>}
      <div className="score" style={{ fontSize: 54, color, minWidth: 76, padding: "6px 12px 2px" }}>{value}</div>
      {editable && <button onClick={() => set(Math.max(0, value - 1))} style={{ width: 42, height: 34, borderRadius: 10, border: "1px solid var(--line-2)", background: "var(--surf-2)", color: "var(--ink)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>−</button>}
    </div>
  );
}

function MatchView({ session, go, route, actions, toast, tick }) {
  const match = MATCHES.find((m) => m.id === route.matchId);
  const leagueId = route.leagueId;
  const league = Store.leagues().find((l) => l.id === leagueId);
  const existing = Store.pronos().find((p) => p.matchId === route.matchId && p.userId === session.userId && p.leagueId === leagueId);

  const [a, setA] = React.useState(existing ? existing.scoreA : 1);
  const [b, setB] = React.useState(existing ? existing.scoreB : 1);
  const [just, setJust] = React.useState(existing ? existing.justification || "" : "");
  const [x2, setX2] = React.useState(existing ? !!existing.bonusX2 : false);
  const [pre, setPre] = React.useState(null);
  const [preBusy, setPreBusy] = React.useState(false);

  if (!match) return <div className="page"><Header title="Match" onBack={() => go("dashboard")} /></div>;
  const st = matchStatus(match);
  const locked = isMatchLockedByPhase(match);
  const editable = st === "open" || st === "urgent";
  const res = resultFor(match.id);
  const oraProno = Store.oraculo().find((o) => o.matchId === match.id && o.leagueId === leagueId);

  // bonus X2 dispo pour la phase ?
  const phase = phaseOf(match.groupe);
  const x2Used = Store.pronos().some((p) => p.userId === session.userId && p.leagueId === leagueId && p.bonusX2 && p.matchId !== match.id && MATCHES.find((m) => m.id === p.matchId) && phaseOf(MATCHES.find((m) => m.id === p.matchId).groupe) === phase);

  // analyse pré-match (lazy)
  React.useEffect(() => {
    let alive = true;
    if (!locked && (st === "open" || st === "urgent")) {
      setPreBusy(true);
      actions.getPreMatch(match).then((p) => { if (alive) { setPre(p); setPreBusy(false); } });
    }
    return () => { alive = false; };
  }, [match.id]);

  const myVote = Store.votes().find((v) => v.userId === session.userId && v.matchId === match.id);
  const votes = Store.votes().filter((v) => v.matchId === match.id);
  const agree = votes.filter((v) => v.vote === "agree").length, disagree = votes.length - agree;
  const agreePct = votes.length ? Math.round((agree / votes.length) * 100) : 50;

  function submit() {
    if (!league) { toast("Choisis d'abord une ligue."); return; }
    actions.submitProno({ matchId: match.id, leagueId, scoreA: a, scoreB: b, justification: just.trim() || null, bonusX2: x2 });
    toast(existing ? "Pronostic mis à jour !" : "Pronostic enregistré !");
    go("league", { leagueId });
  }

  const { clock: IClock, check: ICheck } = TpeIcons;
  const phaseLabel = PHASE_LABEL[match.groupe] || `Groupe ${match.groupe}`;
  const sb = res && existing ? scoreProno(existing, res, leagueId) : null;

  return (
    <div className="page fade">
      <Header title={phaseLabel} sub={`${match.ville} · ${match.stade}`} onBack={() => go(leagueId ? "league" : "dashboard", { leagueId })}
        right={st === "urgent" ? <div className="chip chip-red"><IClock style={{ width: 11, height: 11 }} /> {fmtCountdown(getTimeUntilDeadline(match))}</div>
          : st === "live" ? <div className="live"><span className="pulse" /><span className="chip chip-red">EN DIRECT</span></div>
          : st === "done" ? <div className="chip chip-green">Terminé</div>
          : st === "awaiting" ? <div className="chip chip-mut">Joué</div>
          : <div className="chip chip-mut">{fmtCountdown(getTimeUntilDeadline(match))}</div>} />

      <div className="page-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {locked && <div className="card card-pad mut" style={{ textAlign: "center", fontSize: 13 }}>🔒 Phase éliminatoire — les équipes seront connues après les qualifications.</div>}

        {/* scoreboard + saisie */}
        <div className="card card-pad" style={{ paddingTop: 18, paddingBottom: 18 }}>
          {res && <div className="kicker" style={{ textAlign: "center", marginBottom: 10, color: "var(--green)" }}>Résultat officiel</div>}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ textAlign: "center", width: 76 }}><div className="flag">{flagOf(match.equipeA)}</div><div style={{ fontWeight: 700, fontSize: 12.5, marginTop: 6 }}>{match.equipeA}</div></div>
            {res ? <div className="score" style={{ fontSize: 52 }}>{res.scoreA}</div> : <Stepper value={a} set={setA} color="var(--gold)" editable={editable && !locked} />}
            <div className="disp" style={{ fontSize: 28, color: "var(--mut-2)", alignSelf: "center", paddingTop: res ? 0 : 28 }}>:</div>
            {res ? <div className="score" style={{ fontSize: 52 }}>{res.scoreB}</div> : <Stepper value={b} set={setB} color="var(--ink)" editable={editable && !locked} />}
            <div style={{ textAlign: "center", width: 76 }}><div className="flag">{flagOf(match.equipeB)}</div><div style={{ fontWeight: 700, fontSize: 12.5, marginTop: 6 }}>{match.equipeB}</div></div>
          </div>

          {existing && (
            <div style={{ textAlign: "center", marginTop: 14, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <span className="chip chip-mut">Ton prono : {existing.scoreA}-{existing.scoreB}{existing.bonusX2 ? " ×2" : ""}</span>
              {sb && <span className={"chip " + (sb.pts > 0 ? "chip-green" : "chip-red")}>{sb.pts > 0 ? `+${sb.pts} pts` : "0 pt"}{sb.exact ? " · exact" : ""}</span>}
            </div>
          )}

          {editable && !locked && (
            <>
              <div className="divider" />
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 11, padding: "10px 12px" }}>
                <span style={{ fontSize: 15 }}>✍️</span>
                <input className="field" value={just} maxLength={140} onChange={(e) => setJust(e.target.value)} placeholder="Pourquoi ce score ? (optionnel)" style={{ border: "none", background: "transparent", padding: 0, fontSize: 13 }} />
                <span className="mono" style={{ fontSize: 10, color: "var(--mut-2)" }}>{just.length}/140</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>Bonus ×2 {x2Used ? <span className="chip chip-mut" style={{ marginLeft: 4 }}>déjà utilisé</span> : <span className="chip chip-gold" style={{ marginLeft: 4 }}>1 dispo · phase {phase}</span>}</div>
                  <div style={{ fontSize: 11, color: "var(--mut)" }}>Double tous tes points sur ce match</div>
                </div>
                <button disabled={x2Used && !x2} onClick={() => setX2(!x2)} style={{ width: 52, height: 30, borderRadius: 999, border: "none", cursor: x2Used && !x2 ? "not-allowed" : "pointer", background: x2 ? "linear-gradient(90deg,#C99A0A,#F5C518)" : "var(--surf-3)", padding: 3, display: "flex", justifyContent: x2 ? "flex-end" : "flex-start", boxShadow: x2 ? "var(--glow-gold)" : "none", opacity: x2Used && !x2 ? 0.4 : 1 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: x2 ? "#1A1407" : "#0C0C0E" }} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* analyse pré-match El Oraculo */}
        {!locked && (st === "open" || st === "urgent") && (
          <div className="oraculo-card card-pad">
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <Oraculo size={34} glow={false} />
              <div style={{ flex: 1 }}>
                <div className="oraculo-name">Analyse El Oraculo</div>
                {pre && <div style={{ fontSize: 11, color: "var(--mut)" }}>Confiance : <span style={{ color: "var(--gold)", fontWeight: 700 }}>{pre.confiance}</span></div>}
              </div>
              {oraProno && <div className="score" style={{ fontSize: 22, color: "var(--purple-2)", borderColor: "rgba(139,60,224,0.4)", boxShadow: "none", textShadow: "0 0 12px rgba(139,60,224,0.5)" }}>{oraProno.scoreA}-{oraProno.scoreB}</div>}
            </div>
            {preBusy ? <OraThinking /> : pre ? <p className="oraculo-quote">"{pre.analyse}"</p> : <p className="oraculo-quote mut">El Oraculo n'a pas encore parlé.</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, borderColor: myVote?.vote === "agree" ? "var(--green)" : "var(--line-2)" }} onClick={() => actions.vote(match.id, "agree")}>✓ D'accord <span className="mut" style={{ marginLeft: 4 }}>{agreePct}%</span></button>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, borderColor: myVote?.vote === "disagree" ? "var(--red)" : "var(--line-2)" }} onClick={() => actions.vote(match.id, "disagree")}>🤡 Il délire <span className="mut" style={{ marginLeft: 4 }}>{100 - agreePct}%</span></button>
            </div>
          </div>
        )}

        {/* prono Oraculo si match passé */}
        {res && oraProno && (
          <div className="oraculo-card card-pad" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Oraculo size={36} />
            <div><div className="oraculo-name">El Oraculo avait dit {oraProno.scoreA}-{oraProno.scoreB}</div><p className="oraculo-quote" style={{ marginTop: 3 }}>"{oraProno.replique}"</p></div>
          </div>
        )}

        {editable && !locked && <button className="btn btn-gold" onClick={submit}>{existing ? "Modifier mon pronostic" : "Valider mon pronostic"}</button>}
        {st === "done" && leagueId && <button className="btn btn-ghost" onClick={() => go("league", { leagueId })}>Voir le débriefing complet</button>}
      </div>
    </div>
  );
}
window.MatchView = MatchView;
