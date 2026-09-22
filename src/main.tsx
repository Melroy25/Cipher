import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { PublicLayout } from "./components/PublicLayout.tsx";
import { ScrollToTop } from "./components/ScrollToTop.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { TeamPage } from "./pages/TeamPage.tsx";
import { EventsPage } from "./pages/EventsPage.tsx";
import { BlogPage } from "./pages/BlogPage.tsx";
import { ContributorsPage } from "./pages/ContributorsPage.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";
import "./index.css";

// App mode configuration for separate Vercel deployments:
// 'main'  -> Public website only; admin chunk excluded and /admin redirects to /
// 'admin' -> Admin panel deployment; / redirects to /admin
// 'all'   -> Unified deployment (default); admin chunk lazy-loaded on-demand
const appMode =
  import.meta.env.VITE_APP_MODE ||
  (import.meta.env.MODE === "main"
    ? "main"
    : import.meta.env.MODE === "admin"
    ? "admin"
    : "all");

const LazyAdminApp =
  appMode === "main"
    ? null
    : React.lazy(() =>
        import("./admin/AdminApp.tsx").then((m) => ({ default: m.AdminApp }))
      );

const AdminLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#020804] text-[#00ff66] flex flex-col items-center justify-center font-mono space-y-4">
    <div className="w-10 h-10 border-2 border-[#00ff66] border-t-transparent rounded-full animate-spin" />
    <div className="text-xs tracking-widest uppercase text-emerald-400">
      Initializing Admin Terminal...
    </div>
  </div>
);

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Global Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020804] text-[#00ff66] flex flex-col items-center justify-center p-6 font-mono space-y-4">
          <div className="text-xl font-bold tracking-widest text-emerald-400">
            [CIPHER_SYSTEM_ALERT]
          </div>
          <p className="text-sm text-gray-400 max-w-md text-center">
            A rendering module encountered an interruption. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-[#00ff66] text-[#00ff66] rounded hover:bg-[#00ff66]/10 text-xs font-mono uppercase tracking-wider transition-colors"
          >
            Reload Platform
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin CMS Routes */}
          {appMode === "main" ? (
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
          ) : (
            LazyAdminApp && (
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<AdminLoadingFallback />}>
                    <LazyAdminApp />
                  </Suspense>
                }
              />
            )
          )}

          {/* If deployed strictly as admin portal, root redirects to /admin */}
          {appMode === "admin" ? (
            <Route path="/" element={<Navigate to="/admin" replace />} />
          ) : (
            /* Public Website Routes with Shared Cyber Floating Navbar */
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="contributors" element={<ContributorsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>
          )}

          {/* 404 Fallback */}
          <Route
            path="*"
            element={<Navigate to={appMode === "admin" ? "/admin" : "/"} replace />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);