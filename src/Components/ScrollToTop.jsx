import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls all scrollable elements (like html, body, and custom scroll containers)
    window.scrollTo(0, 0);

    // If you have other scrollable containers, reset them too
    const scrollables = document.querySelectorAll("[data-scroll-reset]");
    scrollables.forEach((el) => (el.scrollTop = 0));
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
