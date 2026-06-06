// ============================================================
// TPE — Données statiques : équipes, drapeaux, calendrier 104 matchs
// ============================================================

// Drapeau emoji par équipe (placeholders éliminatoires gérés à part)
window.FLAGS = {
  "Mexique": "🇲🇽", "Afrique du Sud": "🇿🇦", "Corée du Sud": "🇰🇷", "République tchèque": "🇨🇿",
  "Canada": "🇨🇦", "Bosnie-Herzégovine": "🇧🇦", "USA": "🇺🇸", "Paraguay": "🇵🇾",
  "Qatar": "🇶🇦", "Suisse": "🇨🇭", "Brésil": "🇧🇷", "Maroc": "🇲🇦",
  "Haïti": "🇭🇹", "Écosse": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Australie": "🇦🇺", "Turquie": "🇹🇷",
  "Allemagne": "🇩🇪", "Curaçao": "🇨🇼", "Pays-Bas": "🇳🇱", "Japon": "🇯🇵",
  "Côte d'Ivoire": "🇨🇮", "Équateur": "🇪🇨", "Suède": "🇸🇪", "Tunisie": "🇹🇳",
  "Espagne": "🇪🇸", "Cap-Vert": "🇨🇻", "Belgique": "🇧🇪", "Égypte": "🇪🇬",
  "Arabie Saoudite": "🇸🇦", "Uruguay": "🇺🇾", "Iran": "🇮🇷", "Nouvelle-Zélande": "🇳🇿",
  "France": "🇫🇷", "Sénégal": "🇸🇳", "Irak": "🇮🇶", "Norvège": "🇳🇴",
  "Argentine": "🇦🇷", "Algérie": "🇩🇿", "Autriche": "🇦🇹", "Jordanie": "🇯🇴",
  "Portugal": "🇵🇹", "RD Congo": "🇨🇩", "Angleterre": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croatie": "🇭🇷",
  "Ghana": "🇬🇭", "Panama": "🇵🇦", "Ouzbékistan": "🇺🇿", "Colombie": "🇨🇴",
};

window.flagOf = function (team) {
  if (window.FLAGS[team]) return window.FLAGS[team];
  // placeholder éliminatoire : "1er Groupe X", "Vainqueur Mxx", "Meilleur 3e"...
  return "🏆";
};

window.PHASE_LABEL = {
  "1/32": "1/32 de finale", "1/16": "1/16 de finale",
  "QF": "Quarts de finale", "SF": "Demi-finales",
  "3e": "Match 3e place", "FINALE": "Finale",
};

// Phases pour le bonus X2 (1 par phase)
window.phaseOf = function (groupe) {
  if (["A","B","C","D","E","F","G","H","I","J","K","L"].includes(groupe)) return "groupes";
  return groupe; // 1/32, 1/16, QF, SF, 3e, FINALE
};

window.MATCHES = [
  // ── GROUPES J1 ──
  { id: 1, date: "2026-06-11T21:00", equipeA: "Mexique", equipeB: "Afrique du Sud", groupe: "A", stade: "Estadio Azteca", ville: "Mexico City" },
  { id: 2, date: "2026-06-12T04:00", equipeA: "Corée du Sud", equipeB: "République tchèque", groupe: "A", stade: "Estadio Akron", ville: "Guadalajara" },
  { id: 3, date: "2026-06-12T21:00", equipeA: "Canada", equipeB: "Bosnie-Herzégovine", groupe: "B", stade: "BMO Field", ville: "Toronto" },
  { id: 4, date: "2026-06-13T02:00", equipeA: "USA", equipeB: "Paraguay", groupe: "D", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 5, date: "2026-06-13T21:00", equipeA: "Qatar", equipeB: "Suisse", groupe: "B", stade: "Levi's Stadium", ville: "San Francisco" },
  { id: 6, date: "2026-06-14T00:00", equipeA: "Brésil", equipeB: "Maroc", groupe: "C", stade: "MetLife Stadium", ville: "New York/New Jersey" },
  { id: 7, date: "2026-06-14T03:00", equipeA: "Haïti", equipeB: "Écosse", groupe: "C", stade: "Gillette Stadium", ville: "Boston/Foxborough" },
  { id: 8, date: "2026-06-14T06:00", equipeA: "Australie", equipeB: "Turquie", groupe: "D", stade: "BC Place", ville: "Vancouver" },
  { id: 9, date: "2026-06-14T19:00", equipeA: "Allemagne", equipeB: "Curaçao", groupe: "E", stade: "NRG Stadium", ville: "Houston" },
  { id: 10, date: "2026-06-14T22:00", equipeA: "Pays-Bas", equipeB: "Japon", groupe: "F", stade: "AT&T Stadium", ville: "Dallas/Arlington" },
  { id: 11, date: "2026-06-15T01:00", equipeA: "Côte d'Ivoire", equipeB: "Équateur", groupe: "E", stade: "Lincoln Financial Field", ville: "Philadelphia" },
  { id: 12, date: "2026-06-15T04:00", equipeA: "Suède", equipeB: "Tunisie", groupe: "F", stade: "Estadio BBVA", ville: "Monterrey" },
  { id: 13, date: "2026-06-15T18:00", equipeA: "Espagne", equipeB: "Cap-Vert", groupe: "H", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 14, date: "2026-06-15T21:00", equipeA: "Belgique", equipeB: "Égypte", groupe: "G", stade: "Lumen Field", ville: "Seattle" },
  { id: 15, date: "2026-06-16T00:00", equipeA: "Arabie Saoudite", equipeB: "Uruguay", groupe: "H", stade: "Hard Rock Stadium", ville: "Miami" },
  { id: 16, date: "2026-06-16T03:00", equipeA: "Iran", equipeB: "Nouvelle-Zélande", groupe: "G", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 17, date: "2026-06-16T21:00", equipeA: "France", equipeB: "Sénégal", groupe: "I", stade: "MetLife Stadium", ville: "New York/New Jersey" },
  { id: 18, date: "2026-06-17T00:00", equipeA: "Irak", equipeB: "Norvège", groupe: "I", stade: "Gillette Stadium", ville: "Boston/Foxborough" },
  { id: 19, date: "2026-06-17T03:00", equipeA: "Argentine", equipeB: "Algérie", groupe: "J", stade: "Arrowhead Stadium", ville: "Kansas City" },
  { id: 20, date: "2026-06-17T06:00", equipeA: "Autriche", equipeB: "Jordanie", groupe: "J", stade: "Levi's Stadium", ville: "San Francisco" },
  { id: 21, date: "2026-06-17T19:00", equipeA: "Portugal", equipeB: "RD Congo", groupe: "K", stade: "NRG Stadium", ville: "Houston" },
  { id: 22, date: "2026-06-17T22:00", equipeA: "Angleterre", equipeB: "Croatie", groupe: "L", stade: "AT&T Stadium", ville: "Dallas/Arlington" },
  { id: 23, date: "2026-06-18T01:00", equipeA: "Ghana", equipeB: "Panama", groupe: "L", stade: "BMO Field", ville: "Toronto" },
  { id: 24, date: "2026-06-18T04:00", equipeA: "Ouzbékistan", equipeB: "Colombie", groupe: "K", stade: "Estadio Azteca", ville: "Mexico City" },
  // ── GROUPES J2 ──
  { id: 25, date: "2026-06-18T18:00", equipeA: "République tchèque", equipeB: "Afrique du Sud", groupe: "A", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 26, date: "2026-06-18T21:00", equipeA: "Suisse", equipeB: "Bosnie-Herzégovine", groupe: "B", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 27, date: "2026-06-19T00:00", equipeA: "Canada", equipeB: "Qatar", groupe: "B", stade: "BC Place", ville: "Vancouver" },
  { id: 28, date: "2026-06-19T03:00", equipeA: "Mexique", equipeB: "Corée du Sud", groupe: "A", stade: "Estadio Akron", ville: "Guadalajara" },
  { id: 29, date: "2026-06-19T21:00", equipeA: "USA", equipeB: "Australie", groupe: "D", stade: "Lumen Field", ville: "Seattle" },
  { id: 30, date: "2026-06-20T00:00", equipeA: "Écosse", equipeB: "Maroc", groupe: "C", stade: "Gillette Stadium", ville: "Boston/Foxborough" },
  { id: 31, date: "2026-06-20T03:00", equipeA: "Brésil", equipeB: "Haïti", groupe: "C", stade: "Lincoln Financial Field", ville: "Philadelphia" },
  { id: 32, date: "2026-06-20T06:00", equipeA: "Turquie", equipeB: "Paraguay", groupe: "D", stade: "Levi's Stadium", ville: "San Francisco" },
  { id: 33, date: "2026-06-20T19:00", equipeA: "Pays-Bas", equipeB: "Suède", groupe: "F", stade: "NRG Stadium", ville: "Houston" },
  { id: 34, date: "2026-06-20T22:00", equipeA: "Allemagne", equipeB: "Côte d'Ivoire", groupe: "E", stade: "BMO Field", ville: "Toronto" },
  { id: 35, date: "2026-06-21T02:00", equipeA: "Équateur", equipeB: "Curaçao", groupe: "E", stade: "Arrowhead Stadium", ville: "Kansas City" },
  { id: 36, date: "2026-06-21T06:00", equipeA: "Tunisie", equipeB: "Japon", groupe: "F", stade: "Estadio BBVA", ville: "Monterrey" },
  { id: 37, date: "2026-06-21T18:00", equipeA: "Espagne", equipeB: "Arabie Saoudite", groupe: "H", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 38, date: "2026-06-21T21:00", equipeA: "Belgique", equipeB: "Iran", groupe: "G", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 39, date: "2026-06-22T00:00", equipeA: "Uruguay", equipeB: "Cap-Vert", groupe: "H", stade: "Hard Rock Stadium", ville: "Miami" },
  { id: 40, date: "2026-06-22T03:00", equipeA: "Nouvelle-Zélande", equipeB: "Égypte", groupe: "G", stade: "BC Place", ville: "Vancouver" },
  { id: 41, date: "2026-06-22T19:00", equipeA: "Argentine", equipeB: "Autriche", groupe: "J", stade: "AT&T Stadium", ville: "Dallas/Arlington" },
  { id: 42, date: "2026-06-22T23:00", equipeA: "France", equipeB: "Irak", groupe: "I", stade: "Lincoln Financial Field", ville: "Philadelphia" },
  { id: 43, date: "2026-06-23T02:00", equipeA: "Norvège", equipeB: "Sénégal", groupe: "I", stade: "BMO Field", ville: "Toronto" },
  { id: 44, date: "2026-06-23T05:00", equipeA: "Jordanie", equipeB: "Algérie", groupe: "J", stade: "Levi's Stadium", ville: "San Francisco" },
  { id: 45, date: "2026-06-23T19:00", equipeA: "Portugal", equipeB: "Ouzbékistan", groupe: "K", stade: "NRG Stadium", ville: "Houston" },
  { id: 46, date: "2026-06-23T22:00", equipeA: "Angleterre", equipeB: "Ghana", groupe: "L", stade: "Gillette Stadium", ville: "Boston/Foxborough" },
  { id: 47, date: "2026-06-24T01:00", equipeA: "Panama", equipeB: "Croatie", groupe: "L", stade: "Gillette Stadium", ville: "Boston/Foxborough" },
  { id: 48, date: "2026-06-24T04:00", equipeA: "Colombie", equipeB: "RD Congo", groupe: "K", stade: "Estadio Akron", ville: "Guadalajara" },
  // ── GROUPES J3 ──
  { id: 49, date: "2026-06-24T21:00", equipeA: "Suisse", equipeB: "Canada", groupe: "B", stade: "BC Place", ville: "Vancouver" },
  { id: 50, date: "2026-06-24T21:00", equipeA: "Bosnie-Herzégovine", equipeB: "Qatar", groupe: "B", stade: "Lumen Field", ville: "Seattle" },
  { id: 51, date: "2026-06-25T00:00", equipeA: "Maroc", equipeB: "Haïti", groupe: "C", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 52, date: "2026-06-25T00:00", equipeA: "Écosse", equipeB: "Brésil", groupe: "C", stade: "Hard Rock Stadium", ville: "Miami" },
  { id: 53, date: "2026-06-25T03:00", equipeA: "République tchèque", equipeB: "Mexique", groupe: "A", stade: "Estadio Azteca", ville: "Mexico City" },
  { id: 54, date: "2026-06-25T03:00", equipeA: "Afrique du Sud", equipeB: "Corée du Sud", groupe: "A", stade: "Estadio BBVA", ville: "Monterrey" },
  { id: 55, date: "2026-06-25T22:00", equipeA: "Curaçao", equipeB: "Côte d'Ivoire", groupe: "E", stade: "Lincoln Financial Field", ville: "Philadelphia" },
  { id: 56, date: "2026-06-25T22:00", equipeA: "Équateur", equipeB: "Allemagne", groupe: "E", stade: "MetLife Stadium", ville: "New York/New Jersey" },
  { id: 57, date: "2026-06-26T01:00", equipeA: "Japon", equipeB: "Suède", groupe: "F", stade: "AT&T Stadium", ville: "Dallas/Arlington" },
  { id: 58, date: "2026-06-26T01:00", equipeA: "Tunisie", equipeB: "Pays-Bas", groupe: "F", stade: "Arrowhead Stadium", ville: "Kansas City" },
  { id: 59, date: "2026-06-26T04:00", equipeA: "Turquie", equipeB: "USA", groupe: "D", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 60, date: "2026-06-26T04:00", equipeA: "Paraguay", equipeB: "Australie", groupe: "D", stade: "Levi's Stadium", ville: "San Francisco" },
  { id: 61, date: "2026-06-26T21:00", equipeA: "Norvège", equipeB: "France", groupe: "I", stade: "Gillette Stadium", ville: "Boston/Foxborough" },
  { id: 62, date: "2026-06-26T21:00", equipeA: "Sénégal", equipeB: "Irak", groupe: "I", stade: "BMO Field", ville: "Toronto" },
  { id: 63, date: "2026-06-27T02:00", equipeA: "Cap-Vert", equipeB: "Arabie Saoudite", groupe: "H", stade: "NRG Stadium", ville: "Houston" },
  { id: 64, date: "2026-06-27T02:00", equipeA: "Uruguay", equipeB: "Espagne", groupe: "H", stade: "Estadio Akron", ville: "Guadalajara" },
  { id: 65, date: "2026-06-27T05:00", equipeA: "Nouvelle-Zélande", equipeB: "Belgique", groupe: "G", stade: "BC Place", ville: "Vancouver" },
  { id: 66, date: "2026-06-27T05:00", equipeA: "Égypte", equipeB: "Iran", groupe: "G", stade: "Lumen Field", ville: "Seattle" },
  { id: 67, date: "2026-06-27T23:00", equipeA: "Panama", equipeB: "Angleterre", groupe: "L", stade: "MetLife Stadium", ville: "New York/New Jersey" },
  { id: 68, date: "2026-06-27T23:00", equipeA: "Croatie", equipeB: "Ghana", groupe: "L", stade: "Lincoln Financial Field", ville: "Philadelphia" },
  { id: 69, date: "2026-06-28T01:30", equipeA: "Colombie", equipeB: "Portugal", groupe: "K", stade: "Hard Rock Stadium", ville: "Miami" },
  { id: 70, date: "2026-06-28T01:30", equipeA: "RD Congo", equipeB: "Ouzbékistan", groupe: "K", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 71, date: "2026-06-28T04:00", equipeA: "Algérie", equipeB: "Autriche", groupe: "J", stade: "Arrowhead Stadium", ville: "Kansas City" },
  { id: 72, date: "2026-06-28T04:00", equipeA: "Jordanie", equipeB: "Argentine", groupe: "J", stade: "AT&T Stadium", ville: "Dallas/Arlington" },
  // ── 1/32 ──
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
  // ── 1/16 ──
  { id: 89, date: "2026-07-04T23:00", equipeA: "Vainqueur M73", equipeB: "Vainqueur M74", groupe: "1/16", stade: "Lincoln Financial Field", ville: "Philadelphia" },
  { id: 90, date: "2026-07-04T19:00", equipeA: "Vainqueur M75", equipeB: "Vainqueur M76", groupe: "1/16", stade: "NRG Stadium", ville: "Houston" },
  { id: 91, date: "2026-07-05T22:00", equipeA: "Vainqueur M77", equipeB: "Vainqueur M78", groupe: "1/16", stade: "MetLife Stadium", ville: "New York" },
  { id: 92, date: "2026-07-06T02:00", equipeA: "Vainqueur M79", equipeB: "Vainqueur M80", groupe: "1/16", stade: "Estadio Azteca", ville: "Mexico City" },
  { id: 93, date: "2026-07-06T21:00", equipeA: "Vainqueur M83", equipeB: "Vainqueur M84", groupe: "1/16", stade: "AT&T Stadium", ville: "Dallas" },
  { id: 94, date: "2026-07-07T02:00", equipeA: "Vainqueur M81", equipeB: "Vainqueur M82", groupe: "1/16", stade: "Lumen Field", ville: "Seattle" },
  { id: 95, date: "2026-07-07T18:00", equipeA: "Vainqueur M86", equipeB: "Vainqueur M88", groupe: "1/16", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  { id: 96, date: "2026-07-07T22:00", equipeA: "Vainqueur M85", equipeB: "Vainqueur M87", groupe: "1/16", stade: "BC Place", ville: "Vancouver" },
  // ── QF ──
  { id: 97, date: "2026-07-09T22:00", equipeA: "Vainqueur M89", equipeB: "Vainqueur M90", groupe: "QF", stade: "Gillette Stadium", ville: "Boston" },
  { id: 98, date: "2026-07-10T21:00", equipeA: "Vainqueur M93", equipeB: "Vainqueur M94", groupe: "QF", stade: "SoFi Stadium", ville: "Los Angeles" },
  { id: 99, date: "2026-07-11T23:00", equipeA: "Vainqueur M95", equipeB: "Vainqueur M96", groupe: "QF", stade: "Hard Rock Stadium", ville: "Miami" },
  { id: 100, date: "2026-07-12T03:00", equipeA: "Vainqueur M91", equipeB: "Vainqueur M92", groupe: "QF", stade: "Arrowhead Stadium", ville: "Kansas City" },
  // ── SF ──
  { id: 101, date: "2026-07-14T21:00", equipeA: "Vainqueur M97", equipeB: "Vainqueur M98", groupe: "SF", stade: "AT&T Stadium", ville: "Dallas" },
  { id: 102, date: "2026-07-15T21:00", equipeA: "Vainqueur M99", equipeB: "Vainqueur M100", groupe: "SF", stade: "Mercedes-Benz Stadium", ville: "Atlanta" },
  // ── 3e place ──
  { id: 103, date: "2026-07-18T23:00", equipeA: "Perdant M101", equipeB: "Perdant M102", groupe: "3e", stade: "Hard Rock Stadium", ville: "Miami" },
  // ── FINALE ──
  { id: 104, date: "2026-07-19T21:00", equipeA: "Vainqueur M101", equipeB: "Vainqueur M102", groupe: "FINALE", stade: "MetLife Stadium", ville: "New York/New Jersey" },
];
