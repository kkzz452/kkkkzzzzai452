import { Suspense, lazy, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/home";
import { AuthProvider } from "./contexts/AuthContext";
import { supabase } from "./lib/supabase";
import { Toaster } from "./components/ui/toaster";
import { useState } from "react";

// Lazy load pages for better performance
const AboutPage = lazy(() => import("./components/pages/AboutPage"));
const HistoryPage = lazy(() => import("./components/pages/HistoryPage"));
const CharactersPage = lazy(() => import("./components/pages/CharactersPage"));
const AuthPage = lazy(() => import("./components/pages/AuthPage"));
const ProfilePage = lazy(() => import("./components/pages/ProfilePage"));

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data?.session);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Жүктелуде...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Жүктелуде...
          </div>
        }
      >
        <>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <AboutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/characters"
              element={
                <ProtectedRoute>
                  <CharactersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
          </Routes>
          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
