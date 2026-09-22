import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop — renders nothing, but scrolls the window to (0, 0) every time
 * the URL pathname changes. Place inside <BrowserRouter> so it has access to
 * the router context.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};
