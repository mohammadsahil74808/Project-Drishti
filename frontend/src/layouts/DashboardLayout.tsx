/**
 * SentinelX AI — Dashboard Layout
 * Shell rendered around every authenticated page: Sidebar + Navbar +
 * scrollable content outlet. All /pages/* route elements render inside
 * the <Outlet /> below via the router's nested route config.
 */
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full bg-sx-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-sx-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
