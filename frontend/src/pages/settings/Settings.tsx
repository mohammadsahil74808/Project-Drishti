import { useState, type FormEvent } from "react";
import { User, Bell, Lock, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { usersApi } from "@/api";

export default function Settings() {
  const user = useAuthStore((s) => s.user);

  const [name, setName] = useState(user?.name ?? "");
  const [station, setStation] = useState(user?.station_name ?? "");
  const [savedProfile, setSavedProfile] = useState(false);

  const [notifyAnomaly, setNotifyAnomaly] = useState(true);
  const [notifyForecast, setNotifyForecast] = useState(true);
  const [notifyMissingPerson, setNotifyMissingPerson] = useState(true);
  const [notifySms, setNotifySms] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [savedPw, setSavedPw] = useState(false);

  const { mutate: changePassword, isPending: isChangingPw } = useMutation({
    mutationFn: usersApi.changePassword,
    onSuccess: () => {
      setSavedPw(true);
      setCurrentPw("");
      setNewPw("");
      setPwError("");
      setTimeout(() => setSavedPw(false), 2000);
    },
    onError: (err: any) => {
      setPwError(err.response?.data?.detail || "Failed to update password");
    }
  });

  const handleProfileSave = (e: FormEvent) => {
    e.preventDefault();
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2000);
  };

  const handlePasswordSave = (e: FormEvent) => {
    e.preventDefault();
    setPwError("");
    changePassword({ old_password: currentPw, new_password: newPw });
  };

  const Toggle = ({
    checked,
    onChange,
    label,
    description,
  }: {
    checked: boolean;
    onChange: () => void;
    label: string;
    description: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-sx-text">{label}</p>
        <p className="text-xs text-sx-text-faint mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`h-6 w-11 rounded-full transition-colors relative shrink-0 ${
          checked ? "bg-sx-accent" : "bg-sx-panel-light border border-sx-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-sx-text-dim mt-1">
          Manage your profile, notification, and security preferences
        </p>
      </div>

      {/* Profile */}
      <Card>
        <form onSubmit={handleProfileSave}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-sx-text-dim" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Your officer identity across SentinelX AI</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Badge Number" value={user?.badge_no ?? ""} disabled />
            <Input label="Station" value={station} onChange={(e) => setStation(e.target.value)} />
            <Input label="District" value={user?.district_name ?? ""} disabled />
          </CardContent>
          <CardFooter>
            <span className="text-xs text-sx-success">
              {savedProfile ? "Profile updated." : ""}
            </span>
            <Button type="submit" leftIcon={<Save className="h-4 w-4" />}>
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-sx-text-dim" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Choose which alerts reach you</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-sx-border">
          <Toggle
            checked={notifyAnomaly}
            onChange={() => setNotifyAnomaly((v) => !v)}
            label="Anomaly Alerts"
            description="Statistically unusual crime spikes in your jurisdiction"
          />
          <Toggle
            checked={notifyForecast}
            onChange={() => setNotifyForecast((v) => !v)}
            label="Forecast Alerts"
            description="Predicted risk crossing severity thresholds"
          />
          <Toggle
            checked={notifyMissingPerson}
            onChange={() => setNotifyMissingPerson((v) => !v)}
            label="Missing Person Matches"
            description="AI-suggested matches for open missing-person cases"
          />
          <Toggle
            checked={notifySms}
            onChange={() => setNotifySms((v) => !v)}
            label="SMS Delivery"
            description="Also send critical alerts via SMS (requires provider setup)"
          />
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <form onSubmit={handlePasswordSave}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-sx-text-dim" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
            />
            <Input
              label="New Password"
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <div className="flex flex-col">
               <span className="text-xs text-sx-success">
                 {savedPw ? "Password updated." : ""}
               </span>
               <span className="text-xs text-sx-critical mt-1">
                 {pwError}
               </span>
            </div>
            <Button
              type="submit"
              variant="secondary"
              disabled={!currentPw || !newPw || isChangingPw}
              isLoading={isChangingPw}
            >
              {isChangingPw ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
