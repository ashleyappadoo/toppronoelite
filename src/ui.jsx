/* global React */
// Shared chrome, icons, atoms for the live TPE app.

function StatusBar() {
  const [t, setT] = React.useState(new Date());
  React.useEffect(() => { const id = setInterval(() => setT(new Date()), 30000); return () => clearInterval(id); }, []);
  const hh = String(t.getHours()).padStart(2, "0"), mm = String(t.getMinutes()).padStart(2, "0");
  return (
    <div className="statusbar">
      <span className="mono" style={{ fontSize: 14 }}>{hh}:{mm}</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><path d="M1 4 Q8.5 -2 16 4" stroke="#FAF8F4" strokeWidth="1.4"/><path d="M4 7 Q8.5 3.5 13 7" stroke="#FAF8F4" strokeWidth="1.4"/><circle cx="8.5" cy="10" r="1.4" fill="#FAF8F4"/></svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none"><rect x="1" y="1.5" width="19" height="9" rx="2.5" stroke="#FAF8F4" strokeOpacity="0.5" strokeWidth="1.2"/><rect x="2.5" y="3" width="14" height="6" rx="1.4" fill="#F5C518"/><rect x="21" y="4" width="2" height="4" rx="1" fill="#FAF8F4" fillOpacity="0.6"/></svg>
      </div>
    </div>
  );
}

const I = {
  home:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/></svg>,
  trophy:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M7 4h10v4a5 5 0 01-10 0V4zM7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3M9 14h6l-.5 4h-5L9 14zM8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/></svg>,
  ball:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7l3 2-1 3.5h-4L9 9l3-2zM12 7V3M9 9L5.5 7.5M15 9l3.5-1.5M10 12.5L7.5 16M14 12.5l2.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chart:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  user:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8"/><path d="M5 20a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  bolt:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor"/></svg>,
  fire:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3c1 3-1 4-1 6 2-1 2-3 4-2 2 2 3 5 3 8a6 6 0 11-12 0c0-2 1-3 2-4 1 2 2 2 2 0 0-3 1-6 2-8z" fill="currentColor"/></svg>,
  up:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  down:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  copy:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><rect x="8" y="8" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><path d="M16 8V5a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="currentColor" strokeWidth="1.8"/></svg>,
  check:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clock:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  share:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="6" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.8"/><circle cx="18" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.8"/><circle cx="18" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.8"/><path d="M8 11l8-4M8 13l8 4" stroke="currentColor" strokeWidth="1.8"/></svg>,
  plus:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  back:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  logout:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4M16 8l4 4-4 4M20 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

function BottomNav({ active, go }) {
  const items = [["dashboard","Accueil",I.home],["matchs","Matchs",I.ball],["ligues","Ligues",I.trophy],["wrapped","Wrapped",I.chart],["profil","Profil",I.user]];
  return (
    <nav className="nav">
      {items.map(([k,label,Ic]) => (
        <button key={k} className={active === k ? "on" : ""} onClick={() => go(k)}><Ic /><span>{label}</span></button>
      ))}
    </nav>
  );
}

// avatar déterministe par pseudo
function avColor(seed) {
  const palettes = [
    "linear-gradient(145deg,#F5C518,#C99A0A)","linear-gradient(145deg,#36D399,#0E8C5E)",
    "linear-gradient(145deg,#E03A2B,#9B281C)","linear-gradient(145deg,#4D9EF6,#1E5FB0)",
    "linear-gradient(145deg,#FF8A3D,#C7591A)","linear-gradient(145deg,#E764C9,#A12E86)",
  ];
  let h = 0; for (const c of seed || "x") h = (h * 31 + c.charCodeAt(0)) | 0;
  return palettes[Math.abs(h) % palettes.length];
}
function initials(name) { return (name || "?").replace(/[^a-zA-ZÀ-ÿ0-9]/g, "").slice(0, 2).toUpperCase() || "?"; }

function Av({ name, you }) {
  return <div className="av" style={{ background: avColor(name), boxShadow: you ? "var(--glow-gold)" : "none" }}>{initials(name)}</div>;
}
function OraAv({ size = 34 }) {
  return <div className="av" style={{ width: size, height: size, fontSize: size * 0.55, background: "linear-gradient(145deg,#8B3CE0,#5B1F9E)" }}>🔮</div>;
}

function Header({ title, sub, onBack, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 18px 10px" }}>
      {onBack && <button onClick={onBack} style={{ background: "var(--surf-2)", border: "1px solid var(--line)", borderRadius: 10, width: 36, height: 36, display: "grid", placeItems: "center", color: "var(--ink)", cursor: "pointer" }}><I.back style={{ width: 18, height: 18 }} /></button>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {sub && <div className="kicker" style={{ fontSize: 11 }}>{sub}</div>}
        <div className="disp" style={{ fontSize: 28, letterSpacing: 1 }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

function Toast({ msg }) { return msg ? <div className="toast">{msg}</div> : null; }

function OraThinking({ label = "El Oraculo réfléchit…" }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 9, color: "var(--purple-2)", fontSize: 13, fontWeight: 600 }}><span className="spin" />{label}</div>;
}

Object.assign(window, { StatusBar, TpeIcons: I, BottomNav, Av, OraAv, Header, Toast, OraThinking, avColor, initials });
