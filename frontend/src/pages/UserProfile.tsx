import { useState } from 'react';
import { ArrowLeft, Mail, User } from 'lucide-react';

interface UserProfileProps {
  onNavigate: (page: 'landing' | 'features' | 'profile' | 'tasks' | 'login') => void;
  onSave: (info: { name: string; email: string }) => void;
}

export default function UserProfile({ onNavigate, onSave }: UserProfileProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      onSave(formData);
      setIsSubmitted(true);
      setTimeout(() => {
        onNavigate('tasks');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      {/* Header */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 flex items-center gap-2 text-indigo-300 hover:text-white transition"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="w-full max-w-md">
        {!isSubmitted ? (
          <div className="bg-black/40 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block bg-indigo-500/20 border border-indigo-400/50 rounded-full px-4 py-2 mb-4">
                <p className="text-indigo-300 text-sm font-semibold">👤 Get Started</p>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to TaskMaster</h1>
              <p className="text-slate-400">Tell us a bit about yourself</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-indigo-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-800/50 border border-indigo-500/30 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-indigo-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-slate-800/50 border border-indigo-500/30 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Company Field */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Company (Optional)</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company"
                  className="w-full bg-slate-800/50 border border-indigo-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Role (Optional)</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g., Project Manager"
                  className="w-full bg-slate-800/50 border border-indigo-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Benefits */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 space-y-2">
                <p className="text-indigo-300 font-semibold text-sm">✓ Free to use</p>
                <p className="text-indigo-300 font-semibold text-sm">✓ AI-powered assistance</p>
                <p className="text-indigo-300 font-semibold text-sm">✓ No credit card required</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Start Using TaskMaster
              </button>

              {/* Sign In */}
              <p className="text-center text-slate-400 text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('tasks')}
                  className="text-indigo-400 hover:text-indigo-300 transition"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-black/40 backdrop-blur-xl border border-green-500/30 rounded-2xl p-8 text-center">
            <div className="inline-block bg-green-500/20 border border-green-400/50 rounded-full p-4 mb-4">
              <div className="text-4xl">✓</div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome, {formData.name}!</h2>
            <p className="text-slate-400 mb-6">Your account is all set up. Get ready to master your tasks!</p>
            <p className="text-slate-500 text-sm">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
