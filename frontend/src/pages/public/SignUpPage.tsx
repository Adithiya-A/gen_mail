import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GenMailLogo } from '../../components/common/GenMailLogo';
import { AuthSideBanner } from '../../components/common/AuthSideBanner';
import { GoogleLogo } from '../../components/illustrations/FeatureIllustrations';
import { useEmailContext } from '../../context/EmailContext';
import {signInWithGoogle} from '../../services/authService';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser, showToast } = useEmailContext();

  const [fullName, setFullName] = useState('M. Aarthi');
  const [email, setEmail] = useState('aarthi@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleGoogleSignup = async () => {
    try {
      const user = await signInWithGoogle();

      console.log("Authenticated user:", user);

      // We'll add navigation later
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please accept the Terms of Service to proceed.');
      return;
    }
    updateUser({ name: fullName, email });
    showToast('Account Created!', 'Please connect your Gmail account to continue.');
    navigate('/connect-gmail');
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft-lg border border-[#E8EBF8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
      {/* Left Form Column */}
      <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <GenMailLogo to="/" />

          {/* Heading */}
          <div className="mt-6 mb-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#13182E] tracking-tight">
              Create Your Account
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Join GenMail and start emailing smarter.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#13182E] mb-1">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="M. Aarthi"
                  required
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#13182E] mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarthi@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#13182E] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className="w-full pl-10 pr-10 py-2 text-sm bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#13182E]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-[#13182E] mb-1">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full pl-10 pr-10 py-2 text-sm bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-[#635BFF] rounded border-gray-300 focus:ring-[#635BFF] accent-[#635BFF]"
              />
              <label htmlFor="terms" className="text-xs text-[#505A74] select-none cursor-pointer leading-tight">
                I agree to the{' '}
                <span className="text-[#635BFF] font-semibold underline">Terms of Service</span> and{' '}
                <span className="text-[#635BFF] font-semibold underline">Privacy Policy</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-1 w-full py-2.5 px-4 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8EBF8]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#94A3B8]">Or sign up with</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-[#13182E] font-semibold text-sm rounded-xl border border-[#E8EBF8] shadow-xs flex items-center justify-center gap-2.5 transition-all"
            >
              <GoogleLogo className="w-4 h-4" />
              <span>Sign up with Google</span>
            </button>
          </form>
        </div>

        {/* Footer Toggle */}
        <div className="mt-6 text-center text-xs text-[#64748B]">
          Already have an account?{' '}
          <Link to="/signin" className="font-bold text-[#635BFF] hover:underline">
            Sign in
          </Link>
        </div>
      </div>

      {/* Right Banner Column */}
      <div className="hidden lg:block lg:col-span-5 p-3">
        <AuthSideBanner initialQuoteIndex={1} />
      </div>
    </div>
  );
};
