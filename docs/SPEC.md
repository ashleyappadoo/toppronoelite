# PROMPT CLAUDE — MVP COMPLET : TPE (Top Prono Élite)
# Coupe du Monde FIFA 2026 — Application de pronostics temps réel

---

## CONTEXTE PROJET

Tu vas builder le MVP complet d'une web app de pronostics footballistiques appelée **TPE — Top Prono Élite**, pour la Coupe du Monde 2026 (11 juin – 19 juillet 2026, 104 matchs, 48 équipes, USA/Canada/Mexique).

L'app reprend le concept de MPP (Mon Petit Prono) — ligues privées entre amis/collègues — mais y ajoute une couche IA centrale et des mécaniques virales/sociales inédites.

**L'app est 100% fonctionnelle et temps réel. Zéro mode démo, zéro bouton "simuler". Les matchs ont de vraies dates/heures, les résultats sont saisis par un admin, les pronostics se ferment automatiquement 5 minutes avant le coup d'envoi réel.**

**Stack** : React (JSX, Hooks), Tailwind CSS, shadcn/ui si besoin. Tout dans un seul fichier `.jsx`. API Anthropic pour les features IA. `window.storage` pour la base de données persistante.

---

## IDENTITÉ VISUELLE

**Nom** : TPE — Top Prono Élite
**Tagline** : *"Pronostique. Humilie El Oraculo. Domine ta ligue."*

**Esthétique** : Dark theme. Néon jaune-or `#F5C518` + rouge sang `#C0392B` sur fond noir `#0A0A0A`. Accent secondaire : violet électrique `#7B2FBE` pour El Oraculo. Typographie display : `Bebas Neue` (Google Fonts). Body : `DM Sans`. Ambiance : tableau de score rétro, stade de nuit, tension électrique. Zéro purple gradient générique, zéro Inter.

**El Oraculo** : avatar SVG boule de cristal avec visage troll arrogant, couleur `#7B2FBE`, toujours distinctif dans les cards/classements.

---

## PERSONNAGE : EL ORACULO

El Oraculo est l'IA adversaire intégrée dans chaque ligue. Présent automatiquement, ne peut pas être retiré.

**Personnalité** :
- Arrogant, troll, condescendant mais drôle
- Se vante quand il a raison, trouve des excuses pathétiques quand il se plante
- Cite des stats obscures pour paraître savant
- Expressions espagnoles/latines occasionnelles pour l'effet
- Ton : Zlatan Ibrahimović croisé avec un prof de stats alcoolique

**Exemples de répliques calibrées** :
- Pronostic : *"L'Oraculo a parlé. 2-0. Les mortels peuvent prendre note."*
- Erreur : *"Techniquement, 0-3 était une victoire morale. Mes algorithmes mesurent des choses que vous ne comprenez pas encore."*
- Il bat un joueur : *"Tu as perdu contre une boule de cristal. Momento histórico."*
- Un joueur le bat : *"Félicitations. Tu as eu de la chance. L'univers statistique se corrigera."*
- Toute la ligue le bat : *"Je recalibre mes modèles cosmiques. Anomalie temporaire."*
- Il est dernier : *"Le classement est une métrique bourgeoise. Je mesure des choses plus subtiles."*

---

## FONCTIONNALITÉS MVP

### 1. AUTHENTIFICATION
- Inscription : pseudo (unique), email, mot de passe (hashé SHA-256 côté client)
- Connexion + session persistante
- Rôle : `user` ou `admin` (l'admin peut saisir les résultats des matchs)
- Compte admin par défaut : `admin` / `tpe2026admin`
- Storage : `tpe:users` (array), `tpe:session` (objet)

### 2. DASHBOARD JOUEUR
- Header : logo TPE + pseudo + déconnexion
- Stats perso : points totaux, rang moyen dans ses ligues, **nb de fois qu'il a battu El Oraculo**
- Liste de ses ligues avec top 3 du classement + son rang
- Matchs à venir dans les 24h avec statut pronostic (fait / pas encore)
- Alerte urgente si match dans < 2h sans prono
- Feed des derniers débriefings El Oraculo

### 3. LIGUES PRIVÉES
- Création : nom de ligue → code unique auto-généré format `TPE-XXXX` (6 car alphanumériques)
- Rejoindre via code
- El Oraculo toujours présent, premier membre virtuel de toute ligue
- Classement : humains + El Oraculo dans le même tableau trié par points
- Badge spécial si un humain est premier devant El Oraculo
- Partage du code via bouton "Copier le lien"

### 4. PRONOSTICS (cœur de l'app)

**Saisie** :
- Liste de tous les matchs CdM 2026 (voir calendrier complet ci-dessous)
- Pour chaque match : score équipe A (0–20) + score équipe B (0–20) via boutons +/-
- Justification optionnelle (140 caractères max) : *"Pourquoi ce score ?"*
- Bonus X2 : 1 seul disponible par phase du tournoi (groupes / 1/32 / 1/16 / QF / SF / Finale)
- Deadline automatique : **fermeture 5 minutes avant l'heure de coup d'envoi réelle**
- Après deadline : pronostic verrouillé, lecture seule

**Système de points** :
- Bon résultat (V/N/D) : **3 pts**
- Score exact : 3 pts bonus + **rareté** :
  - < 30% ont le même score exact → +5 pts
  - < 10% ont le même score exact → +10 pts
- Bonus X2 : double le total (résultat + exact + rareté)
- Mauvais résultat : 0 pt

**El Oraculo** pronostique automatiquement via API Claude avec ce prompt système (appelé à la création du match dans la ligue, ou au chargement si non encore fait) :

```
Tu es El Oraculo, une IA de pronostics football arrogante et trollesque.
Match : {equipeA} vs {equipeB} (Groupe {groupe}, CdM 2026)
Génère ton pronostic avec une réplique caractéristique.
Réponds UNIQUEMENT en JSON valide, sans markdown :
{"score_a": N, "score_b": N, "replique": "max 90 caractères, ton El Oraculo"}
Sois cohérent avec les forces réelles des équipes mais garde le hubris.
```

### 5. SAISIE DES RÉSULTATS (admin uniquement)

Vue admin accessible depuis le dashboard si rôle = `admin` :
- Liste de tous les matchs passés sans résultat
- Formulaire : score réel équipe A + score réel équipe B → bouton "Valider le résultat"
- Au moment de la validation :
  - Calcul automatique des points pour tous les joueurs de toutes les ligues
  - Génération du débriefing El Oraculo (appel API Claude) pour chaque ligue concernée
  - Mise à jour des classements
- Storage : `tpe:results` (matchId → {scoreA, scoreB, date})

### 6. DEBRIEFING POST-MATCH (feature IA centrale)

Déclenché automatiquement à chaque validation de résultat admin, pour chaque ligue ayant des pronostics sur ce match.

**Prompt Claude** :
```
Tu es El Oraculo, chroniqueur sarcastique de la ligue "{nomLigue}".

Résultat officiel : {equipeA} {scoreA} - {scoreB} {equipeB}
Ton pronostic El Oraculo était : {scoreOraculo_A}-{scoreOraculo_B} ({resultatOraculo} / {ptsOraculo} pts)

Classement des joueurs sur ce match :
{liste formatée : rang. Pseudo → prono → pts gagnés}

Génère un débriefing de 3-4 phrases MAX en character El Oraculo.
Règles :
- Mentionne au moins 2 pseudos spécifiques
- Si tu as bien pronostiqué : vante-toi de façon spectaculaire
- Si tu t'es planté : excuse pathétique et grandiose (jamais "j'avais tort")
- Humilie affectueusement le dernier (sans jamais être vraiment méchant)
- Glorifie le premier mais insinue que c'est de la chance
- Pas de bullet points, texte fluide
Réponds en JSON : {"texte": "le débriefing complet"}
```

Affiché dans un encart "🔮 El Oraculo commente" avec son avatar violet, dans la vue ligue.

### 7. CLASSEMENT DE LIGUE

Tableau complet :
| Rang | Avatar | Pseudo | Points | Scores exacts | El Oraculo battu | Tendance |
- El Oraculo a son propre rang (avatar boule de cristal)
- Tendance : flèche ↑↓ basée sur les 3 derniers matchs
- Bandeau animé si El Oraculo est dernier : *"🔮 L'Oraculo traverse une période de recalibrage cosmique"*
- Bandeau si El Oraculo est premier : *"🔮 La hiérarchie naturelle est rétablie. Vous êtes les bienvenus."*
- Compteur "El Oraculo battu X fois" sur chaque profil joueur (valorisé comme achievement)

### 8. ANALYSE PRE-MATCH (El Oraculo preview)

Pour chaque match à venir (dans les 48h), El Oraculo génère une fiche :

**Prompt** :
```
Tu es El Oraculo. Analyse pré-match pour {equipeA} vs {equipeB} (CdM 2026).
Génère : 1 fait football obscur ou culturel + 1 verdict tranché + niveau de confiance absurde.
Max 150 caractères total. Ton arrogant.
Réponds en JSON : {"analyse": "texte", "confiance": "ex: 847%"}
```

Affiché sur la card du match. Bouton vote : "✓ D'accord" / "🤡 El Oraculo délire" → comptabilisé (stats de ligue).

### 9. TROPHEES NARRATIFS — "TPE WRAPPED"

Disponible après 10 matchs joués dans le tournoi (ou pour tous dès la fin de la phase de groupes).

**Prompt** :
```
Voici les stats de "{pseudo}" sur la CdM 2026 TPE :
- Matchs pronostiqués : {n}
- Bons résultats : {x}%
- Scores exacts : {y}
- Bonus X2 utilisés/réussis : {a}/{b}
- Fois El Oraculo battu : {c}
- Équipe la plus pronostiquée gagnante : {equipe}
- Plus gros écart score prédit vs réel : {detail}
- Justification la plus longue écrite : "{texte}"

Génère en JSON :
{
  "titre": "max 4 mots, drôle et identitaire (ex: 'Le Romantique Tragique')",
  "description": "2 phrases en character El Oraculo, condescendant mais amusé",
  "stats": ["stat marrante 1", "stat marrante 2", "stat marrante 3"]
}
```

Carte visuelle partageable : fond dark, néon TPE, avatar initiales, titre en `Bebas Neue` grand format, stats dessous. Bouton "📋 Copier" (texte formaté pour partage).

---

## CALENDRIER COMPLET CdM 2026 — 104 MATCHS RÉELS
### (Heures en CEST = heure de Paris/Bordeaux)

```javascript
const MATCHES = [
  // ═══════════════════════════════════════════
  // PHASE DE GROUPES — JOURNÉE 1 (11–18 juin)
  // ═══════════════════════════════════════════

  // Jeudi 11 juin
  { id: 1, date: "2026-06-11T21:00", equipeA: "Mexique", equipeB: "Afrique du Sud", groupe: "A", stade: "Estadio Azteca", ville: "Mexico City" },

  // Vendredi 12 juin
  { id: 2, date: "2026-06-12T04:00", equipeA: "Corée du Sud", equipeB: "République tchèque", groupe: "A", stade: "Estadio Akron", ville: "Guadalajara" },
  { id: 3, date: "2026-06-12T21:00", equipeA: "Canada", equipeB: "Bosnie-Herzégovine", groupe: "B", stade: "BMO Field", ville: "Toronto" },

  // Samedi 13 juin
  { id: 4, date: "2026-06-13T02:00", equipeA: "USA", equipeB: "Paraguay", groupe: "D", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 5, date: "2026-06-13T21:00", equipeA: "Qatar", equipeB: "Suisse", groupe: "B", stade: "Levi's Stadium", ville: "San Francisco" },

  // Dimanche 14 juin
  { id: 6, date: "2026-06-14T00:00", equipeA: "Brésil", equipeB: "Maroc", groupe: "C", stade: "MetLife Stadium", ville: "New York/New Jersey" },
  { id: 7, date: "2026-06-14T03:00", equipeA: "Haïti", equipeB: "Écosse", groupe: "C", stade: "Gillette Stadium", ville: "Boston/Foxborough" },
  { id: 8, date: "2026-06-14T06:00", equipeA: "Australie", equipeB: "Turquie", groupe: "D", stade: "BC Place", ville: "Vancouver" },
  { id: 9, date: "2026-06-14T19:00", equipeA: "Allemagne", equipeB: "Curaçao", groupe: "E", stade: "NRG Stadium", ville: "Houston" },
  { id: 10, date: "2026-06-14T22:00", equipeA: "Pays-Bas", equipeB: "Japon", groupe: "F", stade: "AT&T Stadium", ville: "Dallas/Arlington" },

  // Lundi 15 juin
  { id: 11, date: "2026-06-15T01:00", equipeA: "Côte d'Ivoire", equipeB: "Équateur", groupe: "E", stade: "Lincoln Financial Field", ville: "Philadelphia" },
  { id: 12, date: "2026-06-15T04:00", equipeA: "Suède", equipeB: "Tunisie", groupe: "F", stade: "Estadio BBVA", ville: "Monterrey" },
  { id: 13, date: "2026-06-15T18:00", equipeA: "Espagne", equipeB: "Cap-Vert", groupe: "H", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 14, date: "2026-06-15T21:00", equipeA: "Belgique", equipeB: "Égypte", groupe: "G", stade: "Lumen Field", ville: "Seattle" },

  // Mardi 16 juin
  { id: 15, date: "2026-06-16T00:00", equipeA: "Arabie Saoudite", equipeB: "Uruguay", groupe: "H", stade: "Hard Rock Stadium", ville: "Miami" },
  { id: 16, date: "2026-06-16T03:00", equipeA: "Iran", equipeB: "Nouvelle-Zélande", groupe: "G", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 17, date: "2026-06-16T21:00", equipeA: "France", equipeB: "Sénégal", groupe: "I", stade: "MetLife Stadium", ville: "New York/New Jersey" },

  // Mercredi 17 juin
  { id: 18, date: "2026-06-17T00:00", equipeA: "Irak", equipeB: "Norvège", groupe: "I", stade: "Gillette Stadium", ville: "Boston/Foxborough" },
  { id: 19, date: "2026-06-17T03:00", equipeA: "Argentine", equipeB: "Algérie", groupe: "J", stade: "Arrowhead Stadium", ville: "Kansas City" },
  { id: 20, date: "2026-06-17T06:00", equipeA: "Autriche", equipeB: "Jordanie", groupe: "J", stade: "Levi's Stadium", ville: "San Francisco" },
  { id: 21, date: "2026-06-17T19:00", equipeA: "Portugal", equipeB: "RD Congo", groupe: "K", stade: "NRG Stadium", ville: "Houston" },
  { id: 22, date: "2026-06-17T22:00", equipeA: "Angleterre", equipeB: "Croatie", groupe: "L", stade: "AT&T Stadium", ville: "Dallas/Arlington" },

  // Jeudi 18 juin (J1 fin + J2 début)
  { id: 23, date: "2026-06-18T01:00", equipeA: "Ghana", equipeB: "Panama", groupe: "L", stade: "BMO Field", ville: "Toronto" },
  { id: 24, date: "2026-06-18T04:00", equipeA: "Ouzbékistan", equipeB: "Colombie", groupe: "K", stade: "Estadio Azteca", ville: "Mexico City" },

  // ═══════════════════════════════════════════
  // PHASE DE GROUPES — JOURNÉE 2 (18–24 juin)
  // ═══════════════════════════════════════════

  { id: 25, date: "2026-06-18T18:00", equipeA: "République tchèque", equipeB: "Afrique du Sud", groupe: "A", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 26, date: "2026-06-18T21:00", equipeA: "Suisse", equipeB: "Bosnie-Herzégovine", groupe: "B", stade: "SoFi Stadium", ville: "Los Angeles" },

  // Vendredi 19 juin
  { id: 27, date: "2026-06-19T00:00", equipeA: "Canada", equipeB: "Qatar", groupe: "B", stade: "BC Place", ville: "Vancouver" },
  { id: 28, date: "2026-06-19T03:00", equipeA: "Mexique", equipeB: "Corée du Sud", groupe: "A", stade: "Estadio Akron", ville: "Guadalajara" },
  { id: 29, date: "2026-06-19T21:00", equipeA: "USA", equipeB: "Australie", groupe: "D", stade: "Lumen Field", ville: "Seattle" },

  // Samedi 20 juin
  { id: 30, date: "2026-06-20T00:00", equipeA: "Écosse", equipeB: "Maroc", groupe: "C", stade: "Gillette Stadium", ville: "Boston/Foxborough" },
  { id: 31, date: "2026-06-20T03:00", equipeA: "Brésil", equipeB: "Haïti", groupe: "C", stade: "Lincoln Financial Field", ville: "Philadelphia" },
  { id: 32, date: "2026-06-20T06:00", equipeA: "Turquie", equipeB: "Paraguay", groupe: "D", stade: "Levi's Stadium", ville: "San Francisco" },
  { id: 33, date: "2026-06-20T19:00", equipeA: "Pays-Bas", equipeB: "Suède", groupe: "F", stade: "NRG Stadium", ville: "Houston" },
  { id: 34, date: "2026-06-20T22:00", equipeA: "Allemagne", equipeB: "Côte d'Ivoire", groupe: "E", stade: "BMO Field", ville: "Toronto" },

  // Dimanche 21 juin
  { id: 35, date: "2026-06-21T02:00", equipeA: "Équateur", equipeB: "Curaçao", groupe: "E", stade: "Arrowhead Stadium", ville: "Kansas City" },
  { id: 36, date: "2026-06-21T06:00", equipeA: "Tunisie", equipeB: "Japon", groupe: "F", stade: "Estadio BBVA", ville: "Monterrey" },
  { id: 37, date: "2026-06-21T18:00", equipeA: "Espagne", equipeB: "Arabie Saoudite", groupe: "H", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 38, date: "2026-06-21T21:00", equipeA: "Belgique", equipeB: "Iran", groupe: "G", stade: "SoFi Stadium", ville: "Los Angeles" },

  // Lundi 22 juin
  { id: 39, date: "2026-06-22T00:00", equipeA: "Uruguay", equipeB: "Cap-Vert", groupe: "H", stade: "Hard Rock Stadium", ville: "Miami" },
  { id: 40, date: "2026-06-22T03:00", equipeA: "Nouvelle-Zélande", equipeB: "Égypte", groupe: "G", stade: "BC Place", ville: "Vancouver" },
  { id: 41, date: "2026-06-22T19:00", equipeA: "Argentine", equipeB: "Autriche", groupe: "J", stade: "AT&T Stadium", ville: "Dallas/Arlington" },
  { id: 42, date: "2026-06-22T23:00", equipeA: "France", equipeB: "Irak", groupe: "I", stade: "Lincoln Financial Field", ville: "Philadelphia" },

  // Mardi 23 juin
  { id: 43, date: "2026-06-23T02:00", equipeA: "Norvège", equipeB: "Sénégal", groupe: "I", stade: "BMO Field", ville: "Toronto" },
  { id: 44, date: "2026-06-23T05:00", equipeA: "Jordanie", equipeB: "Algérie", groupe: "J", stade: "Levi's Stadium", ville: "San Francisco" },
  { id: 45, date: "2026-06-23T19:00", equipeA: "Portugal", equipeB: "Ouzbékistan", groupe: "K", stade: "NRG Stadium", ville: "Houston" },
  { id: 46, date: "2026-06-23T22:00", equipeA: "Angleterre", equipeB: "Ghana", groupe: "L", stade: "Gillette Stadium", ville: "Boston/Foxborough" },

  // Mercredi 24 juin
  { id: 47, date: "2026-06-24T01:00", equipeA: "Panama", equipeB: "Croatie", groupe: "L", stade: "Gillette Stadium", ville: "Boston/Foxborough" },
  { id: 48, date: "2026-06-24T04:00", equipeA: "Colombie", equipeB: "RD Congo", groupe: "K", stade: "Estadio Akron", ville: "Guadalajara" },

  // ═══════════════════════════════════════════
  // PHASE DE GROUPES — JOURNÉE 3 (24–28 juin)
  // ═══════════════════════════════════════════

  { id: 49, date: "2026-06-24T21:00", equipeA: "Suisse", equipeB: "Canada", groupe: "B", stade: "BC Place", ville: "Vancouver" },
  { id: 50, date: "2026-06-24T21:00", equipeA: "Bosnie-Herzégovine", equipeB: "Qatar", groupe: "B", stade: "Lumen Field", ville: "Seattle" },

  // Jeudi 25 juin
  { id: 51, date: "2026-06-25T00:00", equipeA: "Maroc", equipeB: "Haïti", groupe: "C", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 52, date: "2026-06-25T00:00", equipeA: "Écosse", equipeB: "Brésil", groupe: "C", stade: "Hard Rock Stadium", ville: "Miami" },
  { id: 53, date: "2026-06-25T03:00", equipeA: "République tchèque", equipeB: "Mexique", groupe: "A", stade: "Estadio Azteca", ville: "Mexico City" },
  { id: 54, date: "2026-06-25T03:00", equipeA: "Afrique du Sud", equipeB: "Corée du Sud", groupe: "A", stade: "Estadio BBVA", ville: "Monterrey" },
  { id: 55, date: "2026-06-25T22:00", equipeA: "Curaçao", equipeB: "Côte d'Ivoire", groupe: "E", stade: "Lincoln Financial Field", ville: "Philadelphia" },
  { id: 56, date: "2026-06-25T22:00", equipeA: "Équateur", equipeB: "Allemagne", groupe: "E", stade: "MetLife Stadium", ville: "New York/New Jersey" },

  // Vendredi 26 juin
  { id: 57, date: "2026-06-26T01:00", equipeA: "Japon", equipeB: "Suède", groupe: "F", stade: "AT&T Stadium", ville: "Dallas/Arlington" },
  { id: 58, date: "2026-06-26T01:00", equipeA: "Tunisie", equipeB: "Pays-Bas", groupe: "F", stade: "Arrowhead Stadium", ville: "Kansas City" },
  { id: 59, date: "2026-06-26T04:00", equipeA: "Turquie", equipeB: "USA", groupe: "D", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 60, date: "2026-06-26T04:00", equipeA: "Paraguay", equipeB: "Australie", groupe: "D", stade: "Levi's Stadium", ville: "San Francisco" },
  { id: 61, date: "2026-06-26T21:00", equipeA: "Norvège", equipeB: "France", groupe: "I", stade: "Gillette Stadium", ville: "Boston/Foxborough" },
  { id: 62, date: "2026-06-26T21:00", equipeA: "Sénégal", equipeB: "Irak", groupe: "I", stade: "BMO Field", ville: "Toronto" },

  // Samedi 27 juin
  { id: 63, date: "2026-06-27T02:00", equipeA: "Cap-Vert", equipeB: "Arabie Saoudite", groupe: "H", stade: "NRG Stadium", ville: "Houston" },
  { id: 64, date: "2026-06-27T02:00", equipeA: "Uruguay", equipeB: "Espagne", groupe: "H", stade: "Estadio Akron", ville: "Guadalajara" },
  { id: 65, date: "2026-06-27T05:00", equipeA: "Nouvelle-Zélande", equipeB: "Belgique", groupe: "G", stade: "BC Place", ville: "Vancouver" },
  { id: 66, date: "2026-06-27T05:00", equipeA: "Égypte", equipeB: "Iran", groupe: "G", stade: "Lumen Field", ville: "Seattle" },
  { id: 67, date: "2026-06-27T23:00", equipeA: "Panama", equipeB: "Angleterre", groupe: "L", stade: "MetLife Stadium", ville: "New York/New Jersey" },
  { id: 68, date: "2026-06-27T23:00", equipeA: "Croatie", equipeB: "Ghana", groupe: "L", stade: "Lincoln Financial Field", ville: "Philadelphia" },

  // Dimanche 28 juin
  { id: 69, date: "2026-06-28T01:30", equipeA: "Colombie", equipeB: "Portugal", groupe: "K", stade: "Hard Rock Stadium", ville: "Miami" },
  { id: 70, date: "2026-06-28T01:30", equipeA: "RD Congo", equipeB: "Ouzbékistan", groupe: "K", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 71, date: "2026-06-28T04:00", equipeA: "Algérie", equipeB: "Autriche", groupe: "J", stade: "Arrowhead Stadium", ville: "Kansas City" },
  { id: 72, date: "2026-06-28T04:00", equipeA: "Jordanie", equipeB: "Argentine", groupe: "J", stade: "AT&T Stadium", ville: "Dallas/Arlington" },

  // ═══════════════════════════════════════════
  // 1/32 DE FINALE (28 juin – 4 juillet)
  // ═══════════════════════════════════════════

  { id: 73, date: "2026-06-28T21:00", equipeA: "2e Groupe A", equipeB: "2e Groupe B", groupe: "1/32", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 74, date: "2026-06-29T22:30", equipeA: "1er Groupe E", equipeB: "Meilleur 3e", groupe: "1/32", stade: "Gillette Stadium", ville: "Boston" },
  { id: 75, date: "2026-06-30T03:00", equipeA: "1er Groupe F", equipeB: "2e Groupe C", groupe: "1/32", stade: "Estadio BBVA", ville: "Monterrey" },
  { id: 76, date: "2026-06-29T19:00", equipeA: "1er Groupe C", equipeB: "2e Groupe F", groupe: "1/32", stade: "NRG Stadium", ville: "Houston" },
  { id: 77, date: "2026-06-30T23:00", equipeA: "1er Groupe I", equipeB: "Meilleur 3e", groupe: "1/32", stade: "MetLife Stadium", ville: "New York" },
  { id: 78, date: "2026-06-30T19:00", equipeA: "2e Groupe E", equipeB: "2e Groupe I", groupe: "1/32", stade: "AT&T Stadium", ville: "Dallas" },
  { id: 79, date: "2026-07-01T03:00", equipeA: "1er Groupe A", equipeB: "Meilleur 3e", groupe: "1/32", stade: "Estadio Azteca", ville: "Mexico City" },
  { id: 80, date: "2026-07-01T18:00", equipeA: "1er Groupe L", equipeB: "Meilleur 3e", groupe: "1/32", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 81, date: "2026-07-02T02:00", equipeA: "1er Groupe D", equipeB: "Meilleur 3e", groupe: "1/32", stade: "Levi's Stadium", ville: "San Francisco" },
  { id: 82, date: "2026-07-01T22:00", equipeA: "1er Groupe G", equipeB: "Meilleur 3e", groupe: "1/32", stade: "Lumen Field", ville: "Seattle" },
  { id: 83, date: "2026-07-03T01:00", equipeA: "2e Groupe K", equipeB: "2e Groupe L", groupe: "1/32", stade: "BMO Field", ville: "Toronto" },
  { id: 84, date: "2026-07-02T21:00", equipeA: "1er Groupe H", equipeB: "2e Groupe J", groupe: "1/32", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 85, date: "2026-07-03T05:00", equipeA: "1er Groupe B", equipeB: "Meilleur 3e", groupe: "1/32", stade: "BC Place", ville: "Vancouver" },
  { id: 86, date: "2026-07-04T00:00", equipeA: "2e Groupe D", equipeB: "2e Groupe G", groupe: "1/32", stade: "Hard Rock Stadium", ville: "Miami" },
  { id: 87, date: "2026-07-04T02:30", equipeA: "1er Groupe K", equipeB: "Meilleur 3e", groupe: "1/32", stade: "BC Place", ville: "Vancouver" },
  { id: 88, date: "2026-07-03T20:00", equipeA: "1er Groupe J", equipeB: "2e Groupe H", groupe: "1/32", stade: "AT&T Stadium", ville: "Dallas" },

  // ═══════════════════════════════════════════
  // 1/16 DE FINALE (4–7 juillet)
  // ═══════════════════════════════════════════

  { id: 89, date: "2026-07-04T23:00", equipeA: "Vainqueur M73", equipeB: "Vainqueur M74", groupe: "1/16", stade: "Lincoln Financial Field", ville: "Philadelphia" },
  { id: 90, date: "2026-07-04T19:00", equipeA: "Vainqueur M75", equipeB: "Vainqueur M76", groupe: "1/16", stade: "NRG Stadium", ville: "Houston" },
  { id: 91, date: "2026-07-05T22:00", equipeA: "Vainqueur M77", equipeB: "Vainqueur M78", groupe: "1/16", stade: "MetLife Stadium", ville: "New York" },
  { id: 92, date: "2026-07-06T02:00", equipeA: "Vainqueur M79", equipeB: "Vainqueur M80", groupe: "1/16", stade: "Estadio Azteca", ville: "Mexico City" },
  { id: 93, date: "2026-07-06T21:00", equipeA: "Vainqueur M83", equipeB: "Vainqueur M84", groupe: "1/16", stade: "AT&T Stadium", ville: "Dallas" },
  { id: 94, date: "2026-07-07T02:00", equipeA: "Vainqueur M81", equipeB: "Vainqueur M82", groupe: "1/16", stade: "Lumen Field", ville: "Seattle" },
  { id: 95, date: "2026-07-07T18:00", equipeA: "Vainqueur M86", equipeB: "Vainqueur M88", groupe: "1/16", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 96, date: "2026-07-07T22:00", equipeA: "Vainqueur M85", equipeB: "Vainqueur M87", groupe: "1/16", stade: "BC Place", ville: "Vancouver" },

  // ═══════════════════════════════════════════
  // QUARTS DE FINALE (9–12 juillet)
  // ═══════════════════════════════════════════

  { id: 97, date: "2026-07-09T22:00", equipeA: "Vainqueur M89", equipeB: "Vainqueur M90", groupe: "QF", stade: "Gillette Stadium", ville: "Boston" },
  { id: 98, date: "2026-07-10T21:00", equipeA: "Vainqueur M93", equipeB: "Vainqueur M94", groupe: "QF", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 99, date: "2026-07-11T23:00", equipeA: "Vainqueur M95", equipeB: "Vainqueur M96", groupe: "QF", stade: "Hard Rock Stadium", ville: "Miami" },
  { id: 100, date: "2026-07-12T03:00", equipeA: "Vainqueur M91", equipeB: "Vainqueur M92", groupe: "QF", stade: "Arrowhead Stadium", ville: "Kansas City" },

  // ═══════════════════════════════════════════
  // DEMI-FINALES (14–15 juillet)
  // ═══════════════════════════════════════════

  { id: 101, date: "2026-07-14T21:00", equipeA: "Vainqueur M97", equipeB: "Vainqueur M98", groupe: "SF", stade: "AT&T Stadium", ville: "Dallas" },
  { id: 102, date: "2026-07-15T21:00", equipeA: "Vainqueur M99", equipeB: "Vainqueur M100", groupe: "SF", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },

  // ═══════════════════════════════════════════
  // MATCH POUR LA 3E PLACE (18 juillet)
  // ═══════════════════════════════════════════

  { id: 103, date: "2026-07-18T23:00", equipeA: "Perdant M101", equipeB: "Perdant M102", groupe: "3e", stade: "Hard Rock Stadium", ville: "Miami" },

  // ═══════════════════════════════════════════
  // FINALE (19 juillet)
  // ═══════════════════════════════════════════

  { id: 104, date: "2026-07-19T21:00", equipeA: "Vainqueur M101", equipeB: "Vainqueur M102", groupe: "FINALE", stade: "MetLife Stadium", ville: "New York/New Jersey" },
];
```

**Note sur les phases éliminatoires** : les noms des équipes (ex: "Vainqueur M73") sont des placeholders. Ils se mettent à jour dynamiquement dans l'UI en fonction des résultats saisis par l'admin au fur et à mesure du tournoi.

---

## GESTION DU TEMPS RÉEL

### Deadline automatique des pronostics
```javascript
// Un match est "ouvert" si : maintenant < kickoff - 5 minutes
// Un match est "fermé" si : maintenant >= kickoff - 5 minutes
const isMatchOpen = (match) => {
  const kickoff = new Date(match.date);
  const deadline = new Date(kickoff.getTime() - 5 * 60 * 1000);
  return new Date() < deadline;
};

// Afficher le temps restant avant fermeture
const getTimeUntilDeadline = (match) => {
  const deadline = new Date(new Date(match.date).getTime() - 5 * 60 * 1000);
  const diff = deadline - new Date();
  if (diff <= 0) return null; // fermé
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return { hours, minutes };
};
```

### Affichage des matchs
- **À venir (>48h)** : affichage normal, prono saisissable
- **Urgents (<2h)** : badge rouge clignotant "⚡ Fermeture imminente"
- **En cours** (kickoff ≤ maintenant ≤ kickoff + 3h) : badge vert "🔴 EN DIRECT" 
- **Terminés** : affichage résultat + points gagnés
- **Phases futures** (1/32 etc.) : verrouillés jusqu'à qualification des équipes

---

## ARCHITECTURE STORAGE (window.storage)

```javascript
// USERS — tableau de tous les comptes
// clé : 'tpe:users'
// valeur : JSON.stringify([{
//   id: string (uuid v4 simple),
//   pseudo: string,
//   email: string,
//   passwordHash: string (SHA-256 hex),
//   role: 'user' | 'admin',
//   createdAt: ISO string
// }])

// SESSION ACTIVE
// clé : 'tpe:session'
// valeur : JSON.stringify({ userId, pseudo, role }) | null

// LIGUES
// clé : 'tpe:leagues'
// valeur : JSON.stringify([{
//   id: string,
//   code: string (ex: "TPE-X9K3"),
//   nom: string,
//   createdBy: userId,
//   createdAt: ISO string,
//   membres: [userId, ...] // sans El Oraculo (il est toujours virtuel)
// }])

// PRONOSTICS HUMAINS
// clé : 'tpe:pronos'
// valeur : JSON.stringify([{
//   id: string,
//   userId: string,
//   leagueId: string,
//   matchId: number,
//   scoreA: number,
//   scoreB: number,
//   justification: string | null,
//   bonusX2: boolean,
//   soumisAt: ISO string
// }])

// PRONOSTICS EL ORACULO (par ligue)
// clé : 'tpe:oraculo_pronos'
// valeur : JSON.stringify([{
//   leagueId: string,
//   matchId: number,
//   scoreA: number,
//   scoreB: number,
//   replique: string,
//   generatedAt: ISO string
// }])

// RÉSULTATS OFFICIELS (saisis par admin)
// clé : 'tpe:results'
// valeur : JSON.stringify([{
//   matchId: number,
//   scoreA: number,
//   scoreB: number,
//   saisiPar: userId,
//   saisiAt: ISO string
// }])

// DEBRIEFINGS EL ORACULO
// clé : 'tpe:debriefs'
// valeur : JSON.stringify([{
//   matchId: number,
//   leagueId: string,
//   texte: string,
//   generatedAt: ISO string
// }])

// VOTES PRE-MATCH (analyse El Oraculo)
// clé : 'tpe:votes'
// valeur : JSON.stringify([{
//   userId: string,
//   matchId: number,
//   vote: 'agree' | 'disagree'
// }])
```

---

## NAVIGATION SPA

6 vues gérées par `useState('view')` :
1. `auth` — Login / Register
2. `dashboard` — Accueil joueur connecté
3. `league` — Vue d'une ligue (passer `leagueId` en state)
4. `match` — Saisie pronostic (passer `matchId` en state)
5. `wrapped` — Trophées narratifs
6. `admin` — Saisie résultats (accessible si role = 'admin')

---

## CONTRAINTES TECHNIQUES ABSOLUES

- **Un seul fichier JSX** (artifact Claude)
- **Tailwind uniquement** — pas de CSS custom sauf variables dans un `<style>` tag
- **API Anthropic** : `fetch("https://api.anthropic.com/v1/messages")`, model `claude-sonnet-4-20250514`, max_tokens 1000. **Pas de clé API dans le code** — l'API est proxied par Claude.ai
- **window.storage** uniquement — jamais localStorage, sessionStorage
- **Jamais de `<form>` HTML** — uniquement `onClick` / `onChange`
- **Google Fonts** : `Bebas Neue` + `DM Sans` importées via tag `<style>@import url(...)</style>` au top du composant
- Gestion d'erreur sur TOUS les appels API (try/catch)
- État "🔮 El Oraculo réfléchit..." avec spinner pendant les appels IA
- Pas de mode démo, pas de "simuler résultat" — seul l'admin saisit les vrais scores

---

## ORDRE DE BUILD RECOMMANDÉ

1. **Storage helpers** : fonctions get/set/update pour chaque entité
2. **Auth** : inscription, connexion, session
3. **Dashboard** : mes ligues, mes stats, matchs urgents
4. **Créer/rejoindre ligue** : code generation, stockage
5. **Vue ligue** : classement (humains + El Oraculo), liste matchs, débriefings
6. **Saisie pronostic** : deadline check, score input, X2, justification
7. **El Oraculo auto-prono** : appel API Claude à l'ouverture d'une ligue pour chaque match ouvert
8. **Vue admin** : saisie résultats → calcul points → déclenchement débriefing
9. **Analyse pré-match** : appel API Claude + système de vote
10. **Wrapped** : calcul stats + appel API Claude + carte partageable
