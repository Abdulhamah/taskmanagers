import { ArrowLeft, CheckCircle, Sparkles, Zap, Brain, Clock, Filter, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Features(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-indigo-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Features</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-indigo-300 hover:text-white transition"
          >
            <ArrowLeft size={20} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Features */}
        <div className="space-y-12">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-indigo-500/20 border border-indigo-400/50 rounded-full px-4 py-2 mb-4">
                <p className="text-indigo-300 text-sm font-semibold">✨ AI-Powered</p>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Intelligent Task Creation</h2>
              <p className="text-lg text-slate-300 mb-6">
                Just write a task title and let our AI assistant auto-generate detailed descriptions and suggest the perfect category. Save time on task setup.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-indigo-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">Auto-generate task descriptions</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-indigo-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">Smart category suggestions</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-indigo-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">Powered by Claude 3.5 Sonnet</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-8 h-80 flex items-center justify-center">
              <Sparkles className="text-indigo-300" size={120} />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-8 h-80 flex items-center justify-center order-2 md:order-1">
              <Brain className="text-purple-300" size={120} />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block bg-purple-500/20 border border-purple-400/50 rounded-full px-4 py-2 mb-4">
                <p className="text-purple-300 text-sm font-semibold">🧠 Smart Insights</p>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">AI-Powered Suggestions</h2>
              <p className="text-lg text-slate-300 mb-6">
                Get intelligent suggestions for completing your tasks. Our AI analyzes your work patterns and provides actionable tips.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">Contextual task suggestions</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">Productivity insights</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">Task completion tips</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-cyan-500/20 border border-cyan-400/50 rounded-full px-4 py-2 mb-4">
                <p className="text-cyan-300 text-sm font-semibold">⚡ Organization</p>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Kanban Board</h2>
              <p className="text-lg text-slate-300 mb-6">
                Organize your tasks visually with our intuitive Kanban board. Drag and drop tasks between columns to update their status instantly.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">Three status columns</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">Real-time updates</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">Visual task management</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-8 h-80 flex items-center justify-center">
              <Zap className="text-cyan-300" size={120} />
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-white mb-12 text-center">More Powerful Features</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
                <Clock className="text-indigo-400 mb-4" size={32} />
                <h4 className="text-white font-semibold mb-2">Due Dates</h4>
                <p className="text-slate-300 text-sm">Set deadlines for tasks and never miss important dates</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                <Filter className="text-purple-400 mb-4" size={32} />
                <h4 className="text-white font-semibold mb-2">Smart Filtering</h4>
                <p className="text-slate-300 text-sm">Filter and sort tasks by status, priority, and category</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
                <BarChart3 className="text-cyan-400 mb-4" size={32} />
                <h4 className="text-white font-semibold mb-2">Analytics</h4>
                <p className="text-slate-300 text-sm">Get insights about your task completion rates</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl p-6">
                <Sparkles className="text-pink-400 mb-4" size={32} />
                <h4 className="text-white font-semibold mb-2">Priorities</h4>
                <p className="text-slate-300 text-sm">Set Low, Medium, or High priority for each task</p>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
                <Brain className="text-amber-400 mb-4" size={32} />
                <h4 className="text-white font-semibold mb-2">Categories</h4>
                <p className="text-slate-300 text-sm">Organize tasks by Work, Personal, Shopping, and more</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                <CheckCircle className="text-green-400 mb-4" size={32} />
                <h4 className="text-white font-semibold mb-2">Track Progress</h4>
                <p className="text-slate-300 text-sm">Monitor completed tasks and stay motivated</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Productivity?</h3>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Start managing your tasks with AI assistance today. It's free to get started!
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}
