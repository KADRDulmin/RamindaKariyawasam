const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);

function appendScript(src, attributes = {}) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  Object.entries(attributes).forEach(([key, value]) => script.setAttribute(key, value));
  document.head.appendChild(script);
}

function loadAnalytics() {
  if (window.__portfolioAnalyticsLoaded || isLocalPreview || navigator.connection?.saveData) return;
  window.__portfolioAnalyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  appendScript("https://www.googletagmanager.com/gtm.js?id=GTM-576JTGMP");

  window.clarity = window.clarity || function clarityQueue() {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  appendScript("https://www.clarity.ms/tag/wikyv2yc29");

  window.gtag = window.gtag || function gtagQueue() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", "G-8Z76CJN8ZG");
  appendScript("https://www.googletagmanager.com/gtag/js?id=G-8Z76CJN8ZG");
}

export function scheduleAnalytics() {
  if (isLocalPreview) return;
  const schedule = () => window.setTimeout(() => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(loadAnalytics, { timeout: 2500 });
    } else {
      loadAnalytics();
    }
  }, 2500);

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
}
