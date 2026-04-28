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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !businessName) return;
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

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email || !password || !businessName}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

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
