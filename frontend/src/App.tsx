import { useState, useEffect, useCallback } from 'react';

const EVENT = {
  date:    'Sábado, 26 de Julio de 2025',
  time:    '4:00 PM',
  place:   'Salón Ilusión',
  address: 'Puebla, Puebla',
  mapsUrl: 'https://maps.google.com/?q=Puebla+Mexico',
};

const G    = '#b5891e';
const GOLD2 = '#d4a832';
const DARK = '#2e2416';
{/*const CREAM = '#faf7f0';*/}
const BLUE = '#3a7abf';
const PINK = '#c44f78';

declare global {
  interface Window {
    storage: {
      get(key: string, shared?: boolean): Promise<{ value: string } | null>;
      set(key: string, value: string, shared?: boolean): Promise<unknown>;
    };
  }
}

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
    <p style={{
      fontFamily:"'Cormorant Garamond','Georgia',serif",
      fontSize:13, letterSpacing:'.28em', color:G,
      textAlign:'center', textTransform:'uppercase', margin:'0 0 22px',
      fontWeight:600,
    }}>
      {children}
    </p>
  );
}

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
        <radialGradient id="sg2" cx="35%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#fff8d0"/>
          <stop offset="100%" stopColor="#c89010"/>
        </radialGradient>
      </defs>
      <g style={{ filter:'drop-shadow(0 8px 20px rgba(120,75,5,.55))' }}>
        <rect x={sq.x} y={sq.y} width={sq.s} height={sq.s} rx={sq.r} fill="url(#sg)"/>
        {pos.map((p,i)=>(
          <g key={i}>
            <circle cx={w*p}       cy={sq.y}       r={7.2} fill="url(#sg)"/>
            <circle cx={w*p}       cy={sq.y+sq.s}  r={7.2} fill="url(#sg)"/>
            <circle cx={sq.x}      cy={w*p}        r={7.2} fill="url(#sg)"/>
            <circle cx={sq.x+sq.s} cy={w*p}        r={7.2} fill="url(#sg)"/>
          </g>
        ))}
      </g>
      <rect x={sq.x+5} y={sq.y+5} width={sq.s-10} height={sq.s*.36} rx={sq.r-2} fill="rgba(255,250,210,.18)"/>
      <text x="54" y="73" textAnchor="middle" fontSize="44"
        fontFamily="'Cormorant Garamond','Georgia','Times New Roman',serif"
        fill="rgba(255,252,225,.92)" fontStyle="italic">M</text>
    </svg>
  );
}

function MarbleSVG({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position:'absolute', inset:0, borderRadius:16 }}>
      <defs>
        <filter id="mf">
          <feTurbulence type="fractalNoise" baseFrequency="0.016 0.038" numOctaves="6" seed="7" result="n"/>
          <feColorMatrix type="matrix"
            values="0.09 0 0 0 0.85  0.09 0 0 0 0.83  0.09 0 0 0 0.80  0 0 0 1.7 -.25"
            in="n"/>
        </filter>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#f9f6ef"/>
          <stop offset="100%" stopColor="#f2ede3"/>
        </linearGradient>
      </defs>
      <rect width={w} height={h} rx="16" fill="url(#mg)"/>
      <rect width={w} height={h} rx="16" filter="url(#mf)" opacity=".72"/>
      {/* Gold veins */}
      <path d={`M${w*.67},0 C${w*.7},${h*.09} ${w*.74},${h*.2} ${w*.76},${h*.36} S${w*.78},${h*.57} ${w*.72},${h*.75} S${w*.68},${h*.9} ${w*.65},${h}`}
        stroke="rgba(200,160,35,.48)" strokeWidth="2" fill="none"/>
      <path d={`M${w*.73},0 C${w*.77},${h*.1} ${w*.82},${h*.23} ${w*.85},${h*.42} S${w*.87},${h*.62} ${w*.82},${h*.8}`}
        stroke="rgba(210,170,42,.44)" strokeWidth="2.5" fill="none"/>
      <path d={`M${w*.8},0 C${w*.83},${h*.08} ${w*.87},${h*.18} ${w*.9},${h*.32} S${w*.92},${h*.5} ${w*.88},${h*.65}`}
        stroke="rgba(218,178,48,.52)" strokeWidth="1.6" fill="none"/>
      <ellipse cx={w*.82} cy={h*.16} rx={w*.09} ry={h*.09} fill="rgba(218,178,48,.07)"/>
      {/* Gray veins */}
      <path d={`M0,${h*.3} C${w*.14},${h*.28} ${w*.3},${h*.33} ${w*.5},${h*.3} S${w*.72},${h*.26} ${w*.88},${h*.3}`}
        stroke="rgba(178,172,162,.22)" strokeWidth=".9" fill="none"/>
      <path d={`M0,${h*.62} C${w*.16},${h*.6} ${w*.35},${h*.65} ${w*.6},${h*.62} S${w*.8},${h*.58} ${w},${h*.62}`}
        stroke="rgba(178,172,162,.18)" strokeWidth=".75" fill="none"/>
      <path d={`M${w*.15},0 C${w*.17},${h*.15} ${w*.2},${h*.32} ${w*.22},${h*.52} S${w*.2},${h*.72} ${w*.18},${h}`}
        stroke="rgba(178,172,162,.14)" strokeWidth=".7" fill="none"/>
    </svg>
  );
}

function Diamond({ size=18, op=0.8 }: { size?:number; op?:number }) {
  return (
    <svg width={size*1.4} height={size*2} viewBox="0 0 14 20" style={{ opacity:op, display:'block' }}>
      <polygon points="7,0 14,7 7,20 0,7" fill="#e8c840"/>
      <polygon points="7,0 14,7 7,20"    fill="rgba(0,0,0,.12)"/>
      <polygon points="7,0 7,20 0,7"     fill="rgba(255,255,255,.14)"/>
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
    { icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="16" height="14" rx="2" stroke={G} strokeWidth="1.5"/>
          <path d="M6 2v3M14 2v3M2 9h16" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="10" cy="14" r="1.5" fill={G}/>
        </svg>
      ), label:'Fecha', val:EVENT.date },
    { icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke={G} strokeWidth="1.5"/>
          <path d="M10 6v4l3 2" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ), label:'Hora', val:EVENT.time },
    { icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z" stroke={G} strokeWidth="1.5"/>
          <circle cx="10" cy="7" r="2" fill={G} opacity=".6"/>
        </svg>
      ), label:'Lugar', val:EVENT.place },
    { icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="6" width="14" height="11" rx="1.5" stroke={G} strokeWidth="1.5"/>
          <path d="M3 9l7 5 7-5" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 6V4a3 3 0 016 0v2" stroke={G} strokeWidth="1.5"/>
        </svg>
      ), label:'Dirección', val:EVENT.address },
  ];
  return (
    <div>
      <SectionTitle>Detalles del Evento</SectionTitle>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {items.map(({ icon, label, val }) => (
          <div key={label} style={{
            padding:'16px 14px', borderRadius:12,
            background:'rgba(255,255,255,0.55)',
            border:`1px solid ${G}28`,
            backdropFilter:'blur(4px)',
            display:'flex', flexDirection:'column', gap:8,
          }}>
            <div style={{ opacity:.9 }}>{icon}</div>
            <div>
              <p style={{ fontSize:9.5, color:`${DARK}60`, letterSpacing:'.18em', textTransform:'uppercase', margin:'0 0 3px', fontFamily:'Georgia,serif' }}>{label}</p>
              <p style={{ fontSize:14, color:DARK, fontFamily:"'Cormorant Garamond','Georgia',serif", margin:0, lineHeight:1.4, fontWeight:500 }}>{val}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:'center', marginTop:22 }}>
        <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer" style={{
          display:'inline-block',
          padding:'12px 32px', borderRadius:50,
          background:`linear-gradient(135deg,${GOLD2},${G},#8a6010)`,
          color:'white', textDecoration:'none',
          fontSize:13, fontWeight:600, letterSpacing:'.1em',
          fontFamily:"'Cormorant Garamond','Georgia',serif",
          boxShadow:`0 6px 24px ${G}44, inset 0 1px 0 rgba(255,255,255,.2)`,
        }}>
          Ver ubicación en Maps
        </a>
      </div>
    </div>
  );
}

/* ─── TEAM VOTING ─── */
function TeamVoting() {
  const [votes, setVotes]   = useState({ nino:0, nina:0 });
  const [myVote, setMyVote] = useState<string|null>(null);
  const [ready, setReady]   = useState(false);

  useEffect(() => {
    (async () => {
      try { const v=await window.storage.get('bbs_votes',true); if(v) setVotes(JSON.parse(v.value)); } catch {}
      try { const m=await window.storage.get('bbs_my_vote');    if(m) setMyVote(m.value);            } catch {}
      setReady(true);
    })();
  }, []);

  const castVote = async (team: 'nino'|'nina') => {
    if (myVote || !ready) return;
    const nv = { ...votes, [team]: votes[team]+1 };
    setVotes(nv); setMyVote(team);
    try { await window.storage.set('bbs_votes', JSON.stringify(nv), true); } catch {}
    try { await window.storage.set('bbs_my_vote', team); } catch {}
  };

  const total = votes.nino + votes.nina;
  const np    = total ? Math.round(votes.nino/total*100) : 50;
  const fp    = 100 - np;

  const VoteBtn = ({ team, color, lightColor, label, symbol }: {
    team:'nino'|'nina'; color:string; lightColor:string; label:string; symbol: React.ReactNode;
  }) => {
    const isChosen = myVote === team;
    const isOther  = myVote && myVote !== team;
    return (
      <button onClick={()=>castVote(team)} disabled={!!myVote} style={{
        flex:1, padding:'20px 10px', borderRadius:14, border: isChosen ? `1.5px solid ${color}` : `1.5px solid ${color}44`,
        cursor: myVote ? 'default' : 'pointer',
        background: isChosen
          ? `linear-gradient(145deg,${lightColor},${color})`
          : isOther ? 'rgba(240,238,234,.6)'
          : `linear-gradient(145deg,${lightColor}44,${color}22)`,
        color: isOther ? '#b0a898' : color,
        fontFamily:"'Cormorant Garamond','Georgia',serif",
        fontSize:16, fontWeight:600,
        boxShadow: isChosen ? `0 8px 28px ${color}40` : 'none',
        transform: isChosen ? 'scale(1.03)' : 'scale(1)',
        transition:'all .35s cubic-bezier(.34,1.56,.64,1)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:8,
      }}>
        <div style={{ fontSize:28, lineHeight:1, filter: isOther ? 'saturate(0) opacity(.4)' : 'none', transition:'filter .3s' }}>{symbol}</div>
        <span style={{ letterSpacing:'.12em', fontSize:13, textTransform:'uppercase' }}>{label}</span>
        {isChosen && <span style={{ fontSize:11, letterSpacing:'.08em', opacity:.8, fontStyle:'italic', fontWeight:400 }}>Tu voto ✓</span>}
      </button>
    );
  };

  const HeartBlue = () => (
    <svg width="30" height="28" viewBox="0 0 30 28">
      <path d="M15,26 C15,26 2,17 2,9 C2,5.13 5.13,2 9,2 C11.4,2 13.53,3.25 15,5.1 C16.47,3.25 18.6,2 21,2 C24.87,2 28,5.13 28,9 C28,17 15,26 15,26Z" fill={BLUE} opacity=".85"/>
      <path d="M15,26 C15,26 2,17 2,9" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" fill="none"/>
    </svg>
  );
  const HeartPink = () => (
    <svg width="30" height="28" viewBox="0 0 30 28">
      <path d="M15,26 C15,26 2,17 2,9 C2,5.13 5.13,2 9,2 C11.4,2 13.53,3.25 15,5.1 C16.47,3.25 18.6,2 21,2 C24.87,2 28,5.13 28,9 C28,17 15,26 15,26Z" fill={PINK} opacity=".85"/>
      <path d="M15,26 C15,26 2,17 2,9" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" fill="none"/>
    </svg>
  );

  return (
    <div>
      <SectionTitle>Tu Predicción</SectionTitle>
      <p style={{ textAlign:'center', color:`${DARK}77`, fontSize:14, margin:'0 0 22px', fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:'italic' }}>
        ¿Crees que será niño o niña?
      </p>

      <div style={{ display:'flex', gap:14, marginBottom: myVote ? 22 : 10 }}>
        <VoteBtn team="nino" color={BLUE} lightColor="#a8c8ee" label="Niño" symbol={<HeartBlue/>}/>
        <VoteBtn team="nina" color={PINK} lightColor="#f0b0c8" label="Niña" symbol={<HeartPink/>}/>
      </div>

      {myVote && total > 0 && (
        <div style={{ padding:20, background:'rgba(255,255,255,.5)', borderRadius:14, border:`1px solid ${G}28`, backdropFilter:'blur(4px)' }}>
          {([['nino',BLUE,np,votes.nino,'Niño'],['nina',PINK,fp,votes.nina,'Niña']] as const).map(([t,c,pct,cnt,lbl])=>(
            <div key={t} style={{ marginBottom: t==='nino' ? 14 : 0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6, fontFamily:"'Cormorant Garamond','Georgia',serif", fontWeight:600 }}>
                <span style={{ color:c }}>{lbl} — {cnt} {cnt===1?'voto':'votos'}</span>
                <span style={{ color:c }}>{pct}%</span>
              </div>
              <div style={{ height:8, borderRadius:4, background:'rgba(0,0,0,.07)', overflow:'hidden' }}>
                <div style={{
                  height:'100%', width:`${pct}%`, borderRadius:4,
                  background: t==='nino' ? `linear-gradient(to right,#8ab8e8,${BLUE})` : `linear-gradient(to right,#e8a0b8,${PINK})`,
                  transition:'width 1.2s cubic-bezier(.34,1.56,.64,1)',
                }}/>
              </div>
            </div>
          ))}
          <p style={{ textAlign:'center', fontSize:12, color:`${DARK}55`, margin:'14px 0 0', fontFamily:'Georgia,serif', fontStyle:'italic' }}>
            {total} {total===1?'persona ha votado':'personas han votado'}
          </p>
        </div>
      )}
      {!myVote && ready && (
        <p style={{ textAlign:'center', fontSize:13, color:`${DARK}55`, margin:'6px 0', fontFamily:'Georgia,serif', fontStyle:'italic' }}>
          {total === 0 ? 'Sé la primera persona en votar' : `${total} ${total===1?'persona ya votó':'personas ya votaron'}`}
        </p>
      )}
    </div>
  );
}

/* ─── WISH MAILBOX ─── */
function WishMailbox() {
  const [messages, setMessages] = useState<{name:string;msg:string;date:string}[]>([]);
  const [form, setForm]         = useState({ name:'', msg:'', email:'' });
  const [errors, setErrors]     = useState({ name:false, msg:false });
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiText, setAiText]     = useState('');
  const [copied, setCopied]     = useState(false);

  useEffect(()=>{
    (async()=>{
      try { const m=await window.storage.get('bbs_msgs',true); if(m) setMessages(JSON.parse(m.value)); } catch {}
    })();
  },[]);

  const validate = () => {
    const e = { name:!form.name.trim(), msg:!form.msg.trim() };
    setErrors(e);
    return !e.name && !e.msg;
  };

  const submit = async () => {
    if (!validate()) return;
    const entry = {
      name: form.name.trim(), msg: form.msg.trim(),
      date: new Date().toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}),
    };
    const updated = [entry, ...messages];
    setMessages(updated);
    try { await window.storage.set('bbs_msgs', JSON.stringify(updated), true); } catch {}
    setSubmitted(true);

    if (form.email.trim()) {
      setGenerating(true);
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514', max_tokens: 600,
            messages: [{ role:'user', content:
              `Escribe una invitación de baby shower en español mexicano, cálida y elegante.\nDirigida a: ${form.name.trim()}\nOrganiza: Daniel y Fátima\nFecha: ${EVENT.date} — Hora: ${EVENT.time}\nLugar: ${EVENT.place}, ${EVENT.address}\nMáximo 170 palabras. Sin emojis. Saludo personal, anuncio, detalles y cierre emotivo firmado por Daniel y Fátima.`
            }],
          }),
        });
        const d = await res.json();
        setAiText(d.content?.map((c:{text?:string})=>c.text||'').join('')||'');
      } catch { setAiText('No se pudo generar la invitación en este momento.'); }
      setGenerating(false);
    }
    setForm({ name:'', msg:'', email:'' });
  };

  const inputBase: React.CSSProperties = {
    width:'100%', padding:'11px 14px',
    border:`1.5px solid ${G}38`, borderRadius:10,
    background:'rgba(255,255,255,.65)', backdropFilter:'blur(4px)',
    fontSize:14, color:DARK, outline:'none',
    fontFamily:"'Cormorant Garamond','Georgia',serif",
    boxSizing:'border-box', transition:'border-color .2s',
  };
  const inputErr: React.CSSProperties = { ...inputBase, borderColor:'#c0392b' };
  const labelStyle: React.CSSProperties = {
    fontSize:10, color:G, letterSpacing:'.2em',
    textTransform:'uppercase', display:'block', marginBottom:7,
    fontFamily:'Georgia,serif', fontWeight:600,
  };

  const SendIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="white" style={{ display:'inline-block', verticalAlign:'middle', marginRight:8 }}>
      <path d="M14.5 8L2 2l3 6-3 6z"/>
      <path d="M5 8h9" stroke="white" strokeWidth="1.2" fill="none"/>
    </svg>
  );

  return (
    <div>
      <SectionTitle>Buzón de Buenos Deseos</SectionTitle>
      <p style={{ textAlign:'center', color:`${DARK}77`, fontSize:14, margin:'0 0 22px', fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:'italic' }}>
        Déjale un mensaje a Daniel y Fátima
      </p>

      {!submitted ? (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={labelStyle}>Nombre completo *</label>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
              placeholder="Tu nombre completo" style={errors.name ? inputErr : inputBase}/>
            {errors.name && <p style={{ fontSize:11, color:'#c0392b', margin:'4px 0 0', fontFamily:'Georgia,serif' }}>Campo obligatorio</p>}
          </div>
          <div>
            <label style={labelStyle}>Tu mensaje *</label>
            <textarea value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))}
              placeholder="Escribe tus buenos deseos para Daniel y Fátima…" rows={3}
              style={{ ...(errors.msg ? inputErr : inputBase), resize:'vertical', lineHeight:1.65 }}/>
            {errors.msg && <p style={{ fontSize:11, color:'#c0392b', margin:'4px 0 0', fontFamily:'Georgia,serif' }}>Campo obligatorio</p>}
          </div>
          <div>
            <label style={labelStyle}>
              Correo electrónico{' '}
              <span style={{ color:`${DARK}55`, fontSize:9, letterSpacing:0, textTransform:'none', fontWeight:400 }}>(opcional)</span>
            </label>
            <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
              placeholder="tu@correo.com" style={inputBase}/>
            <p style={{ fontSize:11.5, color:`${DARK}66`, margin:'6px 0 0', fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:'italic' }}>
              Recibe una invitación personalizada por correo
            </p>
          </div>
          <button onClick={submit} style={{
            width:'100%', padding:'14px 20px', borderRadius:50, border:'none',
            background:`linear-gradient(135deg,${GOLD2},${G},#8a6010)`,
            color:'white', fontSize:14, fontWeight:600, cursor:'pointer',
            letterSpacing:'.12em', fontFamily:"'Cormorant Garamond','Georgia',serif",
            boxShadow:`0 6px 24px ${G}44, inset 0 1px 0 rgba(255,255,255,.18)`,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <SendIcon/> Enviar mensaje
          </button>
        </div>
      ) : (
        <>
          <div style={{
            padding:26, background:'rgba(255,255,255,.55)', borderRadius:14,
            border:`1px solid ${G}30`, backdropFilter:'blur(4px)',
            textAlign:'center', marginBottom:18,
          }}>
            <svg width="44" height="44" viewBox="0 0 44 44" style={{ margin:'0 auto 14px', display:'block' }}>
              <circle cx="22" cy="22" r="21" fill="none" stroke={G} strokeWidth="1.5" opacity=".4"/>
              <path d="M12 22l8 8 12-16" stroke={G} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:20, color:G, fontStyle:'italic', margin:'0 0 8px' }}>
              ¡Gracias por tus buenos deseos!
            </p>
            <p style={{ fontSize:13.5, color:`${DARK}77`, margin:'0 0 18px', fontFamily:'Georgia,serif', fontStyle:'italic' }}>
              Daniel y Fátima lo van a apreciar mucho
            </p>
            <button onClick={()=>setSubmitted(false)} style={{
              padding:'9px 24px', borderRadius:50,
              border:`1.5px solid ${G}`, background:'transparent',
              color:G, fontSize:12, cursor:'pointer', letterSpacing:'.1em',
              fontFamily:'Georgia,serif',
            }}>
              Agregar otro mensaje
            </button>
          </div>

          {generating && (
            <div style={{ textAlign:'center', padding:18 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', border:`2.5px solid ${G}33`, borderTopColor:G, display:'inline-block', marginBottom:12, animation:'spin .8s linear infinite' }}/>
              <p style={{ color:G, fontSize:13.5, fontStyle:'italic', margin:0, fontFamily:'Georgia,serif' }}>Preparando tu invitación…</p>
            </div>
          )}
          {aiText && (
            <div style={{ marginTop:18, padding:24, background:'linear-gradient(145deg,#faf7f0,#f5ead8)', borderRadius:14, border:`1px solid ${G}38` }}>
              <p style={{ fontSize:10, color:G, letterSpacing:'.24em', textTransform:'uppercase', margin:'0 0 14px', fontFamily:'Georgia,serif', fontWeight:600 }}>
                Invitación personalizada
              </p>
              <p style={{ fontSize:13.5, color:DARK, lineHeight:1.9, margin:'0 0 16px', whiteSpace:'pre-wrap', fontFamily:"'Cormorant Garamond','Georgia',serif" }}>{aiText}</p>
              <button
                onClick={()=>{ navigator.clipboard?.writeText(aiText).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2200); }); }}
                style={{
                  padding:'9px 22px', borderRadius:50, border:`1.5px solid ${G}`,
                  background: copied ? G : 'transparent',
                  color: copied ? 'white' : G,
                  fontSize:12, cursor:'pointer', transition:'all .25s', fontFamily:'Georgia,serif', letterSpacing:'.08em',
                }}>
                {copied ? 'Copiado ✓' : 'Copiar texto'}
              </button>
            </div>
          )}
        </>
      )}

      {messages.length > 0 && (
        <div style={{ marginTop:28 }}>
          <p style={{ fontFamily:'Georgia,serif', fontSize:10, letterSpacing:'.22em', color:`${DARK}66`, textAlign:'center', textTransform:'uppercase', margin:'0 0 16px' }}>
            Mensajes recibidos ({messages.length})
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {messages.slice(0,10).map((m,i)=>(
              <div key={i} style={{
                padding:'16px 18px', background:'rgba(255,255,255,.6)',
                borderRadius:12, border:`1px solid ${G}20`,
                boxShadow:'0 2px 10px rgba(0,0,0,.04)', backdropFilter:'blur(4px)',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:7 }}>
                  <span style={{ fontWeight:600, fontSize:15, color:DARK, fontFamily:"'Cormorant Garamond','Georgia',serif" }}>{m.name}</span>
                  <span style={{ fontSize:11, color:`${DARK}50`, fontFamily:'Georgia,serif', fontStyle:'italic' }}>{m.date}</span>
                </div>
                <p style={{ fontSize:13.5, color:`${DARK}bb`, lineHeight:1.7, margin:0, fontFamily:"'Cormorant Garamond','Georgia',serif" }}>{m.msg}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── INVITATION PAGE ─── */
function InvitationPage() {
  return (
    <div style={{ background:'linear-gradient(160deg,#f2ede1 0%,#faf7f0 20%,#f8f4ec 100%)', padding:'clamp(32px,6vw,56px) clamp(16px,4vw,24px) 64px', minHeight:'100vh' }}>
      <div style={{ maxWidth:520, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:8 }}>
          <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:11, letterSpacing:'.32em', color:`${G}cc`, textTransform:'uppercase', margin:'0 0 10px', fontStyle:'italic' }}>
            Con mucho amor
          </p>
          <h1 style={{ fontFamily:"'Cormorant Garamond','Georgia','Times New Roman',serif", fontSize:'clamp(34px,8vw,50px)', fontStyle:'italic', color:DARK, margin:'0 0 6px', fontWeight:400, lineHeight:1.15 }}>
            Daniel &amp; Fátima
          </h1>
          <p style={{ fontSize:13, color:`${DARK}77`, margin:'0 0 22px', fontFamily:'Georgia,serif', fontStyle:'italic' }}>
            te invitan a celebrar
          </p>
          <div style={{ display:'inline-block', padding:'10px 32px', border:`1.5px solid ${G}88`, borderRadius:3, position:'relative' }}>
            <div style={{ position:'absolute', top:-4, left:-4, width:8, height:8, borderTop:`1.5px solid ${G}`, borderLeft:`1.5px solid ${G}` }}/>
            <div style={{ position:'absolute', top:-4, right:-4, width:8, height:8, borderTop:`1.5px solid ${G}`, borderRight:`1.5px solid ${G}` }}/>
            <div style={{ position:'absolute', bottom:-4, left:-4, width:8, height:8, borderBottom:`1.5px solid ${G}`, borderLeft:`1.5px solid ${G}` }}/>
            <div style={{ position:'absolute', bottom:-4, right:-4, width:8, height:8, borderBottom:`1.5px solid ${G}`, borderRight:`1.5px solid ${G}` }}/>
            <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:'clamp(17px,4vw,22px)', letterSpacing:'.32em', color:G, margin:0, fontWeight:600 }}>
              BABY SHOWER
            </p>
          </div>
        </div>

        <Divider/><EventDetails/>
        <Divider/><TeamVoting/>
        <Divider/><WishMailbox/>

        <div style={{ marginTop:44, textAlign:'center', paddingTop:28, borderTop:`1px solid ${G}20` }}>
          <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:15, fontStyle:'italic', color:`${DARK}77`, margin:0 }}>Con amor,</p>
          <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:22, color:G, margin:'6px 0 0', fontStyle:'italic' }}>Daniel &amp; Fátima</p>
        </div>
      </div>
    </div>
  );
}

/* ─── PARTICLE DATA ─── */
type P = {T:'D'|'S'|'dot'; l:number; t:number; s:number; r:number; dl:number; op:number};
const ON_ENV: P[] = [
  {T:'D',l:28,t:210,s:14,r:20,dl:.5,op:.5},
  {T:'D',l:496,t:192,s:12,r:-15,dl:1.1,op:.45},
  {T:'dot',l:55,t:155,s:7,r:0,dl:.9,op:.55},
  {T:'dot',l:484,t:140,s:5,r:0,dl:1.3,op:.5},
];
const OUTSIDE: P[] = [
  {T:'S',l:-50,t:34,s:20,r:0,dl:.6,op:.78},
  {T:'S',l:-48,t:34,s:20,r:0,dl:.6,op:.78},
  {T:'S',l:78,t:-42,s:15,r:20,dl:.3,op:.70},
  {T:'S',l:-60,t:250,s:14,r:10,dl:.2,op:.65},
  {T:'D',l:-60,t:-18,s:22,r:15,dl:.5,op:.72},
  {T:'D',l:-65,t:162,s:24,r:30,dl:.8,op:.75},
  {T:'S',l:195,t:-55,s:12,r:0,dl:1.2,op:.65},
  {T:'S',l:-70,t:112,s:13,r:15,dl:1.6,op:.68},
];

/* ─── RESPONSIVE ENVELOPE ─── */
function EnvelopScene({ phase, onOpen }: { phase:'closed'|'opening'|'opened'; onOpen:()=>void }) {
  // Responsive envelope dimensions
  const [envW, setEnvW] = useState(() => Math.min(window.innerWidth - 32, 520));
  const envH = Math.round(envW * 0.58);

  useEffect(() => {
    const update = () => setEnvW(Math.min(window.innerWidth - 32, 520));
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const scaleFactor = envW / 520;

  return (
    <div onClick={onOpen} style={{
      minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center',
      flexDirection:'column', gap:24,
      background:'radial-gradient(ellipse 80% 70% at 52% 45%,#f4ede0 0%,#e8d4ba 48%,#d8c8aa 100%)',
      overflow:'hidden', position:'relative',
      cursor: phase==='closed' ? 'pointer' : 'default', userSelect:'none',
      padding:'20px 16px',
    }}>
      {/* Ambient blobs */}
      {([[10,20,180,3,0],[80,10,220,3.5,1.2],[5,68,150,2.8,.6],[84,74,190,4,1.8],[50,5,120,3,.9],[20,85,110,2.5,.3]] as number[][]).map(([lx,ly,sz,dur,del],i)=>(
        <div key={i} className="bk" style={{ position:'absolute',left:`${lx}%`,top:`${ly}%`,width:sz,height:sz,borderRadius:'50%',transform:'translate(-50%,-50%)',background:'radial-gradient(circle,rgba(255,255,255,.55) 0%,transparent 70%)',filter:'blur(28px)',pointerEvents:'none',animationDuration:`${dur}s`,animationDelay:`${del}s` }}/>
      ))}

      {/* Envelope */}
      <div className="env" style={{ position:'relative', width:envW, height:envH, flexShrink:0 }}>
        <MarbleSVG w={envW} h={envH}/>

        {/* Inner triangles */}
        <svg style={{ position:'absolute',inset:0,pointerEvents:'none',borderRadius:16,overflow:'hidden' }} width={envW} height={envH} viewBox={`0 0 ${envW} ${envH}`}>
          <polygon points={`0,0 0,${envH} ${envW/2},${envH*.53}`}      fill="rgba(242,239,233,.82)" stroke="rgba(202,196,186,.5)" strokeWidth=".7"/>
          <polygon points={`${envW},0 ${envW},${envH} ${envW/2},${envH*.53}`} fill="rgba(240,237,231,.78)" stroke="rgba(202,196,186,.5)" strokeWidth=".7"/>
          <polygon points={`0,${envH} ${envW},${envH} ${envW/2},${envH*.53}`} fill="rgba(238,234,228,.74)" stroke="rgba(202,196,186,.5)" strokeWidth=".7"/>
        </svg>

        {/* Flap */}
        <div className={`flap${phase==='opening'?' flap-go':''}`}
          style={{ position:'absolute',top:0,left:0,width:'100%',height:'52%',zIndex:10,overflow:'hidden' }}>
          <svg width={envW} height={envH*.52} viewBox={`0 0 ${envW} ${envH*.52}`} style={{ display:'block' }}>
            <polygon points={`0,0 ${envW},0 ${envW/2},${envH*.52}`} fill="rgba(246,244,238,.92)" stroke="rgba(202,196,186,.5)" strokeWidth=".7"/>
          </svg>
        </div>

        {/* Shadow overlay */}
        <div style={{ position:'absolute',inset:0,borderRadius:16,pointerEvents:'none',zIndex:9,boxShadow:'inset 0 8px 30px rgba(0,0,0,.04),0 22px 60px rgba(0,0,0,.15),0 5px 18px rgba(0,0,0,.09)' }}/>

        {/* Text */}
        <div style={{ position:'absolute', top:envH*.2, width:'100%', textAlign:'center', zIndex:6, pointerEvents:'none',
          fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:Math.max(18, envW*.052), fontStyle:'italic', color:G, letterSpacing:'.04em' }}>
          Te invitamos…
        </div>
        <div style={{ position:'absolute', bottom:envH*.085, width:'100%', textAlign:'center', zIndex:6, pointerEvents:'none',
          fontFamily:'Georgia,serif', fontSize:Math.max(8, envW*.02), fontWeight:600, letterSpacing:'.26em', color:`${G}cc` }}>
          TOCA PARA ABRIR
        </div>

        {/* Wax seal */}
        <div style={{ position:'absolute', left:'50%', top:'50%', transform:`translate(-50%,-40%) scale(${Math.max(.7, scaleFactor)})`, zIndex:15, pointerEvents:'none' }}>
          <WaxSeal/>
        </div>

        {/* On-envelope particles */}
        {ON_ENV.map(({T,l,t,s,r,dl,op},i)=>(
          <div key={i} className="fp" style={{ position:'absolute', left:l*scaleFactor, top:t*(envH/280), zIndex:8, ['--r' as string]:`${r}deg`, animationDuration:`${2.5+i*.4}s`, animationDelay:`${dl}s`, pointerEvents:'none' }}>
            {T==='D' ? <Diamond size={s} op={op}/> : <div style={{ width:s,height:s,borderRadius:'50%',background:'#d4a017',opacity:op }}/>}
          </div>
        ))}

        {/* Outside particles */}
        {OUTSIDE.map(({T,l,t,s,r,dl,op},i)=>(
          <div key={i} className={T==='S'?'sp':'fp'} style={{ position:'absolute', left:l*scaleFactor, top:t*(envH/280), zIndex:1, ['--r' as string]:`${r}deg`, ['--op' as string]:op, animationDuration:`${2+i*.3}s`, animationDelay:`${dl}s`, pointerEvents:'none' }}>
            {T==='D' ? <Diamond size={s} op={op}/> : <Star4 size={s} op={op}/>}
          </div>
        ))}
      </div>

      <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:'clamp(13px,3.5vw,16px)', color:`${DARK}66`, fontStyle:'italic', margin:0, textAlign:'center', zIndex:10, pointerEvents:'none' }}>
        Daniel &amp; Fátima • Baby Shower
      </p>
    </div>
  );
}

/* ─── APP ROOT ─── */
export default function App() {
  const [phase, setPhase] = useState<'closed'|'opening'|'opened'>('closed');

  const open = useCallback(()=>{
    if (phase!=='closed') return;
    setPhase('opening');
    setTimeout(()=>setPhase('opened'), 900);
  },[phase]);

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
        @keyframes spin     {to{transform:rotate(360deg)}}
        .env     {animation:envIn .9s cubic-bezier(.16,1,.3,1) forwards}
        .flap    {transform-origin:top center;transform-style:preserve-3d}
        .flap-go {animation:flapUp .78s ease-in forwards}
        .invite  {animation:inviteIn .85s cubic-bezier(.16,1,.3,1) both}
        .fp      {animation:floatP ease-in-out infinite}
        .sp      {animation:twinkP ease-in-out infinite}
        .bk      {animation:bkP   ease-in-out infinite}
        input::placeholder,textarea::placeholder{color:rgba(46,36,22,.35)}
        input:focus,textarea:focus{border-color:${G} !important; box-shadow:0 0 0 3px ${G}18}
        textarea{font-family:'Cormorant Garamond','Georgia',serif}
        button:active{transform:scale(.97) !important}
      `}</style>

      {phase !== 'opened' && (
        <EnvelopScene phase={phase} onOpen={open}/>
      )}
      {phase === 'opened' && (
        <div className="invite"><InvitationPage/></div>
      )}
    </>
  );
}