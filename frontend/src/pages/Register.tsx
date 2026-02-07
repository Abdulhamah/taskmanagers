import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  onRegisterSuccess: (userId: string, userName: string) => void;
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'register' | 'verify' | 'success'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setUserId(data.userId);
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
      }
      setStep('verify');
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Verification failed');
        return;
      }

      // Store user data
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);

      setStep('success');
      setTimeout(() => {
        onRegisterSuccess(userId, name);
      }, 2000);
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-md border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-indigo-100 mt-2">
              {step === 'register' && 'Sign up to get started'}
              {step === 'verify' && 'Verify your email address'}
              {step === 'success' && 'Account created successfully'}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'register' ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-indigo-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-indigo-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-indigo-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="At least 6 characters"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-indigo-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4 bg-slate-800 border border-indigo-500/30 rounded cursor-pointer"
                  />
                  <label htmlFor="showPassword" className="text-sm text-slate-400 cursor-pointer">
                    Show password
                  </label>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition py-2"
                >
                  <ArrowLeft size={18} />
                  Back to Login
                </button>
              </form>
            ) : step === 'verify' ? (
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-indigo-500/30 text-white text-center text-2xl font-bold tracking-widest rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Check your email for the 6-digit verification code
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                    {error}
                  </div>
                )}

                {previewUrl && (
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 text-left">
                    <p className="text-blue-300 text-xs font-semibold mb-2">📧 Development Preview:</p>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 break-all text-xs underline"
                    >
                      View email with code
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('register');
                    setCode('');
                    setError('');
                  }}
                  className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition py-2"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-500/20 border border-green-500/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Check className="text-green-400" size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Welcome to TaskMaster!</h2>
                  <p className="text-slate-300 text-sm">
                    Your account has been created and verified. Preparing to log you in...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
