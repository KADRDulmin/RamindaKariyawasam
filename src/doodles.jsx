// Decorative SVG doodles used on the boards
const { useEffect, useRef, useState } = React;

const Arrow = ({ className = "", style }) => (
  <svg className={className} style={style} viewBox="0 0 120 80" width="120" height="80" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round">
    <path d="M6 50 C 20 10, 60 10, 90 40" />
    <path d="M90 40 L 82 34" />
    <path d="M90 40 L 92 30" />
  </svg>
);

const Star = ({ size = 30, color = "var(--ink)", style, className }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2 L14.5 9 L22 10 L16 14.5 L18 22 L12 18 L6 22 L8 14.5 L2 10 L9.5 9 Z" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

const Swirl = ({ style, className }) => (
  <svg className={className} style={style} viewBox="0 0 60 60" width="60" height="60" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round">
    <path d="M30 30 m -12 0 a 12 12 0 1 1 24 0 a 8 8 0 1 1 -16 0 a 5 5 0 1 1 10 0" />
  </svg>
);

const Heart = ({ size = 24, style, className }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" fill="#e05c5c" stroke="var(--line)" strokeWidth="1.5"/>
  </svg>
);

const Sparkle = ({ size = 20, style, className }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2 V10 M12 14 V22 M2 12 H10 M14 12 H22" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Squiggle = ({ style, className, w = 120, color = "var(--ink)" }) => (
  <svg className={className} style={style} viewBox="0 0 120 20" width={w} height="20" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <path d="M2 10 Q 12 2, 22 10 T 42 10 T 62 10 T 82 10 T 102 10 T 118 10"/>
  </svg>
);

// Cursor-reactive sticky note for hero
function ReactiveNote({ children, baseRot = 0, color = "yellow", x = 50, y = 50, strength = 14, size = "auto", tape = true, pin = false, zIndex = 1 }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, rz: baseRot });

  useEffect(() => {
    let raf;
    const tick = () => {
      const el = ref.current;
      if (!el || !window.__cursor) { raf = requestAnimationFrame(tick); return; }
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (window.__cursor.x - cx) / Math.max(rect.width, 300);
      const dy = (window.__cursor.y - cy) / Math.max(rect.height, 300);
      const w = (window.__TWEAKS && window.__TWEAKS.wobble != null) ? window.__TWEAKS.wobble : 0.6;
      const s = strength * w;
      setTilt({
        rx: -dy * s,
        ry: dx * s,
        rz: baseRot + dx * 2 * w,
        tx: dx * 6 * w,
        ty: dy * 6 * w
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [baseRot, strength]);

  const className = `note ${color}${tape ? "" : " no-tape"}${pin ? " pin" : ""}`;
  const style = {
    position: "absolute",
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%,-50%) perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) rotate(${tilt.rz}deg) translate(${tilt.tx||0}px, ${tilt.ty||0}px)`,
    transition: "transform 0.15s cubic-bezier(.2,.8,.2,1.2)",
    transformStyle: "preserve-3d",
    width: size === "auto" ? "auto" : size,
    zIndex
  };
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

Object.assign(window, { Arrow, Star, Swirl, Heart, Sparkle, Squiggle, ReactiveNote });
