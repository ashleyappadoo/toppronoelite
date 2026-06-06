// ============================================================
// TPE — Stockage persistant (localStorage) + crypto + helpers
// Remplace window.storage par localStorage pour un vrai déploiement web.
// ============================================================

const DB = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
};

// Entités
const Store = {
  users:        () => DB.get("tpe:users", []),
  setUsers:     (v) => DB.set("tpe:users", v),
  session:      () => DB.get("tpe:session", null),
  setSession:   (v) => DB.set("tpe:session", v),
  leagues:      () => DB.get("tpe:leagues", []),
  setLeagues:   (v) => DB.set("tpe:leagues", v),
  pronos:       () => DB.get("tpe:pronos", []),
  setPronos:    (v) => DB.set("tpe:pronos", v),
  oraculo:      () => DB.get("tpe:oraculo_pronos", []),
  setOraculo:   (v) => DB.set("tpe:oraculo_pronos", v),
  results:      () => DB.get("tpe:results", []),
  setResults:   (v) => DB.set("tpe:results", v),
  debriefs:     () => DB.get("tpe:debriefs", []),
  setDebriefs:  (v) => DB.set("tpe:debriefs", v),
  votes:        () => DB.get("tpe:votes", []),
  setVotes:     (v) => DB.set("tpe:votes", v),
};

// UUID v4 simple
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// SHA-256 hex (Web Crypto)
async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Code ligue : TPE-XXXX (4 alphanum)
function genLeagueCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 4; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return "TPE-" + c;
}

// Seed admin par défaut (admin / tpe2026admin)
async function ensureAdmin() {
  const users = Store.users();
  if (!users.some((u) => u.role === "admin")) {
    users.push({
      id: uuid(), pseudo: "admin", email: "admin@tpe.app",
      passwordHash: await sha256("tpe2026admin"),
      role: "admin", createdAt: new Date().toISOString(),
    });
    Store.setUsers(users);
  }
}

Object.assign(window, { DB, Store, uuid, sha256, genLeagueCode, ensureAdmin });
