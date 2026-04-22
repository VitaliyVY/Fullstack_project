const GA_SRC_BASE = "https://www.googletagmanager.com/gtag/js?id=";
const GA_FALLBACK_MEASUREMENT_ID = "G-8736RY31KQ";

const getMeasurementId = () =>
  String(
    import.meta.env.VITE_GA_MEASUREMENT_ID || GA_FALLBACK_MEASUREMENT_ID,
  ).trim();

const getWindow = () => (typeof window === "undefined" ? null : window);

const ensureGtagScript = (win, measurementId) => {
  if (!win?.document) return;

  const existing = win.document.querySelector(
    `script[data-ga-measurement-id="${measurementId}"]`,
  );

  if (existing) return;

  const script = win.document.createElement("script");
  script.async = true;
  script.src = `${GA_SRC_BASE}${encodeURIComponent(measurementId)}`;
  script.dataset.gaMeasurementId = measurementId;
  win.document.head.appendChild(script);
};

export const initAnalytics = () => {
  const win = getWindow();
  const measurementId = getMeasurementId();

  if (!win || !measurementId) return false;
  if (win.__gaInitialized) return true;

  ensureGtagScript(win, measurementId);

  win.dataLayer = win.dataLayer || [];
  win.gtag =
    win.gtag ||
    function gtag() {
      win.dataLayer.push(arguments);
    };

  win.gtag("js", new Date());
  win.gtag("config", measurementId, { send_page_view: false });
  win.__gaInitialized = true;

  return true;
};

export const trackPageView = (path) => {
  const win = getWindow();
  const measurementId = getMeasurementId();

  if (!win || !measurementId || !win.gtag) return;

  const pagePath =
    path || `${win.location.pathname}${win.location.search}${win.location.hash}`;

  if (win.__gaLastTrackedPath === pagePath) return;
  win.__gaLastTrackedPath = pagePath;

  win.gtag("event", "page_view", {
    page_title: win.document?.title || "",
    page_location: win.location?.href || "",
    page_path: pagePath,
    send_to: measurementId,
  });
};
