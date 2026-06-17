import { useState } from "react";
import { UserPlus, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { supabase } from "../../../lib/supabase";
import api from "../../../services/api";

export function VendorSignUp() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !businessName) return;
    if (!acceptedTerms) {
      setError("You must accept the Terms of Service to continue");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      // 1. Create Supabase auth user. The handle_new_auth_user trigger inserts a public.User row.
      const { data, error: signUpErr } = await supabase.auth.signUp({ email, password });
      if (signUpErr) throw new Error(signUpErr.message);
      if (!data.session) {
        // Email confirmation enabled — sign in to acquire token.
        const { data: si, error: siErr } = await supabase.auth.signInWithPassword({ email, password });
        if (siErr) throw new Error(siErr.message);
        if (!si.session) throw new Error("Could not create session");
      }
      // 2. Create vendor profile via API. This also flips User.role → VENDOR.
      await api.post("/api/v1/vendors", {
        businessName,
        categories: [], // Vendor can pick categories later in profile setup
      });
      navigate("/vendor/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Sign up failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    if (!acceptedTerms) {
      setError("You must accept the Terms of Service to continue");
      return;
    }
    setIsLoading(true);
    try {
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/vendor/profile-setup`,
        },
      });
      if (oauthErr) throw oauthErr;
    } catch (err: any) {
      setError(err?.message || "Google sign-up failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFF] to-[#F0F7FF] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A2E] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Portal Selection</span>
        </button>

        <div className="bg-white rounded-2xl border border-[rgba(46,122,217,0.25)] p-8 shadow-[0_4px_16px_rgba(46,122,217,0.20)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#2E7AD9] flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(46,122,217,0.3)]">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">Create Vendor Account</h1>
            <p className="text-sm text-[#6B7280]">Start a 14-day free trial — no credit card required</p>
          </div>

          {error && (
            <div className="mb-6 bg-[#FEE2E2] border border-[#DC2626] rounded-lg p-3">
              <p className="text-sm text-[#DC2626]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="businessName" className="mb-1.5">Business Name</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="John's Cleaning Service"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-1.5">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vendor@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-1.5">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A2E]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-[#1A1A2E] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#2E7AD9]"
              />
              <span>
                I agree to the{" "}
                <a href="/terms" target="_blank" rel="noreferrer" className="text-[#2E7AD9] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" rel="noreferrer" className="text-[#2E7AD9] hover:underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email || !password || !businessName || !acceptedTerms}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[rgba(46,122,217,0.15)]" />
            <span className="text-xs text-[#6B7280]">OR</span>
            <div className="flex-1 h-px bg-[rgba(46,122,217,0.15)]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-[rgba(46,122,217,0.25)] bg-white hover:bg-[#F8FAFF] text-sm font-medium text-[#1A1A2E] transition-colors disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-[#6B7280]">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/vendor/login")}
                className="text-[#2E7AD9] font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
