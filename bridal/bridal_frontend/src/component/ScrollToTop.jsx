import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ behavior = "instant" }) {
  const location = useLocation();

  useEffect(() => {
    // Check if navigation came from main services page with noScroll parameter
    const searchParams = new URLSearchParams(location.search);
    const noScroll = searchParams.get('noScroll');
    
    // Don't scroll if noScroll parameter is present
    if (noScroll === 'true') {
      return;
    }
    
    // Default scroll behavior for all other navigations
    if (behavior === "smooth") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search, behavior]);

  return null;
}