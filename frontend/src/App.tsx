import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import TaskBoard from './components/TaskBoard';
import AiChat from './components/AiChat';
import Landing from './pages/Landing';
import Features from './pages/Features';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Check if user is logged in
    const savedUserId = localStorage.getItem('userId');
    const savedUserName = localStorage.getItem('userName');
    if (savedUserId && savedUserName) {
      setUserId(savedUserId);
      setUserName(savedUserName);
    }
  }, []);

  const handleLoginSuccess = (id: string, name: string) => {
    setUserId(id);
    setUserName(name);
    navigate('/tasks');
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setUserId(null);
    setUserName('');
    navigate('/');
  };

  return (
    <TaskProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register onRegisterSuccess={handleLoginSuccess} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route 
          path="/profile" 
          element={
            userId ? (
              <UserProfile onSave={() => {}} />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />
        <Route
          path="/tasks"
          element={
            userId ? (
              <div>
                <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                  <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <h1 className="text-2xl font-bold">TaskMaster</h1>
                      <span className="text-xs text-white/60 ml-2">by Abdulrazzak Kouwider</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-sm">Welcome, {userName}!</span>
                      <button
                        onClick={() => navigate('/features')}
                        className="hover:bg-white/20 px-3 py-2 rounded transition"
                      >
                        Features
                      </button>
                      <button
                        onClick={() => navigate('/profile')}
                        className="hover:bg-white/20 px-3 py-2 rounded transition"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="hover:bg-white/20 px-3 py-2 rounded transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </nav>
                <TaskBoard />
                <AiChat />
              </div>
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
      </Routes>
    </TaskProvider>
  );
}

export default App;
