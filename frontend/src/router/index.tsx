/**
 * SentinelX AI — Application Router
 *
 * Centralized route table. Route paths are exported as ROUTES so Sidebar/
 * Navbar/redirects reference a single source of truth instead of hardcoded
 * strings scattered across the app.
 */
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

import Login from "@/pages/auth/Login";
import { lazy, Suspense } from "react";
import DashboardHome from "@/pages/dashboard/DashboardHome"; // Keep eager

const CrimeHeatmap = lazy(() => import("@/pages/heatmap/CrimeHeatmap"));
const CrimeAnalytics = lazy(() => import("@/pages/analytics/CrimeAnalytics"));
const Forecast = lazy(() => import("@/pages/forecast/Forecast"));
const CriminalNetwork = lazy(() => import("@/pages/network/CriminalNetwork"));
const AIAssistant = lazy(() => import("@/pages/assistant/AIAssistant"));
const Alerts = lazy(() => import("@/pages/alerts/Alerts"));
const Reports = lazy(() => import("@/pages/reports/Reports"));
const Settings = lazy(() => import("@/pages/settings/Settings"));

import { ROUTES } from "./routes";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sx-bg">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">404</h1>
        <p className="text-sx-text-dim mt-2 text-sm">Page not found.</p>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "heatmap", element: <Suspense fallback={<div className="p-8 text-center text-white/50 animate-pulse">Loading Map...</div>}><CrimeHeatmap /></Suspense> },
          { path: "analytics", element: <Suspense fallback={<div className="p-8 text-center text-white/50 animate-pulse">Loading Analytics...</div>}><CrimeAnalytics /></Suspense> },
          { path: "assistant", element: <Suspense fallback={<div className="p-8 text-center text-white/50 animate-pulse">Loading AI Core...</div>}><AIAssistant /></Suspense> },
          { path: "network", element: <Suspense fallback={<div className="p-8 text-center text-white/50 animate-pulse">Loading Network...</div>}><CriminalNetwork /></Suspense> },
          { path: "forecast", element: <Suspense fallback={<div className="p-8 text-center text-white/50 animate-pulse">Loading Forecast...</div>}><Forecast /></Suspense> },
          { path: "reports", element: <Suspense fallback={<div className="p-8 text-center text-white/50 animate-pulse">Loading Reports...</div>}><Reports /></Suspense> },
          { path: "alerts", element: <Suspense fallback={<div className="p-8 text-center text-white/50 animate-pulse">Loading Alerts...</div>}><Alerts /></Suspense> },
          { path: "settings", element: <Suspense fallback={<div className="p-8 text-center text-white/50 animate-pulse">Loading Config...</div>}><Settings /></Suspense> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
