// ============================================================
// TPE — Stockage persistant
// Mode Supabase (multi-joueurs) si SUPABASE_URL est configuré,
// sinon localStorage (mono-appareil, mode dev/offline).
// ============================================================

let _db = null; // Supabase client (null = localStorage mode)

// Cache mémoire — toutes les lectures sont synchrones depuis ici
const _mem = {
  users: [], leagues: [], pronos: [], oraculo: [],
  results: [], debriefs: [], votes: [],
};

// ---- Conversion camelCase ↔ snake_case ----
const _toCamel = s => s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
const _toSnake = s => s.replace(/([A-Z])/g, m => '_' + m.toLowerCase());
function _fromRow(row) {
  const o = {};
  for (const [k, v] of Object.entries(row)) o[_toCamel(k)] = v;
  return o;
}
function _toRow(obj) {
  const o = {};
  for (const [k, v] of Object.entries(obj)) { if (v !== undefined) o[_toSnake(k)] = v; }
  return o;
}

// ---- localStorage helpers ----
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) { console.warn(e); } },
};

// ---- Chargement depuis localStorage ----
function _loadFromLS() {
  _mem.users    = LS.get('tpe:users', []);
  _mem.leagues  = LS.get('tpe:leagues', []);
  _mem.pronos   = LS.get('tpe:pronos', []);
  _mem.oraculo  = LS.get('tpe:oraculo_pronos', []);
  _mem.results  = LS.get('tpe:results', []);
  _mem.debriefs = LS.get('tpe:debriefs', []);
  _mem.votes    = LS.get('tpe:votes', []);
}

// ---- Chargement depuis Supabase ----
async function _loadFromDB() {
  const [u, l, p, o, r, d, v] = await Promise.all([
    _db.from('users').select('*'),
    _db.from('leagues').select('*'),
    _db.from('pronos').select('*'),
    _db.from('oraculo_pronos').select('*'),
    _db.from('results').select('*'),
    _db.from('debriefs').select('*'),
    _db.from('votes').select('*'),
  ]);
  if (u.error || l.error || p.error) throw new Error('Supabase load error');
  _mem.users    = (u.data || []).map(_fromRow);
  _mem.leagues  = (l.data || []).map(_fromRow);
  _mem.pronos   = (p.data || []).map(_fromRow);
  _mem.oraculo  = (o.data || []).map(_fromRow);
  _mem.results  = (r.data || []).map(_fromRow);
  _mem.debriefs = (d.data || []).map(_fromRow);
  _mem.votes    = (v.data || []).map(_fromRow);
}

// ---- Upsert fire-and-forget vers Supabase ----
function _push(table, rows, conflict) {
  if (!_db || !rows.length) return;
  rows.forEach(row => {
    _db.from(table)
      .upsert(_toRow(row), { onConflict: conflict })
      .then(({ error }) => { if (error) console.warn('[TPE Supabase]', table, error.message); })
      .catch(e => console.warn('[TPE Supabase]', table, e));
  });
}

// ---- Initialisation (appelée au démarrage de l'app) ----
async function initStorage() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const r = await fetch('/api/config', { signal: controller.signal });
    clearTimeout(timer);
    if (r.ok) {
      const { supabaseUrl, supabaseAnonKey } = await r.json();
      if (supabaseUrl && supabaseAnonKey && window.supabase) {
        _db = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
          auth: { persistSession: false },
        });
        await _loadFromDB();
        console.info('[TPE] Supabase connecté ✓');
        return;
      }
    }
  } catch (e) {
    console.warn('[TPE] Supabase non configuré → localStorage:', e.message || e);
  }
  _loadFromLS();
}

// ---- Store public (API identique à l'ancienne version) ----
const Store = {
  // Session : toujours localStorage (par appareil)
  session:    () => LS.get('tpe:session', null),
  setSession: (v) => LS.set('tpe:session', v),

  // Users
  users:    () => _mem.users,
  setUsers: (arr) => {
    _mem.users = arr;
    if (_db) _push('users', arr, 'id');
    else LS.set('tpe:users', arr);
  },

  // Leagues
  leagues:    () => _mem.leagues,
  setLeagues: (arr) => {
    _mem.leagues = arr;
    if (_db) _push('leagues', arr, 'id');
    else LS.set('tpe:leagues', arr);
  },

  // Pronos joueurs
  pronos:    () => _mem.pronos,
  setPronos: (arr) => {
    _mem.pronos = arr;
    if (_db) _push('pronos', arr, 'id');
    else LS.set('tpe:pronos', arr);
  },

  // Pronos El Oraculo
  oraculo:    () => _mem.oraculo,
  setOraculo: (arr) => {
    _mem.oraculo = arr;
    if (_db) _push('oraculo_pronos', arr, 'league_id,match_id');
    else LS.set('tpe:oraculo_pronos', arr);
  },

  // Résultats officiels
  results:    () => _mem.results,
  setResults: (arr) => {
    _mem.results = arr;
    if (_db) _push('results', arr, 'match_id');
    else LS.set('tpe:results', arr);
  },

  // Débriefings
  debriefs:    () => _mem.debriefs,
  setDebriefs: (arr) => {
    _mem.debriefs = arr;
    if (_db) _push('debriefs', arr, 'match_id,league_id');
    else LS.set('tpe:debriefs', arr);
  },

  // Votes pré-match
  votes:    () => _mem.votes,
  setVotes: (arr) => {
    _mem.votes = arr;
    if (_db) _push('votes', arr, 'user_id,match_id');
    else LS.set('tpe:votes', arr);
  },

  // Rafraîchit le cache depuis Supabase (appelé périodiquement)
  sync: async () => { if (_db) await _loadFromDB(); },

  // Indique si Supabase est actif
  isOnline: () => _db !== null,
};

// ---- Utilitaires (inchangés) ----
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function genLeagueCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 4; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return 'TPE-' + c;
}

async function ensureAdmin() {
  const users = Store.users();
  if (!users.some(u => u.role === 'admin')) {
    const u = {
      id: uuid(), pseudo: 'admin', email: 'admin@tpe.app',
      passwordHash: await sha256('tpe2026admin'),
      role: 'admin', createdAt: new Date().toISOString(),
    };
    Store.setUsers([...users, u]);
  }
}

Object.assign(window, { Store, uuid, sha256, genLeagueCode, ensureAdmin, initStorage });
