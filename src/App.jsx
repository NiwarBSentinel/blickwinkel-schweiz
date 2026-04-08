import { useEffect, useRef } from "react";

const team = [
  { name: "Damian Kehr", role: "Redakteur & Moderator", initials: "DK" },
  { name: "Rendy Meyer", role: "Produktion", initials: "RM" },
  { name: "Niwar Barzani", role: "Marketing & Social Media", initials: "NB" },
];

const episodes = [
  { nr: "01", title: "Zwischen zwei Welten", guest: "Demnächst", duration: "— Min." },
  { nr: "02", title: "Vom Scheitern zum Erfolg", guest: "Demnächst", duration: "— Min." },
  { nr: "03", title: "Schweizer Perspektiven", guest: "Demnächst", duration: "— Min." },
];

export default function App() {
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

  return (
    <div style={{ background: "#4A6B6B", minHeight: "100vh", fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F0DC", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 4rem", borderBottom: "1px solid rgba(245,240,220,0.15)" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>BWS</span>
        <div style={{ display: "flex", gap: "2.5rem", fontSize: "0.95rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {["Podcast", "Team", "Episoden", "Kontakt"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: "rgba(245,240,220,0.75)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#F5F0DC"} onMouseLeave={e => e.target.style.color = "rgba(245,240,220,0.75)"}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <PlatformBtn href="https://spotify.com" label="Spotify" color="#1DB954" />
          <PlatformBtn href="https://youtube.com" label="YouTube" color="#FF0000" />
        </div>
      </nav>

      {/* HERO */}
      <section id="podcast" style={{ minHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 2rem", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(245,240,220,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <p style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(245,240,220,0.6)", marginBottom: "2rem" }}>
          🇨🇭 &nbsp; Schweizer Mundart Podcast
        </p>

        <div ref={heroRef} style={{ transition: "transform 0.15s ease-out" }}>
          <h1 style={{ margin: 0, lineHeight: 0.9, userSelect: "none" }}>
            <span style={{
              display: "block", fontSize: "clamp(5rem, 14vw, 11rem)", fontWeight: 900, letterSpacing: "0.04em",
              textTransform: "uppercase", color: "transparent",
              WebkitTextStroke: "2px #F5F0DC",
              textShadow: "0 0 30px rgba(245,240,220,0.25), 0 0 80px rgba(245,240,220,0.1)",
            }}>Blickwinkel</span>
            <span style={{
              display: "block", fontSize: "clamp(5rem, 14vw, 11rem)", fontWeight: 900, letterSpacing: "0.04em",
              textTransform: "uppercase", color: "transparent",
              WebkitTextStroke: "2px #7DD4C8",
              textShadow: "0 0 30px rgba(125,212,200,0.4), 0 0 80px rgba(125,212,200,0.2)",
            }}>Schweiz</span>
          </h1>
        </div>

        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "1.15rem", fontWeight: 400, color: "rgba(245,240,220,0.75)", maxWidth: "540px", margin: "2.5rem auto 3rem", lineHeight: 1.7 }}>
          Authentische Gespräche mit Schweizer Persönlichkeiten — über Herkunft, Werdegang und die grossen Fragen des Lebens. Auf Mundart. Ohne Filter.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="https://spotify.com" style={{ ...btnStyle, background: "#1DB954", color: "#fff", border: "none" }}>
            ▶ &nbsp; Auf Spotify hören
          </a>
          <a href="https://youtube.com" style={{ ...btnStyle, background: "transparent", color: "#F5F0DC", border: "2px solid rgba(245,240,220,0.4)" }}>
            ▶ &nbsp; Auf YouTube schauen
          </a>
        </div>

        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", fontSize: "0.75rem", letterSpacing: "0.2em", color: "rgba(245,240,220,0.35)", textTransform: "uppercase" }}>
          Scroll ↓
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ background: "rgba(0,0,0,0.2)", padding: "6rem 4rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <div>
            <Label>Über den Podcast</Label>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, margin: "1rem 0 1.5rem" }}>
              Echte Geschichten.<br />
              <span style={{ color: "#7DD4C8" }}>Echter Blickwinkel.</span>
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "1rem", color: "rgba(245,240,220,0.72)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              Blickwinkel Schweiz ist ein Langformat-Podcast, der Schweizer Persönlichkeiten aus Gesellschaft, Wirtschaft und Kultur eine Stimme gibt. 20 bis 40 Minuten Tiefe — auf Augenhöhe, auf Mundart.
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "1rem", color: "rgba(245,240,220,0.72)", lineHeight: 1.8 }}>
              Wir glauben: Die interessantesten Geschichten entstehen dann, wenn echte Menschen echte Fragen stellen. Kein Skript. Kein Filter.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {[
              { num: "20–40", label: "Minuten pro Episode" },
              { num: "CH", label: "Schweizer Mundart" },
              { num: "2×", label: "Plattformen: Spotify + YouTube" },
              { num: "100%", label: "Authentisch & ungefiltert" },
            ].map(({ num, label }) => (
              <div key={label} style={{ background: "rgba(245,240,220,0.07)", border: "1px solid rgba(245,240,220,0.12)", borderRadius: "12px", padding: "1.5rem" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#7DD4C8", lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.85rem", color: "rgba(245,240,220,0.6)", marginTop: "0.5rem", lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EPISODEN */}
      <section id="episoden" style={{ padding: "6rem 4rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Label>Episoden</Label>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, margin: "1rem 0 3rem" }}>
            Demnächst verfügbar
          </h2>
          {episodes.map((ep, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "2rem", padding: "1.5rem 0", borderBottom: "1px solid rgba(245,240,220,0.12)", cursor: "default" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "rgba(245,240,220,0.3)", letterSpacing: "0.1em", minWidth: "2rem" }}>{ep.nr}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>{ep.title}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.85rem", color: "rgba(245,240,220,0.5)", marginTop: "0.25rem" }}>{ep.guest}</div>
              </div>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.85rem", color: "rgba(245,240,220,0.4)" }}>{ep.duration}</span>
              <span style={{ background: "rgba(125,212,200,0.15)", color: "#7DD4C8", fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.8rem", borderRadius: "100px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Bald</span>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section id="team" style={{ background: "rgba(0,0,0,0.2)", padding: "6rem 4rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Label>Das Team</Label>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, margin: "1rem 0 3rem" }}>
            Hinter dem Mikrofon
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {team.map((m) => (
              <div key={m.name} style={{ background: "rgba(245,240,220,0.05)", border: "1px solid rgba(245,240,220,0.12)", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(125,212,200,0.2)", border: "2px solid rgba(125,212,200,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.3rem", fontWeight: 800, color: "#7DD4C8", letterSpacing: "0.05em" }}>{m.initials}</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.name}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.9rem", color: "rgba(245,240,220,0.55)", marginTop: "0.4rem" }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section style={{ padding: "6rem 4rem", textAlign: "center" }}>
        <Label>Jetzt zuhören</Label>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, textTransform: "uppercase", margin: "1rem auto 2.5rem", maxWidth: "600px", lineHeight: 1 }}>
          Überall wo du Podcasts hörst
        </h2>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://spotify.com" style={{ ...platformCardStyle, borderColor: "#1DB954" }}>
            <span style={{ fontSize: "2rem" }}>🎵</span>
            <span style={{ fontSize: "1.3rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Spotify</span>
          </a>
          <a href="https://youtube.com" style={{ ...platformCardStyle, borderColor: "#FF0000" }}>
            <span style={{ fontSize: "2rem" }}>▶</span>
            <span style={{ fontSize: "1.3rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>YouTube</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="kontakt" style={{ background: "rgba(0,0,0,0.35)", padding: "3rem 4rem", borderTop: "1px solid rgba(245,240,220,0.1)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Blickwinkel <span style={{ color: "#7DD4C8" }}>Schweiz</span>
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.85rem", color: "rgba(245,240,220,0.45)", marginTop: "0.3rem" }}>
              © 2026 Blickwinkel Schweiz. Alle Rechte vorbehalten.
            </div>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Instagram", "Spotify", "YouTube"].map(p => (
              <a key={p} href="#" style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.85rem", color: "rgba(245,240,220,0.5)", textDecoration: "none", letterSpacing: "0.05em" }}
                onMouseEnter={e => e.target.style.color = "#F5F0DC"} onMouseLeave={e => e.target.style.color = "rgba(245,240,220,0.5)"}>
                {p}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function Label({ children }) {
  return (
    <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "#7DD4C8" }}>
      {children}
    </span>
  );
}

function PlatformBtn({ href, label, color }) {
  return (
    <a href={href} style={{ background: color, color: "#fff", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {label}
    </a>
  );
}

const btnStyle = {
  display: "inline-block", padding: "0.9rem 2.2rem", borderRadius: "100px",
  fontSize: "0.95rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.08em",
  textTransform: "uppercase", transition: "opacity 0.2s", cursor: "pointer",
};

const platformCardStyle = {
  display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
  padding: "2rem 3rem", background: "rgba(245,240,220,0.05)",
  border: "1.5px solid", borderRadius: "16px", textDecoration: "none", color: "#F5F0DC",
  transition: "background 0.2s",
};
