import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "../../contexts/AuthContext";

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email";
    }
    return "";
  };

  const handleEmailBlur = () => {
    const error = validateEmail(email);
    setEmailError(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }
    
    if (!password) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate("/admin/dashboard");
      } else {
        setError(result.error || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
      <div className="w-full max-w-[480px]">
        {/* Back to Portal Selection */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Portal Selection
        </Link>

        {/* Logo and Title */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center">
            <div className="text-[140px] leading-none mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <span className="font-bold text-[#1F2937]">D</span>
            </div>
            <h1 className="text-sm font-medium text-[#6B7280]">Admin Control Panel</h1>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-12 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-[#1F2937] mb-2">Admin Panel Login</h2>
            <div className="w-[60px] h-[3px] bg-[#1F2937] mx-auto"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-7 bg-[#FEE2E2] border border-[#DC2626] rounded-lg p-3 flex items-start gap-3 animate-in slide-in-from-top-2">
              <svg className="w-4 h-4 text-[#DC2626] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-[#DC2626]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-base font-semibold text-[#1F2937] mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                onBlur={handleEmailBlur}
                placeholder="admin@dohuub.com"
                className={`h-[52px] text-base border-2 rounded-[10px] px-4 ${
                  emailError ? 'border-[#DC2626] animate-shake' : 'border-[#E5E7EB] focus:border-[#4B5563]'
                }`}
              />
              {emailError && (
                <p className="mt-1 text-[13px] text-[#DC2626] animate-in fade-in-0">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-base font-semibold text-[#1F2937] mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-[52px] text-base border-2 border-[#E5E7EB] rounded-[10px] px-4 pr-12 focus:border-[#4B5563]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(e as any);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-[52px] bg-[#1F2937] hover:bg-[#111827] text-white text-base font-semibold rounded-[10px] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed transition-colors mt-7"
            >
              {isLoading ? "Logging in..." : "Login to Admin Panel"}
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center mt-5">
              <Link
                to="/admin/reset-password"
                className="text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          Secure Access Only
        </p>
      </div>
    </div>
  );
}