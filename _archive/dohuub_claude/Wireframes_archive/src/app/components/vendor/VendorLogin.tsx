import { useState } from "react";
import { Mail, ArrowLeft, Chrome } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "../../contexts/AuthContext";

export function VendorLogin() {
  const navigate = useNavigate();
  const { sendOtp, loginWithOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await sendOtp(email);

      if (result.success) {
        setOtpSent(true);
      } else {
        setError(result.error || "Failed to send verification code");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await loginWithOtp(email, otp);

      if (result.success) {
        navigate("/vendor/dashboard");
      } else {
        setError(result.error || "Invalid verification code");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth would be implemented here
    // For now, show a message
    setError("Google login coming soon. Please use email + OTP.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F2937] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Portal Selection</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#1F2937]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937] mb-2">
              Vendor Login
            </h1>
            <p className="text-sm text-[#6B7280]">
              Sign in to manage your business
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-[#FEE2E2] border border-[#DC2626] rounded-lg p-3 flex items-start gap-3">
              <svg className="w-4 h-4 text-[#DC2626] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-[#DC2626]">{error}</p>
            </div>
          )}

          {/* Email + OTP Form */}
          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <Label htmlFor="email" className="mb-1.5">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vendor@example.com"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <Label htmlFor="email" className="mb-1.5">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-[#F9FAFB]"
                />
              </div>

              <div>
                <Label htmlFor="otp" className="mb-1.5">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-[#6B7280] mt-1">
                  We sent a code to {email}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                >
                  Change Email
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>
              </div>

              <button
                type="button"
                onClick={handleSendOTP}
                className="text-sm text-[#1F2937] hover:underline w-full text-center"
              >
                Resend Code
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#6B7280]">OR</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <Chrome className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-[#6B7280]">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/vendor/signup")}
                className="text-[#1F2937] font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#9CA3AF]">
            By continuing, you agree to DoHuub's{" "}
            <a href="#" className="hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
