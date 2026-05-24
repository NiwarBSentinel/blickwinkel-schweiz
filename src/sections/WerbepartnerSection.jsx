import { colors, fonts } from "../lib/tokens";

const formats = [
  { label: "01 — PRE-ROLL", text: "Vorgelagerte Erwähnung, klar gekennzeichnet." },
  { label: "02 — HOST-READ", text: "Mitten in der Episode, in der Stimme des Hosts." },
  { label: "03 — INTEGRATION", text: "Die Marke wird Teil des Gesprächs." },
];

const eyebrowStyle = {
  fontFamily: fonts.mono,
  fontSize: "0.72rem",
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.55)",
};

const bodyTextStyle = {
  fontFamily: fonts.body,
  color: "rgba(255,255,255,0.78)",
  lineHeight: 1.7,
};

export default function WerbepartnerSection() {
  return (
    <section
      style={{
        padding: "clamp(5rem, 8vw, 7rem) 1.5rem",
        borderTop: "0.5px solid rgba(255,255,255,0.15)",
        borderBottom: "0.5px solid rgba(255,255,255,0.15)",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <span style={eyebrowStyle}>Für Marken &amp; Partner</span>

        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            color: "#FFFFFF",
            letterSpacing: "-0.005em",
            margin: "1.6rem 0 1.8rem",
          }}
        >
          Zielgruppenpassung{" "}
          <em
            style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontWeight: 400,
              color: colors.neonWarm,
            }}
          >
            schlägt
          </em>{" "}
          Reichweite.
        </h2>

        <p style={{ ...bodyTextStyle, fontSize: "1.05rem", maxWidth: "62ch", margin: 0 }}>
          Klassische Werbung funktioniert im Langformat nicht. Wir integrieren Marken so, dass sie zur Geschichte gehören — auf Mundart, mit echtem Bezug zur Zielgruppe Schweiz.
        </p>

        <div
          className="werbepartner-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2.5rem",
            marginTop: "clamp(3rem, 5vw, 4rem)",
          }}
        >
          {formats.map((f) => (
            <div key={f.label}>
              <div style={{ ...eyebrowStyle, letterSpacing: "0.18em", marginBottom: "0.7rem" }}>
                {f.label}
              </div>
              <p style={{ ...bodyTextStyle, fontSize: "0.98rem", margin: 0 }}>{f.text}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            margin: "clamp(4rem, 7vw, 5.5rem) auto clamp(3rem, 5vw, 4rem)",
          }}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(3.5rem, 9vw, 6rem)",
              fontWeight: 700,
              lineHeight: 1,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            2'000–3'000
          </div>
          <p
            style={{
              ...bodyTextStyle,
              fontSize: "0.95rem",
              maxWidth: "44ch",
              margin: "0.9rem auto 0",
            }}
          >
            monatliche Hörer:innen reichen für den Break-even von Werbepartnern.
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <a
            href="mailto:partner@blickwinkel-schweiz.ch?subject=Mediakit%20anfordern"
            style={{
              display: "inline-block",
              background: colors.neonWarm,
              color: colors.ink,
              padding: "1rem 2rem",
              fontFamily: fonts.display,
              fontSize: "0.95rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              boxShadow: "0 0 22px rgba(250,245,205,0.35)",
            }}
          >
            Mediakit anfordern →
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .werbepartner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
