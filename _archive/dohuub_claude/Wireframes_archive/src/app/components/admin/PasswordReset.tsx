import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function PasswordReset() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    if (!value) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid admin email";
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
    setSuccess(false);
    
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock - check if email is in admin system
      if (email.endsWith("@dohuub.com")) {
        setSuccess(true);
        setIsLoading(false);
      } else {
        setError("This email is not registered as an admin.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
      <div className="w-full max-w-[480px]">
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center">
            <div className="text-[140px] leading-none mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <span className="font-bold text-[#1F2937]">D</span>
            </div>
            <h1 className="text-sm font-medium text-[#6B7280]">Admin Control Panel</h1>
          </div>
        </div>

        {/* Password Reset Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <div className="text-center mb-6">
            <h2 className="text-[28px] font-bold text-[#1F2937] mb-2">Reset Your Password</h2>
            <div className="w-[60px] h-[3px] bg-[#1F2937] mx-auto mb-6"></div>
            
            <p className="text-[15px] text-[#6B7280] leading-relaxed max-w-[340px] mx-auto">
              Enter your admin email and we'll send you a secure reset link.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-[#FEE2E2] border border-[#DC2626] rounded-lg p-3 flex items-start gap-3 animate-in slide-in-from-top-2">
              <svg className="w-4 h-4 text-[#DC2626] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-[#DC2626]">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-[#D1FAE5] border border-[#10B981] rounded-lg p-3 flex items-start gap-3 animate-in slide-in-from-top-2">
              <Check className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#065F46]">
                Reset link sent to {email}. Check your inbox.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email Field */}
            <div>
              <Label htmlFor="reset-email" className="text-base font-semibold text-[#1F2937] mb-2 block">
                Email
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                  setError("");
                  setSuccess(false);
                }}
                onBlur={handleEmailBlur}
                placeholder="your-admin@dohuub.com"
                className={`h-[52px] text-base border-2 rounded-[10px] px-4 ${
                  emailError ? 'border-[#DC2626] animate-shake' : 'border-[#E5E7EB] focus:border-[#4B5563]'
                }`}
                disabled={success}
              />
              {emailError && (
                <p className="mt-1 text-[13px] text-[#DC2626] animate-in fade-in-0">
                  {emailError}
                </p>
              )}
            </div>

            {/* Send Reset Link Button */}
            <Button
              type="submit"
              disabled={isLoading || !email || success}
              className={`w-full h-[52px] text-base font-semibold rounded-[10px] disabled:cursor-not-allowed transition-all ${
                success 
                  ? 'bg-[#10B981] hover:bg-[#10B981] text-white' 
                  : 'bg-[#1F2937] hover:bg-[#111827] text-white disabled:bg-[#D1D5DB]'
              }`}
            >
              {isLoading ? "Sending..." : success ? "Link Sent! ✓" : "Send Reset Link"}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center mt-5">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
