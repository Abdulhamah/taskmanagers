import { useState } from 'react';
import { Mail, ArrowLeft, Check, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('code');
        if (data.previewUrl) {
          setPreviewUrl(data.previewUrl);
        }
      } else {
        setError(data.error || 'Failed to send reset code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
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

    if (!code) {
      setError('Please enter the reset code');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: password })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('success');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
            <p className="text-indigo-100 mt-2">
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'code' && 'Enter the code and new password'}
              {step === 'success' && 'Password reset successfully'}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'email' ? (
              <form onSubmit={handleSendCode} className="space-y-4">
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
                  {loading ? 'Sending...' : 'Send Reset Code'}
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
            ) : step === 'code' ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Reset Code
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
                    Check your email for the 6-digit code
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
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
                    Show passwords
                  </label>
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
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setCode('');
                    setPassword('');
                    setConfirmPassword('');
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
                  <h2 className="text-xl font-bold text-white mb-2">Password Reset Successfully</h2>
                  <p className="text-slate-300 text-sm">
                    Your password has been reset. Redirecting to login...
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
