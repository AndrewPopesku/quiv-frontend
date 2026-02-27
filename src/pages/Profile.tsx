import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Calendar,
  Edit3,
  TrendingUp,
  LogOut,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DAILY_GOALS } from "@/data/user-stats";
import { GoalProgress } from "@/components/profile/GoalProgress";
import { useAuth } from "@/context/AuthContext";
import { UserService } from "@/api";

export default function Profile() {
  const { user, logout, login } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const updateMutation = useMutation({
    mutationFn: () =>
      UserService.userMePartialUpdate({ username, email }),
    onSuccess: (data) => {
      setUpdateSuccess(true);
      setUpdateError("");
      setTimeout(() => setUpdateSuccess(false), 2000);
      // Refresh auth context with updated token
      const token = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");
      if (token && refresh) login(token, refresh);
    },
    onError: () => {
      setUpdateError("Failed to update profile.");
      setUpdateSuccess(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => UserService.userMeDeleteDestroy(),
    onSuccess: () => logout(),
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      deleteMutation.mutate();
    }
  };

  return (
    <Layout>
      {/* Profile Header */}
      <div className="glass-card p-8 mb-8 relative overflow-hidden fade-in">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-primary-foreground shadow-glow">
              {user?.username?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-muted rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {user?.username}
            </h1>
            <p className="text-muted-foreground mb-2">{user?.email}</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/50"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="glass-card p-6 mb-8 fade-in space-y-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Account Settings
          </h3>

          <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl py-2.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl py-2.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>

            {updateError && (
              <p className="text-sm text-destructive">{updateError}</p>
            )}
            {updateSuccess && (
              <p className="text-sm text-green-500">Profile updated.</p>
            )}

            <Button
              type="submit"
              className="gap-2"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </form>

          {/* Danger Zone */}
          <div className="border-t border-border pt-6 mt-6">
            <h4 className="text-sm font-semibold text-destructive mb-2">
              Danger Zone
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data.
            </p>
            <Button
              variant="outline"
              className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete Account
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Goals */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Progress
            </h3>
            <Button variant="ghost" size="sm" className="text-primary">
              Details
            </Button>
          </div>

          <div className="space-y-6">
            {DAILY_GOALS.map((goal) => (
              <GoalProgress
                key={goal.id}
                label={goal.label}
                current={goal.current}
                total={goal.total}
                unit={goal.unit}
                variant={goal.variant}
              />
            ))}
          </div>
        </div>

        {/* Activity Calendar */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Activity Calendar
            </h3>
            <span className="text-sm text-muted-foreground">
              December 2025
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="text-center text-xs text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const activity = Math.random();
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-md flex items-center justify-center text-xs transition-colors cursor-pointer hover:ring-2 hover:ring-primary/50",
                    activity > 0.7
                      ? "bg-primary text-primary-foreground"
                      : activity > 0.4
                        ? "bg-primary/50 text-foreground"
                        : activity > 0.1
                          ? "bg-primary/20 text-muted-foreground"
                          : "bg-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
