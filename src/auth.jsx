/* global React, sha256, uuid, Store, Oraculo */
function AuthView({ onAuthed, toast }) {
  const [mode, setMode] = React.useState("login");
  const [pseudo, setPseudo] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pwd, setPwd] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  async function submit() {
    setErr("");
    const users = Store.users();
    if (mode === "register") {
      if (pseudo.trim().length < 2) return setErr("Pseudo trop court.");
      if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Email invalide.");
      if (pwd.length < 4) return setErr("Mot de passe trop court (4 min).");
      if (users.some((u) => u.pseudo.toLowerCase() === pseudo.trim().toLowerCase())) return setErr("Ce pseudo est déjà pris.");
      setBusy(true);
      const u = { id: uuid(), pseudo: pseudo.trim(), email: email.trim(), passwordHash: await sha256(pwd), role: "user", createdAt: new Date().toISOString() };
      Store.setUsers([...users, u]);
      Store.setSession({ userId: u.id, pseudo: u.pseudo, role: u.role });
      setBusy(false); onAuthed();
    } else {
      setBusy(true);
      const hash = await sha256(pwd);
      const u = users.find((x) => (x.pseudo.toLowerCase() === pseudo.trim().toLowerCase() || x.email.toLowerCase() === pseudo.trim().toLowerCase()) && x.passwordHash === hash);
      setBusy(false);
      if (!u) return setErr("Identifiants incorrects.");
      Store.setSession({ userId: u.id, pseudo: u.pseudo, role: u.role });
      onAuthed();
    }
  }

  return (
    <div className="page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingBottom: 0 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 28px 8px", textAlign: "center" }}>
        <div className="chip chip-gold" style={{ marginBottom: 22 }}>⚽ Coupe du Monde 2026</div>
        <div style={{ position: "relative", marginBottom: 4 }}>
          <div style={{ position: "absolute", inset: -34, background: "radial-gradient(circle, rgba(139,60,224,0.35), transparent 70%)", filter: "blur(6px)" }} />
          <div style={{ position: "relative" }}><Oraculo size={110} /></div>
        </div>
        <div className="disp" style={{ fontSize: 80, marginTop: 12 }}><span className="grad-gold">TPE</span></div>
        <div className="disp" style={{ fontSize: 24, letterSpacing: 4, marginTop: -6 }}>TOP PRONO ÉLITE</div>
        <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5, margin: "16px 0 0", maxWidth: 300 }}>
          Pronostique. <span style={{ color: "var(--purple-2)", fontWeight: 700 }}>Humilie El Oraculo.</span> Domine ta ligue.
        </p>
      </div>

      <div style={{ padding: "8px 22px 30px" }}>
        <div style={{ display: "flex", gap: 0, background: "var(--surf)", border: "1px solid var(--line)", borderRadius: 12, padding: 4, marginBottom: 16 }}>
          {[["login", "Connexion"], ["register", "Inscription"]].map(([k, l]) => (
            <button key={k} onClick={() => { setMode(k); setErr(""); }} style={{ flex: 1, padding: "9px 0", border: "none", borderRadius: 9, cursor: "pointer", fontFamily: "var(--disp)", fontSize: 17, letterSpacing: 1, background: mode === k ? "var(--gold)" : "transparent", color: mode === k ? "var(--bg)" : "var(--mut)" }}>{l}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <input className="field" placeholder={mode === "login" ? "Pseudo ou email" : "Pseudo unique"} value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
          {mode === "register" && <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />}
          <input className="field" type="password" placeholder="Mot de passe" value={pwd} onChange={(e) => setPwd(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          {err && <div style={{ color: "#FF8A7E", fontSize: 13, fontWeight: 600 }}>{err}</div>}
          <button className="btn btn-gold" onClick={submit} disabled={busy}>{busy ? "…" : mode === "login" ? "Se connecter" : "Créer mon compte"}</button>
          <p className="mono" style={{ textAlign: "center", fontSize: 11, color: "var(--mut-2)", marginTop: 4 }}>
            104 MATCHS · 48 ÉQUIPES · 1 BOULE DE CRISTAL INSUPPORTABLE
          </p>
        </div>
      </div>
    </div>
  );
}
window.AuthView = AuthView;
