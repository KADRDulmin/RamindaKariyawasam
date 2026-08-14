import { iconSVG } from "./icons.jsx";

const TWEAK_DEFAULTS = Object.freeze({
  heroPhoto: "suit-pose",
  wobble: 0.6,
  trail: "dots",
});

function initCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  const canUseCustomCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canUseCustomCursor) {
    cursor.hidden = true;
    return;
  }

  const cursorPosition = { x: 0, y: 0 };
  window.__cursor = cursorPosition;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame = 0;
  let lastTrailAt = 0;
  const trailLife = 560;
  cursor.style.opacity = "0";

  const renderCursor = () => {
    animationFrame = 0;
    currentX += (targetX - currentX) * 0.45;
    currentY += (targetY - currentY) * 0.45;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) rotate(-30deg) scale(var(--cursor-scale, 1))`;
    if (Math.abs(targetX - currentX) > 0.25 || Math.abs(targetY - currentY) > 0.25) {
      animationFrame = requestAnimationFrame(renderCursor);
    }
  };

  const scheduleCursorRender = () => {
    if (!animationFrame) animationFrame = requestAnimationFrame(renderCursor);
  };

  const spawnTrail = (x, y) => {
    const kind = window.__TWEAKS.trail || "dots";
    if (kind === "off") return;
    const element = document.createElement("span");
    element.className = "ink-dot";
    const rotation = Math.random() * 60 - 30;
    if (kind === "dots") {
      const size = 5 + Math.random() * 5;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.background = "var(--ink)";
    } else if (kind === "stars") {
      element.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="var(--ink)" d="M12 2 14 9 21 10 15 14 17 21 12 17 7 21 9 14 3 10 10 9Z"/></svg>';
    } else {
      element.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#e05c5c" d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"/></svg>';
    }
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.setProperty("--trail-rotation", `${rotation}deg`);
    element.style.setProperty("--trail-shift", `${6 + Math.random() * 10}px`);
    element.style.setProperty("--trail-scale", String(0.4 + Math.random() * 0.35));
    element.style.setProperty("--trail-life", `${trailLife}ms`);
    document.body.appendChild(element);
    element.addEventListener("animationend", () => element.remove(), { once: true });
  };

  document.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursorPosition.x = targetX;
    cursorPosition.y = targetY;
    cursor.style.opacity = "1";
    scheduleCursorRender();
    const now = performance.now();
    if (now - lastTrailAt >= 64) {
      lastTrailAt = now;
      spawnTrail(targetX, targetY);
    }
  }, { passive: true });

  document.addEventListener("pointerdown", () => cursor.classList.add("pressed"), { passive: true });
  document.addEventListener("pointerup", () => cursor.classList.remove("pressed"), { passive: true });
}

function initTheme() {
  const root = document.documentElement;
  const button = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  const label = document.getElementById("theme-label");
  if (!button || !icon || !label) return;

  const applyTheme = (mode) => {
    const dark = mode === "dark";
    root.classList.toggle("theme-dark", dark);
    root.classList.toggle("theme-light", !dark);
    icon.innerHTML = iconSVG(dark ? "moon" : "sun", 18);
    label.textContent = dark ? "Lights on" : "Lights off";
    button.setAttribute("aria-pressed", String(dark));
    try {
      localStorage.setItem("rk-theme", dark ? "dark" : "light");
    } catch {
      // The theme still works when storage is unavailable.
    }
  };

  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("rk-theme") || "light";
  } catch {
    savedTheme = "light";
  }
  applyTheme(savedTheme);
  button.addEventListener("click", () => applyTheme(root.classList.contains("theme-dark") ? "light" : "dark"));
}

function initNavigation() {
  const tabs = Array.from(document.querySelectorAll(".nav-tab"));
  const progress = document.getElementById("board-progress");
  if (!tabs.length) return;

  let clickLockedTarget = null;
  let navigationTimer = 0;
  let progressTimer = 0;
  let scrollFrame = 0;

  const setActive = (target) => {
    tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.target === target));
  };

  const scrollToBoard = (target) => {
    const section = document.getElementById(`board-${target}`);
    if (!section) return;
    clickLockedTarget = target;
    setActive(target);
    window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    if (progress) {
      progress.style.width = "100%";
      window.clearTimeout(progressTimer);
      progressTimer = window.setTimeout(() => { progress.style.width = "0"; }, 650);
    }
    window.clearTimeout(navigationTimer);
    navigationTimer = window.setTimeout(() => { clickLockedTarget = null; }, 900);
  };

  const updateActiveSection = () => {
    scrollFrame = 0;
    if (clickLockedTarget) return;
    const probe = 140;
    let bestSection = null;
    let bestDelta = Infinity;
    document.querySelectorAll("section.board").forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= probe && rect.bottom > probe) {
        const delta = Math.abs(rect.top - probe);
        if (delta < bestDelta) {
          bestDelta = delta;
          bestSection = section;
        }
      }
    });
    if (bestSection) setActive(bestSection.id.replace("board-", ""));
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => scrollToBoard(tab.dataset.target)));
  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateActiveSection);
  }, { passive: true });
  window.gotoBoard = scrollToBoard;
  window.setTimeout(updateActiveSection, 100);
}

function initTweaks() {
  const panel = document.getElementById("tweaks-panel");
  const hero = document.getElementById("tw-hero");
  const wobble = document.getElementById("tw-wobble");
  const trail = document.getElementById("tw-trail");
  if (!panel || !hero || !wobble || !trail) return;

  hero.value = TWEAK_DEFAULTS.heroPhoto;
  wobble.value = TWEAK_DEFAULTS.wobble;
  trail.value = TWEAK_DEFAULTS.trail;

  const publishChange = (key, value) => {
    window.__TWEAKS[key] = value;
    window.dispatchEvent(new CustomEvent("tweaks:change", { detail: { key, value } }));
    if (window.parent !== window) {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: value } }, "*");
    }
  };

  hero.addEventListener("change", (event) => publishChange("heroPhoto", event.target.value));
  wobble.addEventListener("input", (event) => publishChange("wobble", Number(event.target.value)));
  trail.addEventListener("change", (event) => publishChange("trail", event.target.value));
  window.addEventListener("message", (event) => {
    if (!event.data || typeof event.data !== "object") return;
    if (event.data.type === "__activate_edit_mode") panel.classList.add("open");
    if (event.data.type === "__deactivate_edit_mode") panel.classList.remove("open");
  });
  if (window.parent !== window) window.parent.postMessage({ type: "__edit_mode_available" }, "*");
}

export function initRuntime() {
  if (window.__portfolioRuntimeReady) return;
  window.__portfolioRuntimeReady = true;
  window.__TWEAKS = { ...TWEAK_DEFAULTS };
  initCursor();
  initTheme();
  initNavigation();
  initTweaks();
}
