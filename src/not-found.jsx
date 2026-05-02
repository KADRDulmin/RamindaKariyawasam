function NotFound() {
  const viewerRef = React.useRef(null);

  React.useEffect(() => {
    // Set url attribute directly on the custom element after mount
    if (viewerRef.current) {
      viewerRef.current.setAttribute(
        "url",
        "https://prod.spline.design/3BUV9O7mq5NeiCvk/scene.splinecode"
      );
    }
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "var(--paper)",
      }}
    >
      {/* Spline 3D scene — full background */}
      <spline-viewer
        ref={viewerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      ></spline-viewer>

      {/* Sticky note overlay */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-2.5deg)",
          zIndex: 10,
          maxWidth: 400,
          width: "88%",
        }}
      >
        {/* Tape strip */}
        <div
          style={{
            position: "absolute",
            top: -18,
            left: "50%",
            transform: "translateX(-50%) rotate(1deg)",
            width: 88,
            height: 30,
            background: "var(--tape)",
            border: "1px solid var(--tape-edge)",
            borderRadius: 4,
            zIndex: 1,
          }}
        />

        <div
          style={{
            background: "var(--note-yellow)",
            padding: "40px 32px 32px",
            borderRadius: 4,
            boxShadow: "5px 8px 24px var(--shadow), 0 2px 6px var(--shadow)",
            position: "relative",
          }}
        >
          {/* Big 404 */}
          <div
            style={{
              fontFamily: "'Caveat Brush', cursive",
              fontSize: 100,
              lineHeight: 0.9,
              color: "var(--note-ink)",
              marginBottom: 10,
              letterSpacing: "-2px",
            }}
          >
            404
          </div>

          <div
            style={{
              fontFamily: "'Caveat Brush', cursive",
              fontSize: 24,
              color: "var(--note-ink)",
              marginBottom: 14,
            }}
          >
            You've fallen off the cork board.
          </div>

          <p
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: 15,
              color: "var(--note-ink)",
              lineHeight: 1.65,
              margin: "0 0 8px",
            }}
          >
            This page doesn't exist — not even as a crumpled draft. We checked
            under the keyboard, behind the monitor, and inside every sticky note.
          </p>
          <p
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: 15,
              color: "var(--note-ink)",
              lineHeight: 1.65,
              margin: "0 0 24px",
            }}
          >
            Nothing. Nada. It's gone. Maybe it got stuck to someone's shoe. 🙃
          </p>

          <a
            href="/"
            style={{
              display: "inline-block",
              background: "var(--ink)",
              color: "var(--paper)",
              fontFamily: "'Patrick Hand', cursive",
              fontSize: 15,
              padding: "10px 22px",
              borderRadius: 999,
              textDecoration: "none",
              boxShadow: "2px 3px 8px var(--shadow)",
              letterSpacing: "0.02em",
            }}
          >
            ← stick me back home
          </a>
        </div>
      </div>
    </div>
  );
}
