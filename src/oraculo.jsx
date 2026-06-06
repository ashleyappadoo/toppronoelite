/* global React */
// El Oraculo — boule de cristal, visage troll arrogant, violet électrique.
// Props: size (px), glow (bool)
function Oraculo({ size = 64, glow = true }) {
  const id = React.useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
         style={{ filter: glow ? "drop-shadow(0 0 14px rgba(139,60,224,0.6))" : "none" }}>
      <defs>
        <radialGradient id={`orb${id}`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#E9CCFF" />
          <stop offset="38%" stopColor="#B57BFF" />
          <stop offset="100%" stopColor="#5B1F9E" />
        </radialGradient>
        <linearGradient id={`base${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A2358" />
          <stop offset="100%" stopColor="#1C1029" />
        </linearGradient>
      </defs>

      {/* base / stand */}
      <path d="M28 80 q22 12 44 0 l5 9 q-27 9 -54 0 z" fill={`url(#base${id})`} stroke="#7B2FBE" strokeWidth="1.5"/>
      <rect x="40" y="74" width="20" height="9" rx="2" fill="#2A1840" stroke="#7B2FBE" strokeWidth="1.5"/>

      {/* orb */}
      <circle cx="50" cy="44" r="34" fill={`url(#orb${id})`} />
      <circle cx="50" cy="44" r="34" fill="none" stroke="#C79BFF" strokeWidth="1.2" opacity="0.6"/>

      {/* glossy highlight */}
      <ellipse cx="38" cy="31" rx="13" ry="9" fill="#fff" opacity="0.4" transform="rotate(-25 38 31)"/>

      {/* TROLL FACE — arrogant, condescending */}
      {/* eyebrows raised/smug */}
      <path d="M34 36 q6 -5 13 -1" stroke="#2A0F46" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M55 35 q6 -3 11 2" stroke="#2A0F46" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* half-lidded condescending eyes */}
      <path d="M35 44 q6 5 13 0" stroke="#2A0F46" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <circle cx="41.5" cy="45.5" r="2.4" fill="#2A0F46"/>
      <path d="M55 44 q6 4 12 0" stroke="#2A0F46" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <circle cx="61" cy="45.5" r="2.4" fill="#2A0F46"/>
      {/* smug smirk */}
      <path d="M40 58 q11 7 22 -2" stroke="#2A0F46" strokeWidth="3.4" strokeLinecap="round" fill="none"/>
      <path d="M62 56 l3 -2" stroke="#2A0F46" strokeWidth="3" strokeLinecap="round"/>

      {/* sparkles of arrogance */}
      <g fill="#F5C518">
        <path d="M78 24 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z"/>
        <circle cx="22" cy="58" r="1.8"/>
      </g>
    </svg>
  );
}
window.Oraculo = Oraculo;
