import React from "react";
import { createRoot } from "react-dom/client";
import { AboutBoard, ContactBoard, FeaturedEngineeringBoard, HomeBoard, ProjectsBoard, ToolkitBoard } from "./boards.jsx";
import NotFound from "./not-found.jsx";
import { initAnimations } from "./animations.js";
import { initRuntime } from "./runtime.js";
import { scheduleAnalytics } from "./analytics.js";

// App root - single page, all boards stacked.
function App() {
  const path = window.location.pathname;
  if (path !== "/" && path !== "") return <NotFound />;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <HomeBoard />
      <AboutBoard />
      <FeaturedEngineeringBoard />
      <ProjectsBoard />
      <ToolkitBoard />
      <ContactBoard />
      <footer style={{ textAlign: "center", padding: "40px 20px 80px", color: "var(--ink-soft)", fontFamily: "'Patrick Hand'" }}>
        made with sticky notes &amp; paper · Raminda · 2026
      </footer>
    </div>
  );
}

initRuntime();
const root = createRoot(document.getElementById("root"));
root.render(<App />);
if (window.location.pathname === "/" || window.location.pathname === "") {
  requestAnimationFrame(() => {
    if (window.requestIdleCallback) window.requestIdleCallback(initAnimations, { timeout: 1000 });
    else window.setTimeout(initAnimations, 0);
  });
}
scheduleAnalytics();
