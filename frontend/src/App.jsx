import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layout/MainLayout";

// Lazy load pages for code splitting
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AIPage = lazy(() => import("./pages/AIPage"));
const Drivers = lazy(() => import("./pages/Drivers"));
const Races = lazy(() => import("./pages/Races"));
const Constructors = lazy(() => import("./pages/Teams"));
const Profile = lazy(() => import("./pages/Profile"));
const History = lazy(() => import("./pages/History"));
const HistoryDriver = lazy(() => import("./pages/HistoryDriver"));
const HistoryChampions = lazy(() => import("./pages/HistoryChampions"));

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#0a0a0f'
  }}>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
    <div style={{
      width: '32px',
      height: '32px',
      border: '3px solid rgba(232,0,45,0.3)',
      borderTop: '3px solid #e8002d',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>

      {/* Public Routes - Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public Routes - F1 Stats (No login required) */}
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      <Route
        path="/drivers"
        element={
          <MainLayout>
            <Drivers />
          </MainLayout>
        }
      />

      <Route
        path="/races"
        element={
          <MainLayout>
            <Races />
          </MainLayout>
        }
      />

      <Route
        path="/constructors"
        element={
          <MainLayout>
            <Constructors />
          </MainLayout>
        }
      />

      {/* Public Routes - Historical Data (No login required) */}
      <Route
        path="/history"
        element={
          <MainLayout>
            <History />
          </MainLayout>
        }
      />

      <Route
        path="/history/driver/:driverCode"
        element={
          <MainLayout>
            <HistoryDriver />
          </MainLayout>
        }
      />

      <Route
        path="/history/champions"
        element={
          <MainLayout>
            <HistoryChampions />
          </MainLayout>
        }
      />

      {/* Protected Routes - Authenticated Users Only */}
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AIPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" />} />

    </Routes>
    </Suspense>
  );
}

export default App;