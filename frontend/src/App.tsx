import { useState, useEffect, useCallback } from 'react';
const API_URL = 'http://127.0.0.1:8000/api/baby-shower';

const EVENT = {
  date:      'Domingo, 17 de Mayo de 2026',
  time:      '4:00 PM',
  place:     'Salón de Eventos "Los Leoncitos"',
  address:   'Puebla, Puebla',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.4215266854587!2d-98.2045!3d19.0433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAyJzM1LjkiTiA5OMKwMTInMTYuMiJX!5e0!3m2!1ses!2smx!4v1620000000000!5m2!1ses!2smx',
  mapsLink:  'https://maps.google.com/?q=19.0433,-98.2045',
};

const G     = '#b5891e';
// @ts-ignore
const GOLD2 = '#d4a832';
const DARK  = '#2e2416';
const BLUE  = '#3a7abf';
const PINK  = '#c44f78';

declare global {
  interface Window {
    storage?: {
      get(key: string, shared?: boolean): Promise<{ value: string } | null>;
      set(key: string, value: string, shared?: boolean): Promise<unknown>;
    };
  }
}

// @ts-ignore
async function storeGet(key: string, shared = false): Promise<string | null> {
  if (typeof window !== 'undefined' && window.storage) {
    try { const r = await window.storage.get(key, shared); return r ? r.value : null; } catch {}
  }
  try { return localStorage.getItem(shared ? `shared_${key}` : `local_${key}`); } catch { return null; }
}

// @ts-ignore
async function storeSet(key: string, value: string, shared = false): Promise<void> {
  if (typeof window !== 'undefined' && window.storage) {
    try { await window.storage.set(key, value, shared); return; } catch {}
  }
  try { localStorage.setItem(shared ? `shared_${key}` : `local_${key}`, value); } catch {}
}

/* ─── BUNNY SVG ─── */
function Bunny({ size = 60, color = G, opacity = 0.45, flip = false }: {
  size?: number; color?: string; opacity?: number; flip?: boolean;
}) {
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 60 81"
      style={{ opacity, display:'block', transform: flip ? 'scaleX(-1)' : undefined }}>
      <ellipse cx="20" cy="18" rx="7"   ry="16" fill={color} opacity=".9"/>
      <ellipse cx="20" cy="18" rx="3.5" ry="12" fill="rgba(255,230,210,.55)"/>
      <ellipse cx="40" cy="16" rx="7"   ry="16" fill={color} opacity=".9"/>
      <ellipse cx="40" cy="16" rx="3.5" ry="12" fill="rgba(255,230,210,.55)"/>
      <ellipse cx="30" cy="36" rx="16" ry="15" fill={color}/>
      <ellipse cx="24" cy="33" rx="2.8" ry="3"  fill={DARK} opacity=".65"/>
      <ellipse cx="36" cy="33" rx="2.8" ry="3"  fill={DARK} opacity=".65"/>
      <circle  cx="25" cy="32" r="1"            fill="white" opacity=".7"/>
      <circle  cx="37" cy="32" r="1"            fill="white" opacity=".7"/>
      <ellipse cx="30" cy="39" rx="2"  ry="1.4" fill={DARK} opacity=".4"/>
      <ellipse cx="21" cy="40" rx="4"  ry="2.5" fill="rgba(255,180,140,.28)"/>
      <ellipse cx="39" cy="40" rx="4"  ry="2.5" fill="rgba(255,180,140,.28)"/>
      <ellipse cx="30" cy="62" rx="18" ry="16"  fill={color} opacity=".95"/>
      <circle  cx="48" cy="70" r="5.5"           fill="rgba(255,252,245,.82)"/>
      <ellipse cx="18" cy="75" rx="6"  ry="4"   fill={color} opacity=".85"/>
      <ellipse cx="42" cy="75" rx="6"  ry="4"   fill={color} opacity=".85"/>
    </svg>
  );
}

/* ─── BUNNY EN EL SELLO — versión pequeña dentro del círculo dorado ─── */
function BunnySeal() {
  /* Bunny centrado en viewBox 60×81, escalado para caber en el sello.
     Lo pintamos en crema/blanco para que contraste con el oro. */
  const C = 'rgba(255,252,230,.92)';
  const D = 'rgba(80,50,10,.35)';
  return (
    <g transform="translate(54,54) scale(0.72) translate(-30,-50)">
      {/* orejas */}
      <ellipse cx="20" cy="18" rx="6.5" ry="15" fill={C} opacity=".95"/>
      <ellipse cx="20" cy="18" rx="3"   ry="10" fill="rgba(200,140,100,.35)"/>
      <ellipse cx="40" cy="16" rx="6.5" ry="15" fill={C} opacity=".95"/>
      <ellipse cx="40" cy="16" rx="3"   ry="10" fill="rgba(200,140,100,.35)"/>
      {/* cabeza */}
      <ellipse cx="30" cy="36" rx="15" ry="14" fill={C}/>
      {/* ojos */}
      <ellipse cx="24" cy="33" rx="2.5" ry="2.8" fill={D}/>
      <ellipse cx="36" cy="33" rx="2.5" ry="2.8" fill={D}/>
      <circle  cx="25" cy="32" r=".9"            fill="rgba(255,255,255,.7)"/>
      <circle  cx="37" cy="32" r=".9"            fill="rgba(255,255,255,.7)"/>
      {/* nariz */}
      <ellipse cx="30" cy="39" rx="1.8" ry="1.2" fill={D}/>
      {/* mejillas */}
      <ellipse cx="21" cy="40" rx="3.5" ry="2"  fill="rgba(255,180,140,.22)"/>
      <ellipse cx="39" cy="40" rx="3.5" ry="2"  fill="rgba(255,180,140,.22)"/>
      {/* cuerpo */}
      <ellipse cx="30" cy="60" rx="16" ry="14"  fill={C} opacity=".9"/>
      {/* cola */}
      <circle  cx="46" cy="68" r="5"             fill="rgba(255,255,255,.7)"/>
      {/* patitas */}
      <ellipse cx="19" cy="72" rx="5.5" ry="3.5" fill={C} opacity=".85"/>
      <ellipse cx="41" cy="72" rx="5.5" ry="3.5" fill={C} opacity=".85"/>
    </g>
  );
}

/* ─── UI HELPERS ─── */
function Divider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'32px 0' }}>
      <div style={{ flex:1, height:'1px', background:`linear-gradient(to right,transparent,${G}55)` }}/>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M12,2 L13.5,10 L22,12 L13.5,14 L12,22 L10.5,14 L2,12 L10.5,10 Z" fill={G} opacity=".7"/>
      </svg>
      <div style={{ flex:1, height:'1px', background:`linear-gradient(to left,transparent,${G}55)` }}/>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:13, letterSpacing:'.28em', color:G, textAlign:'center', textTransform:'uppercase', margin:'0 0 22px', fontWeight:600 }}>
      {children}
    </p>
  );
}

/* ─── MARBLE SVG ─── */
function MarbleSVG({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position:'absolute', inset:0, borderRadius:16 }}>
      <defs>
        <filter id="mf">
          <feTurbulence type="fractalNoise" baseFrequency="0.016 0.038" numOctaves="6" seed="7" result="n"/>
          <feColorMatrix type="matrix" values="0.09 0 0 0 0.85 0.09 0 0 0 0.83 0.09 0 0 0 0.80 0 0 0 1.7 -.25" in="n"/>
        </filter>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#f9f6ef"/>
          <stop offset="100%" stopColor="#f2ede3"/>
        </linearGradient>
      </defs>
      <rect width={w} height={h} rx="16" fill="url(#mg)"/>
      <rect width={w} height={h} rx="16" filter="url(#mf)" opacity=".72"/>
      <path d={`M${w*.67},0 C${w*.7},${h*.09} ${w*.74},${h*.2} ${w*.76},${h*.36} S${w*.78},${h*.57} ${w*.72},${h*.75} S${w*.68},${h*.9} ${w*.65},${h}`} stroke="rgba(200,160,35,.48)" strokeWidth="2" fill="none"/>
      <path d={`M${w*.73},0 C${w*.77},${h*.1} ${w*.82},${h*.23} ${w*.85},${h*.42} S${w*.87},${h*.62} ${w*.82},${h*.8}`} stroke="rgba(210,170,42,.44)" strokeWidth="2.5" fill="none"/>
      <path d={`M${w*.8},0 C${w*.83},${h*.08} ${w*.87},${h*.18} ${w*.9},${h*.32} S${w*.92},${h*.5} ${w*.88},${h*.65}`} stroke="rgba(218,178,48,.52)" strokeWidth="1.6" fill="none"/>
      <ellipse cx={w*.82} cy={h*.16} rx={w*.09} ry={h*.09} fill="rgba(218,178,48,.07)"/>
      <path d={`M0,${h*.3} C${w*.14},${h*.28} ${w*.3},${h*.33} ${w*.5},${h*.3} S${w*.72},${h*.26} ${w*.88},${h*.3}`} stroke="rgba(178,172,162,.22)" strokeWidth=".9" fill="none"/>
      <path d={`M0,${h*.62} C${w*.16},${h*.6} ${w*.35},${h*.65} ${w*.6},${h*.62} S${w*.8},${h*.58} ${w},${h*.62}`} stroke="rgba(178,172,162,.18)" strokeWidth=".75" fill="none"/>
      <path d={`M${w*.15},0 C${w*.17},${h*.15} ${w*.2},${h*.32} ${w*.22},${h*.52} S${w*.2},${h*.72} ${w*.18},${h}`} stroke="rgba(178,172,162,.14)" strokeWidth=".7" fill="none"/>
    </svg>
  );
}

/* ─── WAX SEAL CON CONEJO ─── */
function WaxSeal() {
  const w = 108, sq = { x:12, y:12, s:84, r:5 };
  const pos = [0.24, 0.38, 0.52, 0.66, 0.80];
  return (
    <svg width={w} height={w} viewBox={`0 0 ${w} ${w}`}>
      <defs>
        <radialGradient id="sg" cx="35%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#fce98a"/>
          <stop offset="30%"  stopColor="#e8c030"/>
          <stop offset="65%"  stopColor="#b88018"/>
          <stop offset="100%" stopColor="#7a520c"/>
        </radialGradient>
      </defs>
      <g style={{ filter:'drop-shadow(0 8px 20px rgba(120,75,5,.55))' }}>
        <rect x={sq.x} y={sq.y} width={sq.s} height={sq.s} rx={sq.r} fill="url(#sg)"/>
        {pos.map((p,i) => (
          <g key={i}>
            <circle cx={w*p}       cy={sq.y}       r={7.2} fill="url(#sg)"/>
            <circle cx={w*p}       cy={sq.y+sq.s}  r={7.2} fill="url(#sg)"/>
            <circle cx={sq.x}      cy={w*p}        r={7.2} fill="url(#sg)"/>
            <circle cx={sq.x+sq.s} cy={w*p}        r={7.2} fill="url(#sg)"/>
          </g>
        ))}
      </g>
      {/* Brillo superior */}
      <rect x={sq.x+5} y={sq.y+5} width={sq.s-10} height={sq.s*.36} rx={sq.r-2} fill="rgba(255,250,210,.18)"/>
      {/* Conejo en lugar de la "M" */}
      <BunnySeal/>
    </svg>
  );
}

function Diamond({ size=18, op=0.8 }: { size?:number; op?:number }) {
  return (
    <svg width={size*1.4} height={size*2} viewBox="0 0 14 20" style={{ opacity:op, display:'block' }}>
      <polygon points="7,0 14,7 7,20 0,7" fill="#e8c840"/>
      <polygon points="7,0 14,7 7,20" fill="rgba(0,0,0,.12)"/>
      <polygon points="7,0 7,20 0,7"  fill="rgba(255,255,255,.14)"/>
      <line x1="0" y1="7" x2="14" y2="7" stroke="rgba(255,248,180,.45)" strokeWidth=".5"/>
    </svg>
  );
}

function Star4({ size=20, op=0.85 }: { size?:number; op?:number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ opacity:op, display:'block' }}>
      <path d="M10,1 L11.9,8.1 L19,10 L11.9,11.9 L10,19 L8.1,11.9 L1,10 L8.1,8.1 Z" fill="#e8c840"/>
    </svg>
  );
}

/* ─── EVENT DETAILS ─── */
function EventDetails() {
  const items = [
    { icon:<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="14" rx="2" stroke={G} strokeWidth="1.5"/><path d="M6 2v3M14 2v3M2 9h16" stroke={G} strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="14" r="1.5" fill={G}/></svg>, label:'Fecha', val:EVENT.date },
    { icon:<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={G} strokeWidth="1.5"/><path d="M10 6v4l3 2" stroke={G} strokeWidth="1.5" strokeLinecap="round"/></svg>, label:'Hora', val:EVENT.time },
    { icon:<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z" stroke={G} strokeWidth="1.5"/><circle cx="10" cy="7" r="2" fill={G} opacity=".6"/></svg>, label:'Lugar', val:EVENT.place },
    { icon:<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="6" width="14" height="11" rx="1.5" stroke={G} strokeWidth="1.5"/><path d="M3 9l7 5 7-5" stroke={G} strokeWidth="1.5" strokeLinecap="round"/><path d="M7 6V4a3 3 0 016 0v2" stroke={G} strokeWidth="1.5"/></svg>, label:'Dirección', val:EVENT.address },
  ];
  return (
    <div>
      <SectionTitle>Detalles del Evento</SectionTitle>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
        {items.map(({ icon, label, val }) => (
          <div key={label} style={{ padding:'14px 12px', borderRadius:12, background:'rgba(255,255,255,0.55)', border:`1px solid ${G}28`, backdropFilter:'blur(4px)', display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ opacity:.9 }}>{icon}</div>
            <div>
              <p style={{ fontSize:9.5, color:`${DARK}60`, letterSpacing:'.18em', textTransform:'uppercase', margin:'0 0 3px', fontFamily:'Georgia,serif' }}>{label}</p>
              <p style={{ fontSize:14, color:DARK, fontFamily:"'Cormorant Garamond','Georgia',serif", margin:0, lineHeight:1.4, fontWeight:500 }}>{val}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderRadius:14, overflow:'hidden', border:`1px solid ${G}28`, boxShadow:'0 4px 20px rgba(0,0,0,.08)', height:220, position:'relative', marginBottom:16 }}>
        <iframe
          src={EVENT.mapsEmbed}
          style={{ position:'absolute', top:-65, left:0, width:'100%', height:'285px', border:'none' }}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación del evento"
        />
      </div>
      <div style={{ textAlign:'center' }}>
        <a href={EVENT.mapsLink} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 32px', borderRadius:50, background:`linear-gradient(135deg,${GOLD2},${G},#8a6010)`, color:'white', textDecoration:'none', fontSize:13, fontWeight:600, letterSpacing:'.1em', fontFamily:"'Cormorant Garamond','Georgia',serif", boxShadow:`0 6px 24px ${G}44, inset 0 1px 0 rgba(255,255,255,.2)` }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z" fill="white" opacity=".9"/><circle cx="10" cy="7" r="2" fill="rgba(0,0,0,.3)"/></svg>
          Abrir en Google Maps
        </a>
      </div>
    </div>
  );
}

/* ─── TEAM VOTING ─── */
function TeamVoting({ onVoteChange }: { onVoteChange: (v: string | null) => void }) {
  const [votes, setVotes] = useState({ nino:0, nina:0 });
  const [myVote, setMyVote] = useState<string|null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL);
        if (res.ok) { const data = await res.json(); if (data.votes) setVotes(data.votes); }
      } catch {}
      try { const m = localStorage.getItem('local_bbs_my_vote'); if (m) { setMyVote(m); onVoteChange(m); } } catch {}
      setReady(true);
    })();
  }, []);

  const castVote = async (team: 'nino' | 'nina') => {
    if (myVote || !ready) return;
    setMyVote(team); onVoteChange(team);
    setVotes(v => ({ ...v, [team]: v[team] + 1 }));
    try { localStorage.setItem('local_bbs_my_vote', team); } catch {}
    try {
      const res = await fetch(`${API_URL}/vote`, { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify({ team }) });
      if (res.ok) { const d = await res.json(); setVotes(d); }
    } catch {}
  };

  const total = votes.nino + votes.nina;
  const np = total ? Math.round(votes.nino / total * 100) : 50;
  const fp = 100 - np;

  const Heart = ({ color }: { color: string }) => (
    <svg width="30" height="28" viewBox="0 0 30 28">
      <path d="M15,26 C15,26 2,17 2,9 C2,5.13 5.13,2 9,2 C11.4,2 13.53,3.25 15,5.1 C16.47,3.25 18.6,2 21,2 C24.87,2 28,5.13 28,9 C28,17 15,26 15,26Z" fill={color} opacity=".85"/>
      <path d="M15,26 C15,26 2,17 2,9" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" fill="none"/>
    </svg>
  );

  const VoteBtn = ({ team, color, lightColor, label }: { team:'nino'|'nina'; color:string; lightColor:string; label:string }) => {
    const isChosen = myVote === team, isOther = myVote && myVote !== team;
    return (
      <button onClick={()=>castVote(team)} disabled={!!myVote} style={{ flex:1, padding:'20px 10px', borderRadius:14, border: isChosen?`1.5px solid ${color}`:`1.5px solid ${color}44`, cursor:myVote?'default':'pointer', background: isChosen?`linear-gradient(145deg,${lightColor},${color})`:isOther?'rgba(240,238,234,.6)':`linear-gradient(145deg,${lightColor}44,${color}22)`, color:isOther?'#b0a898':color, fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:16, fontWeight:600, boxShadow:isChosen?`0 8px 28px ${color}40`:'none', transform:isChosen?'scale(1.03)':'scale(1)', transition:'all .35s cubic-bezier(.34,1.56,.64,1)', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <div style={{ lineHeight:1, filter:isOther?'saturate(0) opacity(.4)':'none', transition:'filter .3s' }}><Heart color={color}/></div>
        <span style={{ letterSpacing:'.12em', fontSize:13, textTransform:'uppercase' }}>{label}</span>
        {isChosen && <span style={{ fontSize:11, letterSpacing:'.08em', opacity:.8, fontStyle:'italic', fontWeight:400 }}>Tu voto ✓</span>}
      </button>
    );
  };

  return (
    <div>
      <SectionTitle>Tu Predicción</SectionTitle>
      <p style={{ textAlign:'center', color:`${DARK}77`, fontSize:14, margin:'0 0 22px', fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:'italic' }}>¿Crees que será niño o niña?</p>
      <div style={{ display:'flex', gap:14, marginBottom: myVote ? 22 : 10 }}>
        <VoteBtn team="nino" color={BLUE} lightColor="#a8c8ee" label="Niño"/>
        <VoteBtn team="nina" color={PINK} lightColor="#f0b0c8" label="Niña"/>
      </div>
      {myVote && total > 0 && (
        <div style={{ padding:20, background:'rgba(255,255,255,.5)', borderRadius:14, border:`1px solid ${G}28`, backdropFilter:'blur(4px)' }}>
          {([['nino',BLUE,np,votes.nino,'Niño'],['nina',PINK,fp,votes.nina,'Niña']] as const).map(([t,c,pct,cnt,lbl])=>(
            <div key={t} style={{ marginBottom:t==='nino'?14:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6, fontFamily:"'Cormorant Garamond','Georgia',serif", fontWeight:600 }}>
                <span style={{ color:c }}>{lbl} — {cnt} {cnt===1?'voto':'votos'}</span>
                <span style={{ color:c }}>{pct}%</span>
              </div>
              <div style={{ height:8, borderRadius:4, background:'rgba(0,0,0,.07)', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${pct}%`, borderRadius:4, background:t==='nino'?`linear-gradient(to right,#8ab8e8,${BLUE})`:`linear-gradient(to right,#e8a0b8,${PINK})`, transition:'width 1.2s cubic-bezier(.34,1.56,.64,1)' }}/>
              </div>
            </div>
          ))}
          <p style={{ textAlign:'center', fontSize:12, color:`${DARK}55`, margin:'14px 0 0', fontFamily:'Georgia,serif', fontStyle:'italic' }}>{total} {total===1?'persona ha votado':'personas han votado'}</p>
        </div>
      )}
      {!myVote && ready && (
        <p style={{ textAlign:'center', fontSize:13, color:`${DARK}55`, margin:'6px 0', fontFamily:'Georgia,serif', fontStyle:'italic' }}>{total===0?'Sé la primera persona en votar':`${total} ${total===1?'persona ya votó':'personas ya votaron'}`}</p>
      )}
    </div>
  );
}

/* ─── SHIRT ─── */
function Shirt({ color, active }: { color: string; active: boolean }) {
  return (
    <svg width="64" height="58" viewBox="0 0 64 58" fill="none">
      <path d="M22 5L8 15l8 5v30h32V20l8-5L44 5c0 0-2.5 7-12 7S22 5 22 5z" fill={color} opacity={active?'.9':'.2'}/>
      <path d="M22 5L8 15l8 5" stroke="rgba(255,255,255,.35)" strokeWidth="1.2" fill="none"/>
      <path d="M42 5l14 10-8 5" stroke="rgba(255,255,255,.35)" strokeWidth="1.2" fill="none"/>
      {active && <>
        <path d="M22 5L8 15l8 5v30h32V20l8-5L44 5" stroke="rgba(255,255,255,.18)" strokeWidth=".8" fill="none"/>
        <path d="M26 14 C26 14 28 17 32 17 C36 17 38 14 38 14" stroke="rgba(255,255,255,.25)" strokeWidth=".8" fill="none"/>
      </>}
    </svg>
  );
}

/* ─── DRESS CODE ─── */
function DressCode({ myVote }: { myVote: string | null }) {
  const isNino = myVote==='nino', isNina = myVote==='nina', hasVoted = !!myVote;
  const activeColor = isNino?BLUE:isNina?PINK:G;
  const activeBg    = isNino?'rgba(58,122,191,.07)':isNina?'rgba(196,79,120,.07)':`${G}08`;
  const activeBorder= isNino?'rgba(58,122,191,.25)':isNina?'rgba(196,79,120,.25)':`${G}22`;
  return (
    <div>
      <SectionTitle>Dress Code</SectionTitle>
      {!hasVoted ? (
        <div>
          <p style={{ textAlign:'center', color:`${DARK}77`, fontSize:14, margin:'0 0 22px', fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:'italic' }}>Vota primero para descubrir tu color</p>
          <div style={{ display:'flex', gap:14 }}>
            {[{color:BLUE,label:'Team Niño',hint:'Azul'},{color:PINK,label:'Team Niña',hint:'Rosa'}].map(({color,label,hint})=>(
              <div key={label} style={{ flex:1, padding:'22px 12px', borderRadius:14, border:`1.5px dashed ${color}35`, background:`${color}05`, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                <Shirt color={color} active={false}/>
                <span style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:14, color:`${color}88`, letterSpacing:'.14em', textTransform:'uppercase', fontWeight:600 }}>{hint}</span>
                <span style={{ fontSize:11, color:`${DARK}44`, fontFamily:'Georgia,serif', fontStyle:'italic' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ padding:'28px 20px', borderRadius:16, background:activeBg, border:`1.5px solid ${activeBorder}`, textAlign:'center', marginBottom:16, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:'-30%', width:'60%', height:'100%', background:'linear-gradient(105deg,transparent,rgba(255,255,255,.2),transparent)', pointerEvents:'none' }}/>
            <div style={{ marginBottom:14, display:'flex', justifyContent:'center' }}><Shirt color={activeColor} active={true}/></div>
            <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:11, letterSpacing:'.28em', color:activeColor, textTransform:'uppercase', margin:'0 0 8px', fontWeight:600 }}>Tu color es</p>
            <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:32, color:activeColor, fontStyle:'italic', margin:'0 0 10px', fontWeight:600, lineHeight:1.1 }}>{isNino?'Azul':'Rosa'}</p>
            <p style={{ fontSize:13.5, color:`${DARK}88`, margin:0, fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:'italic', lineHeight:1.6 }}>
              {isNino?'Ven vestido de azul — Team Niño 💙':'Ven vestido de rosa — Team Niña 💖'}
            </p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {([['nino',BLUE,'Azul','Team Niño'],['nina',PINK,'Rosa','Team Niña']] as const).map(([team,color,hint,label])=>{
              const active = myVote===team;
              return (
                <div key={team} style={{ flex:1, padding:'14px 10px', borderRadius:12, border:active?`1.5px solid ${color}45`:`1px solid ${color}18`, background:active?`${color}09`:'rgba(255,255,255,.35)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, opacity:active?1:.4 }}>
                  <div style={{ transform:'scale(.78)', transformOrigin:'top center', lineHeight:0 }}><Shirt color={color} active={active}/></div>
                  <p style={{ margin:0, fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:14, color, fontWeight:600 }}>{hint}</p>
                  <p style={{ margin:0, fontSize:10.5, color:`${DARK}66`, fontFamily:'Georgia,serif', fontStyle:'italic' }}>{label}</p>
                  {active && <span style={{ fontSize:10, color, letterSpacing:'.1em', fontFamily:'Georgia,serif' }}>← tu color</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── WISH MAILBOX ─── */
function WishMailbox() {
  const [messages, setMessages] = useState<{name:string;message:string;created_at:string}[]>([]);
  const [form, setForm]         = useState({ name:'', msg:'', email:'' });
  const [errors, setErrors]     = useState({ name:false, msg:false });
  const [submitted, setSubmitted]   = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiText, setAiText]     = useState('');
  const [copied, setCopied]     = useState(false);

  useEffect(()=>{
    (async()=>{
      try {
        const res = await fetch(API_URL);
        if (res.ok) { const data = await res.json(); if (data.messages) setMessages(data.messages); }
      } catch {}
    })();
  },[]);

  const validate = () => { const e={name:!form.name.trim(),msg:!form.msg.trim()}; setErrors(e); return !e.name&&!e.msg; };

  const submit = async () => {
    if (!validate()) return;
    const tempEntry = { name:form.name.trim(), message:form.msg.trim(), created_at:new Date().toISOString() };
    setMessages([tempEntry,...messages]);
    setSubmitted(true);
    try {
      const res = await fetch(`${API_URL}/message`, { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify({name:tempEntry.name,msg:tempEntry.message}) });
      if (res.ok) { const d = await res.json(); setMessages(d); }
    } catch {}
    if (form.email.trim()) {
      setGenerating(true);
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', { method:'POST', headers:{'Content-Type':'application/json','x-api-key':'TU_API_KEY_AQUI','anthropic-version':'2023-06-01','anthropic-dangerously-allow-browser':'true'}, body:JSON.stringify({ model:'claude-3-sonnet-20240229', max_tokens:600, messages:[{role:'user',content:`Escribe una invitación de revelación de Género de bebé en español mexicano, cálida y elegante.\nDirigida a: ${form.name.trim()}\nOrganiza: Fátima y Daniel\nFecha: Domingo, 17 de Mayo de 2026 — Hora: 4:00 PM\nLugar: Salón de Eventos "La Nube", Puebla\nMáximo 170 palabras. Sin emojis. Saludo personal, anuncio, detalles y cierre emotivo firmado por Fátima y Daniel.`}]}) });
        const d = await res.json();
        setAiText(d.content?.map((c:{text?:string})=>c.text||'').join('')||'');
      } catch { setAiText('No se pudo generar la invitación en este momento.'); }
      setGenerating(false);
    }
    setForm({name:'',msg:'',email:''});
  };

  const inp: React.CSSProperties = { width:'100%', padding:'11px 14px', border:`1.5px solid ${G}38`, borderRadius:10, background:'rgba(255,255,255,.65)', backdropFilter:'blur(4px)', fontSize:14, color:DARK, outline:'none', fontFamily:"'Cormorant Garamond','Georgia',serif", boxSizing:'border-box', transition:'border-color .2s' };
  const inpErr: React.CSSProperties = { ...inp, borderColor:'#c0392b' };
  const lbl: React.CSSProperties = { fontSize:10, color:G, letterSpacing:'.2em', textTransform:'uppercase', display:'block', marginBottom:7, fontFamily:'Georgia,serif', fontWeight:600 };

  return (
    <div>
      <SectionTitle>Buzón de Buenos Deseos</SectionTitle>
      <p style={{ textAlign:'center', color:`${DARK}77`, fontSize:14, margin:'0 0 22px', fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:'italic' }}>Déjale un mensaje a Fátima y Daniel</p>
      {!submitted ? (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={lbl}>Nombre completo *</label>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Tu nombre completo" style={errors.name?inpErr:inp}/>
            {errors.name && <p style={{ fontSize:11, color:'#c0392b', margin:'4px 0 0', fontFamily:'Georgia,serif' }}>Campo obligatorio</p>}
          </div>
          <div>
            <label style={lbl}>Tu mensaje *</label>
            <textarea value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))} placeholder="Escribe tus buenos deseos para Fátima y Daniel…" rows={3} style={{...(errors.msg?inpErr:inp),resize:'vertical',lineHeight:1.65}}/>
            {errors.msg && <p style={{ fontSize:11, color:'#c0392b', margin:'4px 0 0', fontFamily:'Georgia,serif' }}>Campo obligatorio</p>}
          </div>
          {/*<div>
            <label style={lbl}>Correo electrónico <span style={{ color:`${DARK}55`, fontSize:9, letterSpacing:0, textTransform:'none', fontWeight:400 }}>(opcional)</span></label>
            <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="tu@correo.com" style={inp}/>
            <p style={{ fontSize:11.5, color:`${DARK}66`, margin:'6px 0 0', fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:'italic' }}>Recibe una invitación personalizada por correo</p>
          </div>*/}
          <button onClick={submit} style={{ width:'100%', padding:'14px 20px', borderRadius:50, border:'none', background:`linear-gradient(135deg,${GOLD2},${G},#8a6010)`, color:'white', fontSize:14, fontWeight:600, cursor:'pointer', letterSpacing:'.12em', fontFamily:"'Cormorant Garamond','Georgia',serif", boxShadow:`0 6px 24px ${G}44, inset 0 1px 0 rgba(255,255,255,.18)`, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M14.5 8L2 2l3 6-3 6z"/><path d="M5 8h9" stroke="white" strokeWidth="1.2" fill="none"/></svg>
            Enviar mensaje
          </button>
        </div>
      ) : (
        <>
          <div style={{ padding:26, background:'rgba(255,255,255,.55)', borderRadius:14, border:`1px solid ${G}30`, backdropFilter:'blur(4px)', textAlign:'center', marginBottom:18 }}>
            <svg width="44" height="44" viewBox="0 0 44 44" style={{ margin:'0 auto 14px', display:'block' }}>
              <circle cx="22" cy="22" r="21" fill="none" stroke={G} strokeWidth="1.5" opacity=".4"/>
              <path d="M12 22l8 8 12-16" stroke={G} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:20, color:G, fontStyle:'italic', margin:'0 0 8px' }}>¡Gracias por tus buenos deseos!</p>
            <button onClick={()=>setSubmitted(false)} style={{ padding:'9px 24px', borderRadius:50, border:`1.5px solid ${G}`, background:'transparent', color:G, fontSize:12, cursor:'pointer', letterSpacing:'.1em', fontFamily:'Georgia,serif' }}>Agregar otro mensaje</button>
          </div>
          {generating && (
            <div style={{ textAlign:'center', padding:18 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', border:`2.5px solid ${G}33`, borderTopColor:G, display:'inline-block', marginBottom:12, animation:'spin .8s linear infinite' }}/>
              <p style={{ color:G, fontSize:13.5, fontStyle:'italic', margin:0, fontFamily:'Georgia,serif' }}>Preparando tu invitación…</p>
            </div>
          )}
          {aiText && (
            <div style={{ marginTop:18, padding:24, background:'linear-gradient(145deg,#faf7f0,#f5ead8)', borderRadius:14, border:`1px solid ${G}38` }}>
              <p style={{ fontSize:10, color:G, letterSpacing:'.24em', textTransform:'uppercase', margin:'0 0 14px', fontFamily:'Georgia,serif', fontWeight:600 }}>Invitación personalizada</p>
              <p style={{ fontSize:13.5, color:DARK, lineHeight:1.9, margin:'0 0 16px', whiteSpace:'pre-wrap', fontFamily:"'Cormorant Garamond','Georgia',serif" }}>{aiText}</p>
              <button onClick={()=>{navigator.clipboard?.writeText(aiText).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2200);});}} style={{ padding:'9px 22px', borderRadius:50, border:`1.5px solid ${G}`, background:copied?G:'transparent', color:copied?'white':G, fontSize:12, cursor:'pointer', transition:'all .25s', fontFamily:'Georgia,serif', letterSpacing:'.08em' }}>
                {copied?'Copiado ✓':'Copiar texto'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── COUNTDOWN ─── */
function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const target = new Date('2026-05-17T16:00:00').getTime();
    const tick = () => {
      const dist = target - Date.now();
      if (dist < 0) return;
      setTimeLeft({ d:Math.floor(dist/86400000), h:Math.floor(dist%86400000/3600000), m:Math.floor(dist%3600000/60000), s:Math.floor(dist%60000/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div>
      <SectionTitle>Faltan</SectionTitle>
      <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
        {[{label:'Días',val:timeLeft.d},{label:'Hrs',val:timeLeft.h},{label:'Min',val:timeLeft.m},{label:'Seg',val:timeLeft.s}].map(({label,val})=>(
          <div key={label} style={{ flex:1, padding:'16px 0', borderRadius:14, background:'rgba(255,255,255,0.55)', border:`1px solid ${G}30`, backdropFilter:'blur(4px)', display:'flex', flexDirection:'column', alignItems:'center', boxShadow:'0 4px 15px rgba(0,0,0,.03)' }}>
            <span style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:32, color:G, lineHeight:1, marginBottom:4, fontWeight:600, fontStyle:'italic' }}>{val.toString().padStart(2,'0')}</span>
            <span style={{ fontSize:10, color:`${DARK}77`, letterSpacing:'.18em', textTransform:'uppercase', fontFamily:'Georgia,serif' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── INVITATION PAGE con más conejos ─── */
function InvitationPage() {
  const [myVote, setMyVote] = useState<string | null>(null);

  /* Conejos laterales — posición fixed para que se vean en toda la scroll */
  const sideBunniesLeft = [
    { top:'6%',  size:58, op:.38, dur:'4.0s', del:'0s'   },
    { top:'24%', size:48, op:.32, dur:'5.2s', del:'.7s'  },
    { top:'43%', size:54, op:.36, dur:'4.6s', del:'1.3s' },
    { top:'62%', size:44, op:.28, dur:'3.9s', del:'.4s'  },
    { top:'80%', size:50, op:.34, dur:'5.0s', del:'1.8s' },
  ];
  const sideBunniesRight = [
    { top:'14%', size:52, op:.36, dur:'4.3s', del:'.5s'  },
    { top:'32%', size:44, op:.30, dur:'5.5s', del:'1.6s' },
    { top:'50%', size:56, op:.38, dur:'4.1s', del:'.2s'  },
    { top:'68%', size:42, op:.28, dur:'4.8s', del:'1.1s' },
    { top:'86%', size:48, op:.32, dur:'3.7s', del:'.9s'  },
  ];

  return (
    <div style={{ background:'linear-gradient(160deg,#f2ede1 0%,#faf7f0 20%,#f8f4ec 100%)', padding:'clamp(32px,6vw,56px) clamp(16px,4vw,24px) 64px', minHeight:'100vh', position:'relative', overflow:'hidden' }}>

      {/* Conejos izquierda */}
      {sideBunniesLeft.map((b,i) => (
        <div key={`bl${i}`} className="bp" style={{ position:'fixed', left:'-4px', top:b.top, zIndex:0, pointerEvents:'none', animationDuration:b.dur, animationDelay:b.del }}>
          <Bunny size={b.size} color={G} opacity={b.op} flip={false}/>
        </div>
      ))}

      {/* Conejos derecha */}
      {sideBunniesRight.map((b,i) => (
        <div key={`br${i}`} className="bp" style={{ position:'fixed', right:'-4px', top:b.top, zIndex:0, pointerEvents:'none', animationDuration:b.dur, animationDelay:b.del }}>
          <Bunny size={b.size} color={G} opacity={b.op} flip={true}/>
        </div>
      ))}

      <div style={{ maxWidth:520, margin:'0 auto', position:'relative', zIndex:1 }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign:'center', marginBottom:8 }}>
          {/* Conejos decorativos en el header — más grandes y visibles */}
          <div style={{ display:'flex', justifyContent:'center', alignItems:'flex-end', gap:8, marginBottom:18 }}>
            <div className="bp" style={{ animationDuration:'4.2s', animationDelay:'.6s' }}>
              <Bunny size={36} color={G} opacity={.55}/>
            </div>
            <div className="bp" style={{ animationDuration:'3.6s', animationDelay:'0s' }}>
              <Bunny size={48} color={G} opacity={.65}/>
            </div>
            <div className="bp" style={{ animationDuration:'4.8s', animationDelay:'1.1s' }}>
              <Bunny size={36} color={G} opacity={.55} flip/>
            </div>
          </div>

          <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:11, letterSpacing:'.32em', color:`${G}cc`, textTransform:'uppercase', margin:'0 0 10px', fontStyle:'italic' }}>Con mucho amor</p>
          <h1 style={{ fontFamily:"'Cormorant Garamond','Georgia','Times New Roman',serif", fontSize:'clamp(34px,8vw,50px)', fontStyle:'italic', color:DARK, margin:'0 0 6px', fontWeight:400, lineHeight:1.15 }}>Fátima &amp; Daniel</h1>
          <p style={{ fontSize:13, color:`${DARK}77`, margin:'0 0 22px', fontFamily:'Georgia,serif', fontStyle:'italic' }}>te invitan a celebrar</p>
          <div style={{ display:'inline-block', padding:'10px 32px', border:`1.5px solid ${G}88`, borderRadius:3, position:'relative' }}>
            <div style={{ position:'absolute', top:-4, left:-4, width:8, height:8, borderTop:`1.5px solid ${G}`, borderLeft:`1.5px solid ${G}` }}/>
            <div style={{ position:'absolute', top:-4, right:-4, width:8, height:8, borderTop:`1.5px solid ${G}`, borderRight:`1.5px solid ${G}` }}/>
            <div style={{ position:'absolute', bottom:-4, left:-4, width:8, height:8, borderBottom:`1.5px solid ${G}`, borderLeft:`1.5px solid ${G}` }}/>
            <div style={{ position:'absolute', bottom:-4, right:-4, width:8, height:8, borderBottom:`1.5px solid ${G}`, borderRight:`1.5px solid ${G}` }}/>
            <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:'clamp(15px,4vw,20px)', letterSpacing:'.28em', color:G, margin:0, fontWeight:600 }}>Revelación de Género y Baby shower</p>
          </div>
        </div>

        <Divider/>
        <EventDetails/>

        {/* Conejos entre secciones */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', margin:'4px 0', opacity:.42, padding:'0 8px' }}>
          <div className="bp" style={{ animationDuration:'4s', animationDelay:'.3s' }}><Bunny size={34} color={G} opacity={1}/></div>
          <div className="bp" style={{ animationDuration:'5s', animationDelay:'1s' }}><Bunny size={28} color={G} opacity={1} flip/></div>
        </div>

        <Divider/>
        <Countdown/>
        <Divider/>
        <TeamVoting onVoteChange={setMyVote}/>

        {/* Conejos entre secciones */}
        <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center', margin:'4px 0', opacity:.40 }}>
          <div className="bp" style={{ animationDuration:'4.5s', animationDelay:'.8s' }}><Bunny size={30} color={G} opacity={1} flip/></div>
          <div className="bp" style={{ animationDuration:'3.8s', animationDelay:'0s' }}><Bunny size={38} color={G} opacity={1}/></div>
          <div className="bp" style={{ animationDuration:'4.2s', animationDelay:'1.4s' }}><Bunny size={30} color={G} opacity={1} flip/></div>
        </div>

        <Divider/>
        <DressCode myVote={myVote}/>
        <Divider/>
        <WishMailbox/>

        {/* Footer bunnies — más visibles */}
        <div style={{ display:'flex', justifyContent:'center', alignItems:'flex-end', gap:10, margin:'40px 0 14px', opacity:.52 }}>
          <div className="bp" style={{ animationDuration:'4.6s', animationDelay:'.4s' }}><Bunny size={30} color={G} opacity={1}/></div>
          <div className="bp" style={{ animationDuration:'3.8s', animationDelay:'1.2s' }}><Bunny size={42} color={G} opacity={1}/></div>
          <div className="bp" style={{ animationDuration:'5.2s', animationDelay:'.2s' }}><Bunny size={34} color={G} opacity={1}/></div>
          {/*<div className="bp" style={{ animationDuration:'4.0s', animationDelay:'1.8s' }}><Bunny size={30} color={G} opacity={1} flip/></div>*/}
        </div>

        <div style={{ textAlign:'center', paddingTop:16, borderTop:`1px solid ${G}20` }}>
          <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:15, fontStyle:'italic', color:`${DARK}77`, margin:0 }}>Con amor,</p>
          <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:22, color:G, margin:'6px 0 0', fontStyle:'italic' }}>Fátima &amp; Daniel</p>
        </div>
      </div>
    </div>
  );
}

/* ─── PARTICLE DATA ─── */
type P = {T:'D'|'S'|'dot'; l:number; t:number; s:number; r:number; dl:number; op:number};
const ON_ENV: P[]  = [{T:'D',l:28,t:210,s:14,r:20,dl:.5,op:.5},{T:'D',l:496,t:192,s:12,r:-15,dl:1.1,op:.45},{T:'dot',l:55,t:155,s:7,r:0,dl:.9,op:.55},{T:'dot',l:484,t:140,s:5,r:0,dl:1.3,op:.5}];
const OUTSIDE: P[] = [{T:'S',l:-50,t:34,s:20,r:0,dl:.6,op:.78},{T:'S',l:78,t:-42,s:15,r:20,dl:.3,op:.70},{T:'S',l:-60,t:250,s:14,r:10,dl:.2,op:.65},{T:'D',l:-60,t:-18,s:22,r:15,dl:.5,op:.72},{T:'D',l:-65,t:162,s:24,r:30,dl:.8,op:.75},{T:'S',l:195,t:-55,s:12,r:0,dl:1.2,op:.65},{T:'S',l:-70,t:112,s:13,r:15,dl:1.6,op:.68}];

/* ─── ENVELOPE SCENE ─── */
function EnvelopeScene({ phase, onOpen }: { phase:'closed'|'opening'|'opened'; onOpen:()=>void }) {
  const [envW, setEnvW] = useState(() => Math.min(window.innerWidth - 32, 520));
  const envH = Math.round(envW * 0.58);
  useEffect(() => { const u = () => setEnvW(Math.min(window.innerWidth - 32, 520)); window.addEventListener('resize', u); return () => window.removeEventListener('resize', u); }, []);
  const sf = envW / 520;
  return (
    <div onClick={onOpen} style={{ minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:24, background:'radial-gradient(ellipse 80% 70% at 52% 45%,#f4ede0 0%,#e8d4ba 48%,#d8c8aa 100%)', overflow:'hidden', position:'relative', cursor:phase==='closed'?'pointer':'default', userSelect:'none', padding:'20px 16px' }}>
      {([[10,20,180,3,0],[80,10,220,3.5,1.2],[5,68,150,2.8,.6],[84,74,190,4,1.8],[50,5,120,3,.9],[20,85,110,2.5,.3]] as number[][]).map(([lx,ly,sz,dur,del],i)=>(
        <div key={i} className="bk" style={{ position:'absolute',left:`${lx}%`,top:`${ly}%`,width:sz,height:sz,borderRadius:'50%',transform:'translate(-50%,-50%)',background:'radial-gradient(circle,rgba(255,255,255,.55) 0%,transparent 70%)',filter:'blur(28px)',pointerEvents:'none',animationDuration:`${dur}s`,animationDelay:`${del}s` }}/>
      ))}
      {/* Conejos en la pantalla del sobre */}
      <div className="bp" style={{ position:'absolute', left:'2%', bottom:'6%', pointerEvents:'none', animationDuration:'4.5s', animationDelay:'.4s', zIndex:2 }}><Bunny size={44} color={G} opacity={.28}/></div>
      <div className="bp" style={{ position:'absolute', right:'2%', bottom:'6%', pointerEvents:'none', animationDuration:'5s', animationDelay:'1.5s', zIndex:2 }}><Bunny size={40} color={G} opacity={.24} flip/></div>
      <div className="bp" style={{ position:'absolute', left:'4%', top:'8%', pointerEvents:'none', animationDuration:'4.2s', animationDelay:'1s', zIndex:2 }}><Bunny size={32} color={G} opacity={.20}/></div>
      <div className="bp" style={{ position:'absolute', right:'4%', top:'10%', pointerEvents:'none', animationDuration:'3.8s', animationDelay:'.2s', zIndex:2 }}><Bunny size={28} color={G} opacity={.18} flip/></div>

      <div className="env" style={{ position:'relative', width:envW, height:envH, flexShrink:0 }}>
        <MarbleSVG w={envW} h={envH}/>
        <svg style={{ position:'absolute',inset:0,pointerEvents:'none',borderRadius:16,overflow:'hidden' }} width={envW} height={envH} viewBox={`0 0 ${envW} ${envH}`}>
          <polygon points={`0,0 0,${envH} ${envW/2},${envH*.53}`}            fill="rgba(242,239,233,.82)" stroke="rgba(202,196,186,.5)" strokeWidth=".7"/>
          <polygon points={`${envW},0 ${envW},${envH} ${envW/2},${envH*.53}`} fill="rgba(240,237,231,.78)" stroke="rgba(202,196,186,.5)" strokeWidth=".7"/>
          <polygon points={`0,${envH} ${envW},${envH} ${envW/2},${envH*.53}`} fill="rgba(238,234,228,.74)" stroke="rgba(202,196,186,.5)" strokeWidth=".7"/>
        </svg>
        <div className={`flap${phase==='opening'?' flap-go':''}`} style={{ position:'absolute',top:0,left:0,width:'100%',height:'52%',zIndex:10,overflow:'hidden' }}>
          <svg width={envW} height={envH*.52} viewBox={`0 0 ${envW} ${envH*.52}`} style={{ display:'block' }}>
            <polygon points={`0,0 ${envW},0 ${envW/2},${envH*.52}`} fill="rgba(246,244,238,.92)" stroke="rgba(202,196,186,.5)" strokeWidth=".7"/>
          </svg>
        </div>
        <div style={{ position:'absolute',inset:0,borderRadius:16,pointerEvents:'none',zIndex:9,boxShadow:'inset 0 8px 30px rgba(0,0,0,.04),0 22px 60px rgba(0,0,0,.15),0 5px 18px rgba(0,0,0,.09)' }}/>
        <div style={{ position:'absolute', top:envH*.2, width:'100%', textAlign:'center', zIndex:6, pointerEvents:'none', fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:Math.max(18,envW*.052), fontStyle:'italic', color:G, letterSpacing:'.04em' }}>Te invitamos…</div>
        <div style={{ position:'absolute', bottom:envH*.085, width:'100%', textAlign:'center', zIndex:6, pointerEvents:'none', fontFamily:'Georgia,serif', fontSize:Math.max(8,envW*.02), fontWeight:600, letterSpacing:'.26em', color:`${G}cc` }}>TOCA PARA ABRIR</div>
        {/* SELLO CON CONEJO */}
        <div style={{ position:'absolute', left:'50%', top:'50%', transform:`translate(-50%,-40%) scale(${Math.max(.7,sf)})`, zIndex:15, pointerEvents:'none' }}><WaxSeal/></div>
        {ON_ENV.map(({T,l,t,s,r,dl,op},i)=>(
          <div key={i} className="fp" style={{ position:'absolute', left:l*sf, top:t*(envH/280), zIndex:8, ['--r' as string]:`${r}deg`, animationDuration:`${2.5+i*.4}s`, animationDelay:`${dl}s`, pointerEvents:'none' }}>
            {T==='D'?<Diamond size={s} op={op}/>:<div style={{ width:s,height:s,borderRadius:'50%',background:'#d4a017',opacity:op }}/>}
          </div>
        ))}
        {OUTSIDE.map(({T,l,t,s,r,dl,op},i)=>(
          <div key={i} className={T==='S'?'sp':'fp'} style={{ position:'absolute', left:l*sf, top:t*(envH/280), zIndex:1, ['--r' as string]:`${r}deg`, ['--op' as string]:op, animationDuration:`${2+i*.3}s`, animationDelay:`${dl}s`, pointerEvents:'none' }}>
            {T==='D'?<Diamond size={s} op={op}/>:<Star4 size={s} op={op}/>}
          </div>
        ))}
      </div>
      <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:'clamp(13px,3.5vw,16px)', color:`${DARK}66`, fontStyle:'italic', margin:0, textAlign:'center', zIndex:10, pointerEvents:'none' }}>Fátima &amp; Daniel • Revelación de Género y Baby shower</p>
    </div>
  );
}

/* ─── APP ROOT ─── */
export default function App() {
  const [phase, setPhase] = useState<'closed'|'opening'|'opened'>('closed');
  const open = useCallback(()=>{ if (phase!=='closed') return; setPhase('opening'); setTimeout(()=>setPhase('opened'),900); },[phase]);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        body{margin:0;padding:0;-webkit-font-smoothing:antialiased}
        @keyframes envIn    {from{opacity:0;transform:scale(.88) translateY(30px)}to{opacity:1;transform:none}}
        @keyframes flapUp   {0%{transform:perspective(700px) rotateX(0)}100%{transform:perspective(700px) rotateX(-178deg)}}
        @keyframes inviteIn {from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
        @keyframes floatP   {0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-10px) rotate(calc(var(--r,0deg)+8deg))}}
        @keyframes twinkP   {0%,100%{opacity:var(--op,.8);transform:scale(1) rotate(var(--r,0deg))}50%{opacity:1;transform:scale(1.4) rotate(calc(var(--r,0deg)+18deg))}}
        @keyframes bkP      {0%,100%{opacity:.22}50%{opacity:.42}}
        @keyframes bunnyBob {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes spin     {to{transform:rotate(360deg)}}
        .env     {animation:envIn .9s cubic-bezier(.16,1,.3,1) forwards}
        .flap    {transform-origin:top center;transform-style:preserve-3d}
        .flap-go {animation:flapUp .78s ease-in forwards}
        .invite  {animation:inviteIn .85s cubic-bezier(.16,1,.3,1) both}
        .fp      {animation:floatP ease-in-out infinite}
        .sp      {animation:twinkP ease-in-out infinite}
        .bk      {animation:bkP   ease-in-out infinite}
        .bp      {animation:bunnyBob ease-in-out infinite}
        input::placeholder,textarea::placeholder{color:rgba(46,36,22,.35)}
        input:focus,textarea:focus{border-color:${G} !important;box-shadow:0 0 0 3px ${G}18}
        textarea{font-family:'Cormorant Garamond','Georgia',serif}
        button:active{transform:scale(.97) !important}
      `}</style>
      {phase!=='opened' && <EnvelopeScene phase={phase} onOpen={open}/>}
      {phase==='opened' && <div className="invite"><InvitationPage/></div>}
    </>
  );
}