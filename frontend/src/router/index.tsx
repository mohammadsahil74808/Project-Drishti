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
import DashboardHome from "@/pages/dashboard/DashboardHome";
import CrimeHeatmap from "@/pages/heatmap/CrimeHeatmap";
import CrimeAnalytics from "@/pages/analytics/CrimeAnalytics";
import Forecast from "@/pages/forecast/Forecast";
import CriminalNetwork from "@/pages/network/CriminalNetwork";
import AIAssistant from "@/pages/assistant/AIAssistant";
import Alerts from "@/pages/alerts/Alerts";
import Reports from "@/pages/reports/Reports";
import Settings from "@/pages/settings/Settings";

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
          { path: "heatmap", element: <CrimeHeatmap /> },
          { path: "analytics", element: <CrimeAnalytics /> },
          { path: "assistant", element: <AIAssistant /> },
          { path: "network", element: <CriminalNetwork /> },
          { path: "forecast", element: <Forecast /> },
          { path: "reports", element: <Reports /> },
          { path: "alerts", element: <Alerts /> },
          { path: "settings", element: <Settings /> },
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
