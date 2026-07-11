/**
 * SentinelX AI — Login Page
 *
 * Badge number + password sign-in. Backend auth endpoint isn't wired yet
 * (Phase 2 of the backend build), so this authenticates against a mock
 * session locally via authStore — swap the onSubmit handler for a real
 * `login()` call in src/api/auth.ts once the API is live.
 */
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, BadgeCheck, Lock } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import type { LoginResponse } from "@/types";

export default function Login() {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  const [badgeNo, setBadgeNo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!badgeNo.trim() || !password.trim()) {
      setError("Enter both badge number and password.");
      return;
    }

    setIsLoading(true);

    // --- Mock auth (replace with real POST /auth/login once backend is live) ---
    await new Promise((r) => setTimeout(r, 700));

    const mockResponse: LoginResponse = {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: {
        id: "usr_001",
        name: "Inspector Rakesh Gowda",
        badgeNo: badgeNo.trim(),
        role: "sho",
        stationName: "Whitefield Police Station",
        districtName: "Bengaluru East",
      },
    };

    loginSuccess(mockResponse);
    setIsLoading(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-sx-bg relative overflow-hidden">
      {/* Ambient grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-sx-accent/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-sx-accent/10 blur-3xl" />

      <div className="relative w-full max-w-sm mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-sx-panel border border-sx-border flex items-center justify-center shadow-glow mb-4">
            <ShieldAlert className="h-7 w-7 text-sx-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sentinel<span className="text-sx-accent">X</span> AI
          </h1>
          <p className="text-xs text-sx-text-dim mt-1 uppercase tracking-widest">
            Karnataka State Police — Command Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="sx-panel-base p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Officer Sign In</h2>
            <p className="text-xs text-sx-text-dim mt-0.5">
              Enter your issued credentials to access the platform.
            </p>
          </div>

          <Input
            label="Badge Number"
            placeholder="e.g. KSP-48213"
            value={badgeNo}
            onChange={(e) => setBadgeNo(e.target.value)}
            leftIcon={<BadgeCheck className="h-4 w-4" />}
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            autoComplete="current-password"
          />

          {error && <p className="text-xs text-sx-critical">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            leftIcon={isLoading ? undefined : <Lock className="h-4 w-4" />}
          >
            {isLoading ? "Authenticating…" : "Sign In"}
          </Button>

          <p className="text-[11px] text-sx-text-faint text-center pt-1">
            This is a scaffold demo — any badge number/password signs you in.
          </p>
        </form>

        <p className="text-center text-[11px] text-sx-text-faint mt-6">
          For authorized personnel only. All access is logged and audited.
        </p>
      </div>
    </div>
  );
}
