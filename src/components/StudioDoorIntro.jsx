import { useEffect, useState } from "react";

export default function StudioDoorIntro() {
  const [phase, setPhase] = useState("idle");
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasHash = window.location.hash && window.location.hash !== "#";
    const played = sessionStorage.getItem("bw-intro-played");

    if (reducedMotion || hasHash || played) {
      setMounted(false);
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function enter() {
    if (phase !== "idle") return;
    setPhase("entering");
    sessionStorage.setItem("bw-intro-played", "1");
    setTimeout(() => setPhase("done"), 2050);
    setTimeout(() => {
      document.body.style.overflow = "";
      setMounted(false);
    }, 3050);
  }

  function skip(e) {
    e.stopPropagation();
    sessionStorage.setItem("bw-intro-played", "1");
    setPhase("done");
    setTimeout(() => {
      document.body.style.overflow = "";
      setMounted(false);
    }, 450);
  }

  if (!mounted) return null;

  return (
    <>
      <style>{`
        .bw-intro {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: radial-gradient(ellipse at center, #1c2a2a 0%, #0a1414 80%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          user-select: none;
        }
        .bw-intro.done {
          opacity: 0;
          pointer-events: none;
        }
        .bw-intro-onair {
          position: absolute;
          top: 6%;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.42em;
          color: #e85a5a;
          text-shadow: 0 0 14px rgba(232,90,90,0.55);
        }
        .bw-intro-name {
          position: absolute;
          top: 12%;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.2rem, 2.2vw, 1.55rem);
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #F5F0DC;
          text-shadow: 0 0 32px rgba(245,240,220,0.25);
          white-space: nowrap;
        }
        .bw-intro-name-accent {
          color: #7DD4C8;
          text-shadow: 0 0 28px rgba(125,212,200,0.45);
        }
        .bw-intro-onair-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e85a5a;
          box-shadow: 0 0 12px rgba(232,90,90,0.8);
          animation: bw-intro-blink 1.6s ease-in-out infinite;
        }
        @keyframes bw-intro-blink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .bw-intro-scene {
          perspective: 1400px;
          perspective-origin: center center;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bw-intro-doorframe {
          width: min(440px, 78vw);
          height: min(640px, 78vh);
          position: relative;
          transform-style: preserve-3d;
          transition: transform 2s cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
        }
        .bw-intro.entering .bw-intro-doorframe {
          transform: translateZ(950px);
        }

        .bw-intro-door {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(180deg, #2c3a36 0%, #1a2622 100%);
          border: 1px solid rgba(245,240,220,0.18);
          box-shadow:
            inset 0 0 90px rgba(0,0,0,0.55),
            0 20px 60px rgba(0,0,0,0.45);
          transition: transform 1.8s cubic-bezier(0.5, 0, 0.2, 1) 0.05s;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bw-intro-door::before,
        .bw-intro-door::after {
          content: "";
          position: absolute;
          left: 14%;
          right: 14%;
          height: 22%;
          border: 1px solid rgba(245,240,220,0.08);
          pointer-events: none;
        }
        .bw-intro-door::before { top: 10%; }
        .bw-intro-door::after  { bottom: 10%; }

        .bw-intro-door-left {
          left: 0;
          transform-origin: left center;
          border-right: 0;
        }
        .bw-intro-door-right {
          right: 0;
          transform-origin: right center;
          border-left: 0;
        }
        .bw-intro.entering .bw-intro-door-left  { transform: rotateY(-115deg); }
        .bw-intro.entering .bw-intro-door-right { transform: rotateY( 115deg); }

        .bw-intro-handle {
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(245,240,220,0.55);
          box-shadow: 0 0 14px rgba(245,240,220,0.35);
        }
        .bw-intro-handle-left  { right: 14px; transform: translateY(-50%); }
        .bw-intro-handle-right { left: 14px;  transform: translateY(-50%); }

        .bw-intro-lightgap {
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, transparent 0%, #FAF5CD 50%, transparent 100%);
          box-shadow: 0 0 50px rgba(250,245,205,0.7);
          transform: translateX(-50%);
          transition: opacity 0.8s ease-out;
          pointer-events: none;
        }
        .bw-intro.entering .bw-intro-lightgap { opacity: 0; }

        .bw-intro-cta {
          position: absolute;
          bottom: 9%;
          font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
          font-size: 0.72rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(245,240,220,0.55);
          animation: bw-intro-pulse 2.4s ease-in-out infinite;
          transition: opacity 0.3s ease;
        }
        .bw-intro.entering .bw-intro-cta { opacity: 0; }
        @keyframes bw-intro-pulse {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 0.92; }
        }

        .bw-intro-skip {
          position: absolute;
          top: 1.4rem;
          right: 1.4rem;
          background: transparent;
          border: 0;
          color: rgba(245,240,220,0.45);
          font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 0.5rem 0.8rem;
          z-index: 10;
          transition: color 0.2s ease;
        }
        .bw-intro-skip:hover { color: #F5F0DC; }
      `}</style>

      <div
        className={`bw-intro ${phase}`}
        onClick={enter}
        role="button"
        tabIndex={0}
        aria-label="Studio betreten"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") enter(); }}
      >
        <button className="bw-intro-skip" onClick={skip} aria-label="Intro überspringen">
          Überspringen ×
        </button>

        <div className="bw-intro-onair">
          <span className="bw-intro-onair-dot" />
          On Air
        </div>

        <div className="bw-intro-name">
          Blickwinkel <span className="bw-intro-name-accent">Schweiz</span>
        </div>

        <div className="bw-intro-scene">
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

        <div className="bw-intro-cta">Klicke um einzutreten</div>
      </div>
    </>
  );
}
