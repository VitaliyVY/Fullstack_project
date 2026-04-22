import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "../lib/analytics.js";

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (!initAnalytics()) return;
    const path = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(path);
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default AnalyticsTracker;
