import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLoginSuccess: (userId: string, userName: string) => void;
}

export default function Login({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      onLoginSuccess(data.id, data.name);
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">✓</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TaskMaster</h1>
          <p className="text-slate-400">Made by Abdulrazzak Kouwider</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>

          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 pl-10 bg-slate-700 bg-opacity-50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-200">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pl-10 bg-slate-700 bg-opacity-50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Loading...'
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-center text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
