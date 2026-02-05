import { Sparkles, ArrowRight, Zap, Brain, BarChart3 } from 'lucide-react';

interface LandingProps {
  onNavigate: (page: 'landing' | 'features' | 'profile' | 'tasks' | 'login') => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-indigo-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-white">TaskMaster</h1>
            <span className="text-xs text-slate-400 ml-2">by Abdulrazzak Kouwider</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('features')}
              className="text-indigo-300 hover:text-white transition"
            >
              Features
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="space-y-6 mb-12">
          <div className="inline-block bg-indigo-500/20 border border-indigo-400/50 rounded-full px-4 py-2">
            <p className="text-indigo-300 text-sm font-semibold">🚀 Powered by AI</p>
          </div>
          
          <h2 className="text-6xl font-bold text-white leading-tight">
            Your Tasks, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Supercharged</span>
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            TaskMaster AI helps you organize, prioritize, and complete tasks with intelligent AI assistance. Stay productive and focused.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <button
              onClick={() => onNavigate('login')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              Start Free <ArrowRight size={20} />
            </button>
            <button
              onClick={() => onNavigate('features')}
              className="border border-indigo-400/50 text-indigo-300 hover:bg-indigo-500/10 px-8 py-3 rounded-lg font-semibold transition"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 hover:border-indigo-400/50 transition">
            <Brain className="text-indigo-400 mb-4 mx-auto" size={40} />
            <h3 className="text-white font-semibold mb-2">AI Assistant</h3>
            <p className="text-slate-300 text-sm">Get smart suggestions and auto-generated descriptions powered by Claude AI</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/50 transition">
            <Zap className="text-purple-400 mb-4 mx-auto" size={40} />
            <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
            <p className="text-slate-300 text-sm">Organize tasks in Kanban columns with instant updates and smooth interactions</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400/50 transition">
            <BarChart3 className="text-cyan-400 mb-4 mx-auto" size={40} />
            <h3 className="text-white font-semibold mb-2">Smart Analytics</h3>
            <p className="text-slate-300 text-sm">Get insights about your productivity and task distribution</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8 text-center">
        <div className="bg-gradient-to-br from-indigo-500/5 to-transparent border border-indigo-500/20 rounded-lg p-6">
          <div className="text-3xl font-bold text-indigo-400">1000+</div>
          <p className="text-slate-300 mt-2">Active Users</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-400">50K+</div>
          <p className="text-slate-300 mt-2">Tasks Managed</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-lg p-6">
          <div className="text-3xl font-bold text-cyan-400">99.9%</div>
          <p className="text-slate-300 mt-2">Uptime</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500/5 to-transparent border border-pink-500/20 rounded-lg p-6">
          <div className="text-3xl font-bold text-pink-400">24/7</div>
          <p className="text-slate-300 mt-2">AI Support</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-indigo-500/20 bg-black/50 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          <p>© 2024 TaskMaster. Made with ❤️ by Abdulrazzak Kouwider</p>
        </div>
      </footer>
    </div>
  );
}
