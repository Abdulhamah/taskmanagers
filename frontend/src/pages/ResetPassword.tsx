import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-md border border-blue-500/30 rounded-2xl shadow-2xl p-6 text-center">
          <AlertCircle className="text-blue-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Password Reset</h2>
          <p className="text-slate-300 mb-6">
            Password resets are now done on the forgot password page for better security. You'll enter a code sent to your email instead of clicking a link.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Go to Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

