/* global React, Store, MATCHES, flagOf, PHASE_LABEL, kickoff, resultFor, isMatchLockedByPhase, TpeIcons, Header */
function AdminRow({ match, onValidate }) {
  const existing = resultFor(match.id);
  const [a, setA] = React.useState(existing ? existing.scoreA : 0);
  const [b, setB] = React.useState(existing ? existing.scoreB : 0);
  const [busy, setBusy] = React.useState(false);
  const nbPronos = Store.pronos().filter((p) => p.matchId === match.id).length;

  async function go() {
    setBusy(true);
    await onValidate(match.id, a, b);
    setBusy(false);
  }
  const Stp = ({ v, set }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <button onClick={() => set(Math.max(0, v - 1))} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid var(--line-2)", background: "var(--surf-2)", color: "var(--ink)", cursor: "pointer" }}>−</button>
      <div className="score" style={{ fontSize: 26, minWidth: 40, padding: "2px 8px 0" }}>{v}</div>
      <button onClick={() => set(Math.min(20, v + 1))} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid var(--line-2)", background: "var(--surf-2)", color: "var(--ink)", cursor: "pointer" }}>+</button>
    </div>
  );

  return (
    <div className="card card-pad" style={{ marginBottom: 10, borderColor: existing ? "rgba(54,211,153,0.3)" : "var(--line)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="kicker" style={{ fontSize: 10 }}>{PHASE_LABEL[match.groupe] || "Groupe " + match.groupe} · M{match.id}</div>
        <div className="mono" style={{ fontSize: 10, color: "var(--mut)" }}>{nbPronos} pronos</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 0 }}><span className="flag" style={{ fontSize: 22 }}>{flagOf(match.equipeA)}</span><span style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{match.equipeA}</span></div>
        <Stp v={a} set={setA} />
        <Stp v={b} set={setB} />
        <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 0, justifyContent: "flex-end" }}><span style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{match.equipeB}</span><span className="flag" style={{ fontSize: 22 }}>{flagOf(match.equipeB)}</span></div>
      </div>
      <button className={"btn " + (existing ? "btn-ghost" : "btn-gold")} style={{ marginTop: 12 }} onClick={go} disabled={busy}>
        {busy ? "🔮 Calcul + débriefings…" : existing ? "Corriger le résultat" : "Valider le résultat"}
      </button>
    </div>
  );
}

function AdminView({ go, actions, toast }) {
  const now = new Date();
  const played = MATCHES.filter((m) => !isMatchLockedByPhase(m) && kickoff(m) <= now);
  const pending = played.filter((m) => !resultFor(m.id)).sort((a, b) => kickoff(b) - kickoff(a));
  const done = played.filter((m) => resultFor(m.id)).sort((a, b) => kickoff(b) - kickoff(a));

  async function validate(matchId, a, b) {
    const r = await actions.validateResult(matchId, a, b);
    toast(`Résultat validé · ${r.leagues} ligue(s) recalculée(s)`);
  }

  return (
    <div className="page fade">
      <Header title="Console Admin" sub="Saisie des résultats officiels" onBack={() => go("dashboard")} right={<div className="chip chip-red">ADMIN</div>} />
      <div className="page-pad">
        <div className="oraculo-card card-pad" style={{ marginBottom: 14, fontSize: 12.5, color: "var(--ink-2)" }}>
          Valider un résultat recalcule automatiquement les points de toutes les ligues et déclenche le débriefing d'El Oraculo. <b>Zéro mode démo.</b>
        </div>

        <div className="shead"><div className="t">À saisir</div><div className="chip chip-red">{pending.length}</div></div>
        {pending.length === 0 && <div className="card card-pad mut" style={{ textAlign: "center", fontSize: 13, marginBottom: 14 }}>Aucun match en attente de résultat.</div>}
        {pending.map((m) => <AdminRow key={m.id} match={m} onValidate={validate} />)}

        {done.length > 0 && <>
          <div className="shead" style={{ marginTop: 18 }}><div className="t">Validés</div><div className="chip chip-green">{done.length}</div></div>
          {done.slice(0, 8).map((m) => <AdminRow key={m.id} match={m} onValidate={validate} />)}
        </>}
      </div>
    </div>
  );
}
window.AdminView = AdminView;
