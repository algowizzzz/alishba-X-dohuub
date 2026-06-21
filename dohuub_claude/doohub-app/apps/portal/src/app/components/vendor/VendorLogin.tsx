import { useState } from "react";
import { Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { signInAs } from "../../../services/auth";

export function VendorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await signInAs(email, password, "VENDOR");
      navigate("/vendor/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFF] to-[#F0F7FF] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
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
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">Vendor Login</h1>
            <p className="text-sm text-[#6B7280]">Sign in to manage your business</p>
          </div>

          {error && (
            <div className="mb-6 bg-[#FEE2E2] border border-[#DC2626] rounded-lg p-3">
              <p className="text-sm text-[#DC2626]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
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

            <Button type="submit" className="w-full" disabled={isLoading || !email || !password}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-[#6B7280]">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/vendor/signup")}
                className="text-[#2E7AD9] font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
