const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateElement(element, keyframes, options) {
  if (!element || prefersReducedMotion()) return;
  element.animate(keyframes, { duration: 560, easing: "cubic-bezier(.2,.8,.2,1)", ...options });
}

function revealSectionHeading(heading) {
  animateElement(heading.querySelector(".num"), [
    { opacity: 0, transform: "scale(.45) rotate(-14deg)" },
    { opacity: 1, transform: "none" },
  ], { duration: 480 });
  animateElement(heading.querySelector("h2"), [
    { opacity: 0, transform: "translateX(-32px)" },
    { opacity: 1, transform: "none" },
  ], { delay: 70 });
}

function revealNote(note) {
  if (note.classList.contains("dragging")) return;
  const finalTransform = getComputedStyle(note).transform;
  animateElement(note, [
    { opacity: 0, transform: "translateY(38px) scale(.94)" },
    { opacity: 1, transform: finalTransform === "none" ? "none" : finalTransform },
  ], { duration: 520 });

  note.querySelectorAll(".chip").forEach((chip, index) => {
    const chipTransform = getComputedStyle(chip).transform;
    animateElement(chip, [
      { opacity: 0, transform: "scale(.75)" },
      { opacity: 1, transform: chipTransform === "none" ? "none" : chipTransform },
    ], { duration: 300, delay: Math.min(index * 24, 220) });
  });
}

function revealTimelineItem(item) {
  animateElement(item, [
    { opacity: 0, transform: "translateX(-24px)" },
    { opacity: 1, transform: "none" },
  ], { duration: 440 });
}

function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (entry.target.classList.contains("section-head")) revealSectionHeading(entry.target);
      else if (entry.target.classList.contains("timeline-item")) revealTimelineItem(entry.target);
      else revealNote(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

  document.querySelectorAll([
    "#board-about .section-head",
    "#board-nsbm .section-head",
    "#board-work .section-head",
    "#board-toolkit .section-head",
    "#board-contact .section-head",
    "#board-about .note",
    "#board-nsbm .note",
    "#board-work .note",
    "#board-toolkit .note",
    "#board-contact .note",
    ".timeline-item",
  ].join(",")).forEach((element) => observer.observe(element));
}

function injectDividers() {
  document.querySelectorAll(".board-wrap:not(:first-child)").forEach((board) => {
    const wrapper = document.createElement("div");
    wrapper.className = "board-divider";
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.innerHTML = '<svg viewBox="0 0 1200 40" preserveAspectRatio="none"><path d="M0 20 Q 100 8 200 20 T 400 20 T 600 20 T 800 20 T 1000 20 T 1200 20" pathLength="1" /></svg>';
    board.before(wrapper);
    const path = wrapper.querySelector("path");
    path.style.strokeDasharray = "1";
    path.style.strokeDashoffset = "1";
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      animateElement(path, [
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0 },
      ], { duration: 900, easing: "ease-in-out", delay: 100, fill: "forwards" });
    }, { threshold: 0.04 });
    observer.observe(board);
  });
}

function burstConfetti(anchor) {
  const styles = getComputedStyle(document.documentElement);
  const colors = ["--note-yellow", "--note-pink", "--note-mint", "--note-sky", "--note-lav", "--note-peach"]
    .map((name) => styles.getPropertyValue(name).trim());
  const rect = anchor.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = Math.max(48, rect.top + 80);

  for (let index = 0; index < 18; index += 1) {
    const particle = document.createElement("span");
    const size = 7 + Math.random() * 9;
    const angle = (Math.PI * 2 * index / 18) + (Math.random() - 0.5) * 0.7;
    const distance = 90 + Math.random() * 170;
    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance + 60;
    particle.className = "confetti-particle";
    particle.style.cssText = `left:${originX}px;top:${originY}px;width:${size}px;height:${size}px;background:${colors[index % colors.length]}`;
    if (Math.random() > 0.45) particle.style.borderRadius = "50%";
    document.body.appendChild(particle);
    const animation = particle.animate([
      { opacity: 1, transform: "translate(-50%,-50%) rotate(0deg)" },
      { opacity: 0, transform: `translate(calc(-50% + ${translateX}px),calc(-50% + ${translateY}px)) rotate(${360 + Math.random() * 360}deg)` },
    ], { duration: 900 + Math.random() * 450, delay: Math.random() * 120, easing: "cubic-bezier(.2,.7,.2,1)" });
    animation.finished.finally(() => particle.remove());
  }
}

function observeContactConfetti() {
  const contact = document.getElementById("board-contact");
  if (!contact) return;
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    burstConfetti(contact);
  }, { threshold: 0.2 });
  observer.observe(contact);
}

export function initAnimations() {
  if (window.__portfolioAnimationsReady || prefersReducedMotion()) return;
  window.__portfolioAnimationsReady = true;
  injectDividers();
  observeReveals();
  observeContactConfetti();
}
