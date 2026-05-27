import { useState, useEffect, useRef } from "react";

// ─── TOUR DATA ────────────────────────────────────────────────────────────────

const TOUR_STEPS = [
  {
    id: "welcome",
    chapter: null,
    headline: "ICHŌS",
    subhead: "ηχηρός · sound finds sound",
    body: "A place for the songs that shaped you — and the people shaped by the same ones.",
    visual: "disc",
    cta: "begin",
    skip: false,
  },
  {
    id: "story-songs",
    chapter: "I · Your Sound",
    headline: "Story Songs",
    subhead: "up to 20 tracks · each with a caption",
    body: "These aren't your favourite songs. They're the ones you can't explain without also explaining a year of your life.",
    visual: "songs",
    cta: "next",
    skip: true,
  },
  {
    id: "echo-matching",
    chapter: "II · Connection",
    headline: "Echo Matching",
    subhead: "overlap becomes connection",
    body: "Ichōs finds people whose story songs overlap with yours — not just the tracks, but the verses that stopped them mid-listen.",
    visual: "echoes",
    cta: "next",
    skip: true,
  },
  {
    id: "verse-pinning",
    chapter: "III · Verses",
    headline: "Verse Pinning",
    subhead: "the exact line that undid you",
    body: "Pin the specific lyric that got you. Two people can love the same song for different reasons. The verse is where you find out if you felt the same thing.",
    visual: "verses",
    cta: "next",
    skip: true,
  },
  {
    id: "booth",
    chapter: "IV · The Booth",
    headline: "Listening Booth",
    subhead: "your live radio station",
    body: "Curate a queue in real-time. Visitors enter and hear exactly what you're hearing — across any distance. Co-host with someone else. Leave voice notes before each track.",
    visual: "booth",
    cta: "next",
    skip: true,
  },
  {
    id: "journal",
    chapter: "V · Memory",
    headline: "Listening Journal",
    subhead: "private · or public · tied to a song",
    body: "Write what a song meant on a specific night. Attach a voice note. Make it public and let strangers find themselves in your words.",
    visual: "journal",
    cta: "next",
    skip: true,
  },
  {
    id: "safety",
    chapter: "VI · Your Space",
    headline: "Your Space, Your Rules",
    subhead: "block · report · hide · control",
    body: "You control who can find you, enter your booth, or appear in your matches. Block and report are always one tap away. Your online status can be hidden at any time.",
    visual: "safety",
    cta: "next",
    skip: true,
  },
  {
    id: "ready",
    chapter: null,
    headline: "You heard it too.",
    subhead: "now say something",
    body: "Start by adding your first story song — the one that comes to mind right now, before you've had time to think about it.",
    visual: "ready",
    cta: "add my first song",
    skip: false,
  },
];

const SONGS_SAMPLE = [
  { id:"s2", title:"Holocene",   artist:"Bon Iver",     cover:"🌲", accent:"#4a7c4a" },
  { id:"s3", title:"Retrograde", artist:"James Blake",  cover:"🌊", accent:"#2563eb" },
  { id:"s5", title:"Re: Stacks", artist:"Bon Iver",     cover:"❄️", accent:"#065f46" },
];

const PAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='500' height='500' filter='url(%23n)' opacity='.05'/%3E%3C/svg%3E")`;

// ─── ALBUM DISC ───────────────────────────────────────────────────────────────

function Disc({ size = 140, accent = "#4a7c4a", text = "BI", cover = "🌲", spinning = false, pulse = false }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, position: "relative" }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: "50%",
        background: "#0a0806",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        boxShadow: `0 ${size * 0.06}px ${size * 0.25}px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(220,210,190,0.05)`,
        animation: spinning ? "discSpin 4s linear infinite" : pulse ? "discPulse 3s ease-in-out infinite" : "none",
      }}>
        {[0.93, 0.83, 0.73, 0.63].map((r, i) => (
          <div key={i} style={{ position: "absolute", width: `${r * 100}%`, height: `${r * 100}%`, borderRadius: "50%", border: "1px solid rgba(220,210,190,0.05)" }} />
        ))}
        {/* Label */}
        <div style={{
          width: size * 0.44, height: size * 0.44, borderRadius: "50%", zIndex: 2,
          background: `conic-gradient(from 0deg, ${accent}cc, ${accent}44, #0f0a06, ${accent}88)`,
          border: `1px solid ${accent}50`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 2, boxShadow: `0 0 ${size * 0.12}px ${accent}30`,
        }}>
          <span style={{ fontSize: size * 0.14 }}>{cover}</span>
          <div style={{ width: "55%", height: 1, background: `${accent}60` }} />
        </div>
        {/* Spindle */}
        <div style={{ position: "absolute", width: size * 0.05, height: size * 0.05, borderRadius: "50%", background: "#030202", border: "1px solid rgba(220,210,190,0.1)", zIndex: 3 }} />
        {/* Shine */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, transparent 50%)", pointerEvents: "none", zIndex: 4 }} />
      </div>
      {pulse && (
        <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `1px solid ${accent}30`, animation: "ringPulse 3s ease-in-out infinite" }} />
      )}
    </div>
  );
}

// ─── STEP VISUALS ────────────────────────────────────────────────────────────

function StepVisual({ stepId }) {
  const [waveActive, setWaveActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWaveActive(true), 300);
    return () => clearTimeout(t);
  }, [stepId]);

  const Wave = ({ bars = 20, color = "rgba(220,210,190,0.4)", active }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 18 }}>
      {Array.from({ length: bars }, (_, i) => (
        <div key={i} style={{
          width: 2, borderRadius: 2, background: color,
          height: active ? `${3 + Math.abs(Math.sin(i * 0.7)) * 11}px` : "2px",
          opacity: active ? 0.7 : 0.2,
          transition: "height 0.4s ease", transitionDelay: `${i * 30}ms`,
        }} />
      ))}
    </div>
  );

  if (stepId === "welcome") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", position: "relative" }}>
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)", animation: "slowPulse 4s ease-in-out infinite" }} />
      <Disc size={160} accent="#c9a84c" text="Ι" cover="◎" spinning />
    </div>
  );

  if (stepId === "story-songs") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      {SONGS_SAMPLE.map((s, i) => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: `1px solid rgba(220,210,190,0.1)`, background: "rgba(14,11,8,0.6)", animation: `fadeSlide 0.4s ease forwards`, animationDelay: `${i * 100}ms`, opacity: 0 }}>
          <Disc size={42} accent={s.accent} cover={s.cover} spinning={i === 0} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 14, fontWeight: 700, color: "#ddd0b8" }}>{s.title}</div>
            <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 9.5, color: "rgba(220,210,190,0.38)", letterSpacing: "0.06em" }}>{s.artist}</div>
            {i === 0 && <div style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 11, color: "rgba(220,210,190,0.5)", marginTop: 3 }}>
              "found this on a train through nowhere…"
            </div>}
          </div>
        </div>
      ))}
    </div>
  );

  if (stepId === "echo-matching") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
      {/* Two users connected by shared songs */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {[{ av: "I", color: "#a78bfa" }, { av: "MC", color: "#8b5cf6" }].map((u, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg,${u.color}40,${u.color}18)`, border: `1.5px solid ${u.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: u.color }}>
              {u.av}
            </div>
          </div>
        ))}
      </div>
      {/* Shared songs */}
      <div style={{ display: "flex", gap: 8 }}>
        {SONGS_SAMPLE.map((s, i) => (
          <div key={s.id} style={{ animation: `fadeSlide 0.4s ease forwards`, animationDelay: `${i * 120}ms`, opacity: 0 }}>
            <Disc size={52} accent={s.accent} cover={s.cover} pulse />
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 13, color: "rgba(220,210,190,0.5)", textAlign: "center" }}>
        3 shared songs · <span style={{ color: "#c4b5fd" }}>a resonance</span>
      </div>
      <Wave bars={22} color="rgba(167,139,250,0.5)" active={waveActive} />
    </div>
  );

  if (stepId === "verse-pinning") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      {[
        { verse: "And at once I knew I was not magnificent", song: "Holocene · Bon Iver", pinners: 12, accent: "#4a7c4a" },
        { verse: "This is not the sound of a new man", song: "Re: Stacks · Bon Iver", pinners: 8, accent: "#065f46" },
      ].map((v, i) => (
        <div key={i} style={{ padding: "12px 14px", border: `1px solid rgba(220,210,190,0.1)`, background: "rgba(14,11,8,0.6)", animation: `fadeSlide 0.4s ease forwards`, animationDelay: `${i * 150}ms`, opacity: 0 }}>
          <div style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 14, color: "rgba(220,210,190,0.85)", lineHeight: 1.6, marginBottom: 6, paddingLeft: 10, borderLeft: `1px solid ${v.accent}60` }}>
            "{v.verse}"
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 9, color: "rgba(220,210,190,0.3)" }}>{v.song}</div>
            <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 9, color: `${v.accent}cc` }}>📜 {v.pinners} pinned</div>
          </div>
        </div>
      ))}
    </div>
  );

  if (stepId === "booth") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Disc size={80} accent="#065f46" cover="❄️" spinning />
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 16, fontWeight: 700, color: "#ddd0b8", marginBottom: 2 }}>Re: Stacks</div>
          <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 9.5, color: "rgba(220,210,190,0.38)", marginBottom: 8 }}>Bon Iver · 4:59</div>
          <Wave bars={16} color="rgba(110,231,183,0.5)" active={waveActive} />
        </div>
      </div>
      {/* Listeners */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6ee7b7", boxShadow: "0 0 6px #6ee7b766", animation: "onlinePulse 2.5s ease infinite" }} />
        <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 9.5, color: "rgba(220,210,190,0.4)" }}>7 listening now</div>
      </div>
      {/* Queue strip */}
      <div style={{ display: "flex", gap: 6 }}>
        {SONGS_SAMPLE.map((s, i) => (
          <div key={s.id} style={{ opacity: i === 0 ? 1 : 0.4, animation: `fadeSlide 0.4s ease forwards`, animationDelay: `${i * 100}ms` }}>
            <Disc size={34} accent={s.accent} cover={s.cover} />
          </div>
        ))}
      </div>
    </div>
  );

  if (stepId === "journal") return (
    <div style={{ width: "100%" }}>
      <div style={{ padding: "14px", border: "1px solid rgba(220,210,190,0.1)", background: "rgba(14,11,8,0.6)", animation: "fadeSlide 0.4s ease forwards", opacity: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Disc size={38} accent="#2563eb" cover="🌊" />
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 13, fontWeight: 700, color: "#ddd0b8" }}>Retrograde</div>
            <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 8.5, color: "rgba(220,210,190,0.3)" }}>James Blake · nocturnal</div>
          </div>
          <div style={{ marginLeft: "auto", fontFamily: "'Karla',sans-serif", fontSize: 8, color: "rgba(220,210,190,0.25)" }}>Tonight, 2:14am</div>
        </div>
        <div style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 13, color: "rgba(220,210,190,0.7)", lineHeight: 1.7 }}>
          "The drop at 2:14 is a whole other world. I've listened to this song 400 times and I still hold my breath waiting for it."
        </div>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12 }}>🎙</span>
          <Wave bars={12} color="rgba(220,210,190,0.3)" active={waveActive} />
          <span style={{ fontFamily: "'Karla',sans-serif", fontSize: 8.5, color: "rgba(220,210,190,0.25)" }}>0:12</span>
        </div>
      </div>
    </div>
  );

  if (stepId === "safety") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      {[
        { icon: "🔒", label: "hide online status", desc: "invisible to everyone else", done: true  },
        { icon: "🚫", label: "block a user",        desc: "they disappear from your world", done: false },
        { icon: "👁",  label: "hide booth activity", desc: "listen anonymously",         done: true  },
        { icon: "🚩", label: "report harassment",   desc: "reviewed within 24h",         done: false },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", border: `1px solid rgba(220,210,190,${item.done ? 0.14 : 0.07})`, background: item.done ? "rgba(220,210,190,0.04)" : "rgba(14,11,8,0.4)", animation: `fadeSlide 0.4s ease forwards`, animationDelay: `${i * 80}ms`, opacity: 0 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontWeight: 700, color: item.done ? "#ddd0b8" : "rgba(220,210,190,0.55)" }}>{item.label}</div>
            <div style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 11, color: "rgba(220,210,190,0.38)" }}>{item.desc}</div>
          </div>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1px solid rgba(220,210,190,${item.done ? 0.4 : 0.15})`, background: item.done ? "rgba(220,210,190,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "rgba(220,210,190,0.7)", flexShrink: 0 }}>
            {item.done ? "✓" : ""}
          </div>
        </div>
      ))}
    </div>
  );

  if (stepId === "ready") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: -16, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)", animation: "slowPulse 3s ease-in-out infinite" }} />
        <Disc size={120} accent="#c9a84c" text="Ι" cover="◎" spinning />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(201,168,76,0.4)", animation: `dotFade 1.4s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );

  return null;
}

// ─── PROGRESS INDICATOR ──────────────────────────────────────────────────────

function Progress({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          height: 2, borderRadius: 1,
          width: i === current ? 20 : 6,
          background: i === current ? "rgba(220,210,190,0.6)" : i < current ? "rgba(220,210,190,0.25)" : "rgba(220,210,190,0.1)",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

// ─── ONBOARDING TOUR ─────────────────────────────────────────────────────────

function OnboardingTour({ onComplete }) {
  const [stepIdx, setStepIdx]   = useState(0);
  const [dir,     setDir]       = useState(1);  // 1 = forward, -1 = back
  const [exiting, setExiting]   = useState(false);
  const step = TOUR_STEPS[stepIdx];
  const isLast = stepIdx === TOUR_STEPS.length - 1;

  const goTo = (nextIdx) => {
    if (nextIdx < 0 || nextIdx >= TOUR_STEPS.length) return;
    setDir(nextIdx > stepIdx ? 1 : -1);
    setExiting(true);
    setTimeout(() => {
      setStepIdx(nextIdx);
      setExiting(false);
    }, 220);
  };

  const handleNext = () => {
    if (isLast) { onComplete(); return; }
    goTo(stepIdx + 1);
  };

  const handleBack = () => goTo(stepIdx - 1);

  // Swipe support
  const touchStart = useRef(null);
  const onTouchStart = e => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (delta < -50) handleNext();
    if (delta >  50 && stepIdx > 0) handleBack();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "#070604", display: "flex", flexDirection: "column",
      backgroundImage: PAPER, backgroundSize: "500px",
      overflow: "hidden",
    }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Ambient */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 20%, rgba(201,168,76,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Top bar */}
      <div style={{ padding: "env(safe-area-inset-top,0px) 18px 0", paddingTop: "max(env(safe-area-inset-top,0px), 18px)", flexShrink: 0 }}>
        <div style={{ height: 2, background: "linear-gradient(90deg,transparent,rgba(220,210,190,0.25),transparent)", marginBottom: 14 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Back */}
          <button onClick={handleBack} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(220,210,190,0.3)", fontFamily: "'Karla',sans-serif", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 0", opacity: stepIdx > 0 ? 1 : 0, transition: "opacity 0.2s" }}>
            ← back
          </button>
          {/* Chapter */}
          <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 8.5, letterSpacing: "0.2em", color: "rgba(220,210,190,0.28)", textTransform: "uppercase", textAlign: "center" }}>
            {step.chapter || "ichōs"}
          </div>
          {/* Skip */}
          {step.skip ? (
            <button onClick={onComplete} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(220,210,190,0.28)", fontFamily: "'Karla',sans-serif", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 0" }}>
              skip
            </button>
          ) : <div style={{ width: 36 }} />}
        </div>
      </div>

      {/* Visual area */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px 28px",
        opacity: exiting ? 0 : 1,
        transform: exiting ? `translateX(${dir * -30}px)` : "none",
        transition: "opacity 0.22s ease, transform 0.22s ease",
      }}>
        <StepVisual stepId={step.id} />
      </div>

      {/* Text + CTA */}
      <div style={{
        padding: "0 24px",
        paddingBottom: "max(env(safe-area-inset-bottom,0px), 32px)",
        flexShrink: 0,
        opacity: exiting ? 0 : 1,
        transform: exiting ? `translateY(${dir * 12}px)` : "none",
        transition: "opacity 0.22s ease, transform 0.22s ease",
      }}>
        {/* Headline */}
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: step.id === "welcome" ? 36 : 26, fontWeight: 900, color: "#ddd0b8", letterSpacing: step.id === "welcome" ? "0.04em" : "0.01em", lineHeight: 1.1, marginBottom: 6, textAlign: step.id === "welcome" || step.id === "ready" ? "center" : "left" }}>
          {step.headline}
        </div>

        {/* Subhead */}
        <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 10, letterSpacing: "0.16em", color: "rgba(220,210,190,0.35)", textTransform: "uppercase", marginBottom: 14, textAlign: step.id === "welcome" || step.id === "ready" ? "center" : "left" }}>
          {step.subhead}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(220,210,190,0.1)", marginBottom: 14 }} />

        {/* Body */}
        <div style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 14.5, color: "rgba(220,210,190,0.62)", lineHeight: 1.72, marginBottom: 24, textAlign: step.id === "welcome" || step.id === "ready" ? "center" : "left" }}>
          {step.body}
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 18 }}>
          <Progress current={stepIdx} total={TOUR_STEPS.length} />
        </div>

        {/* CTA */}
        <button onClick={handleNext} style={{
          width: "100%", padding: "14px",
          fontFamily: "'Karla',sans-serif", fontSize: 10.5, letterSpacing: "0.16em",
          color: "rgba(220,210,190,0.9)",
          background: step.id === "ready" ? "rgba(201,168,76,0.1)" : "rgba(220,210,190,0.06)",
          border: `1px solid rgba(220,210,190,${step.id === "ready" ? 0.3 : 0.18})`,
          cursor: "pointer", textTransform: "uppercase",
          transition: "all 0.2s ease",
          position: "relative", overflow: "hidden",
        }}>
          {step.cta}
          {step.id === "ready" && (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.08),transparent)", pointerEvents: "none" }} />
          )}
        </button>
      </div>
    </div>
  );
}

// ─── GITHUB DEPLOY GUIDE ──────────────────────────────────────────────────────

function GitHubGuide() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(null);

  const copy = (text, key) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const STEPS = [
    {
      n: "01", title: "Create your GitHub repo",
      desc: "Go to github.com/new and create a new repository called ichos-pwa. Make it public. Don't initialise with a README — the project already has one.",
      action: null,
      note: "Same flow as you used with Phorya.",
    },
    {
      n: "02", title: "Push your code",
      desc: "In your ichos-pwa folder, run these commands:",
      code: `git init
git add .
git commit -m "feat: initial Ichōs PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ichos-pwa.git
git push -u origin main`,
      key: "push",
      note: "Replace YOUR_USERNAME with your GitHub username.",
    },
    {
      n: "03", title: "Connect to Vercel",
      desc: "Go to vercel.com → New Project → Import from GitHub. Select ichos-pwa. Vercel auto-detects Vite. Click Deploy.",
      code: `# Framework: Vite (auto-detected)
# Build command: npm run build
# Output directory: dist
# Install command: npm install`,
      key: "vercel",
      note: "Every push to main auto-deploys. Same as Phorya.",
    },
    {
      n: "04", title: "Add your VAPID keys",
      desc: "In Vercel → Settings → Environment Variables, add your push notification keys:",
      code: `VITE_VAPID_PUBLIC_KEY = your_public_key_here
# Generate with: npx web-push generate-vapid-keys`,
      key: "vapid",
      note: "The private key goes on your backend server, never in Vercel env vars.",
    },
    {
      n: "05", title: "Generate icons",
      desc: "Upload the 512×512 source to pwabuilder.com/imageGenerator and drop the pack into public/icons/ — then push to trigger a redeploy.",
      action: "https://www.pwabuilder.com/imageGenerator",
      key: "icons",
      note: "Icons are already generated in this project — swap them for final brand art when ready.",
    },
    {
      n: "06", title: "Test the PWA",
      desc: "On Android Chrome: open your Vercel URL → three-dot menu → 'Add to Home screen'. On iOS Safari: tap Share → 'Add to Home Screen'. Run Lighthouse for your PWA score.",
      code: `# Lighthouse in Chrome DevTools:
# DevTools → Lighthouse → PWA → Analyse page load
# Target: PWA 100 · Performance 90+`,
      key: "test",
      note: "Service workers only activate on HTTPS — Vercel provides this automatically.",
    },
  ];

  const current = STEPS[step];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, border: "1px solid rgba(220,210,190,0.1)", overflow: "hidden" }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{ flex: 1, padding: "9px 0", background: i === step ? "rgba(220,210,190,0.07)" : "transparent", border: "none", borderRight: i < STEPS.length - 1 ? "1px solid rgba(220,210,190,0.08)" : "none", cursor: "pointer", fontFamily: "'Karla',sans-serif", fontSize: 8.5, letterSpacing: "0.1em", color: i === step ? "#ddd0b8" : i < step ? "rgba(220,210,190,0.35)" : "rgba(220,210,190,0.2)", transition: "all 0.2s" }}>
            {s.n}
          </button>
        ))}
      </div>

      {/* Step */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#ddd0b8", marginBottom: 6 }}>{current.title}</div>
        <div style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 13.5, color: "rgba(220,210,190,0.6)", lineHeight: 1.7, marginBottom: 16 }}>{current.desc}</div>

        {current.code && (
          <div style={{ marginBottom: 14, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", background: "rgba(220,210,190,0.05)", border: "1px solid rgba(220,210,190,0.12)", borderBottom: "none" }}>
              <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 8, letterSpacing: "0.12em", color: "rgba(220,210,190,0.35)" }}>terminal</div>
              <button onClick={() => copy(current.code, current.key)} style={{ fontFamily: "'Karla',sans-serif", fontSize: 8, letterSpacing: "0.1em", color: copied === current.key ? "#6ee7b7" : "rgba(220,210,190,0.35)", background: "transparent", border: "none", cursor: "pointer", textTransform: "uppercase" }}>
                {copied === current.key ? "copied" : "copy"}
              </button>
            </div>
            <pre style={{ background: "rgba(8,6,4,0.8)", border: "1px solid rgba(220,210,190,0.08)", padding: "12px 14px", overflowX: "auto", fontFamily: "monospace", fontSize: 11, color: "rgba(220,210,190,0.6)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {current.code}
            </pre>
          </div>
        )}

        {current.action && (
          <a href={current.action} target="_blank" rel="noreferrer" style={{ display: "block", fontFamily: "'Karla',sans-serif", fontSize: 9.5, letterSpacing: "0.12em", color: "rgba(220,210,190,0.6)", background: "rgba(220,210,190,0.04)", border: "1px solid rgba(220,210,190,0.14)", padding: "10px 14px", textDecoration: "none", marginBottom: 14, transition: "all 0.2s", textTransform: "uppercase" }}>
            → {current.action}
          </a>
        )}

        {current.note && (
          <div style={{ padding: "10px 12px", border: "1px solid rgba(220,210,190,0.08)", background: "rgba(14,11,8,0.5)" }}>
            <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 8, letterSpacing: "0.12em", color: "rgba(220,210,190,0.25)", textTransform: "uppercase", marginBottom: 4 }}>note</div>
            <div style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 12, color: "rgba(220,210,190,0.45)", lineHeight: 1.6 }}>{current.note}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 8, paddingTop: 16, flexShrink: 0 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ flex: 1, padding: "10px", fontFamily: "'Karla',sans-serif", fontSize: 9.5, letterSpacing: "0.1em", color: "rgba(220,210,190,0.35)", background: "transparent", border: "1px solid rgba(220,210,190,0.1)", cursor: step === 0 ? "not-allowed" : "pointer", textTransform: "uppercase", opacity: step === 0 ? 0.4 : 1 }}>← prev</button>
        <button onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : null} style={{ flex: 2, padding: "10px", fontFamily: "'Karla',sans-serif", fontSize: 9.5, letterSpacing: "0.1em", color: step === STEPS.length - 1 ? "#6ee7b7" : "rgba(220,210,190,0.7)", background: step === STEPS.length - 1 ? "rgba(110,231,183,0.08)" : "rgba(220,210,190,0.05)", border: `1px solid rgba(220,210,190,${step === STEPS.length - 1 ? 0.25 : 0.16})`, cursor: "pointer", textTransform: "uppercase", transition: "all 0.2s" }}>
          {step === STEPS.length - 1 ? "✓ ready to deploy" : "next →"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [view,    setView]    = useState("tour");  // tour | main | github
  const [loaded,  setLoaded]  = useState(false);

  // Persist tour completion
  useEffect(() => {
    setTimeout(() => setLoaded(true), 80);
    const completed = localStorage.getItem("ichos-tour-completed");
    if (completed) setView("main");
  }, []);

  const completeTour = () => {
    localStorage.setItem("ichos-tour-completed", "1");
    setView("main");
  };

  const replayTour = () => {
    localStorage.removeItem("ichos-tour-completed");
    setView("tour");
  };

  if (view === "tour") return (
    <>
      <style>{GLOBAL_CSS}</style>
      <OnboardingTour onComplete={completeTour} />
    </>
  );

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: "100%", maxWidth: 420, margin: "0 auto", height: "100dvh", background: "#070604", display: "flex", flexDirection: "column", overflow: "hidden", backgroundImage: PAPER, backgroundSize: "500px", opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}>

        {/* Header */}
        <header style={{ flexShrink: 0, background: "rgba(7,6,4,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(220,210,190,0.12)" }}>
          <div style={{ height: 2, background: "linear-gradient(90deg,transparent,rgba(220,210,190,0.28),transparent)" }} />
          <div style={{ padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 7, letterSpacing: "0.28em", color: "rgba(220,210,190,0.2)", marginBottom: 3 }}>ηχηρός · vol. I</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, letterSpacing: "0.02em", color: "#ddd0b8", lineHeight: 1 }}>ICHŌS</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setView(v => v === "github" ? "main" : "github")} style={{ fontFamily: "'Karla',sans-serif", fontSize: 8.5, letterSpacing: "0.1em", color: view === "github" ? "#6ee7b7" : "rgba(220,210,190,0.4)", background: "transparent", border: `1px solid rgba(220,210,190,${view === "github" ? 0.25 : 0.12})`, padding: "5px 11px", cursor: "pointer", textTransform: "uppercase", transition: "all 0.2s" }}>
                  {view === "github" ? "← app" : "github →"}
                </button>
              </div>
            </div>
          </div>
          <div style={{ height: 2, background: "rgba(220,210,190,0.15)" }} />
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px 40px" }}>

          {view === "github" && <GitHubGuide />}

          {view === "main" && (
            <div>
              {/* Icon showcase */}
              <div style={{ marginBottom: 24, padding: "20px", border: "1px solid rgba(220,210,190,0.12)", background: "rgba(14,11,8,0.6)", display: "flex", alignItems: "center", gap: 18 }}>
                <Disc size={80} accent="#c9a84c" text="Ι" cover="◎" pulse />
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#ddd0b8", marginBottom: 3 }}>Ichōs App Icon</div>
                  <div style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 13, color: "rgba(220,210,190,0.5)", lineHeight: 1.6, marginBottom: 8 }}>
                    Vinyl disc · conic gradient label · Ι letterform · generated at all 9 PWA sizes
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[16, 32, 96, 192, 512].map(s => (
                      <div key={s} style={{ fontFamily: "'Karla',sans-serif", fontSize: 8, color: "rgba(220,210,190,0.35)", background: "rgba(220,210,190,0.04)", border: "1px solid rgba(220,210,190,0.08)", padding: "2px 7px" }}>{s}px</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Onboarding tour card */}
              <div style={{ marginBottom: 16, border: "1px solid rgba(220,210,190,0.1)", background: "rgba(14,11,8,0.5)", overflow: "hidden" }}>
                <div style={{ height: 1.5, background: "linear-gradient(90deg,transparent,rgba(220,210,190,0.25),transparent)" }} />
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#ddd0b8", marginBottom: 4 }}>Onboarding Tour</div>
                  <div style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 13, color: "rgba(220,210,190,0.5)", lineHeight: 1.65, marginBottom: 12 }}>
                    8-step tour covering every feature — story songs, echo matching, verse pinning, booth, journal, and safety. Swipe or tap. Can be replayed at any time from Settings.
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                    {TOUR_STEPS.map(s => (
                      <div key={s.id} style={{ fontFamily: "'Karla',sans-serif", fontSize: 8, color: "rgba(220,210,190,0.35)", background: "rgba(220,210,190,0.04)", border: "1px solid rgba(220,210,190,0.08)", padding: "2px 8px" }}>{s.id}</div>
                    ))}
                  </div>
                  <button onClick={replayTour} style={{ fontFamily: "'Karla',sans-serif", fontSize: 9.5, letterSpacing: "0.12em", color: "rgba(220,210,190,0.7)", background: "rgba(220,210,190,0.06)", border: "1px solid rgba(220,210,190,0.2)", padding: "10px 18px", cursor: "pointer", textTransform: "uppercase", transition: "all 0.2s" }}>
                    replay tour →
                  </button>
                </div>
              </div>

              {/* GitHub quick link */}
              <div style={{ padding: "14px 16px", border: "1px solid rgba(220,210,190,0.1)", background: "rgba(14,11,8,0.4)", cursor: "pointer" }} onClick={() => setView("github")}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "rgba(220,210,190,0.75)", marginBottom: 4 }}>Deploy to GitHub + Vercel</div>
                <div style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 13, color: "rgba(220,210,190,0.45)", lineHeight: 1.6 }}>
                  Same workflow as Phorya. 6-step guide: create repo → push → connect Vercel → env vars → icons → test.
                </div>
                <div style={{ marginTop: 10, fontFamily: "'Karla',sans-serif", fontSize: 9, letterSpacing: "0.1em", color: "rgba(220,210,190,0.35)", textTransform: "uppercase" }}>open guide →</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Spectral:ital,wght@0,300;0,400;1,300;1,400;1,600&family=Karla:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #070604; color: #ddd0b8; -webkit-font-smoothing: antialiased; overflow: hidden; }
  input, textarea, button { font-family: inherit; }
  @keyframes discSpin    { from { transform:rotate(0) }   to { transform:rotate(360deg) } }
  @keyframes discPulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
  @keyframes ringPulse   { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.15;transform:scale(1.1)} }
  @keyframes slowPulse   { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
  @keyframes onlinePulse { 0%,100%{box-shadow:0 0 6px #6ee7b766} 50%{box-shadow:0 0 12px #6ee7b7aa} }
  @keyframes fadeSlide   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  @keyframes dotFade     { 0%,100%{opacity:.2} 50%{opacity:.8} }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(220,210,190,0.12); border-radius: 2px; }
`;
