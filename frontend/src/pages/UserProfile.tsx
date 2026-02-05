import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, User, CheckCircle } from 'lucide-react';

interface UserProfileProps {
  onNavigate: (page: 'landing' | 'features' | 'profile' | 'tasks' | 'login') => void;
  onSave: (info: { name: string; email: string }) => void;
}

export default function UserProfile({ onNavigate, onSave }: UserProfileProps) {
  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userInfo });

  useEffect(() => {
    // Fetch user info from backend if userId exists
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`/api/auth/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          setUserInfo({
            name: data.name,
            email: data.email
          });
          setFormData({
            name: data.name,
            email: data.email
          });
          localStorage.setItem('userEmail', data.email);
        })
        .catch(err => console.error('Error fetching user:', err));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      onSave(formData);
      setUserInfo(formData);
      setIsEditing(false);
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      {/* Header */}
      <button
        onClick={() => onNavigate('tasks')}
        className="absolute top-6 left-6 flex items-center gap-2 text-indigo-300 hover:text-white transition"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="w-full max-w-md">
        {userInfo.name ? (
          <div className="bg-black/40 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-8">
            <div className="text-center mb-8">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
              <p className="text-slate-400">Your account information</p>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-indigo-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 border border-indigo-500/30 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-indigo-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 border border-indigo-500/30 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Full Name</p>
                  <p className="text-white font-semibold text-lg">{userInfo.name}</p>
                </div>

                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Email Address</p>
                  <p className="text-white font-semibold text-lg flex items-center gap-2">
                    <Mail size={18} className="text-indigo-400" />
                    {userInfo.email}
                  </p>
                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                  <p className="text-indigo-300 text-sm">
                    ✓ Your data is saved and secured in our database
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-black/40 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-indigo-500/20 border border-indigo-400/50 rounded-full px-4 py-2 mb-4">
                <p className="text-indigo-300 text-sm font-semibold">👤 Update Profile</p>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Update Your Info</h1>
              <p className="text-slate-400">Complete your profile</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-indigo-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full bg-slate-800/50 border border-indigo-500/30 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-indigo-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-slate-800/50 border border-indigo-500/30 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Save Profile
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
