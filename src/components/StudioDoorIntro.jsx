import { useEffect, useRef, useState } from "react";

const NOISE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.55'/></svg>",
  );

function playEntrySounds() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;

    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = "triangle";
    click.frequency.setValueAtTime(820, now);
    click.frequency.exponentialRampToValueAtTime(90, now + 0.04);
    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.exponentialRampToValueAtTime(0.22, now + 0.006);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    click.connect(clickGain).connect(ctx.destination);
    click.start(now);
    click.stop(now + 0.12);

    const creakStart = now + 0.1;
    const bufLen = Math.floor(ctx.sampleRate * 0.55);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      const t = i / bufLen;
      const env = Math.sin(Math.PI * t) * Math.pow(1 - t, 0.4);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 220;
    filter.Q.value = 5;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.14, creakStart);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, creakStart + 0.55);
    noise.connect(filter).connect(noiseGain).connect(ctx.destination);
    noise.start(creakStart);
    noise.stop(creakStart + 0.6);

    setTimeout(() => { try { ctx.close(); } catch { /* ignore */ } }, 1500);
  } catch {
    /* silent */
  }
}

export default function StudioDoorIntro() {
  const [entering, setEntering] = useState(false);
  const [phase2, setPhase2] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasHash = window.location.hash && window.location.hash !== "#";
    const played = sessionStorage.getItem("bw-intro-played");

    if (hasHash || played) {
      setMounted(false);
      return;
    }
    if (reducedMotion) setReduced(true);

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    };
  }, []);

  useEffect(() => {
    if (!mounted || entering) return;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      if (stageRef.current) {
        stageRef.current.style.setProperty("--bw-px", `${x}px`);
        stageRef.current.style.setProperty("--bw-py", `${y}px`);
      }
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [mounted, entering]);

  function enter() {
    if (entering) return;
    sessionStorage.setItem("bw-intro-played", "1");
    setEntering(true);

    if (reduced) {
      setTimeout(() => {
        document.body.style.overflow = "";
        setMounted(false);
      }, 320);
      return;
    }

    playEntrySounds();
    document.body.style.pointerEvents = "none";

    setTimeout(() => setPhase2(true), 400);

    setTimeout(() => {
      const heroRoot = document.querySelector("[data-hero-root]");
      if (heroRoot) heroRoot.classList.add("bw-hero-reveal");
    }, 1000);

    setTimeout(() => {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
      setMounted(false);
    }, 1400);
  }

  function skip(e) {
    e.stopPropagation();
    sessionStorage.setItem("bw-intro-played", "1");
    document.body.style.overflow = "";
    setMounted(false);
  }

  if (!mounted) return null;

  const className = [
    "bw-intro",
    entering && "entering",
    phase2 && "phase2",
    reduced && "reduced",
  ].filter(Boolean).join(" ");

  return (
    <>
      <style>{`
        .bw-intro {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: radial-gradient(ellipse at 50% 45%, #1d3434 0%, #0a1414 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          user-select: none;
          font-family: 'Barlow Condensed', sans-serif;
        }
        .bw-intro::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("${NOISE_SVG}");
          opacity: 0.045;
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        .bw-intro::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 50%, transparent 28%, rgba(0,0,0,0.78) 100%);
          pointer-events: none;
        }

        .bw-intro.reduced.entering {
          opacity: 0;
          transition: opacity 300ms ease;
          pointer-events: none;
        }

        .bw-intro-skip {
          position: absolute;
          top: 1.4rem;
          right: 1.4rem;
          background: transparent;
          border: 0;
          color: rgba(245,240,220,0.4);
          font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 0.5rem 0.8rem;
          z-index: 12;
          transition: color 0.25s ease;
        }
        .bw-intro-skip:hover { color: #F5F0DC; }

        .bw-intro-bloom {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffe1bf 0%, #ffa85c 22%, rgba(255,168,92,0.4) 50%, transparent 75%);
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 0;
          pointer-events: none;
          z-index: 6;
          mix-blend-mode: screen;
        }
        .bw-intro.entering:not(.reduced) .bw-intro-bloom {
          animation: bw-bloom-burst 800ms cubic-bezier(0.2, 0.7, 0.4, 1) 80ms forwards;
        }
        @keyframes bw-bloom-burst {
          0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 0; }
          35%  { transform: translate(-50%, -50%) scale(4); opacity: 0.85; }
          100% { transform: translate(-50%, -50%) scale(14); opacity: 0; }
        }

        .bw-intro-whiteflash {
          position: absolute;
          inset: 0;
          background: #ffffff;
          opacity: 0;
          pointer-events: none;
          z-index: 8;
        }
        .bw-intro.entering:not(.reduced) .bw-intro-whiteflash {
          animation:
            bw-whiteflash-in 220ms ease-in 800ms forwards,
            bw-whiteflash-out 160ms ease-out 1020ms forwards;
        }
        @keyframes bw-whiteflash-in  { to { opacity: 1; } }
        @keyframes bw-whiteflash-out { to { opacity: 0; } }

        .bw-intro-scene {
          perspective: 1600px;
          perspective-origin: center 45%;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
          z-index: 2;
        }
        .bw-intro-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.9rem;
          transform: translate3d(var(--bw-px, 0px), var(--bw-py, 0px), 0);
          transition: transform 0.2s ease-out;
          will-change: transform;
        }

        .bw-intro-onair {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.42em;
          color: #ff5252;
          text-shadow: 0 0 14px rgba(255,82,82,0.55);
        }
        .bw-intro-onair-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #ff5252;
          box-shadow: 0 0 12px rgba(255,82,82,0.8);
          animation: bw-intro-pulse-dot 1.5s ease-in-out infinite;
        }
        @keyframes bw-intro-pulse-dot {
          0%, 100% { opacity: 0.55; box-shadow: 0 0 8px rgba(255,82,82,0.55); transform: scale(0.95); }
          50%      { opacity: 1;    box-shadow: 0 0 18px rgba(255,82,82,0.95); transform: scale(1.1); }
        }

        .bw-intro-name {
          font-size: clamp(1.3rem, 2.3vw, 1.65rem);
          font-weight: 900;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #F5F0DC;
          text-shadow: 0 0 32px rgba(245,240,220,0.22);
          white-space: nowrap;
          margin-bottom: 0.4rem;
        }
        .bw-intro-name-accent {
          color: #7DD4C8;
          text-shadow: 0 0 28px rgba(125,212,200,0.5);
        }

        .bw-intro.phase2 .bw-intro-onair,
        .bw-intro.phase2 .bw-intro-name,
        .bw-intro.phase2 .bw-intro-cta {
          display: none;
        }

        .bw-intro-frame {
          position: relative;
          padding: 16px 16px 18px;
          background: linear-gradient(180deg, #1e2828 0%, #0d1616 100%);
          box-shadow:
            inset 0 0 24px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(245,240,220,0.06),
            0 28px 70px rgba(0,0,0,0.65),
            0 0 0 1px rgba(245,240,220,0.04);
          animation: bw-intro-breath 5s ease-in-out infinite alternate;
          transform-origin: center center;
        }
        @keyframes bw-intro-breath {
          from { transform: scale(1); }
          to   { transform: scale(1.006); }
        }
        .bw-intro.entering:not(.reduced) .bw-intro-frame {
          animation: bw-camera-push 600ms cubic-bezier(0.4, 0, 0.2, 1) 400ms forwards;
        }
        @keyframes bw-camera-push {
          to { transform: scale(3.5); }
        }

        .bw-intro-doorframe {
          width: min(420px, 70vw);
          height: min(560px, 64vh);
          position: relative;
          transform-style: preserve-3d;
        }

        .bw-intro-door {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          background:
            linear-gradient(90deg,
              rgba(255,255,255,0.04) 0%,
              transparent 8%,
              transparent 92%,
              rgba(0,0,0,0.22) 100%
            ),
            linear-gradient(180deg, #2c2e32 0%, #181a1e 100%);
          border: 1px solid rgba(245,240,220,0.12);
          box-shadow:
            inset 0 0 110px rgba(0,0,0,0.55),
            inset 0 1px 0 rgba(245,240,220,0.05);
          transition: transform 1s cubic-bezier(0.42, 0, 0.2, 1) 0.05s;
          backface-visibility: hidden;
        }
        .bw-intro-door::before,
        .bw-intro-door::after {
          content: "";
          position: absolute;
          left: 13%;
          right: 13%;
          height: 26%;
          border: 1px solid rgba(245,240,220,0.07);
          box-shadow: inset 0 0 12px rgba(0,0,0,0.4);
          pointer-events: none;
        }
        .bw-intro-door::before { top: 9%; }
        .bw-intro-door::after  { bottom: 9%; }
        .bw-intro-door-left  { left: 0;  transform-origin: left center;  border-right: 0; }
        .bw-intro-door-right { right: 0; transform-origin: right center; border-left: 0; }

        .bw-intro:not(.entering):hover .bw-intro-door-left  { transform: rotateY(-3deg); }
        .bw-intro:not(.entering):hover .bw-intro-door-right { transform: rotateY( 3deg); }
        .bw-intro:not(.entering):hover .bw-intro-lightgap   { width: 4px; filter: brightness(1.2); }
        .bw-intro:not(.entering):hover .bw-intro-floorglow  { opacity: 1; filter: brightness(1.15); }

        .bw-intro.entering:not(.reduced) .bw-intro-door-left {
          animation:
            bw-door-left-swing 600ms cubic-bezier(0.6, 0.05, 0.3, 1) 0ms forwards,
            bw-door-blur 600ms ease-in 400ms forwards;
        }
        .bw-intro.entering:not(.reduced) .bw-intro-door-right {
          animation:
            bw-door-right-swing 600ms cubic-bezier(0.6, 0.05, 0.3, 1) 0ms forwards,
            bw-door-blur 600ms ease-in 400ms forwards;
        }
        @keyframes bw-door-left-swing  { to { transform: rotateY(-95deg); } }
        @keyframes bw-door-right-swing { to { transform: rotateY( 95deg); } }
        @keyframes bw-door-blur        { to { filter: blur(6px); } }

        .bw-intro-handle {
          position: absolute;
          top: 50%;
          width: 11px;
          height: 38px;
          border-radius: 5px;
          transform: translateY(-50%);
          background:
            linear-gradient(135deg, #fce18b 0%, #c9a045 48%, #7a5618 100%);
          box-shadow:
            0 3px 6px rgba(0,0,0,0.7),
            inset -1px -2px 3px rgba(0,0,0,0.45),
            inset 1px 1px 2px rgba(255,235,180,0.7);
        }
        .bw-intro-handle-left  { right: 14px; }
        .bw-intro-handle-right { left: 14px; }

        .bw-intro.entering:not(.reduced) .bw-intro-handle {
          animation: bw-handle-twitch 220ms cubic-bezier(0.3, 0, 0.5, 1) 30ms;
        }
        @keyframes bw-handle-twitch {
          0%   { transform: translateY(-50%); }
          35%  { transform: translateY(calc(-50% + 4px)); }
          100% { transform: translateY(-50%); }
        }

        .bw-intro-lightgap {
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, transparent 0%, #ffa85c 40%, #ffd09c 50%, #ffa85c 60%, transparent 100%);
          box-shadow:
            0 0 50px rgba(255,168,92,0.85),
            0 0 18px rgba(255,210,150,0.7);
          transform: translateX(-50%);
          transition: width 0.3s ease, filter 0.3s ease;
          pointer-events: none;
          animation: bw-intro-flicker 3.6s ease-in-out infinite;
        }
        @keyframes bw-intro-flicker {
          0%   { opacity: 0.85; filter: brightness(1); }
          18%  { opacity: 0.94; filter: brightness(1.12); }
          29%  { opacity: 0.78; filter: brightness(0.9); }
          43%  { opacity: 0.97; filter: brightness(1.15); }
          58%  { opacity: 0.84; filter: brightness(1); }
          71%  { opacity: 0.76; filter: brightness(0.88); }
          85%  { opacity: 0.91; filter: brightness(1.06); }
          100% { opacity: 0.85; filter: brightness(1); }
        }
        .bw-intro.entering:not(.reduced) .bw-intro-lightgap {
          animation: bw-lightgap-fade 200ms ease-out 0ms forwards;
        }
        @keyframes bw-lightgap-fade { to { opacity: 0; } }

        .bw-intro-floorglow {
          margin-top: -28px;
          width: 90%;
          height: 64px;
          background: radial-gradient(ellipse at center top, rgba(255,168,92,0.4) 0%, rgba(255,168,92,0.15) 35%, transparent 70%);
          filter: blur(10px);
          pointer-events: none;
          opacity: 0.85;
          animation: bw-intro-flicker 3.6s ease-in-out infinite;
          transition: opacity 0.6s ease, filter 0.3s ease;
        }
        .bw-intro.entering:not(.reduced) .bw-intro-floorglow {
          animation: bw-floorglow-fade 400ms ease-out 100ms forwards;
        }
        @keyframes bw-floorglow-fade { to { opacity: 0; } }

        .bw-intro-cta {
          position: absolute;
          bottom: 9%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
          font-size: 0.72rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(245,240,220,0.6);
          animation: bw-intro-cta-pulse 2.4s ease-in-out infinite;
          z-index: 5;
        }
        @keyframes bw-intro-cta-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.95; }
        }
        .bw-intro-chevron {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffa85c;
          text-shadow: 0 0 10px rgba(255,168,92,0.7);
          animation: bw-intro-chevron-nudge 1.6s ease-in-out infinite;
        }
        @keyframes bw-intro-chevron-nudge {
          0%, 100% { transform: translateX(0); opacity: 0.7; }
          50%      { transform: translateX(5px); opacity: 1; }
        }

        @media (max-width: 480px) {
          .bw-intro-stage { gap: 0.6rem; }
          .bw-intro-name { font-size: 1.1rem; letter-spacing: 0.18em; }
          .bw-intro-cta { font-size: 0.68rem; letter-spacing: 0.24em; }
        }
      `}</style>

      <div
        className={className}
        onClick={enter}
        role="button"
        tabIndex={0}
        aria-label="Studio betreten"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") enter(); }}
      >
        <button className="bw-intro-skip" onClick={skip} aria-label="Intro überspringen">
          Überspringen ×
        </button>

        <div className="bw-intro-bloom" />
        <div className="bw-intro-whiteflash" />

        <div className="bw-intro-scene">
          <div className="bw-intro-stage" ref={stageRef}>
            <div className="bw-intro-onair">
              <span className="bw-intro-onair-dot" />
              On Air
            </div>

            <div className="bw-intro-name">
              Blickwinkel <span className="bw-intro-name-accent">Schweiz</span>
            </div>

            <div className="bw-intro-frame">
              <div className="bw-intro-doorframe">
                <div className="bw-intro-door bw-intro-door-left">
                  <span className="bw-intro-handle bw-intro-handle-left" />
                </div>
                <div className="bw-intro-door bw-intro-door-right">
                  <span className="bw-intro-handle bw-intro-handle-right" />
                </div>
                <div className="bw-intro-lightgap" />
              </div>
            </div>

            <div className="bw-intro-floorglow" />
          </div>
        </div>

        <div className="bw-intro-cta">
          <span className="bw-intro-chevron">›</span>
          Klicke um einzutreten
        </div>
      </div>
    </>
  );
}
