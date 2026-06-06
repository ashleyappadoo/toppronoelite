# TPE — Top Prono Élite 🔮⚽

> **Pronostique. Humilie El Oraculo. Domine ta ligue.**
> Web app de pronostics pour la **Coupe du Monde FIFA 2026** (11 juin – 19 juillet 2026, 104 matchs, 48 équipes).

Ligues privées entre amis/collègues à la « Mon Petit Prono », **+ une IA adversaire centrale** : **El Oraculo**, une boule de cristal arrogante et trolle, présente automatiquement dans chaque ligue. Elle pronostique, commente les résultats, analyse les matchs et te roaste dans ton bilan de fin de tournoi.

---

## 🚀 Démarrer

C'est un site **statique** (aucune étape de build requise). Trois options :

```bash
# 1. Le plus simple : ouvrir directement
open index.html

# 2. Serveur local (recommandé)
python3 -m http.server 8080      # puis http://localhost:8080
#   ou
npx serve .

# 3. Déploiement : GitHub Pages / Netlify / Vercel — pointer sur la racine du repo
```

**Compte admin par défaut** (saisie des résultats) : `admin` / `tpe2026admin`

---

## 🧠 El Oraculo & l'IA

Les features IA (prono auto, débriefing post-match, analyse pré-match, TPE Wrapped) passent par `src/ai.js`.

- **En environnement Claude / avec un proxy** exposant `window.claude.complete(prompt)` → appels réels au modèle.
- **Sans API** → `src/ai.js` bascule automatiquement sur un **générateur local** (répliques El Oraculo, pronos cohérents par niveau d'équipe). **L'app reste 100 % fonctionnelle hors-ligne.**

> Pour un déploiement public avec vraie IA, branche un petit proxy backend (clé API Anthropic côté serveur, **jamais dans le code client**) et expose `window.claude.complete`, ou remplace `ask()` dans `src/ai.js` par un `fetch` vers ta route serveur.

---

## 🗂️ Architecture

```
toppronoelite/
├─ index.html            # point d'entrée, charge fonts + scripts dans l'ordre
├─ styles.css            # design system (dark néon · or/rouge · violet Oraculo)
├─ src/
│  ├─ data.js            # 104 matchs réels CdM 2026 + drapeaux + phases (JS pur)
│  ├─ storage.js         # persistance localStorage, SHA-256, uuid, seed admin
│  ├─ engine.js          # deadlines temps réel, moteur de points, classements
│  ├─ ai.js              # El Oraculo (API window.claude + fallback local)
│  ├─ oraculo.jsx        # avatar SVG boule de cristal troll
│  ├─ ui.jsx             # status bar, icônes, bottom-nav, avatars, header
│  ├─ auth.jsx           # inscription / connexion / session
│  ├─ dashboard.jsx      # accueil joueur (stats, ligues, matchs urgents, feed)
│  ├─ league.jsx         # hub ligues + vue ligue (classement, matchs, débriefs)
│  ├─ match.jsx          # saisie prono (steppers, ×2, justif) + analyse pré-match
│  ├─ admin.jsx          # console admin : saisie des résultats officiels
│  ├─ wrapped.jsx        # TPE Wrapped + vues Matchs/Profil
│  └─ app.jsx            # routeur SPA + état global + actions
└─ docs/SPEC.md          # cahier des charges d'origine
```

**Stack** : React 18 + Babel standalone (JSX in-browser, zéro bundler), CSS vanilla, `localStorage`.
**Polices** : Bebas Neue (display) + DM Sans (texte) + DM Mono (chiffres) via Google Fonts.

---

## ⚙️ Règles du jeu (implémentées)

**Système de points** (`src/engine.js`)
- Bon résultat (V/N/D) : **3 pts**
- Score exact : **+3 pts** + bonus rareté (`<30 %` même score → +5, `<10 %` → +10)
- **Bonus ×2** : 1 seul par phase (groupes / 1/32 / 1/16 / QF / SF / finale) — double le total du match
- Mauvais résultat : 0 pt

**Temps réel**
- Pronostics fermés **5 min avant le coup d'envoi** réel ; verrouillés en lecture seule ensuite
- Statuts auto : à venir / urgent (`<2 h`) / en direct / joué / terminé
- Phases éliminatoires verrouillées tant que les équipes ne sont pas connues

**Social / viral**
- Ligues privées avec code `TPE-XXXX`, El Oraculo membre virtuel inamovible
- Classement humains + El Oraculo, badges « 🔮 devancé / battu ×N », tendances ↑↓
- Débriefing El Oraculo généré à chaque résultat validé
- Vote pré-match « D'accord / Il délire »
- **TPE Wrapped** : carte d'archétype partageable (débloquée après 10 matchs)

**Clés `localStorage`** : `tpe:users`, `tpe:session`, `tpe:leagues`, `tpe:pronos`, `tpe:oraculo_pronos`, `tpe:results`, `tpe:debriefs`, `tpe:votes`.

---

## 📦 Mettre ce projet dans le repo GitHub

Le contenu de ce dossier `toppronoelite/` correspond à la racine du repo `ashleyappadoo/toppronoelite`.

```bash
cd toppronoelite
git init
git add .
git commit -m "feat: MVP complet TPE — Top Prono Élite"
git branch -M main
git remote add origin https://github.com/ashleyappadoo/toppronoelite.git
git push -u origin main
```

> Depuis **Claude Code** : ouvre le repo, dépose ces fichiers à la racine, puis `commit` + `push`.

---

## 🛠️ Pistes d'évolution (post-MVP)

- **Backend réel** (Supabase / Firebase / Postgres) pour partager les données entre joueurs — `localStorage` est mono-appareil.
- Proxy IA serveur pour El Oraculo en production.
- Notifications push avant fermeture des pronos.
- Migration optionnelle vers Vite + modules ES si l'équipe préfère un build.
