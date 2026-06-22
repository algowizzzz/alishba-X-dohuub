import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { supabase } from "../../../lib/supabase";

export function AdminChangePassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // When admin lands here via the password-reset email link, the URL contains
  // ?recovery=1 (set in PasswordReset's redirectTo) AND Supabase has placed a
  // recovery access_token in the URL hash that detectSessionInUrl swaps for
  // a session. In that mode the user doesn't know their current password,
  // so we skip the re-auth gate.
  const [isRecovery, setIsRecovery] = useState(searchParams.get("recovery") === "1");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event in case the page mounts before
    // Supabase has processed the URL hash.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const validate = () => {
    if (isRecovery) {
      if (!next || !confirm) return "Enter and confirm your new password";
    } else {
      if (!current || !next || !confirm) return "All fields are required";
      if (next === current) return "New password must be different";
    }
    if (next.length < 8) return "New password must be at least 8 characters";
    if (next !== confirm) return "New passwords don't match";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setSaving(true);
    try {
      if (!isRecovery) {
        // Re-authenticate with the current password before changing — this
        // protects against session hijack scenarios where someone reaches an
        // already-signed-in admin tab.
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) throw new Error("Not signed in");

        const { error: reAuthErr } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: current,
        });
        if (reAuthErr) throw new Error("Current password is incorrect");
      }

      const { error: updateErr } = await supabase.auth.updateUser({ password: next });
      if (updateErr) throw updateErr;

      toast.success(isRecovery ? "Password set. Please sign in." : "Password updated");
      if (isRecovery) {
        await supabase.auth.signOut();
        navigate("/admin/login");
      } else {
        navigate(-1);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFF] to-[#F0F7FF] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A2E] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="bg-white rounded-2xl border border-[rgba(46,122,217,0.25)] p-8 shadow-[0_4px_16px_rgba(46,122,217,0.20)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#2E7AD9] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">Change Password</h1>
            <p className="text-sm text-[#6B7280]">
              Update the password for your admin account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="current" className="mb-1.5">Current Password</Label>
              <div className="relative">
                <Input
                  id="current"
                  type={show ? "text" : "password"}
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A2E]"
                >
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="next" className="mb-1.5">New Password</Label>
              <Input
                id="next"
                type={show ? "text" : "password"}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>

            <div>
              <Label htmlFor="confirm" className="mb-1.5">Confirm New Password</Label>
              <Input
                id="confirm"
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={saving || !current || !next || !confirm}
            >
              {saving ? "Updating…" : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
