import { colors, fonts } from "../lib/tokens";

const formats = [
  { numero: "01", label: "VOR DER TÜR", text: "Vorgelagerte Erwähnung, klar als Werbung markiert." },
  { numero: "02", label: "IN DER STIMME", text: "Mitten in der Episode, vom Host gelesen." },
  { numero: "03", label: "IM GESPRÄCH", text: "Die Marke wird Teil des Themas, nicht der Pause." },
];

export default function WerbepartnerSection() {
  return (
    <section
      style={{
        padding: "clamp(5rem, 8vw, 7rem) 1.5rem",
        borderTop: "0.5px solid rgba(255,255,255,0.15)",
        borderBottom: "0.5px solid rgba(255,255,255,0.15)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(250,245,205,0.018) 80px, rgba(250,245,205,0.018) 81px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 980, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.6rem" }}>
          <span style={{ width: 28, height: 1, background: colors.neonWarm, opacity: 0.55 }} />
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: "0.72rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Damit es weitergeht
          </span>
        </div>

        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
            fontWeight: 700,
            lineHeight: 1.02,
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
            margin: "0 0 1.8rem",
            textShadow: "0 0 60px rgba(250,245,205,0.08)",
          }}
        >
          Lieber wenige, die wirklich{" "}
          <em
            style={{
              fontFamily: fonts.body,
              fontStyle: "italic",
              fontWeight: 400,
              color: colors.neonWarm,
              textShadow: "0 0 24px rgba(250,245,205,0.35)",
            }}
          >
            zuhören
          </em>
          .
        </h2>

        <p
          style={{
            fontFamily: fonts.body,
            fontSize: "1.1rem",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.78)",
            maxWidth: "62ch",
            margin: 0,
          }}
        >
          Ein Podcast lebt nicht vom Quoten-Druck. Er lebt von Menschen, die zuhören wollen. Wer mit uns sendet, gehört in die Geschichte — nicht zwischen sie.
        </p>

        <div
          className="werbepartner-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2.5rem",
            marginTop: "clamp(3.5rem, 6vw, 5rem)",
          }}
        >
          {formats.map((f) => (
            <div key={f.label}>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: "3rem",
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "rgba(255,255,255,0.14)",
                  letterSpacing: "-0.02em",
                }}
              >
                {f.numero}
              </div>
              <div
                style={{
                  width: 24,
                  height: 1,
                  background: colors.neonWarm,
                  opacity: 0.5,
                  margin: "1rem 0",
                }}
              />
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: "0.74rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: colors.neonWarm,
                  marginBottom: "0.7rem",
                }}
              >
                {f.label}
              </div>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.78)",
                  margin: 0,
                }}
              >
                {f.text}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            margin: "clamp(4.5rem, 8vw, 6rem) auto clamp(3rem, 5vw, 4rem)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(680px, 90%)",
              height: 320,
              background:
                "radial-gradient(ellipse, rgba(250,245,205,0.09) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: "0.68rem",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "1.2rem",
              }}
            >
              · Break-even ·
            </div>

            <div
              style={{
                fontFamily: fonts.display,
                fontSize: "clamp(4rem, 11vw, 7.5rem)",
                fontWeight: 700,
                lineHeight: 0.95,
                color: "#FFFFFF",
                letterSpacing: "-0.025em",
                textShadow: "0 0 40px rgba(250,245,205,0.2)",
              }}
            >
              2'000–3'000
            </div>

            <p
              style={{
                fontFamily: fonts.body,
                fontSize: "1rem",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.78)",
                maxWidth: "48ch",
                margin: "1.2rem auto 0",
              }}
            >
              monatliche Hörer:innen reichen — für Partner, die zuhören wollen, statt zu rufen.
            </p>
          </div>
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
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              boxShadow: "0 0 22px rgba(250,245,205,0.35)",
              borderRadius: 2,
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
