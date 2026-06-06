// ============================================================
// TPE — El Oraculo IA
// Utilise window.claude.complete si présent (env. Anthropic / proxy),
// sinon bascule sur un générateur local pour rester 100% fonctionnel.
// ============================================================
/* global FLAGS */

function hasClaude() {
  return typeof window.claude !== "undefined" && typeof window.claude.complete === "function";
}

function extractJSON(str) {
  if (!str) return null;
  try { return JSON.parse(str); } catch {}
  const m = str.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}

async function ask(prompt) {
  // Claude.ai native proxy (used when running inside Claude artifacts)
  if (hasClaude()) {
    try { return await window.claude.complete(prompt); }
    catch (e) { console.warn("Claude proxy error:", e); }
  }
  // Vercel serverless proxy (production deployment)
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    return data.text ?? null;
  } catch (e) {
    console.warn("API indisponible, fallback local:", e.message);
    return null;
  }
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// force d'équipe approximée (pour des pronos cohérents en fallback)
const TIER = {
  "France":5,"Argentine":5,"Brésil":5,"Espagne":5,"Angleterre":5,"Allemagne":4,"Portugal":5,
  "Pays-Bas":4,"Belgique":4,"Croatie":4,"Uruguay":4,"Maroc":4,"USA":3,"Mexique":3,"Suisse":3,
  "Japon":3,"Sénégal":3,"Colombie":3,"Danemark":3,"Corée du Sud":3,"Australie":3,"Égypte":3,
  "Côte d'Ivoire":3,"Équateur":3,"Suède":3,"Autriche":3,"Norvège":4,"Turquie":3,"Écosse":3,
  "Iran":3,"Qatar":2,"Canada":3,"Paraguay":2,"Tunisie":2,"Cap-Vert":2,"Curaçao":1,"Haïti":1,
  "Panama":2,"Ghana":3,"RD Congo":2,"Ouzbékistan":2,"Jordanie":2,"Algérie":3,"Irak":2,
  "Nouvelle-Zélande":2,"Arabie Saoudite":2,"Bosnie-Herzégovine":2,"République tchèque":3,"Afrique du Sud":2,
};
function tier(t) { return TIER[t] || 3; }

// ---------- 1. Pronostic auto El Oraculo ----------
async function aiOraculoProno(match) {
  const prompt =
`Tu es El Oraculo, une IA de pronostics football arrogante et trollesque.
Match : ${match.equipeA} vs ${match.equipeB} (Groupe ${match.groupe}, CdM 2026)
Génère ton pronostic avec une réplique caractéristique.
Réponds UNIQUEMENT en JSON valide, sans markdown :
{"score_a": N, "score_b": N, "replique": "max 90 caractères, ton El Oraculo"}
Sois cohérent avec les forces réelles des équipes mais garde le hubris.`;
  const raw = await ask(prompt);
  const j = extractJSON(raw);
  if (j && Number.isInteger(j.score_a) && Number.isInteger(j.score_b) && j.replique) return j;

  // fallback local
  const da = tier(match.equipeA), db = tier(match.equipeB);
  const base = (d) => Math.max(0, Math.min(4, Math.round((d - 1) / 1.3 + (Math.random() < 0.4 ? 1 : 0))));
  let a = base(da), b = base(db);
  if (a === b && da !== db) (da > db ? (a++) : (b++));
  const repliques = [
    "L'Oraculo a parlé. Les mortels peuvent prendre note.",
    "C'est écrit dans mes algorithmes cosmiques. Inévitable.",
    `${da >= db ? match.equipeA : match.equipeB} gagne. Las matemáticas ne mentent jamais.`,
    "J'ai déjà vu ce match. Dans le futur. Vous comprendrez bientôt.",
    "Pronostic livré. Vous pouvez applaudir maintenant.",
  ];
  return { score_a: a, score_b: b, replique: pick(repliques) };
}

// ---------- 2. Débriefing post-match ----------
async function aiDebrief(ctx) {
  const prompt =
`Tu es El Oraculo, chroniqueur sarcastique de la ligue "${ctx.nomLigue}".

Résultat officiel : ${ctx.equipeA} ${ctx.scoreA} - ${ctx.scoreB} ${ctx.equipeB}
Ton pronostic El Oraculo était : ${ctx.oraA}-${ctx.oraB} (${ctx.ptsOraculo} pts)

Classement des joueurs sur ce match :
${ctx.lignes}

Génère un débriefing de 3-4 phrases MAX en character El Oraculo.
Règles : mentionne au moins 2 pseudos spécifiques ; si bien pronostiqué vante-toi, sinon excuse pathétique et grandiose (jamais "j'avais tort") ; humilie affectueusement le dernier ; glorifie le premier en insinuant la chance ; texte fluide.
Réponds en JSON : {"texte": "le débriefing complet"}`;
  const raw = await ask(prompt);
  const j = extractJSON(raw);
  if (j && j.texte) return j;

  const oraGood = ctx.ptsOraculo > 0;
  const first = ctx.first || "le premier", last = ctx.last || "le dernier";
  const texte = oraGood
    ? `Évidemment. ${ctx.oraA}-${ctx.oraB}, comme annoncé. ${first} a suivi mon sillage et récolte les miettes de ma clairvoyance. Quant à ${last}, son pronostic restera une curiosité anthropologique. Momento histórico, mais pour moi seulement.`
    : `Techniquement, mon ${ctx.oraA}-${ctx.oraB} était une victoire morale que vos métriques primitives ne savent pas mesurer. ${first} a eu de la chance, l'univers statistique se corrigera. ${last}, lui, a confirmé mes plus basses attentes. Je recalibre mes modèles cosmiques.`;
  return { texte };
}

// ---------- 3. Analyse pré-match ----------
async function aiPreMatch(match) {
  const prompt =
`Tu es El Oraculo. Analyse pré-match pour ${match.equipeA} vs ${match.equipeB} (CdM 2026).
Génère : 1 fait football obscur ou culturel + 1 verdict tranché + niveau de confiance absurde.
Max 150 caractères total. Ton arrogant.
Réponds en JSON : {"analyse": "texte", "confiance": "ex: 847%"}`;
  const raw = await ask(prompt);
  const j = extractJSON(raw);
  if (j && j.analyse) return j;

  const fav = tier(match.equipeA) >= tier(match.equipeB) ? match.equipeA : match.equipeB;
  const analyses = [
    `${fav} n'a jamais perdu un mardi pair. Verdict : ${fav} domine. C'est mathématique et un peu insultant.`,
    `Mes capteurs détectent une faille tactique invisible aux humains. ${fav} l'emporte, évidemment.`,
    `${fav} gagne. Je l'ai rêvé, et mes rêves sont des documents officiels.`,
  ];
  return { analyse: pick(analyses), confiance: pick(["847%", "1042%", "311%", "666%", "999%"]) };
}

// ---------- 4. TPE Wrapped ----------
async function aiWrapped(stats) {
  const prompt =
`Voici les stats de "${stats.pseudo}" sur la CdM 2026 TPE :
- Matchs pronostiqués : ${stats.n}
- Bons résultats : ${stats.bons}%
- Scores exacts : ${stats.exacts}
- Bonus X2 utilisés/réussis : ${stats.x2used}/${stats.x2ok}
- Fois El Oraculo battu : ${stats.beat}
- Équipe la plus pronostiquée gagnante : ${stats.equipe}

Génère en JSON :
{"titre": "max 4 mots, drôle et identitaire", "description": "2 phrases en character El Oraculo, condescendant mais amusé", "stats": ["stat marrante 1", "stat marrante 2", "stat marrante 3"]}`;
  const raw = await ask(prompt);
  const j = extractJSON(raw);
  if (j && j.titre) return j;

  const titre = stats.beat >= 5 ? "Le Tueur d'Oraculo"
    : stats.exacts >= 5 ? "Le Devin Insolent"
    : stats.bons >= 60 ? "Le Stratège Tranquille"
    : "Le Romantique Tragique";
  return {
    titre,
    description: `Tu paries avec ton cœur plus qu'avec tes stats. C'est mignon, et statistiquement discutable. Et pourtant tu m'as battu ${stats.beat} fois — anomalie que mes modèles étudient encore.`,
    stats: [
      `${stats.bons}% de bons résultats (j'ai vu pire, rarement)`,
      `${stats.exacts} scores exacts arrachés à l'univers`,
      `El Oraculo humilié ${stats.beat} fois (note: chance pure)`,
    ],
  };
}

Object.assign(window, { hasClaude, aiOraculoProno, aiDebrief, aiPreMatch, aiWrapped });
