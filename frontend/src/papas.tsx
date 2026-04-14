import { useState, useEffect } from 'react';

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
async function storeGet2(key: string, shared = false): Promise<string | null> {
  if (typeof window !== 'undefined' && window.storage) {
    try { const r = await window.storage.get(key, shared); return r ? r.value : null; } catch {}
  }
  try { return localStorage.getItem(shared ? `shared_${key}` : `local_${key}`); } catch { return null; }
}

/* ─── MARBLE BG ─── */
function MarblePage() {
  return (
    <svg style={{ position:'fixed', inset:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="mfp">
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.032" numOctaves="6" seed="11" result="n"/>
          <feColorMatrix type="matrix" values="0.09 0 0 0 0.86 0.09 0 0 0 0.84 0.09 0 0 0 0.81 0 0 0 1.5 -.2" in="n"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#f5f0e6"/>
      <rect width="100%" height="100%" filter="url(#mfp)" opacity=".62"/>
      <path d="M75%,0 C77%,12% 80%,28% 81%,46% S82%,64% 78%,80%" stroke="rgba(200,162,38,.38)" strokeWidth="2.2" fill="none"/>
      <path d="M82%,0 C84%,10% 87%,25% 89%,44% S90%,62% 86%,78%" stroke="rgba(210,172,44,.34)" strokeWidth="2.8" fill="none"/>
      <path d="M88%,0 C90%,9% 93%,20% 94%,36% S95%,54% 92%,68%" stroke="rgba(218,180,50,.42)" strokeWidth="1.8" fill="none"/>
    </svg>
  );
}

/* ─── BUNNY ─── */
function Bunny({ size = 60, color = G, opacity = 0.45, flip = false }: { size?: number; color?: string; opacity?: number; flip?: boolean }) {
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 60 81" style={{ opacity, display:'block', transform: flip ? 'scaleX(-1)' : undefined }}>
      <ellipse cx="20" cy="18" rx="7" ry="16" fill={color} opacity=".9"/>
      <ellipse cx="20" cy="18" rx="3.5" ry="12" fill="rgba(255,230,210,.55)"/>
      <ellipse cx="40" cy="16" rx="7" ry="16" fill={color} opacity=".9"/>
      <ellipse cx="40" cy="16" rx="3.5" ry="12" fill="rgba(255,230,210,.55)"/>
      <ellipse cx="30" cy="36" rx="16" ry="15" fill={color}/>
      <ellipse cx="24" cy="33" rx="2.8" ry="3" fill={DARK} opacity=".65"/>
      <ellipse cx="36" cy="33" rx="2.8" ry="3" fill={DARK} opacity=".65"/>
      <circle cx="25" cy="32" r="1" fill="white" opacity=".7"/>
      <circle cx="37" cy="32" r="1" fill="white" opacity=".7"/>
      <ellipse cx="30" cy="39" rx="2" ry="1.4" fill={DARK} opacity=".4"/>
      <ellipse cx="21" cy="40" rx="4" ry="2.5" fill="rgba(255,180,140,.28)"/>
      <ellipse cx="39" cy="40" rx="4" ry="2.5" fill="rgba(255,180,140,.28)"/>
      <ellipse cx="30" cy="62" rx="18" ry="16" fill={color} opacity=".95"/>
      <circle cx="48" cy="70" r="5.5" fill="rgba(255,252,245,.82)"/>
      <ellipse cx="18" cy="75" rx="6" ry="4" fill={color} opacity=".85"/>
      <ellipse cx="42" cy="75" rx="6" ry="4" fill={color} opacity=".85"/>
    </svg>
  );
}

/* ─── GOLD DIVIDER ─── */
function Divider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'28px 0' }}>
      <div style={{ flex:1, height:'1px', background:`linear-gradient(to right,transparent,${G}55)` }}/>
      <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12,2 L13.5,10 L22,12 L13.5,14 L12,22 L10.5,14 L2,12 L10.5,10 Z" fill={G} opacity=".7"/></svg>
      <div style={{ flex:1, height:'1px', background:`linear-gradient(to left,transparent,${G}55)` }}/>
    </div>
  );
}

/* ─── VOTE STATS MINI BAR ─── */
function VoteStats({ votes }: { votes: { nino: number; nina: number } }) {
  const total = votes.nino + votes.nina;
  if (total === 0) return null;
  const np = Math.round(votes.nino / total * 100);
  const fp = 100 - np;
  const leader = votes.nino > votes.nina ? 'nino' : votes.nina > votes.nino ? 'nina' : null;

  return (
    <div style={{ padding:'20px 22px', background:'rgba(255,255,255,.55)', borderRadius:16, border:`1px solid ${G}22`, backdropFilter:'blur(6px)', marginBottom:0 }}>
      <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:10, letterSpacing:'.28em', color:G, textTransform:'uppercase', margin:'0 0 16px', textAlign:'center', fontWeight:600 }}>Predicciones del público</p>
      <div style={{ display:'flex', gap:10, marginBottom:14 }}>
        {([['nino',BLUE,'💙 Niño',np,votes.nino],['nina',PINK,'💗 Niña',fp,votes.nina]] as const).map(([t,c,lbl,pct,cnt])=>(
          <div key={t} style={{ flex:1, textAlign:'center', padding:'14px 8px', borderRadius:12, background: leader===t ? `${c}12` : 'rgba(255,255,255,.3)', border:`1px solid ${c}${leader===t?'44':'22'}`, transition:'all .3s' }}>
            <p style={{ margin:'0 0 4px', fontSize:20 }}>{lbl.split(' ')[0]}</p>
            <p style={{ margin:'0 0 2px', fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:26, color:c, fontWeight:600, lineHeight:1 }}>{pct}%</p>
            <p style={{ margin:0, fontSize:11, color:`${DARK}66`, fontFamily:'Georgia,serif', fontStyle:'italic' }}>{cnt} {cnt===1?'voto':'votos'}</p>
            {leader===t && <p style={{ margin:'6px 0 0', fontSize:10, color:c, letterSpacing:'.1em', fontFamily:'Georgia,serif', fontWeight:600 }}>GANANDO</p>}
          </div>
        ))}
      </div>
      <div style={{ height:10, borderRadius:5, background:`${PINK}33`, overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${np}%`, background:`linear-gradient(to right,#8ab8e8,${BLUE})`, borderRadius:5, transition:'width 1s ease' }}/>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
        <span style={{ fontSize:10, color:BLUE, fontFamily:'Georgia,serif' }}>💙 {np}%</span>
        <span style={{ fontSize:10, color:`${DARK}55`, fontFamily:'Georgia,serif', fontStyle:'italic' }}>{total} votos totales</span>
        <span style={{ fontSize:10, color:PINK, fontFamily:'Georgia,serif' }}>{fp}% 💗</span>
      </div>
    </div>
  );
}

/* ─── SINGLE MESSAGE CARD ─── */
const CARD_COLORS = [
  { bg:'rgba(255,255,255,.72)', accent:G },
  { bg:'rgba(232,248,242,.65)', accent:'#2d8c6a' },
  { bg:'rgba(235,244,255,.65)', accent:BLUE },
  { bg:'rgba(255,242,248,.65)', accent:PINK },
  { bg:'rgba(255,252,235,.65)', accent:'#a07820' },
  { bg:'rgba(248,238,255,.65)', accent:'#7c4fb0' },
];

function MessageCard({ msg, idx, isNew }: { msg: { name: string; msg: string; date: string }; idx: number; isNew?: boolean }) {
  const palette = CARD_COLORS[idx % CARD_COLORS.length];
  const initials = msg.name.split(' ').slice(0,2).map(w=>w[0]?.toUpperCase()||'').join('');

  return (
    <div
      className={isNew ? 'card-new' : 'card-in'}
      style={{
        padding:'22px 22px 20px',
        borderRadius:16,
        background: palette.bg,
        border: `1px solid ${palette.accent}25`,
        backdropFilter:'blur(6px)',
        boxShadow:'0 4px 20px rgba(0,0,0,.06), 0 1px 4px rgba(0,0,0,.04)',
        position:'relative',
        overflow:'hidden',
        animationDelay:`${idx * 0.06}s`,
      }}
    >
      {/* Corner accent */}
      <div style={{ position:'absolute', top:0, right:0, width:48, height:48, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:-24, right:-24, width:48, height:48, borderRadius:'50%', background:`${palette.accent}18` }}/>
      </div>

      {/* Quote mark */}
      <div style={{ position:'absolute', top:14, right:18, fontFamily:"Georgia,serif", fontSize:52, color:`${palette.accent}14`, lineHeight:1, pointerEvents:'none', userSelect:'none' }}>"</div>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
        <div style={{ width:42, height:42, borderRadius:'50%', background:`linear-gradient(135deg,${palette.accent}55,${palette.accent}33)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:16, color:palette.accent, fontWeight:600 }}>{initials}</span>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:0, fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:17, color:DARK, fontWeight:600, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{msg.name}</p>
          <p style={{ margin:'2px 0 0', fontSize:11, color:`${DARK}55`, fontFamily:'Georgia,serif', fontStyle:'italic' }}>{msg.date}</p>
        </div>
        {isNew && (
          <span style={{ padding:'3px 10px', borderRadius:50, background:`${palette.accent}18`, color:palette.accent, fontSize:10, fontFamily:'Georgia,serif', letterSpacing:'.1em', flexShrink:0 }}>NUEVO</span>
        )}
      </div>

      {/* Message */}
      <p style={{ margin:0, fontSize:15, color:`${DARK}cc`, lineHeight:1.75, fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:'italic' }}>
        {msg.msg}
      </p>
    </div>
  );
}

/* ─── EMPTY STATE ─── */
function EmptyState() {
  return (
    <div style={{ textAlign:'center', padding:'60px 24px' }}>
      <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:24, opacity:.35 }}>
        <Bunny size={30} color={G} opacity={1}/>
        <Bunny size={40} color={G} opacity={1}/>
        <Bunny size={30} color={G} opacity={1} flip/>
      </div>
      <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:22, color:`${DARK}77`, fontStyle:'italic', margin:'0 0 10px' }}>
        Aún no hay mensajes
      </p>
      <p style={{ fontSize:13.5, color:`${DARK}55`, fontFamily:'Georgia,serif', fontStyle:'italic', margin:0 }}>
        Los mensajes de tus invitados aparecerán aquí
      </p>
    </div>
  );
}

/* ─── LOADING SKELETON ─── */
function Skeleton() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {[1,2,3].map(i=>(
        <div key={i} style={{ padding:'22px', borderRadius:16, background:'rgba(255,255,255,.5)', border:`1px solid ${G}15` }}>
          <div style={{ display:'flex', gap:12, marginBottom:14 }}>
            <div className="shimmer" style={{ width:42, height:42, borderRadius:'50%' }}/>
            <div style={{ flex:1 }}>
              <div className="shimmer" style={{ height:16, width:'55%', borderRadius:6, marginBottom:6 }}/>
              <div className="shimmer" style={{ height:11, width:'35%', borderRadius:4 }}/>
            </div>
          </div>
          <div className="shimmer" style={{ height:13, width:'100%', borderRadius:4, marginBottom:8 }}/>
          <div className="shimmer" style={{ height:13, width:'80%', borderRadius:4 }}/>
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function Papas() {
  const [messages, setMessages] = useState<{name:string;msg:string;date:string}[]>([]);
  const [votes, setVotes]       = useState({ nino:0, nina:0 });
  const [loading, setLoading]   = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [newCount, setNewCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [filter, setFilter]     = useState<'all'|'recientes'>('all');
  const [copied, setCopied]     = useState(false);

  const load = async (isRefresh = false) => {
    try {
      // 1. Le pegamos a la API real en lugar de storeGet
      const res = await fetch('http://127.0.0.1:8000/api/baby-shower');
      
      if (res.ok) {
        const data = await res.json();
        
        // 2. Mapeamos los mensajes para que coincidan con la estructura que espera tu tarjeta
        const msgs = (data.messages || []).map((m: any) => ({
            name: m.name,
            msg: m.message,
            date: new Date(m.created_at).toLocaleDateString('es-MX', { day:'numeric', month:'short', year:'numeric' })
        }));

        if (isRefresh && msgs.length > prevCount) {
          setNewCount(msgs.length - prevCount);
        }
        
        setPrevCount(msgs.length);
        setMessages(msgs);
        
        if (data.votes) setVotes(data.votes);
      }
    } catch (error) {
        console.error("No se pudo cargar la data de MySQL:", error);
    }
    
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => { setLoading(true); setNewCount(0); load(); };

  const copyAll = () => {
    const text = messages.map((m,i) => `${i+1}. ${m.name} (${m.date})\n"${m.msg}"`).join('\n\n');
    navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(()=>setCopied(false), 2200); });
  };

  const displayed = filter === 'recientes' ? messages.slice(0, 5) : messages;
  const total = votes.nino + votes.nina;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        body{margin:0;padding:0;-webkit-font-smoothing:antialiased}
        @keyframes fadeUp   {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes cardIn   {from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}
        @keyframes cardNew  {from{opacity:0;transform:translateY(-10px) scale(.98)}to{opacity:1;transform:none}}
        @keyframes shimmer  {0%{background-position:-400px 0}100%{background-position:400px 0}}
        @keyframes bunnyBob {0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes pulse    {0%,100%{opacity:.7}50%{opacity:1}}
        @keyframes spin     {to{transform:rotate(360deg)}}
        .page-in  {animation:fadeUp .7s cubic-bezier(.16,1,.3,1) both}
        .card-in  {animation:cardIn .55s cubic-bezier(.16,1,.3,1) both}
        .card-new {animation:cardNew .5s cubic-bezier(.16,1,.3,1) both;outline:1.5px solid ${G}55}
        .bp       {animation:bunnyBob ease-in-out infinite}
        .shimmer  {background:linear-gradient(90deg,#e8e2d8 25%,#f4efe6 50%,#e8e2d8 75%);background-size:800px 100%;animation:shimmer 1.6s infinite linear}
        .filter-btn{padding:8px 18px;border-radius:50px;border:1.5px solid ${G}35;background:transparent;color:${DARK}99;font-family:Georgia,serif;font-size:12px;cursor:pointer;transition:all .2s;letter-spacing:.06em}
        .filter-btn.active{background:${G};border-color:${G};color:white}
        .filter-btn:hover:not(.active){background:${G}15;border-color:${G}55}
        input::placeholder{color:rgba(46,36,22,.35)}
      `}</style>

      <MarblePage/>

      {/* Bunnies decorativos */}
      {[{ l:'-6px', t:'8%', s:46, op:.22, flip:false, dur:'4.2s', del:'0s' },{ l:'-5px', t:'38%', s:36, op:.16, flip:false, dur:'5s', del:'.9s' },{ l:'-5px', t:'68%', s:32, op:.13, flip:false, dur:'4.7s', del:'1.5s' }].map((b,i)=>(
        <div key={`bl${i}`} className="bp" style={{ position:'fixed', left:b.l, top:b.t, zIndex:1, pointerEvents:'none', animationDuration:b.dur, animationDelay:b.del }}>
          <Bunny size={b.s} color={G} opacity={b.op} flip={b.flip}/>
        </div>
      ))}
      {[{ r:'-6px', t:'15%', s:44, op:.20, dur:'4.6s', del:'.5s' },{ r:'-5px', t:'48%', s:34, op:.15, dur:'3.9s', del:'1.8s' },{ r:'-4px', t:'76%', s:30, op:.12, dur:'5.2s', del:'.3s' }].map((b,i)=>(
        <div key={`br${i}`} className="bp" style={{ position:'fixed', right:b.r, top:b.t, zIndex:1, pointerEvents:'none', animationDuration:b.dur, animationDelay:b.del }}>
          <Bunny size={b.s} color={G} opacity={b.op} flip/>
        </div>
      ))}

      <div className="page-in" style={{ maxWidth:580, margin:'0 auto', padding:'clamp(28px,6vw,52px) clamp(16px,4vw,28px) 80px', position:'relative', zIndex:2 }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign:'center', marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:20, opacity:.55 }}>
            <div className="bp" style={{ animationDuration:'4s' }}><Bunny size={28} color={G} opacity={1}/></div>
            <div className="bp" style={{ animationDuration:'3.4s', animationDelay:'.5s' }}><Bunny size={38} color={G} opacity={1}/></div>
            <div className="bp" style={{ animationDuration:'4.8s', animationDelay:'1s' }}><Bunny size={28} color={G} opacity={1} flip/></div>
          </div>
          <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:11, letterSpacing:'.32em', color:`${G}bb`, textTransform:'uppercase', margin:'0 0 10px', fontStyle:'italic' }}>Para</p>
          <h1 style={{ fontFamily:"'Cormorant Garamond','Georgia','Times New Roman',serif", fontSize:'clamp(32px,7vw,48px)', fontStyle:'italic', color:DARK, margin:'0 0 6px', fontWeight:400, lineHeight:1.15 }}>
            Fátima &amp; Daniel
          </h1>
          <p style={{ fontSize:13.5, color:`${DARK}77`, margin:'0 0 24px', fontFamily:'Georgia,serif', fontStyle:'italic' }}>
            Los mensajes de amor de tus invitados
          </p>

          {/* Stats chips */}
          <div style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
            <div style={{ padding:'8px 18px', borderRadius:50, background:'rgba(255,255,255,.6)', border:`1px solid ${G}28`, backdropFilter:'blur(4px)' }}>
              <span style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:14, color:G, fontWeight:600 }}>{messages.length}</span>
              <span style={{ fontSize:12, color:`${DARK}77`, fontFamily:'Georgia,serif', marginLeft:6 }}>mensaje{messages.length!==1?'s':''}</span>
            </div>
            <div style={{ padding:'8px 18px', borderRadius:50, background:'rgba(255,255,255,.6)', border:`1px solid ${G}28`, backdropFilter:'blur(4px)' }}>
              <span style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:14, color:G, fontWeight:600 }}>{total}</span>
              <span style={{ fontSize:12, color:`${DARK}77`, fontFamily:'Georgia,serif', marginLeft:6 }}>voto{total!==1?'s':''}</span>
            </div>
          </div>
        </div>

        <Divider/>

        {/* ── VOTE STATS ── */}
        {total > 0 && (
          <>
            <VoteStats votes={votes}/>
            <Divider/>
          </>
        )}

        {/* ── TOOLBAR ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginBottom:20, flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:8 }}>
            <button className={`filter-btn${filter==='all'?' active':''}`} onClick={()=>setFilter('all')}>
              Todos ({messages.length})
            </button>
            <button className={`filter-btn${filter==='recientes'?' active':''}`} onClick={()=>setFilter('recientes')}>
              Recientes
            </button>
          </div>

          <div style={{ display:'flex', gap:8 }}>
            {messages.length > 0 && (
              <button onClick={copyAll} style={{ padding:'8px 16px', borderRadius:50, border:`1.5px solid ${G}35`, background: copied?G:'transparent', color: copied?'white':`${DARK}88`, fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer', transition:'all .25s', letterSpacing:'.06em', display:'flex', alignItems:'center', gap:6 }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill={copied?'white':DARK} opacity=".7"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke={copied?'white':`${DARK}88`} strokeWidth="1.5" fill="none"/><path d="M3 11V3a1 1 0 011-1h8" stroke={copied?'white':`${DARK}88`} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                {copied ? 'Copiado ✓' : 'Copiar todo'}
              </button>
            )}
            <button onClick={handleRefresh} style={{ padding:'8px 16px', borderRadius:50, border:`1.5px solid ${G}35`, background:'transparent', color:`${DARK}88`, fontFamily:'Georgia,serif', fontSize:11, cursor:'pointer', transition:'all .2s', letterSpacing:'.06em', display:'flex', alignItems:'center', gap:6 }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" opacity=".7" style={{ animation: loading?'spin .8s linear infinite':undefined }}>
                <path d="M14 8A6 6 0 112 8"/>
                <path d="M14 3v5h-5"/>
              </svg>
              Actualizar
            </button>
          </div>
        </div>

        {/* Última actualización */}
        <p style={{ fontSize:11, color:`${DARK}44`, fontFamily:'Georgia,serif', fontStyle:'italic', margin:'-12px 0 20px', textAlign:'right' }}>
          Actualizado: {lastRefresh.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}
          {newCount > 0 && <span style={{ marginLeft:10, color:G, fontWeight:600 }}>+{newCount} nuevo{newCount!==1?'s':''}</span>}
        </p>

        {/* ── MESSAGES ── */}
        {loading ? (
          <Skeleton/>
        ) : messages.length === 0 ? (
          <EmptyState/>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {displayed.map((m, i) => (
              <MessageCard
                key={`${m.name}-${i}`}
                msg={m}
                idx={i}
                isNew={newCount > 0 && i < newCount}
              />
            ))}
            {filter === 'recientes' && messages.length > 5 && (
              <button onClick={()=>setFilter('all')} style={{ width:'100%', padding:'14px', borderRadius:12, border:`1.5px dashed ${G}44`, background:'transparent', color:G, fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:14, cursor:'pointer', letterSpacing:'.08em', fontStyle:'italic' }}>
                Ver los {messages.length - 5} mensajes restantes
              </button>
            )}
          </div>
        )}

        {/* ── FOOTER ── */}
        {!loading && messages.length > 0 && (
          <>
            <Divider/>
            <div style={{ textAlign:'center' }}>
              <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:14, opacity:.3 }}>
                <Bunny size={22} color={G} opacity={1}/>
                <Bunny size={30} color={G} opacity={1}/>
                <Bunny size={22} color={G} opacity={1} flip/>
              </div>
              <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:15, fontStyle:'italic', color:`${DARK}66`, margin:'0 0 4px' }}>
                Con amor, sus invitados
              </p>
              <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:20, color:G, margin:0, fontStyle:'italic' }}>
                Fátima &amp; Daniel
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}