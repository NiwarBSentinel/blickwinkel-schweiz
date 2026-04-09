import { useEffect, useRef, useState } from "react";
import imgDamian from "./assets/15.png";
import imgRendy from "./assets/16.png";
import imgNiwar from "./assets/17.png";
import { supabase } from "./lib/supabase";

// ── Typewriter Hook ──────────────────────────────────────────────
function useTypewriter(words, speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ── Scroll Reveal Hook ───────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Waveform Component ───────────────────────────────────────────
function Waveform() {
  const bars = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "48px", margin: "2rem auto", justifyContent: "center" }}>
      {bars.map(i => (
        <div key={i} style={{
          width: "3px", borderRadius: "2px",
          background: i % 3 === 0 ? "#7DD4C8" : "rgba(245,240,220,0.4)",
          height: `${20 + Math.sin(i * 0.6) * 14 + Math.cos(i * 0.3) * 10}px`,
          animation: `wave ${0.8 + (i % 5) * 0.15}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.04}s`,
        }} />
      ))}
    </div>
  );
}

// ── Team ─────────────────────────────────────────────────────────
const team = [
  { name: "Damian Kehr", role: "Redakteur & Moderator", initials: "DK", img: imgDamian, quote: "Jede Geschichte verdient es, gehört zu werden." },
  { name: "Rendy Meyer", role: "Produktion", initials: "RM", img: imgRendy, quote: "Sound ist Emotion — wir machen beides hörbar." },
  { name: "Niwar Barzani", role: "Marketing & Social Media", initials: "NB", img: imgNiwar, quote: "Die Schweiz hat mehr zu sagen als man denkt." },
];

// ── Newsletter Component ──────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    const { error } = await supabase.from("newsletter").insert({ email: email.trim().toLowerCase() });
    if (error) {
      if (error.code === "23505") {
        setStatus("success");
        setMsg("Du bist bereits angemeldet! 🎉");
      } else {
        setStatus("error");
        setMsg("Etwas ist schiefgelaufen. Versuche es später.");
      }
    } else {
      setStatus("success");
      setMsg("Willkommen an Bord! 🎉");
    }
    setEmail("");
  }

  return (
    <section style={{ padding: "6rem 5vw", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(245,240,220,0.015) 60px, rgba(245,240,220,0.015) 61px)", pointerEvents: "none" }} />
      <div className="reveal" style={{ maxWidth: "550px", margin: "0 auto", position: "relative" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: "#7DD4C8" }}>Newsletter</span>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, margin: "1rem 0 1rem" }}>
          Nichts<br /><span style={{ color: "#7DD4C8" }}>verpassen.</span>
        </h2>
        <p style={{ fontFamily: "'Lora', serif", fontSize: "0.95rem", color: "rgba(245,240,220,0.6)", lineHeight: 1.8, marginBottom: "2rem" }}>
          Neue Episoden, Behind-the-Scenes und exklusive Inhalte — direkt in dein Postfach.
        </p>

        {status === "success" ? (
          <div style={{ padding: "1.2rem 2rem", borderRadius: "12px", background: "rgba(125,212,200,0.12)", border: "1px solid rgba(125,212,200,0.3)", color: "#7DD4C8", fontWeight: 700, fontSize: "0.95rem" }}>
            {msg}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.75rem", maxWidth: "480px", margin: "0 auto" }}>
            <input
              type="email"
              required
              placeholder="deine@email.ch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: "0.85rem 1.2rem",
                borderRadius: "100px",
                border: "1.5px solid rgba(245,240,220,0.15)",
                background: "rgba(245,240,220,0.05)",
                color: "#F5F0DC",
                fontFamily: "'Lora', serif",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(125,212,200,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(245,240,220,0.15)"; }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                padding: "0.85rem 1.8rem",
                borderRadius: "100px",
                border: "none",
                background: "#7DD4C8",
                color: "#1a1a2e",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: status === "loading" ? "wait" : "pointer",
                opacity: status === "loading" ? 0.6 : 1,
                transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {status === "loading" ? "..." : "Anmelden"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p style={{ fontFamily: "'Lora', serif", fontSize: "0.8rem", color: "rgba(255,100,100,0.8)", marginTop: "1rem" }}>{msg}</p>
        )}

        <p style={{ fontFamily: "'Lora', serif", fontSize: "0.7rem", color: "rgba(245,240,220,0.25)", marginTop: "1.2rem" }}>
          Kein Spam. Jederzeit abmeldbar.
        </p>
      </div>
    </section>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function App() {
  useScrollReveal();
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 12;
      const y = ((e.clientY - top) / height - 0.5) * 8;
      el.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg)`;
    };
    const onLeave = () => { el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  const typeWords = [
    "über Scheitern.",
    "über Heimat.",
    "über Erfolg.",
    "über Träume.",
    "über die Schweiz.",
    "über das Leben.",
  ];
  const typed = useTypewriter(typeWords, 75, 1800);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;0,900;1,700&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; overflow-x: hidden; background: #3D5F5F; }
        #root { width: 100%; }
        a { text-decoration: none; color: inherit; }

        @keyframes wave {
          from { transform: scaleY(0.4); opacity: 0.5; }
          to   { transform: scaleY(1.0); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes slowDrift {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.35s; }

        .nav-link {
          color: rgba(245,240,220,0.65);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: color 0.2s;
          cursor: pointer;
        }
        .nav-link:hover { color: #F5F0DC; }

        .episode-card {
          background: rgba(245,240,220,0.04);
          border: 1px solid rgba(245,240,220,0.1);
          border-radius: 16px;
          padding: 1.8rem 2rem;
          transition: background 0.3s, border-color 0.3s, transform 0.3s;
          cursor: default;
        }
        .episode-card:hover {
          background: rgba(125,212,200,0.08);
          border-color: rgba(125,212,200,0.35);
          transform: translateY(-3px);
        }

        .team-card {
          background: rgba(245,240,220,0.04);
          border: 1px solid rgba(245,240,220,0.1);
          border-radius: 20px;
          padding: 2rem 1.5rem;
          text-align: center;
          transition: transform 0.3s, background 0.3s;
        }
        .team-card:hover {
          transform: translateY(-6px);
          background: rgba(245,240,220,0.08);
        }

        .platform-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          padding: 2rem 3.5rem;
          border-radius: 18px;
          border: 1.5px solid;
          background: rgba(245,240,220,0.04);
          color: #F5F0DC;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.2rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: transform 0.25s, background 0.25s;
          cursor: pointer;
        }
        .platform-btn:hover { transform: translateY(-4px); background: rgba(245,240,220,0.1); }

        @media (max-width: 768px) {
          .hero-title { font-size: clamp(3.5rem, 18vw, 7rem) !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .nav-links { display: none; }
          .section-pad { padding: 4rem 1.5rem !important; }
        }
      `}</style>

      <div style={{ background: "#3D5F5F", color: "#F5F0DC", fontFamily: "'Barlow Condensed', sans-serif", minHeight: "100vh", width: "100%" }}>

        {/* ── NAV ── */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.4rem 5vw", borderBottom: "1px solid rgba(245,240,220,0.1)", position: "sticky", top: 0, background: "rgba(61,95,95,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
          <span style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Blickwinkel <span style={{ color: "#7DD4C8" }}>Schweiz</span></span>
          <div className="nav-links" style={{ display: "flex", gap: "2.5rem" }}>
            {["Podcast", "Manifesto", "Team", "Episoden"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <a href="https://spotify.com" style={{ background: "#1DB954", color: "#fff", padding: "0.35rem 1rem", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Spotify</a>
            <a href="https://youtube.com" style={{ background: "#FF0000", color: "#fff", padding: "0.35rem 1rem", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>YouTube</a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="podcast" style={{ minHeight: "95vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "5rem 5vw 3rem", position: "relative", overflow: "hidden" }}>

          {/* background radial glow */}
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "500px", background: "radial-gradient(ellipse, rgba(125,212,200,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* floating mic decoration */}
          <div style={{ position: "absolute", right: "8%", top: "20%", fontSize: "12rem", opacity: 0.06, animation: "slowDrift 8s ease-in-out infinite", userSelect: "none" }}>🎙</div>
          <div style={{ position: "absolute", left: "6%", bottom: "25%", fontSize: "9rem", opacity: 0.05, animation: "slowDrift 11s ease-in-out infinite reverse", userSelect: "none" }}>🎧</div>

          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: "#7DD4C8", marginBottom: "2rem", animation: "fadeUp 0.8s ease both" }}>
            🇨🇭 &nbsp; Schweizer Mundart Podcast · 2026
          </p>

          <div style={{ animation: "fadeUp 0.9s ease 0.15s both" }}>
            <div ref={heroRef} style={{ transition: "transform 0.15s ease-out" }}>
              <h1 className="hero-title" style={{ fontSize: "clamp(4rem, 10vw, 9rem)", fontWeight: 900, lineHeight: 0.88, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                <span style={{ display: "block", color: "transparent", WebkitTextStroke: "2px #F5F0DC", textShadow: "0 0 40px rgba(245,240,220,0.4), 0 0 80px rgba(245,240,220,0.25), 0 0 140px rgba(245,240,220,0.1)" }}>Blickwinkel</span>
                <span style={{ display: "block", color: "transparent", WebkitTextStroke: "2px #7DD4C8", textShadow: "0 0 40px rgba(125,212,200,0.6), 0 0 80px rgba(125,212,200,0.4), 0 0 140px rgba(125,212,200,0.2)" }}>Schweiz</span>
              </h1>
            </div>
          </div>

          <Waveform />

          {/* typewriter line */}
          <div style={{ animation: "fadeUp 1s ease 0.3s both", minHeight: "2.5rem", marginBottom: "1rem" }}>
            <p style={{ fontFamily: "'Lora', serif", fontSize: "clamp(1rem, 2.5vw, 1.4rem)", fontStyle: "italic", color: "rgba(245,240,220,0.8)", letterSpacing: "0.02em" }}>
              Echte Gespräche —{" "}
              <span style={{ color: "#7DD4C8" }}>{typed}</span>
              <span style={{ animation: "blink 1s step-end infinite", color: "#7DD4C8" }}>|</span>
            </p>
          </div>

          <p style={{ fontFamily: "'Lora', serif", fontSize: "1rem", color: "rgba(245,240,220,0.6)", maxWidth: "480px", lineHeight: 1.8, marginBottom: "2.5rem", animation: "fadeUp 1s ease 0.45s both" }}>
            Authentische Gespräche mit Schweizer Persönlichkeiten — ohne Drehbuch, auf Mundart, direkt ins Herz.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 1s ease 0.6s both" }}>
            <a href="https://spotify.com" style={{ background: "#1DB954", color: "#fff", padding: "0.85rem 2.2rem", borderRadius: "100px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", transition: "transform 0.2s, opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              ▶ &nbsp;Auf Spotify hören
            </a>
            <a href="https://youtube.com" style={{ border: "2px solid rgba(245,240,220,0.3)", color: "#F5F0DC", padding: "0.85rem 2.2rem", borderRadius: "100px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", transition: "border-color 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,240,220,0.7)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,240,220,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              ▶ &nbsp;Auf YouTube schauen
            </a>
          </div>
        </section>

        {/* ── MANIFESTO ── */}
        <section id="manifesto" style={{ background: "rgba(0,0,0,0.25)", padding: "8rem 5vw", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(245,240,220,0.02) 60px, rgba(245,240,220,0.02) 61px)", pointerEvents: "none" }} />
          <div className="reveal" style={{ maxWidth: "820px", margin: "0 auto" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: "#7DD4C8" }}>Unser Manifesto</span>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.4, margin: "2rem 0", color: "#F5F0DC" }}>
              "Jeder Mensch trägt eine Geschichte in sich.<br />
              <span style={{ color: "#7DD4C8", fontStyle: "normal", fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.1em", textTransform: "uppercase", letterSpacing: "0.04em" }}>Wir holen sie raus.</span>"
            </h2>
            <div style={{ width: "60px", height: "2px", background: "#7DD4C8", margin: "2rem auto" }} />
            <p style={{ fontFamily: "'Lora', serif", fontSize: "1.05rem", color: "rgba(245,240,220,0.65)", lineHeight: 1.85, maxWidth: "600px", margin: "0 auto" }}>
              Die Schweiz ist mehr als Berge und Banken. Sie ist voller Menschen mit aussergewöhnlichen Wegen — Unternehmerinnen, Aktivisten, Künstlerinnen, Träumer. Wir geben ihnen ein Mikrofon. Auf Mundart. Ohne Filter.
            </p>
          </div>
        </section>

        {/* ── WARUM WIR ── */}
        <section style={{ padding: "7rem 5vw" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }} className="two-col section-pad">
            <div className="reveal">
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: "#7DD4C8" }}>Warum wir das machen</span>
              <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, margin: "1rem 0 1.5rem" }}>
                Mundart ist<br /><span style={{ color: "#7DD4C8" }}>Identität.</span>
              </h2>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "1rem", color: "rgba(245,240,220,0.68)", lineHeight: 1.85, marginBottom: "1.2rem" }}>
                In einer Zeit, wo Algorithmen entscheiden was wir sehen, wollen wir das Gegenteil: Langsamkeit. Tiefe. Gespräche, die länger als 60 Sekunden dauern.
              </p>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "1rem", color: "rgba(245,240,220,0.68)", lineHeight: 1.85 }}>
                Schweizer Mundart ist kein Dialekt — sie ist Heimat. Und diese Heimat hat Geschichten verdient, die gehört werden.
              </p>
            </div>
            <div className="reveal reveal-delay-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
              {[
                { num: "20–40", sub: "Min. Gespräche auf Augenhöhe" },
                { num: "CH", sub: "Schweizer Mundart · authentisch" },
                { num: "2×", sub: "Spotify & YouTube" },
                { num: "∞", sub: "Geschichten, die bleiben" },
              ].map(({ num, sub }) => (
                <div key={sub} style={{ background: "rgba(245,240,220,0.06)", border: "1px solid rgba(245,240,220,0.1)", borderRadius: "14px", padding: "1.4rem" }}>
                  <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#7DD4C8", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: "0.8rem", color: "rgba(245,240,220,0.55)", marginTop: "0.5rem", lineHeight: 1.5 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EPISODEN ── */}
        <section id="episoden" style={{ background: "rgba(0,0,0,0.2)", padding: "7rem 5vw" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div className="reveal" style={{ marginBottom: "3rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: "#7DD4C8" }}>Episoden</span>
              <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, margin: "1rem 0 0.5rem" }}>
                Kommt bald.
              </h2>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "0.95rem", color: "rgba(245,240,220,0.5)", fontStyle: "italic" }}>
                Wer wird der erste Gast sein? Bald weisst du es.
              </p>
            </div>
            {[
              { nr: "01", title: "Episode 01", teaser: "Ein Schweizer. Eine Geschichte. Demnächst.", delay: "" },
              { nr: "02", title: "Episode 02", teaser: "Wer wagt, gewinnt — oder verliert. Und erzählt davon.", delay: "reveal-delay-1" },
              { nr: "03", title: "Episode 03", teaser: "Heimat ist nicht dort wo man geboren wird.", delay: "reveal-delay-2" },
            ].map((ep) => (
              <div key={ep.nr} className={`episode-card reveal ${ep.delay}`} style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 900, color: "rgba(245,240,220,0.25)", letterSpacing: "0.1em", minWidth: "2rem" }}>{ep.nr}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>{ep.title}</div>
                    <div style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", fontStyle: "italic", color: "rgba(245,240,220,0.5)", marginTop: "0.3rem" }}>{ep.teaser}</div>
                  </div>
                  <span style={{ background: "rgba(125,212,200,0.12)", color: "#7DD4C8", fontSize: "0.65rem", fontWeight: 700, padding: "0.3rem 0.9rem", borderRadius: "100px", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TEAM ── */}
        <section id="team" style={{ padding: "7rem 5vw" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div className="reveal" style={{ marginBottom: "3rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: "#7DD4C8" }}>Das Team</span>
              <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, margin: "1rem 0" }}>
                Drei Köpfe.<br /><span style={{ color: "#7DD4C8" }}>Eine Stimme.</span>
              </h2>
            </div>
            <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {team.map((m, i) => (
                <div key={m.name} className={`team-card reveal reveal-delay-${i + 1}`}>
                  <img src={m.img} alt={m.name} style={{ width: "140px", height: "140px", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "3px solid rgba(125,212,200,0.35)", margin: "0 auto 1.2rem", display: "block" }} />
                  <div style={{ fontSize: "1.2rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.name}</div>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: "0.8rem", color: "rgba(245,240,220,0.45)", margin: "0.3rem 0 1.2rem" }}>{m.role}</div>
                  <div style={{ width: "30px", height: "1.5px", background: "#7DD4C8", margin: "0 auto 1rem" }} />
                  <p style={{ fontFamily: "'Lora', serif", fontSize: "0.85rem", fontStyle: "italic", color: "rgba(245,240,220,0.6)", lineHeight: 1.6 }}>"{m.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: "rgba(0,0,0,0.3)", padding: "7rem 5vw", textAlign: "center" }}>
          <div className="reveal" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, marginBottom: "1.5rem" }}>
              Bereit<br /><span style={{ color: "#7DD4C8" }}>zuzuhören?</span>
            </h2>
            <p style={{ fontFamily: "'Lora', serif", fontSize: "1rem", color: "rgba(245,240,220,0.6)", lineHeight: 1.8, marginBottom: "3rem" }}>
              Folge uns jetzt und verpasse keine Episode. Die ersten Gespräche kommen bald — und sie werden dich nicht kalt lassen.
            </p>
            <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://spotify.com" className="platform-btn" style={{ borderColor: "#1DB954" }}>
                <span style={{ fontSize: "1.8rem" }}>🎵</span>
                Spotify
              </a>
              <a href="https://youtube.com" className="platform-btn" style={{ borderColor: "#FF0000" }}>
                <span style={{ fontSize: "1.8rem" }}>▶</span>
                YouTube
              </a>
            </div>
          </div>
        </section>

        {/* ── NEWSLETTER ── */}
        <Newsletter />

        {/* ── FOOTER ── */}
        <footer style={{ background: "rgba(0,0,0,0.4)", padding: "2.5rem 5vw", borderTop: "1px solid rgba(245,240,220,0.08)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Blickwinkel <span style={{ color: "#7DD4C8" }}>Schweiz</span>
              </div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: "0.78rem", color: "rgba(245,240,220,0.35)", marginTop: "0.25rem", fontStyle: "italic" }}>
                Echte Geschichten. Echter Blickwinkel.
              </div>
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "0.75rem", color: "rgba(245,240,220,0.3)" }}>
              © 2026 Blickwinkel Schweiz · Alle Rechte vorbehalten
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {["Instagram", "Spotify", "YouTube"].map(p => (
                <a key={p} href="#" style={{ fontFamily: "'Lora', serif", fontSize: "0.8rem", color: "rgba(245,240,220,0.4)", letterSpacing: "0.04em", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#F5F0DC"}
                  onMouseLeave={e => e.target.style.color = "rgba(245,240,220,0.4)"}>
                  {p}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
