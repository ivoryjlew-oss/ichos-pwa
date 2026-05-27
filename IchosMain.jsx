import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const ALBUM_ART = {
  s1:{ bg:"linear-gradient(145deg,#1a1a2e,#2d1b4e,#0f0f23)", label:"#8b5cf6", text:"R",  ring:"#6d28d9" },
  s2:{ bg:"linear-gradient(145deg,#0d1f0d,#1a3a1a,#0a2a0a)", label:"#4a7c4a", text:"BI", ring:"#2d5a2d" },
  s3:{ bg:"linear-gradient(145deg,#0a1520,#1a2d40,#0d1e30)", label:"#2563eb", text:"JB", ring:"#1d4ed8" },
  s4:{ bg:"linear-gradient(145deg,#1e1000,#3a2000,#2a1500)", label:"#92400e", text:"BI", ring:"#78350f" },
  s5:{ bg:"linear-gradient(145deg,#0f1e1a,#1a3028,#0a1f1a)", label:"#065f46", text:"BI", ring:"#047857" },
  s6:{ bg:"linear-gradient(145deg,#0d0d1f,#1a1a3a,#080820)", label:"#4338ca", text:"MO", ring:"#3730a3" },
  s7:{ bg:"linear-gradient(145deg,#1a0a0a,#3a1010,#200808)", label:"#991b1b", text:"BI", ring:"#7f1d1d" },
  s8:{ bg:"linear-gradient(145deg,#1a1500,#302800,#201e00)", label:"#854d0e", text:"BE", ring:"#713f12" },
  s9:{ bg:"linear-gradient(145deg,#0f1520,#1a2535,#0a1018)", label:"#0369a1", text:"SS", ring:"#075985" },
};

const SONGS = [
  { id:"s1", title:"Motion Picture Soundtrack", artist:"Radiohead",            genre:"post-rock",  duration:239 },
  { id:"s2", title:"Holocene",                  artist:"Bon Iver",             genre:"folk",        duration:355 },
  { id:"s3", title:"Retrograde",                artist:"James Blake",          genre:"electronic",  duration:295 },
  { id:"s4", title:"Skinny Love",               artist:"Bon Iver",             genre:"folk",        duration:222 },
  { id:"s5", title:"Re: Stacks",                artist:"Bon Iver",             genre:"folk",        duration:459 },
  { id:"s6", title:"The Night Will Always Win", artist:"Manchester Orchestra", genre:"indie",       duration:248 },
  { id:"s7", title:"Blood Bank",                artist:"Bon Iver",             genre:"folk",        duration:258 },
  { id:"s8", title:"Lua",                       artist:"Bright Eyes",          genre:"folk",        duration:244 },
  { id:"s9", title:"Death With Dignity",        artist:"Sufjan Stevens",       genre:"indie",       duration:192 },
];

const VERSES = [
  { id:"v1", songId:"s2", text:"And at once I knew I was not magnificent",          context:"Holocene, 2:14 — the collapse of ego in a single line" },
  { id:"v2", songId:"s4", text:"Come on skinny love just last the year",             context:"Skinny Love — desperation worn as a plea" },
  { id:"v3", songId:"s4", text:"Who will love you? Who will fight? Who will fall far behind?", context:"Skinny Love — three questions that undo you" },
  { id:"v4", songId:"s8", text:"I'm gonna miss you like a child misses their blanket", context:"Lua — grief made tactile and small" },
  { id:"v5", songId:"s6", text:"I know the night will always win",                   context:"The Night Will Always Win — resignation that feels like peace" },
  { id:"v6", songId:"s9", text:"The only thing that's left is a page that I wrote",  context:"Death With Dignity — what remains after someone leaves" },
  { id:"v7", songId:"s1", text:"I will see you in the next life",                    context:"Motion Picture Soundtrack — a farewell that sounds like a promise" },
  { id:"v8", songId:"s5", text:"This is not the sound of a new man",                 context:"Re: Stacks — honesty about the inability to change" },
  { id:"v9", songId:"s3", text:"You're the reason I'm still breathing",              context:"Retrograde — the person who becomes the reason" },
];

const USERS = [
  { id:"u1", name:"Mara Chen",    handle:"mara",   av:"MC", color:"#8b5cf6", bio:"I listen when words aren't enough.",     songIds:["s2","s3","s5","s4","s1"], verseIds:["v1","v2","v7"], status:"online",  statusHidden:false, followers:1240 },
  { id:"u2", name:"Theo Park",    handle:"theo",   av:"TP", color:"#c4b5fd", bio:"Music is the only honest language.",      songIds:["s3","s4","s2","s6"],      verseIds:["v2","v3","v5"], status:"online",  statusHidden:true,  followers:892  },
  { id:"u3", name:"Isla Novak",   handle:"isla",   av:"IN", color:"#6ee7b7", bio:"Late nights, long songs.",                songIds:["s5","s1","s3"],            verseIds:["v1","v8","v9"], status:"online",  statusHidden:false, followers:3100 },
  { id:"u4", name:"Dae-Jung Lim", handle:"dae",    av:"DJ", color:"#fcd34d", bio:"Chasing the feeling before sleep.",       songIds:["s2","s7","s8","s9","s4"], verseIds:["v4","v6"],      status:"offline", statusHidden:false, followers:567  },
  { id:"u5", name:"Priya Nair",   handle:"priya",  av:"PN", color:"#f9a8d4", bio:"Every song is a room I've lived in.",     songIds:["s9","s1","s6"],            verseIds:["v5","v6","v7"], status:"offline", statusHidden:false, followers:2890 },
  { id:"u6", name:"Olu Mensah",   handle:"olu",    av:"OM", color:"#fb923c", bio:"Sound is memory. Memory is everything.",  songIds:["s8","s3"],                 verseIds:["v4","v9"],      status:"online",  statusHidden:false, followers:4200 },
];

const MY_PROFILE = {
  id:"me", name:"Ivory", handle:"ivory", av:"I", color:"#a78bfa",
  bio:"Every song is a room I've lived in.",
  songIds:["s1","s2","s3","s5","s6"],
  verseIds:["v1","v5","v7"],
  status:"online", statusHidden:false,
};

const MOODS = [
  { id:"transcendent", label:"transcendent", color:"#c4b5fd", songId:"s2" },
  { id:"nocturnal",    label:"nocturnal",    color:"#60a5fa", songId:"s5" },
  { id:"aching",       label:"aching",       color:"#fca5a5", songId:"s4" },
  { id:"sacred",       label:"sacred",       color:"#86efac", songId:"s9" },
  { id:"electric",     label:"electric",     color:"#67e8f9", songId:"s3" },
  { id:"raw",          label:"raw",          color:"#fdba74", songId:"s7" },
  { id:"tender",       label:"tender",       color:"#fde68a", songId:"s8" },
  { id:"resigned",     label:"resigned",     color:"#a5b4fc", songId:"s6" },
];

const ALERTS_DATA = [
  { id:"a1", type:"verse_match",  read:false, time:"2m ago",    userId:"u3", songId:"s2", verseSnippet:"And at once I knew I was not magnificent", message:"Isla pinned the same verse as you" },
  { id:"a2", type:"booth_visit",  read:false, time:"14m ago",   userId:"u1", songId:null, message:"Mara entered your booth" },
  { id:"a3", type:"new_echo",     read:false, time:"1h ago",    userId:"u6", songId:"s8", message:"New echo match — Olu shares 3 songs" },
  { id:"a4", type:"badge_earned", read:true,  time:"2h ago",    userId:null, badgeId:"b6", message:"You earned the Deep Echo badge" },
  { id:"a5", type:"story_song",   read:true,  time:"5h ago",    userId:"u2", songId:"s3", message:"Theo added a story song that matches yours" },
];

const BADGES = [
  { id:"b1",  name:"First Echo",     icon:"🌀", rarity:"common",    earned:true,  date:"Mar 12", desc:"Found your first echo match"                     },
  { id:"b2",  name:"Deep Listener",  icon:"🎧", rarity:"uncommon",  earned:true,  date:"Mar 18", desc:"Listened for 10+ hours in a single week"          },
  { id:"b3",  name:"Verse Keeper",   icon:"📜", rarity:"uncommon",  earned:true,  date:"Mar 24", desc:"Pinned 5 or more story verses"                    },
  { id:"b4",  name:"Booth Host",     icon:"🎙", rarity:"common",    earned:true,  date:"Apr 2",  desc:"Hosted your first listening booth"                 },
  { id:"b5",  name:"Rare Frequency", icon:"💎", rarity:"rare",      earned:true,  date:"Apr 8",  desc:"First to echo a song with fewer than 100 listeners"},
  { id:"b6",  name:"Deep Echo",      icon:"🌊", rarity:"rare",      earned:true,  date:"Apr 15", desc:"Matched with someone who shares 5+ story songs"    },
  { id:"b7",  name:"Night Owl",      icon:"🌙", rarity:"uncommon",  earned:false, progress:5, total:7,  desc:"Listened 2am–4am on 7 different nights"    },
  { id:"b8",  name:"The Long Listen",icon:"⏳", rarity:"legendary", earned:false, progress:1, total:3,  desc:"Listened to Re: Stacks 3 times in one sitting"},
];

const RARITY = {
  common:    { color:"rgba(220,210,190,0.5)",  bg:"rgba(220,210,190,0.05)", border:"rgba(220,210,190,0.14)" },
  uncommon:  { color:"#6ee7b7",                bg:"rgba(110,231,183,0.07)", border:"rgba(110,231,183,0.2)"  },
  rare:      { color:"#93c5fd",                bg:"rgba(147,197,253,0.07)", border:"rgba(147,197,253,0.2)"  },
  legendary: { color:"#fcd34d",                bg:"rgba(252,211,77,0.07)",  border:"rgba(252,211,77,0.2)"   },
};

const BOOTH_QUEUE  = ["s2","s5","s1","s3","s4"];
const JOURNAL_DATA = [
  { id:"j1", songId:"s2", date:"Today, 2:14am",   mood:"transcendent", entry:"Found this song again for what must be the hundredth time. 'And at once I knew I was not magnificent' — hits differently at 35,000 feet. Some songs are maps of who you were.", voiceNote:"0:28", public:true,  likes:34 },
  { id:"j2", songId:"s5", date:"Yesterday, 11pm",  mood:"nocturnal",   entry:"Re: Stacks at midnight again. The piano part in the third minute is the moment I always forget I'm breathing.", voiceNote:null,  public:false, likes:0  },
  { id:"j3", songId:"s9", date:"3 days ago",        mood:"sacred",      entry:"Death With Dignity on the train home. I couldn't look at anyone after. Some songs make public space feel like a violation.", voiceNote:"0:22", public:true,  likes:19 },
];

const REPORT_REASONS = ["Harassment or bullying","Hate speech or discrimination","Spam or fake account","Sexually explicit content","Threats or violence","Impersonation","Sharing private information","Other"];

const fmt  = n => n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n);
const fmtT = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
const PAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='500' height='500' filter='url(%23n)' opacity='.048'/%3E%3C/svg%3E")`;

// ─── BASE COMPONENTS ──────────────────────────────────────────────────────────

const Rule = ({ op=0.1, my=12 }) => <div style={{ height:1, background:`rgba(220,210,190,${op})`, margin:`${my}px 0` }}/>;
const ThickRule = ({ op=0.2 }) => <div style={{ height:2, background:`rgba(220,210,190,${op})` }}/>;

function DottedRule({ label, right }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"18px 0 14px" }}>
      <span style={{ fontFamily:"'Karla',sans-serif", fontSize:9, letterSpacing:"0.2em", color:"rgba(220,210,190,0.28)", whiteSpace:"nowrap", textTransform:"uppercase" }}>{label}</span>
      <div style={{ flex:1, borderTop:"1px dashed rgba(220,210,190,0.12)" }}/>
      {right && <span style={{ fontFamily:"'Karla',sans-serif", fontSize:8.5, color:"rgba(220,210,190,0.22)", whiteSpace:"nowrap" }}>{right}</span>}
    </div>
  );
}

function Wave({ active=false, bars=14, color="rgba(220,210,190,0.4)" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:1.5, height:14 }}>
      {Array.from({length:bars},(_,i) => (
        <div key={i} style={{ width:1.5, height:active?`${3+Math.abs(Math.sin(i*0.7))*9}px`:"2px", background:color, opacity:active?0.65:0.2, transition:"height 0.3s ease", animation:active?"wa 0.8s ease-in-out infinite alternate":"none", animationDelay:`${i*60}ms` }}/>
      ))}
    </div>
  );
}

function AlbumDisc({ songId, size=80, spinning=false }) {
  const art  = ALBUM_ART[songId] || ALBUM_ART.s1;
  const song = SONGS.find(s => s.id === songId);
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", flexShrink:0 }}>
      <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:"#080604", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", boxShadow:`0 ${size*.06}px ${size*.25}px rgba(0,0,0,.8), inset 0 0 0 1px rgba(220,210,190,.06)`, animation:spinning?"discSpin 4.5s linear infinite":"none" }}>
        {[.94,.86,.78,.70].map((r,i) => <div key={i} style={{ position:"absolute", width:`${r*100}%`, height:`${r*100}%`, borderRadius:"50%", border:"1px solid rgba(220,210,190,.04)" }}/>)}
        <div style={{ width:size*.44, height:size*.44, borderRadius:"50%", background:art.bg, zIndex:2, border:`1px solid ${art.ring}40`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:`0 0 ${size*.12}px ${art.label}22`, overflow:"hidden" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:size*.1, fontWeight:900, color:art.label, lineHeight:1 }}>{art.text}</div>
          <div style={{ width:"55%", height:1, background:`${art.label}50`, margin:"2px 0" }}/>
          <div style={{ fontFamily:"'Karla',sans-serif", fontSize:size*.065, color:`${art.label}80`, letterSpacing:"0.05em", textAlign:"center", padding:"0 3px", maxWidth:"90%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{song?.title?.length>8?song.title.slice(0,7)+"…":song?.title}</div>
        </div>
        <div style={{ position:"absolute", width:size*.045, height:size*.045, borderRadius:"50%", background:"#030202", border:"1px solid rgba(220,210,190,.1)", zIndex:3 }}/>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"linear-gradient(145deg,rgba(255,255,255,.05) 0%,transparent 50%)", pointerEvents:"none", zIndex:4 }}/>
      </div>
    </div>
  );
}

function Avatar({ user, size=36, showStatus=true }) {
  const c = user?.color || "#8b5cf6";
  const isOnline = user?.status === "online" && !user?.statusHidden;
  return (
    <div style={{ position:"relative", flexShrink:0, width:size, height:size }}>
      <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${c}40,${c}18)`, border:`1.5px solid ${c}50`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Playfair Display',serif", fontSize:size*.3, fontWeight:700, color:c }}>
        {user?.av || "?"}
      </div>
      {showStatus && !user?.statusHidden && (
        <div style={{ position:"absolute", bottom:-1, right:-1, width:size*.24, height:size*.24, borderRadius:"50%", background:isOnline?"#6ee7b7":"rgba(220,210,190,0.25)", border:"2px solid #050302", boxShadow:isOnline?"0 0 6px #6ee7b766":undefined, animation:isOnline?"onlinePulse 2.5s ease infinite":undefined }}/>
      )}
    </div>
  );
}

// ─── BLOCK / REPORT ───────────────────────────────────────────────────────────

function BlockReportMenu({ user, onBlock, onClose }) {
  const [view,   setView]   = useState("menu");
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");

  if (view === "done-report") return (
    <div style={{ position:"fixed",inset:0,zIndex:700,background:"rgba(3,2,1,0.96)",backdropFilter:"blur(20px)",display:"flex",alignItems:"flex-end",animation:"slideUp 0.28s cubic-bezier(.16,1,.3,1)" }}>
      <div style={{ width:"100%",maxWidth:420,margin:"0 auto",background:"#0c0a07",borderRadius:"8px 8px 0 0",border:"1px solid rgba(220,210,190,0.1)",borderBottom:"none",padding:"32px 18px 28px",textAlign:"center",backgroundImage:PAPER,backgroundSize:"500px" }}>
        <ThickRule op={0.15}/>
        <div style={{ fontSize:44,marginBottom:14 }}>✓</div>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#ddd0b8",marginBottom:8 }}>Report received</div>
        <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13,color:"rgba(220,210,190,0.5)",lineHeight:1.7,maxWidth:300,margin:"0 auto 20px" }}>Our team will review this within 24 hours. Thank you for helping keep Ichōs safe.</div>
        <button onClick={onClose} style={{ fontFamily:"'Karla',sans-serif",fontSize:9,letterSpacing:"0.12em",color:"rgba(220,210,190,0.5)",background:"transparent",border:"1px solid rgba(220,210,190,0.15)",padding:"9px 22px",cursor:"pointer",textTransform:"uppercase" }}>done</button>
      </div>
    </div>
  );

  if (view === "done-block") return (
    <div style={{ position:"fixed",inset:0,zIndex:700,background:"rgba(3,2,1,0.96)",backdropFilter:"blur(20px)",display:"flex",alignItems:"flex-end",animation:"slideUp 0.28s cubic-bezier(.16,1,.3,1)" }}>
      <div style={{ width:"100%",maxWidth:420,margin:"0 auto",background:"#0c0a07",borderRadius:"8px 8px 0 0",border:"1px solid rgba(220,210,190,0.1)",borderBottom:"none",padding:"32px 18px 28px",textAlign:"center",backgroundImage:PAPER,backgroundSize:"500px" }}>
        <ThickRule op={0.15}/>
        <div style={{ fontSize:44,marginBottom:14 }}>🚫</div>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#ddd0b8",marginBottom:8 }}>@{user.handle} is blocked</div>
        <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13,color:"rgba(220,210,190,0.5)",lineHeight:1.7,maxWidth:280,margin:"0 auto 20px" }}>They can no longer contact you, find your profile, or enter your booth.</div>
        <button onClick={onClose} style={{ fontFamily:"'Karla',sans-serif",fontSize:9,letterSpacing:"0.12em",color:"rgba(220,210,190,0.5)",background:"transparent",border:"1px solid rgba(220,210,190,0.15)",padding:"9px 22px",cursor:"pointer",textTransform:"uppercase" }}>done</button>
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed",inset:0,zIndex:700,background:"rgba(3,2,1,0.95)",backdropFilter:"blur(20px)",display:"flex",alignItems:"flex-end",animation:"slideUp 0.28s cubic-bezier(.16,1,.3,1)" }}>
      <div style={{ width:"100%",maxWidth:420,margin:"0 auto",background:"#0c0a07",borderRadius:"8px 8px 0 0",border:"1px solid rgba(220,210,190,0.1)",borderBottom:"none",maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden",backgroundImage:PAPER,backgroundSize:"500px" }}>
        <ThickRule op={0.15}/>
        {view === "menu" && (
          <>
            <div style={{ padding:"14px 18px",borderBottom:"1px solid rgba(220,210,190,0.08)",display:"flex",alignItems:"center",gap:10 }}>
              <Avatar user={user} size={36} showStatus={false}/>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:"#ddd0b8" }}>{user.name}</div>
                <div style={{ fontFamily:"'Karla',sans-serif",fontSize:9,color:"rgba(220,210,190,0.3)" }}>@{user.handle}</div>
              </div>
            </div>
            {[{icon:"🚩",label:"Report",color:"rgba(220,210,190,0.7)",fn:()=>setView("report")},{icon:"🚫",label:"Block",color:"#fca5a5",fn:()=>{ onBlock(user.id); setView("done-block"); }},{icon:"🔇",label:"Mute from feed",color:"rgba(220,210,190,0.5)",fn:onClose},{icon:"👁",label:"Remove from echoes",color:"rgba(220,210,190,0.5)",fn:onClose}].map(({icon,label,color,fn})=>(
              <button key={label} onClick={fn} style={{ width:"100%",display:"flex",alignItems:"center",gap:14,padding:"13px 18px",background:"none",border:"none",cursor:"pointer",textAlign:"left",borderBottom:"1px solid rgba(220,210,190,0.05)" }}>
                <span style={{ fontSize:20,flexShrink:0 }}>{icon}</span>
                <span style={{ fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color }}>{label}</span>
              </button>
            ))}
            <div style={{ padding:"12px 18px 20px" }}>
              <button onClick={onClose} style={{ width:"100%",fontFamily:"'Karla',sans-serif",fontSize:10,letterSpacing:"0.12em",color:"rgba(220,210,190,0.4)",background:"transparent",border:"1px solid rgba(220,210,190,0.12)",padding:"10px",cursor:"pointer",textTransform:"uppercase" }}>cancel</button>
            </div>
          </>
        )}
        {view === "report" && (
          <div style={{ flex:1,overflowY:"auto",padding:"18px" }}>
            <button onClick={()=>setView("menu")} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(220,210,190,0.35)",fontFamily:"'Karla',sans-serif",fontSize:9,letterSpacing:"0.1em",marginBottom:14 }}>← back</button>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#ddd0b8",marginBottom:6 }}>Report @{user.handle}</div>
            <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13,color:"rgba(220,210,190,0.45)",lineHeight:1.6,marginBottom:18 }}>Confidential. Reviewed within 24 hours.</div>
            <div style={{ display:"flex",flexDirection:"column",gap:6,marginBottom:14 }}>
              {REPORT_REASONS.map(r => (
                <button key={r} onClick={()=>setReason(r)} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:reason===r?"rgba(220,210,190,0.06)":"transparent",border:`1px solid rgba(220,210,190,${reason===r?0.2:0.08})`,cursor:"pointer",textAlign:"left",transition:"all 0.2s" }}>
                  <div style={{ width:14,height:14,borderRadius:"50%",border:`1.5px solid rgba(220,210,190,${reason===r?0.6:0.2})`,background:reason===r?"rgba(220,210,190,0.4)":"transparent",flexShrink:0,transition:"all 0.2s" }}/>
                  <span style={{ fontFamily:"'Spectral',serif",fontSize:13,color:reason===r?"#ddd0b8":"rgba(220,210,190,0.55)" }}>{r}</span>
                </button>
              ))}
            </div>
            <textarea value={detail} onChange={e=>setDetail(e.target.value)} placeholder="Additional detail (optional)…" rows={3}
              style={{ width:"100%",background:"rgba(220,210,190,0.03)",border:"1px solid rgba(220,210,190,0.1)",padding:"10px 12px",color:"#ddd0b8",fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13,lineHeight:1.55,resize:"none",outline:"none",marginBottom:14 }}/>
            <button onClick={()=>reason&&setView("done-report")} disabled={!reason} style={{ width:"100%",padding:"12px",fontFamily:"'Karla',sans-serif",fontSize:10,letterSpacing:"0.14em",color:reason?"rgba(220,210,190,0.8)":"rgba(220,210,190,0.25)",background:reason?"rgba(220,210,190,0.06)":"transparent",border:`1px solid rgba(220,210,190,${reason?0.2:0.08})`,cursor:reason?"pointer":"not-allowed",textTransform:"uppercase",transition:"all 0.2s" }}>
              submit report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DISCOVER TAB ────────────────────────────────────────────────────────────

function DiscoverTab({ onEnterRoom, onBlockReport }) {
  const [activeSong, setActive]  = useState("s2");
  const [playing,    setPlaying] = useState(false);
  const [liked,      setLiked]   = useState([]);
  const song = SONGS.find(s => s.id === activeSong);

  return (
    <div>
      <div style={{ marginBottom:20,border:"1px solid rgba(220,210,190,0.1)",background:"rgba(14,11,8,0.6)",overflow:"hidden" }}>
        <div style={{ height:1.5,background:"linear-gradient(90deg,transparent,rgba(220,210,190,0.25),transparent)" }}/>
        <div style={{ padding:"14px 16px" }}>
          <div style={{ fontFamily:"'Karla',sans-serif",fontSize:7.5,letterSpacing:"0.2em",color:"rgba(220,210,190,0.25)",marginBottom:10,textTransform:"uppercase" }}>Now Playing · Your Soundtrack</div>
          <div style={{ display:"flex",gap:14,alignItems:"center" }}>
            <AlbumDisc songId={activeSong} size={64} spinning={playing}/>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:20,fontWeight:700,color:"#ddd0b8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginBottom:2 }}>{song?.title}</div>
              <div style={{ fontFamily:"'Karla',sans-serif",fontSize:10,color:"rgba(220,210,190,0.35)",letterSpacing:"0.06em",marginBottom:8 }}>{song?.artist}</div>
              <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                <button onClick={()=>setPlaying(p=>!p)} style={{ width:26,height:26,border:"1px solid rgba(220,210,190,0.25)",background:"transparent",color:"rgba(220,210,190,0.6)",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>{playing?"⏸":"▶"}</button>
                <Wave active={playing} bars={18}/>
              </div>
            </div>
          </div>
          <Rule op={0.07} my={10}/>
          <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
            {MY_PROFILE.songIds.map(id => {
              const s = SONGS.find(x => x.id === id);
              return s ? (
                <button key={id} onClick={()=>setActive(id)} style={{ display:"flex",alignItems:"center",gap:7,background:activeSong===id?"rgba(220,210,190,0.06)":"transparent",border:`1px solid rgba(220,210,190,${activeSong===id?0.2:0.08})`,padding:"4px 9px",cursor:"pointer",transition:"all 0.2s" }}>
                  <AlbumDisc songId={id} size={22}/>
                  <span style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:11,color:activeSong===id?"#ddd0b8":"rgba(220,210,190,0.45)" }}>{s.title.length>14?s.title.slice(0,13)+"…":s.title}</span>
                </button>
              ) : null;
            })}
          </div>
        </div>
      </div>

      <DottedRule label="Resonating with You"/>
      {USERS.slice(0,4).map((u,i) => {
        const shared = u.songIds.filter(id => MY_PROFILE.songIds.includes(id));
        const depth  = shared.length>=5?"a deep echo":shared.length>=3?"a resonance":"a thread";
        const isL    = liked.includes(u.id);
        return (
          <div key={u.id} style={{ marginBottom:10,border:"1px solid rgba(220,210,190,0.08)",background:"rgba(14,11,8,0.4)",overflow:"hidden" }}>
            <div style={{ padding:"12px 14px" }}>
              <div style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:8 }}>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:400,color:"rgba(220,210,190,0.18)",width:20,flexShrink:0,paddingTop:2 }}>{["I","II","III","IV"][i]}</div>
                <Avatar user={u} size={38}/>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:2,flexWrap:"wrap" }}>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:"#ddd0b8" }}>{u.name}</div>
                    <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,color:"rgba(220,210,190,0.28)" }}>@{u.handle}</div>
                    {!u.statusHidden && <div style={{ width:6,height:6,borderRadius:"50%",background:u.status==="online"?"#6ee7b7":"rgba(220,210,190,0.25)",boxShadow:u.status==="online"?"0 0 6px #6ee7b766":undefined }}/>}
                    <div style={{ marginLeft:"auto",fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:11,color:"rgba(220,210,190,0.45)" }}>{depth}</div>
                  </div>
                  <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13,color:"rgba(220,210,190,0.5)",lineHeight:1.6,marginBottom:6,paddingLeft:10,borderLeft:"1px solid rgba(220,210,190,0.15)" }}>"{u.bio}"</div>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <Wave active={i===0} bars={10}/>
                    <div style={{ display:"flex",gap:7 }}>
                      <button onClick={()=>setLiked(l=>isL?l.filter(x=>x!==u.id):[...l,u.id])} style={{ background:"none",border:"none",cursor:"pointer",fontSize:15,color:isL?"#fca5a5":"rgba(220,210,190,0.2)",transition:"color 0.2s" }}>{isL?"❤️":"🤍"}</button>
                      <button onClick={()=>onBlockReport(u)} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(220,210,190,0.22)",fontSize:13,padding:4 }}>···</button>
                      <button onClick={()=>onEnterRoom(u)} style={{ fontFamily:"'Karla',sans-serif",fontSize:8,color:"rgba(220,210,190,0.5)",background:"transparent",border:"1px solid rgba(220,210,190,0.15)",padding:"3px 8px",cursor:"pointer" }}>room →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div style={{ margin:"24px 0",padding:"16px 18px",borderTop:"2px solid rgba(220,210,190,0.1)",borderBottom:"2px solid rgba(220,210,190,0.1)" }}>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontStyle:"italic",fontWeight:700,color:"rgba(220,210,190,0.38)",lineHeight:1.5,textAlign:"center" }}>
          "every song you've loved is a fingerprint of who you were when you heard it"
        </div>
        <div style={{ textAlign:"center",marginTop:8,fontFamily:"'Karla',sans-serif",fontSize:7.5,letterSpacing:"0.2em",color:"rgba(220,210,190,0.18)" }}>— ichōs manifesto</div>
      </div>
    </div>
  );
}

// ─── VERSES TAB ───────────────────────────────────────────────────────────────

function VersesTab({ onEnterRoom }) {
  const [myVerses,    setMyVerses]  = useState(MY_PROFILE.verseIds);
  const [selected,    setSelected]  = useState(null);
  const [adding,      setAdding]    = useState(false);

  const getMatches = id => USERS.filter(u => u.verseIds.includes(id));

  return (
    <div>
      <div style={{ marginBottom:18,padding:"14px 16px",border:"1px solid rgba(220,210,190,0.1)",background:"rgba(14,11,8,0.5)" }}>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#ddd0b8",marginBottom:4 }}>Verse Matching</div>
        <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13,color:"rgba(220,210,190,0.5)",lineHeight:1.65 }}>Pin the exact line that stopped you. Find others who were stopped by the same words.</div>
      </div>
      <DottedRule label="Your Pinned Verses"/>
      {myVerses.map(id => {
        const v    = VERSES.find(x => x.id === id);
        if (!v) return null;
        const song    = SONGS.find(s => s.id === v.songId);
        const matches = getMatches(id);
        const isSel   = selected === id;
        return (
          <div key={id} onClick={()=>setSelected(isSel?null:id)} style={{ marginBottom:8,border:`1px solid rgba(220,210,190,${isSel?0.2:0.08})`,background:isSel?"rgba(220,210,190,0.04)":"rgba(14,11,8,0.4)",cursor:"pointer",overflow:"hidden" }}>
            {isSel && <div style={{ height:1.5,background:"linear-gradient(90deg,transparent,rgba(220,210,190,0.3),transparent)" }}/>}
            <div style={{ padding:"12px 14px" }}>
              <div style={{ display:"flex",gap:10,marginBottom:6 }}>
                <AlbumDisc songId={v.songId} size={36}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,color:"rgba(220,210,190,0.3)",marginBottom:2 }}>{song?.title} · {song?.artist}</div>
                  <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:14,color:"rgba(220,210,190,0.85)",lineHeight:1.55 }}>"{v.text}"</div>
                </div>
              </div>
              <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:11,color:"rgba(220,210,190,0.35)",marginBottom:6,paddingLeft:46 }}>{v.context}</div>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",paddingLeft:46 }}>
                <div style={{ fontFamily:"'Karla',sans-serif",fontSize:9,color:matches.length?"rgba(220,210,190,0.5)":"rgba(220,210,190,0.2)" }}>{matches.length?`${matches.length} ${matches.length===1?"person":"people"} pinned this`:"no matches yet"}</div>
                <div style={{ fontFamily:"'Karla',sans-serif",fontSize:9,color:"rgba(220,210,190,0.3)" }}>{isSel?"▲ hide":"▼ who"}</div>
              </div>
            </div>
            {isSel && matches.length > 0 && (
              <div style={{ borderTop:"1px solid rgba(220,210,190,0.08)",background:"rgba(220,210,190,0.02)" }}>
                {matches.map(u => (
                  <div key={u.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderBottom:"1px solid rgba(220,210,190,0.05)" }}>
                    <Avatar user={u} size={30}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:700,color:"#ddd0b8" }}>{u.name}</div>
                      <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:11,color:"rgba(220,210,190,0.4)" }}>{u.bio}</div>
                    </div>
                    <button onClick={e=>{e.stopPropagation();onEnterRoom(u);}} style={{ fontFamily:"'Karla',sans-serif",fontSize:8,color:"rgba(220,210,190,0.5)",background:"transparent",border:"1px solid rgba(220,210,190,0.15)",padding:"4px 9px",cursor:"pointer" }}>room →</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <button onClick={()=>setAdding(a=>!a)} style={{ width:"100%",fontFamily:"'Karla',sans-serif",fontSize:9.5,letterSpacing:"0.12em",color:"rgba(220,210,190,0.5)",background:"transparent",border:"1px dashed rgba(220,210,190,0.15)",padding:"10px",cursor:"pointer",marginBottom:14,textTransform:"uppercase" }}>
        {adding?"▲ cancel":"+ pin a verse"}
      </button>
      {adding && (
        <div style={{ border:"1px solid rgba(220,210,190,0.12)",background:"rgba(14,11,8,0.6)",marginBottom:16 }}>
          {VERSES.filter(v => !myVerses.includes(v.id)).map(v => {
            const song = SONGS.find(s => s.id === v.songId);
            return (
              <div key={v.id} onClick={()=>{setMyVerses(m=>[...m,v.id]);setAdding(false);}} style={{ display:"flex",gap:10,padding:"10px 14px",borderBottom:"1px solid rgba(220,210,190,0.05)",cursor:"pointer" }}>
                <AlbumDisc songId={v.songId} size={32}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,color:"rgba(220,210,190,0.28)",marginBottom:2 }}>{song?.title} · {song?.artist}</div>
                  <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:12.5,color:"rgba(220,210,190,0.7)",lineHeight:1.5 }}>"{v.text}"</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── BOOTH TAB ────────────────────────────────────────────────────────────────

function BoothTab() {
  const [idx,      setIdx]    = useState(0);
  const [prog,     setProg]   = useState(0);
  const [playing,  setPlay]   = useState(true);
  const [msgs,     setMsgs]   = useState([{from:"Ivory",text:"welcome to my booth",time:"now"}]);
  const [input,    setInput]  = useState("");
  const [panel,    setPanel]  = useState("chat");
  const [reactions,setReacts] = useState([]);
  const currentSong = SONGS.find(s => s.id === BOOTH_QUEUE[idx]);
  const art = ALBUM_ART[BOOTH_QUEUE[idx]] || ALBUM_ART.s1;

  useEffect(()=>{
    if(!playing)return;
    const t=setInterval(()=>{ setProg(p=>{ if(p>=1){setIdx(i=>(i+1)%BOOTH_QUEUE.length);return 0;} return p+(1/(currentSong?.duration||240)/10); }); },100);
    return()=>clearInterval(t);
  },[playing,currentSong]);

  const react=e=>{ const id=Date.now(); setReacts(r=>[...r,{id,e,x:10+Math.random()*80}]); setTimeout(()=>setReacts(r=>r.filter(x=>x.id!==id)),2200); };
  const send=()=>{ if(!input.trim())return; setMsgs(m=>[...m,{from:"You",text:input,time:"now"}]); setInput(""); };

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      <div style={{ position:"relative",zIndex:0,background:`radial-gradient(ellipse at 50% 30%,${art.label}12,transparent 60%)`,marginBottom:0 }}/>
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:50,overflow:"hidden" }}>
        {reactions.map(r=><div key={r.id} style={{ position:"absolute",bottom:280,left:`${r.x}%`,fontSize:24,animation:"floatUp 2.2s ease forwards" }}>{r.e}</div>)}
      </div>
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 0 10px",flexShrink:0 }}>
        <div style={{ marginBottom:12 }}><AlbumDisc songId={BOOTH_QUEUE[idx]} size={120} spinning={playing}/></div>
        <div style={{ textAlign:"center",marginBottom:8 }}>
          <div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:19,fontWeight:700,color:"#ddd0b8",marginBottom:2 }}>{currentSong?.title}</div>
          <div style={{ fontFamily:"'Karla',sans-serif",fontSize:11,color:"rgba(220,210,190,0.38)",letterSpacing:"0.08em" }}>{currentSong?.artist}</div>
        </div>
        <div style={{ width:"100%",maxWidth:260,marginBottom:8,padding:"0 20px" }}>
          <div style={{ height:1.5,background:"rgba(220,210,190,0.1)",borderRadius:1,marginBottom:3,cursor:"pointer" }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProg((e.clientX-r.left)/r.width);}}>
            <div style={{ height:"100%",width:`${prog*100}%`,background:"rgba(220,210,190,0.45)",borderRadius:1,transition:"width 0.1s linear" }}/>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",fontFamily:"'Karla',sans-serif",fontSize:8,color:"rgba(220,210,190,0.22)" }}>
            <span>{fmtT(Math.floor(prog*(currentSong?.duration||240)))}</span>
            <span>{fmtT(currentSong?.duration||240)}</span>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:8 }}>
          <button onClick={()=>{setIdx(i=>Math.max(0,i-1));setProg(0);}} style={{ background:"none",border:"none",color:"rgba(220,210,190,0.4)",fontSize:18,cursor:"pointer" }}>⏮</button>
          <button onClick={()=>setPlay(p=>!p)} style={{ width:40,height:40,borderRadius:"50%",border:"1.5px solid rgba(220,210,190,0.28)",background:"transparent",color:"rgba(220,210,190,0.7)",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>{playing?"⏸":"▶"}</button>
          <button onClick={()=>{setIdx(i=>(i+1)%BOOTH_QUEUE.length);setProg(0);}} style={{ background:"none",border:"none",color:"rgba(220,210,190,0.4)",fontSize:18,cursor:"pointer" }}>⏭</button>
        </div>
        <div style={{ display:"flex",gap:5 }}>
          {["❤️","🥲","✨","🔥","💭","🎵","🌊","🫧"].map(e=>(
            <button key={e} onClick={()=>react(e)} style={{ background:"rgba(220,210,190,0.04)",border:"1px solid rgba(220,210,190,0.09)",borderRadius:3,padding:"4px 5px",fontSize:13,cursor:"pointer" }}>{e}</button>
          ))}
        </div>
      </div>
      <div style={{ flex:1,display:"flex",flexDirection:"column",borderTop:"1px solid rgba(220,210,190,0.08)",minHeight:0 }}>
        <div style={{ display:"flex",flexShrink:0,borderBottom:"1px solid rgba(220,210,190,0.08)" }}>
          {[["chat","chat"],["queue","queue"]].map(([k,l])=>(
            <button key={k} onClick={()=>setPanel(k)} style={{ flex:1,fontFamily:"'Karla',sans-serif",fontSize:8.5,letterSpacing:"0.1em",color:panel===k?"#ddd0b8":"rgba(220,210,190,0.3)",background:"none",border:"none",borderRight:k==="chat"?"1px solid rgba(220,210,190,0.08)":"none",cursor:"pointer",padding:"8px 4px",textTransform:"uppercase",position:"relative" }}>
              {l}{panel===k&&<div style={{ position:"absolute",bottom:0,left:"20%",right:"20%",height:1,background:"rgba(220,210,190,0.35)" }}/>}
            </button>
          ))}
        </div>
        {panel==="chat"&&(
          <div style={{ flex:1,display:"flex",flexDirection:"column",minHeight:0 }}>
            <div style={{ flex:1,overflowY:"auto",padding:"8px 16px",display:"flex",flexDirection:"column",gap:6 }}>
              {msgs.map((m,i)=>(
                <div key={i} style={{ display:"flex",gap:6 }}>
                  <span style={{ fontFamily:"'Playfair Display',serif",fontSize:11,fontWeight:700,color:"rgba(220,210,190,0.45)",flexShrink:0 }}>{m.from}</span>
                  <span style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:12.5,color:"rgba(220,210,190,0.6)",lineHeight:1.45 }}>{m.text}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:7,padding:"6px 16px 14px",borderTop:"1px solid rgba(220,210,190,0.06)",flexShrink:0 }}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="say something…"
                style={{ flex:1,background:"transparent",border:"1px solid rgba(220,210,190,0.1)",padding:"7px 12px",color:"#ddd0b8",fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13,outline:"none" }}/>
              <button onClick={send} style={{ width:34,height:34,background:"rgba(220,210,190,0.05)",border:"1px solid rgba(220,210,190,0.16)",color:"rgba(220,210,190,0.5)",fontSize:14,cursor:"pointer",flexShrink:0 }}>↑</button>
            </div>
          </div>
        )}
        {panel==="queue"&&(
          <div style={{ flex:1,overflowY:"auto",padding:"10px 16px" }}>
            {BOOTH_QUEUE.map((id,i)=>{
              const s=SONGS.find(x=>x.id===id);
              const isCur=i===idx;
              return (
                <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(220,210,190,0.05)",opacity:isCur?1:0.5 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:200,color:"rgba(220,210,190,0.2)",width:18,textAlign:"center",flexShrink:0 }}>{isCur?"▶":i+1}</div>
                  <AlbumDisc songId={id} size={36} spinning={isCur&&playing}/>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:13,fontWeight:700,color:isCur?"#ddd0b8":"rgba(221,208,184,0.6)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{s?.title}</div>
                    <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,color:"rgba(220,210,190,0.28)" }}>{s?.artist}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── JOURNAL TAB ─────────────────────────────────────────────────────────────

function JournalTab() {
  const [entries,   setEntries]  = useState(JOURNAL_DATA);
  const [composing, setCompose]  = useState(false);
  const [newSong,   setNewSong]  = useState("s2");
  const [newMood,   setNewMood]  = useState("nocturnal");
  const [newEntry,  setNewEntry] = useState("");
  const [isPublic,  setPublic]   = useState(false);
  const moodColor = id => MOODS.find(m=>m.id===id)?.color||"rgba(220,210,190,0.4)";

  const save=()=>{
    if(!newEntry.trim())return;
    setEntries(p=>[{id:`j${Date.now()}`,songId:newSong,date:"Just now",mood:newMood,entry:newEntry,voiceNote:null,public:isPublic,likes:0},...p]);
    setNewEntry(""); setCompose(false);
  };

  return (
    <div>
      <div style={{ marginBottom:18,padding:"14px 16px",border:"1px solid rgba(220,210,190,0.1)",background:"rgba(14,11,8,0.5)" }}>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#ddd0b8",marginBottom:4 }}>Listening Journal</div>
        <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13,color:"rgba(220,210,190,0.5)",lineHeight:1.65 }}>A private record of what you heard and what it meant. Each entry is tied to a song.</div>
      </div>
      {!composing&&<button onClick={()=>setCompose(true)} style={{ width:"100%",fontFamily:"'Karla',sans-serif",fontSize:9.5,letterSpacing:"0.12em",color:"rgba(220,210,190,0.5)",background:"transparent",border:"1px dashed rgba(220,210,190,0.15)",padding:"11px",cursor:"pointer",marginBottom:16,textTransform:"uppercase" }}>+ write a new entry</button>}
      {composing&&(
        <div style={{ marginBottom:16,border:"1px solid rgba(220,210,190,0.15)",background:"rgba(14,11,8,0.6)",overflow:"hidden" }}>
          <div style={{ height:1.5,background:"linear-gradient(90deg,transparent,rgba(220,210,190,0.25),transparent)" }}/>
          <div style={{ padding:"14px 16px" }}>
            <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,letterSpacing:"0.16em",color:"rgba(220,210,190,0.28)",textTransform:"uppercase",marginBottom:8 }}>Song</div>
            <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:10,marginBottom:12 }}>
              {SONGS.map(s=>(
                <button key={s.id} onClick={()=>setNewSong(s.id)} style={{ flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"transparent",border:"none",cursor:"pointer",opacity:newSong===s.id?1:0.4,transition:"opacity 0.2s" }}>
                  <AlbumDisc songId={s.id} size={38} spinning={newSong===s.id}/>
                  <div style={{ fontFamily:"'Karla',sans-serif",fontSize:7.5,color:"rgba(220,210,190,0.5)",maxWidth:40,textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{s.title.length>8?s.title.slice(0,7)+"…":s.title}</div>
                </button>
              ))}
            </div>
            <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,letterSpacing:"0.16em",color:"rgba(220,210,190,0.28)",textTransform:"uppercase",marginBottom:8 }}>Mood</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:12 }}>
              {MOODS.map(m=>(
                <button key={m.id} onClick={()=>setNewMood(m.id)} style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:11.5,color:newMood===m.id?m.color:"rgba(220,210,190,0.4)",background:newMood===m.id?`${m.color}12`:"transparent",border:`1px solid ${newMood===m.id?m.color+"50":"rgba(220,210,190,0.1)"}`,padding:"4px 11px",cursor:"pointer",transition:"all 0.2s" }}>{m.label}</button>
              ))}
            </div>
            <textarea value={newEntry} onChange={e=>setNewEntry(e.target.value)} placeholder="What were you thinking when this song played…" rows={4}
              style={{ width:"100%",background:"rgba(220,210,190,0.03)",border:"1px solid rgba(220,210,190,0.1)",padding:"10px 12px",color:"#ddd0b8",fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:14,lineHeight:1.65,resize:"none",outline:"none",marginBottom:12 }}/>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
              <span style={{ fontFamily:"'Karla',sans-serif",fontSize:9,color:"rgba(220,210,190,0.35)",letterSpacing:"0.08em" }}>public</span>
              <button onClick={()=>setPublic(p=>!p)} style={{ width:36,height:20,borderRadius:10,border:"none",cursor:"pointer",background:isPublic?"rgba(110,231,183,0.3)":"rgba(220,210,190,0.1)",position:"relative",transition:"background 0.25s",flexShrink:0 }}>
                <div style={{ width:14,height:14,borderRadius:"50%",background:isPublic?"#6ee7b7":"rgba(220,210,190,0.4)",position:"absolute",top:3,left:isPublic?19:3,transition:"left 0.25s, background 0.25s" }}/>
              </button>
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={save} style={{ flex:1,padding:"11px",fontFamily:"'Karla',sans-serif",fontSize:9.5,letterSpacing:"0.12em",color:"rgba(220,210,190,0.8)",background:"rgba(220,210,190,0.06)",border:"1px solid rgba(220,210,190,0.2)",cursor:"pointer",textTransform:"uppercase" }}>save entry</button>
              <button onClick={()=>setCompose(false)} style={{ padding:"11px 16px",fontFamily:"'Karla',sans-serif",fontSize:9.5,color:"rgba(220,210,190,0.3)",background:"transparent",border:"1px solid rgba(220,210,190,0.1)",cursor:"pointer" }}>cancel</button>
            </div>
          </div>
        </div>
      )}
      {entries.map(e=>{
        const song=SONGS.find(s=>s.id===e.songId);
        const mc=moodColor(e.mood);
        return (
          <div key={e.id} style={{ marginBottom:12,border:"1px solid rgba(220,210,190,0.08)",background:"rgba(14,11,8,0.4)",overflow:"hidden" }}>
            <div style={{ height:1,background:`linear-gradient(90deg,transparent,${mc}40,transparent)` }}/>
            <div style={{ padding:"13px 14px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                <AlbumDisc songId={e.songId} size={40}/>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:13,fontWeight:700,color:"rgba(221,208,184,0.85)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{song?.title}</div>
                  <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,color:"rgba(220,210,190,0.3)" }}>{song?.artist}</div>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:10,color:mc }}>{e.mood}</div>
                  <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8,color:"rgba(220,210,190,0.22)" }}>{e.date}</div>
                </div>
              </div>
              {e.voiceNote&&(
                <div style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"rgba(220,210,190,0.03)",border:"1px solid rgba(220,210,190,0.08)",marginBottom:8 }}>
                  <span style={{ fontSize:14 }}>🎙</span>
                  <Wave active={false} bars={10} color="rgba(220,210,190,0.3)"/>
                  <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,color:"rgba(220,210,190,0.3)" }}>{e.voiceNote}</div>
                </div>
              )}
              <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13.5,color:"rgba(220,210,190,0.72)",lineHeight:1.7 }}>{e.entry}</div>
              <div style={{ marginTop:8,fontFamily:"'Karla',sans-serif",fontSize:9,color:"rgba(220,210,190,0.25)",display:"flex",alignItems:"center",gap:4 }}>
                {e.public?<><span style={{ fontSize:12 }}>❤️</span>{e.likes}</>:<><span style={{ fontSize:11 }}>🔒</span>private</>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── ALERTS TAB ───────────────────────────────────────────────────────────────

function AlertsTab({ alerts, onMarkRead, onMarkAllRead }) {
  const AMETA = { verse_match:{icon:"📜",color:"#c4b5fd",label:"Verse"}, booth_visit:{icon:"🎙",color:"#6ee7b7",label:"Booth"}, new_echo:{icon:"✨",color:"#93c5fd",label:"Echo"}, badge_earned:{icon:"🏅",color:"#fcd34d",label:"Badge"}, story_song:{icon:"🎵",color:"#fdba74",label:"Song"} };
  const unread = alerts.filter(a=>!a.read).length;
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#ddd0b8" }}>Resonance Alerts</div>
          {unread>0&&<div style={{ fontFamily:"'Karla',sans-serif",fontSize:9,color:"rgba(220,210,190,0.4)",marginTop:2 }}>{unread} unread</div>}
        </div>
        {unread>0&&<button onClick={onMarkAllRead} style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,letterSpacing:"0.1em",color:"rgba(220,210,190,0.4)",background:"transparent",border:"1px solid rgba(220,210,190,0.12)",padding:"5px 11px",cursor:"pointer",textTransform:"uppercase" }}>mark all read</button>}
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
        {alerts.map(a=>{
          const meta=AMETA[a.type]||AMETA.story_song;
          const user=USERS.find(u=>u.id===a.userId);
          const song=SONGS.find(s=>s.id===a.songId);
          const badge=BADGES.find(b=>b.id===a.badgeId);
          return (
            <div key={a.id} onClick={()=>onMarkRead(a.id)} style={{ display:"flex",gap:12,padding:"12px 14px",border:`1px solid rgba(220,210,190,${a.read?0.06:0.14})`,background:a.read?"rgba(14,11,8,0.3)":"rgba(14,11,8,0.6)",cursor:"pointer",position:"relative",overflow:"hidden" }}>
              {!a.read&&<div style={{ position:"absolute",left:0,top:0,bottom:0,width:2,background:`linear-gradient(180deg,${meta.color},transparent)` }}/>}
              <div style={{ width:38,height:38,borderRadius:"50%",background:`${meta.color}12`,border:`1px solid ${meta.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{meta.icon}</div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13.5,color:a.read?"rgba(220,210,190,0.55)":"rgba(220,210,190,0.88)",lineHeight:1.5,marginBottom:4 }}>{a.message}</div>
                {a.verseSnippet&&<div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:11.5,color:`${meta.color}80`,paddingLeft:8,borderLeft:`1px solid ${meta.color}30`,marginBottom:4 }}>"{a.verseSnippet}"</div>}
                {song&&<div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}><AlbumDisc songId={song.id} size={18}/><span style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,color:"rgba(220,210,190,0.3)" }}>{song.title}</span></div>}
                {badge&&<div style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"2px 8px",background:RARITY[badge.rarity]?.bg,border:`1px solid ${RARITY[badge.rarity]?.border}`,marginBottom:4 }}><span style={{ fontSize:12 }}>{badge.icon}</span><span style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,color:RARITY[badge.rarity]?.color }}>{badge.name}</span></div>}
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  {user&&<Avatar user={user} size={16}/>}
                  <span style={{ fontFamily:"'Karla',sans-serif",fontSize:8,color:"rgba(220,210,190,0.22)" }}>{a.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PROFILE TAB ─────────────────────────────────────────────────────────────

function ProfileTab({ blockedUsers, onUnblock, onOpenSettings }) {
  return (
    <div>
      <div style={{ textAlign:"center",marginBottom:24,paddingBottom:20,borderBottom:"1px solid rgba(220,210,190,0.1)" }}>
        <div style={{ width:72,height:72,border:"1.5px solid rgba(220,210,190,0.2)",margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(220,210,190,0.02)",position:"relative" }}>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:900,color:"rgba(220,210,190,0.4)" }}>I</div>
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h])=>(
            <div key={v+h} style={{ position:"absolute",[v]:-5,[h]:-5,width:7,height:7,borderTop:v==="top"?"1px solid rgba(220,210,190,0.2)":"none",borderBottom:v==="bottom"?"1px solid rgba(220,210,190,0.2)":"none",borderLeft:h==="left"?"1px solid rgba(220,210,190,0.2)":"none",borderRight:h==="right"?"1px solid rgba(220,210,190,0.2)":"none" }}/>
          ))}
        </div>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:"#ddd0b8",letterSpacing:"0.02em",marginBottom:4 }}>Ivory</div>
        <div style={{ fontFamily:"'Karla',sans-serif",fontSize:9,color:"rgba(220,210,190,0.28)",letterSpacing:"0.12em",marginBottom:8 }}>@ivory · ichōs</div>
        <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:14,color:"rgba(220,210,190,0.42)",marginBottom:16,lineHeight:1.55 }}>"Every song is a room I've lived in"</div>
        <div style={{ display:"flex",justifyContent:"center",borderTop:"1px solid rgba(220,210,190,0.08)",borderBottom:"1px solid rgba(220,210,190,0.08)",padding:"8px 0",marginBottom:16 }}>
          {[{n:MY_PROFILE.songIds.length,l:"songs"},{n:3,l:"verses"},{n:6,l:"earned"},{n:2,l:"booths"}].map(({n,l},i,arr)=>(
            <div key={l} style={{ textAlign:"center",padding:"0 12px",borderRight:i<arr.length-1?"1px solid rgba(220,210,190,0.08)":"none" }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"rgba(220,210,190,0.5)",lineHeight:1 }}>{n}</div>
              <div style={{ fontFamily:"'Karla',sans-serif",fontSize:7.5,color:"rgba(220,210,190,0.25)",letterSpacing:"0.1em",marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={onOpenSettings} style={{ fontFamily:"'Karla',sans-serif",fontSize:9,letterSpacing:"0.12em",color:"rgba(220,210,190,0.45)",background:"transparent",border:"1px solid rgba(220,210,190,0.15)",padding:"8px 20px",cursor:"pointer",textTransform:"uppercase" }}>⚙ privacy & settings</button>
      </div>
      <DottedRule label="Story Songs"/>
      {MY_PROFILE.songIds.map(id=>{
        const s=SONGS.find(x=>x.id===id);
        return s?(
          <div key={id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(220,210,190,0.06)" }}>
            <AlbumDisc songId={id} size={42}/>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:14,fontWeight:700,color:"rgba(221,208,184,0.8)" }}>{s.title}</div>
              <div style={{ fontFamily:"'Karla',sans-serif",fontSize:9,color:"rgba(220,210,190,0.3)",letterSpacing:"0.06em" }}>{s.artist}</div>
            </div>
            <Wave active={false} bars={7}/>
          </div>
        ):null;
      })}
      <DottedRule label="Badges"/>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20 }}>
        {BADGES.filter(b=>b.earned).map(b=>{
          const r=RARITY[b.rarity];
          return (
            <div key={b.id} style={{ padding:"12px 8px",border:`1px solid ${r.border}`,background:r.bg,display:"flex",flexDirection:"column",alignItems:"center",gap:5 }}>
              <div style={{ fontSize:26 }}>{b.icon}</div>
              <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,color:r.color,textAlign:"center",lineHeight:1.3 }}>{b.name}</div>
            </div>
          );
        })}
      </div>
      {blockedUsers.length>0&&(
        <>
          <DottedRule label="Blocked Users"/>
          {blockedUsers.map(u=>(
            <div key={u.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid rgba(220,210,190,0.06)" }}>
              <Avatar user={{...u,status:"offline",statusHidden:true}} size={34} showStatus={false}/>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:"rgba(220,210,190,0.55)" }}>{u.name}</div>
                <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,color:"rgba(220,210,190,0.25)" }}>@{u.handle} · blocked</div>
              </div>
              <button onClick={()=>onUnblock(u.id)} style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,color:"rgba(220,210,190,0.4)",background:"transparent",border:"1px solid rgba(220,210,190,0.15)",padding:"5px 11px",cursor:"pointer" }}>unblock</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── SETTINGS SHEET ───────────────────────────────────────────────────────────

function SettingsSheet({ onClose }) {
  const [statusHidden, setStatusHidden] = useState(false);
  const [boothHidden,  setBoothHidden]  = useState(false);
  const [matchingOn,   setMatchingOn]   = useState(true);
  const [versesPublic, setVersesPublic] = useState(true);
  const [saved,        setSaved]        = useState(false);
  const save=()=>{ setSaved(true); setTimeout(()=>setSaved(false),1800); };

  const Toggle=({value,onChange})=>(
    <button onClick={()=>onChange(!value)} style={{ width:40,height:22,borderRadius:11,border:"none",cursor:"pointer",background:value?"rgba(110,231,183,0.3)":"rgba(220,210,190,0.1)",position:"relative",transition:"background 0.25s",flexShrink:0 }}>
      <div style={{ width:16,height:16,borderRadius:"50%",background:value?"#6ee7b7":"rgba(220,210,190,0.4)",position:"absolute",top:3,left:value?21:3,transition:"left 0.25s, background 0.25s" }}/>
    </button>
  );

  return (
    <div style={{ position:"fixed",inset:0,zIndex:600,background:"rgba(3,2,1,0.97)",backdropFilter:"blur(20px)",display:"flex",alignItems:"flex-end",animation:"slideUp 0.3s cubic-bezier(.16,1,.3,1)" }}>
      <div style={{ width:"100%",maxWidth:420,margin:"0 auto",background:"#0a0806",borderRadius:"6px 6px 0 0",border:"1px solid rgba(220,210,190,0.1)",borderBottom:"none",maxHeight:"88vh",display:"flex",flexDirection:"column",overflow:"hidden",backgroundImage:PAPER,backgroundSize:"500px" }}>
        <ThickRule op={0.15}/>
        <div style={{ padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(220,210,190,0.08)",flexShrink:0 }}>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#ddd0b8" }}>Privacy & Settings</div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(220,210,190,0.35)",fontSize:18 }}>✕</button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"18px" }}>
          {[
            [{label:"Hide online status",desc:"Others won't see you're online",value:statusHidden,onChange:setStatusHidden},{label:"Hide booth activity",desc:"Enter booths anonymously",value:boothHidden,onChange:setBoothHidden}],
            [{label:"Appear in echo matching",desc:"Surface in others' Echoes tab",value:matchingOn,onChange:setMatchingOn},{label:"Show verses publicly",desc:"Verses visible on your profile",value:versesPublic,onChange:setVersesPublic}]
          ].map((group,gi)=>(
            <div key={gi} style={{ marginBottom:20 }}>
              {group.map(({label,desc,value,onChange})=>(
                <div key={label} style={{ display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:"1px solid rgba(220,210,190,0.07)" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:"#ddd0b8",marginBottom:2 }}>{label}</div>
                    <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:12,color:"rgba(220,210,190,0.45)",lineHeight:1.5 }}>{desc}</div>
                  </div>
                  <Toggle value={value} onChange={onChange}/>
                </div>
              ))}
            </div>
          ))}
          {/* Safety */}
          <div style={{ marginTop:4,padding:"14px 16px",border:"1px solid rgba(220,210,190,0.08)",background:"rgba(14,11,8,0.5)",marginBottom:16 }}>
            <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,letterSpacing:"0.16em",color:"rgba(220,210,190,0.28)",textTransform:"uppercase",marginBottom:8 }}>Need support?</div>
            {[{n:"Crisis Text Line",c:"Text HOME to 741741"},{n:"988 Lifeline",c:"Call or text 988"},{n:"Samaritans",c:"116 123 (UK & Ireland)"}].map(r=>(
              <div key={r.n} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(220,210,190,0.05)" }}>
                <div style={{ fontFamily:"'Karla',sans-serif",fontSize:10,color:"rgba(220,210,190,0.55)" }}>{r.n}</div>
                <div style={{ fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:11,color:"rgba(220,210,190,0.4)" }}>{r.c}</div>
              </div>
            ))}
          </div>
          <button onClick={save} style={{ width:"100%",padding:"12px",fontFamily:"'Karla',sans-serif",fontSize:10,letterSpacing:"0.14em",color:saved?"#6ee7b7":"rgba(220,210,190,0.6)",background:saved?"rgba(110,231,183,0.08)":"rgba(220,210,190,0.05)",border:`1px solid rgba(220,210,190,${saved?0:0.18})`,cursor:"pointer",transition:"all 0.3s",textTransform:"uppercase" }}>
            {saved?"✓ settings saved":"save settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ECHO ROOM ────────────────────────────────────────────────────────────────

function EchoRoom({ match, onClose }) {
  const songId = match?.songIds?.[0] || "s2";
  const song   = SONGS.find(s => s.id === songId) || SONGS[0];
  const [msgs,  setMsgs]  = useState([{from:match.name,text:"You heard it too.",time:"now"},{from:"You",text:"I've been waiting to say that.",time:"now"}]);
  const [input, setInput] = useState("");
  const [play,  setPlay]  = useState(true);
  const [prog,  setProg]  = useState(0.18);
  useEffect(()=>{ if(!play)return; const t=setInterval(()=>setProg(p=>p>=1?0:p+0.001),300); return()=>clearInterval(t); },[play]);
  const send=()=>{ if(!input.trim())return; setMsgs(m=>[...m,{from:"You",text:input,time:"now"}]); setInput(""); };
  return (
    <div style={{ position:"fixed",inset:0,zIndex:500,background:"rgba(5,3,2,0.97)",backdropFilter:"blur(20px)",display:"flex",alignItems:"flex-end",animation:"slideUp 0.35s cubic-bezier(.16,1,.3,1)" }}>
      <div style={{ width:"100%",maxWidth:420,margin:"0 auto",background:"#0a0806",borderRadius:"6px 6px 0 0",border:"1px solid rgba(220,210,190,0.1)",borderBottom:"none",maxHeight:"88vh",display:"flex",flexDirection:"column",overflow:"hidden",backgroundImage:PAPER,backgroundSize:"500px" }}>
        <ThickRule op={0.12}/>
        <div style={{ padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(220,210,190,0.08)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:6,height:6,borderRadius:"50%",background:"rgba(220,210,190,0.6)",animation:"pulse 2s ease infinite" }}/>
            <span style={{ fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#ddd0b8" }}>Echo Room</span>
            <span style={{ fontFamily:"'Karla',sans-serif",fontSize:9,color:"rgba(220,210,190,0.3)" }}>with {match.name}</span>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(220,210,190,0.3)",fontSize:18 }}>✕</button>
        </div>
        <div style={{ padding:"14px 18px",display:"flex",alignItems:"center",gap:14,borderBottom:"1px solid rgba(220,210,190,0.07)" }}>
          <AlbumDisc songId={songId} size={58} spinning={play}/>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:17,fontWeight:700,color:"#ddd0b8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginBottom:2 }}>{song.title}</div>
            <div style={{ fontFamily:"'Karla',sans-serif",fontSize:9.5,color:"rgba(220,210,190,0.35)",marginBottom:6 }}>{song.artist}</div>
            <div style={{ height:1,background:"rgba(220,210,190,0.08)",cursor:"pointer",marginBottom:5 }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProg((e.clientX-r.left)/r.width);}}>
              <div style={{ height:"100%",width:`${prog*100}%`,background:"rgba(220,210,190,0.35)",transition:"width 0.3s linear" }}/>
            </div>
            <Wave active={play} bars={18}/>
          </div>
          <button onClick={()=>setPlay(p=>!p)} style={{ width:32,height:32,border:"1px solid rgba(220,210,190,0.25)",background:"transparent",color:"rgba(220,210,190,0.6)",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{play?"⏸":"▶"}</button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"12px 18px",display:"flex",flexDirection:"column",gap:8 }}>
          {msgs.map((m,i)=>(
            <div key={i} style={{ display:"flex",flexDirection:"column",maxWidth:"80%",alignSelf:m.from==="You"?"flex-end":"flex-start",alignItems:m.from==="You"?"flex-end":"flex-start" }}>
              <div style={{ background:m.from==="You"?"rgba(220,210,190,0.07)":"rgba(220,210,190,0.04)",border:`1px solid rgba(220,210,190,${m.from==="You"?0.12:0.07})`,padding:"7px 12px",fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13.5,lineHeight:1.55,color:"rgba(221,208,184,0.85)" }}>{m.text}</div>
              <div style={{ fontFamily:"'Karla',sans-serif",fontSize:8,color:"rgba(220,210,190,0.22)",marginTop:2,padding:"0 3px" }}>{m.from} · {m.time}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:7,padding:"8px 18px 18px",borderTop:"1px solid rgba(220,210,190,0.07)" }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="leave an echo…"
            style={{ flex:1,background:"transparent",border:"1px solid rgba(220,210,190,0.1)",padding:"8px 12px",color:"#ddd0b8",fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13.5,outline:"none" }}/>
          <button onClick={send} style={{ width:36,height:36,background:"rgba(220,210,190,0.05)",border:"1px solid rgba(220,210,190,0.16)",color:"rgba(220,210,190,0.55)",fontSize:15,cursor:"pointer",flexShrink:0 }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function IchosMain() {
  const [tab,          setTab]        = useState("discover");
  const [room,         setRoom]       = useState(null);
  const [blockReport,  setBlockReport]= useState(null);
  const [settingsOpen, setSettings]   = useState(false);
  const [blockedUsers, setBlocked]    = useState([]);
  const [alerts,       setAlerts]     = useState(ALERTS_DATA);

  const unread = alerts.filter(a => !a.read).length;

  const handleBlock   = id => { const u = USERS.find(x => x.id === id); if (u && !blockedUsers.find(x=>x.id===id)) setBlocked(b=>[...b,u]); };
  const handleUnblock = id => setBlocked(b => b.filter(x => x.id !== id));
  const markRead      = id => setAlerts(a => a.map(x => x.id===id ? {...x,read:true} : x));
  const markAllRead   = ()  => setAlerts(a => a.map(x => ({...x,read:true})));

  const TABS = [
    { k:"discover", label:"Discover"  },
    { k:"verses",   label:"Verses"    },
    { k:"booth",    label:"Booth"     },
    { k:"journal",  label:"Journal"   },
    { k:"alerts",   label:"Alerts", badge:unread },
    { k:"profile",  label:"Profile"   },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Karla:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#070604;color:#ddd0b8;-webkit-font-smoothing:antialiased;overflow:hidden;}
        input,textarea,button{font-family:inherit;}
        input::placeholder,textarea::placeholder{color:rgba(220,210,190,0.22);font-style:italic;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
        @keyframes onlinePulse{0%,100%{opacity:1;box-shadow:0 0 6px #6ee7b766}50%{opacity:.7;box-shadow:0 0 12px #6ee7b7aa}}
        @keyframes discSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
        @keyframes floatUp{from{transform:translateY(0) scale(1);opacity:1}to{transform:translateY(-80px) scale(1.2);opacity:0}}
        @keyframes wa{from{opacity:.2;transform:scaleY(.7)}to{opacity:.7;transform:scaleY(1)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(220,210,190,0.12);border-radius:2px;}
      `}</style>

      <div style={{ width:"100%", maxWidth:420, margin:"0 auto", height:"100dvh", position:"relative", overflow:"hidden", background:"#070604" }}>
        <div style={{ position:"fixed",inset:0,backgroundImage:PAPER,backgroundSize:"500px",pointerEvents:"none",zIndex:0 }}/>
        <div style={{ position:"fixed",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(180,140,60,0.04) 0%,transparent 60%)",pointerEvents:"none",zIndex:0 }}/>

        {/* ── HEADER ── */}
        <header style={{ position:"sticky",top:0,zIndex:20,background:"rgba(7,6,4,0.96)",backdropFilter:"blur(20px)" }}>
          <div style={{ height:2,background:"linear-gradient(90deg,transparent,rgba(220,210,190,0.28),transparent)" }}/>
          <div style={{ padding:"12px 18px 0" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:10 }}>
              <div>
                <div style={{ fontFamily:"'Karla',sans-serif",fontSize:7,letterSpacing:"0.28em",color:"rgba(220,210,190,0.2)",marginBottom:3 }}>ηχηρός · vol. I · sound finds sound</div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:900,letterSpacing:"0.02em",color:"#ddd0b8",lineHeight:1 }}>ICHŌS</div>
              </div>
              <button onClick={()=>setSettings(true)} style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,letterSpacing:"0.1em",color:"rgba(220,210,190,0.35)",background:"transparent",border:"1px solid rgba(220,210,190,0.12)",padding:"5px 11px",cursor:"pointer",textTransform:"uppercase" }}>⚙ settings</button>
            </div>
          </div>
          <div style={{ height:2,background:"rgba(220,210,190,0.15)" }}/>
          <div style={{ display:"flex",overflowX:"auto" }}>
            {TABS.map(({k,label,badge},i)=>(
              <button key={k} onClick={()=>setTab(k)} style={{ fontFamily:"'Karla',sans-serif",fontSize:8.5,letterSpacing:"0.08em",color:tab===k?"#ddd0b8":"rgba(220,210,190,0.28)",background:"none",border:"none",borderRight:i<TABS.length-1?"1px solid rgba(220,210,190,0.08)":"none",cursor:"pointer",padding:"9px 12px",textTransform:"uppercase",position:"relative",transition:"color 0.2s",whiteSpace:"nowrap",flexShrink:0 }}>
                {label}
                {badge>0&&<span style={{ marginLeft:5,fontFamily:"'Karla',sans-serif",fontSize:7.5,color:"#fcd34d",background:"rgba(252,211,77,0.15)",border:"1px solid rgba(252,211,77,0.3)",borderRadius:8,padding:"0 5px" }}>{badge}</span>}
                {tab===k&&<div style={{ position:"absolute",bottom:0,left:"15%",right:"15%",height:1.5,background:"rgba(220,210,190,0.4)" }}/>}
              </button>
            ))}
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div style={{ position:"absolute",top:0,left:0,right:0,bottom:0,overflowY:"auto",paddingTop:tab==="booth"?104:104 }}>
          <div style={{ padding:tab==="booth"?"0":"18px 18px 40px",position:"relative",zIndex:1,animation:"fadeUp 0.4s ease",height:tab==="booth"?"100%":undefined }} key={tab}>
            {tab==="discover" && <DiscoverTab onEnterRoom={setRoom} onBlockReport={setBlockReport}/>}
            {tab==="verses"   && <VersesTab onEnterRoom={setRoom}/>}
            {tab==="booth"    && <BoothTab/>}
            {tab==="journal"  && <JournalTab/>}
            {tab==="alerts"   && <AlertsTab alerts={alerts} onMarkRead={markRead} onMarkAllRead={markAllRead}/>}
            {tab==="profile"  && <ProfileTab blockedUsers={blockedUsers} onUnblock={handleUnblock} onOpenSettings={()=>setSettings(true)}/>}
          </div>
        </div>

        {/* ── OVERLAYS ── */}
        {room        && <EchoRoom match={room} onClose={()=>setRoom(null)}/>}
        {blockReport && <BlockReportMenu user={blockReport} onBlock={handleBlock} onClose={()=>setBlockReport(null)}/>}
        {settingsOpen && <SettingsSheet onClose={()=>setSettings(false)}/>}
      </div>
    </>
  );
}
