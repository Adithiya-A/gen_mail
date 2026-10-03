import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GenMailLogo } from '../../components/common/GenMailLogo';
import { AuthSideBanner } from '../../components/common/AuthSideBanner';
import { GoogleLogo } from '../../components/illustrations/FeatureIllustrations';
import { useEmailContext } from '../../context/EmailContext';
import {signInWithGoogle} from '../../services/authService';
import { getCurrentUser } from '../../services/api';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useEmailContext();

  const [email, setEmail] = useState('aarthi@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleGoogleSignIn = async () => {
    try {

      const user = await signInWithGoogle();

      console.log('Google sign-in successful:', user);

      const backendUser = await getCurrentUser();

      console.log('Backend authenticated user:', backendUser);


      showToast('Signed In Successfully', `Welcome back${user.name ? `, ${user.name}` : ''}!`);

      navigate('/dashboard');

    } catch (error) {

      console.error('Google sign-in failed:', error);

      showToast('Sign In Failed', 'Unable to sign in with Google. Please try again.');

    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Signed In Successfully', 'Welcome back to GenMail!');
    navigate('/dashboard');
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft-lg border border-[#E8EBF8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
      {/* Left Form Column */}
      <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <GenMailLogo to="/" />

          {/* Heading */}
          <div className="mt-8 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#13182E] tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Sign in to continue to GenMail.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#13182E] mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#13182E]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your email!')}
                  className="text-xs font-medium text-[#635BFF] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all shadow-xs"
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#635BFF] rounded border-gray-300 focus:ring-[#635BFF] accent-[#635BFF]"
              />
              <label htmlFor="remember" className="text-xs text-[#505A74] select-none cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="mt-2 w-full py-3 px-4 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8EBF8]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#94A3B8]">Or continue with</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-[#13182E] font-semibold text-sm rounded-xl border border-[#E8EBF8] shadow-xs flex items-center justify-center gap-2.5 transition-all"
            >
              <GoogleLogo className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>
          </form>
        </div>

        {/* Footer Toggle */}
        <div className="mt-8 text-center text-xs text-[#64748B]">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#635BFF] hover:underline">
            Sign up
          </Link>
        </div>
      </div>

      {/* Right Banner Column */}
      <div className="hidden lg:block lg:col-span-5 p-3">
        <AuthSideBanner initialQuoteIndex={0} />
      </div>
    </div>
  );
};
