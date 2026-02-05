import { useState, useEffect } from 'react';
import { TaskProvider } from './context/TaskContext';
import TaskBoard from './components/TaskBoard';
import AiChat from './components/AiChat';
import Landing from './pages/Landing';
import Features from './pages/Features';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import './App.css';

type Page = 'landing' | 'features' | 'profile' | 'tasks' | 'login';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Check if user is logged in
    const savedUserId = localStorage.getItem('userId');
    const savedUserName = localStorage.getItem('userName');
    if (savedUserId && savedUserName) {
      setUserId(savedUserId);
      setUserName(savedUserName);
      setCurrentPage('tasks');
    }
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLoginSuccess = (id: string, name: string) => {
    setUserId(id);
    setUserName(name);
    setCurrentPage('tasks');
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setUserId(null);
    setUserName('');
    setCurrentPage('landing');
  };

  return (
    <TaskProvider>
      {currentPage === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'landing' && <Landing onNavigate={navigateTo} />}
      {currentPage === 'features' && <Features onNavigate={navigateTo} />}
      {currentPage === 'profile' && <UserProfile onNavigate={navigateTo} onSave={() => {}} />}
      {currentPage === 'tasks' && userId ? (
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
                  onClick={() => navigateTo('features')}
                  className="hover:bg-white/20 px-3 py-2 rounded transition"
                >
                  Features
                </button>
                <button
                  onClick={() => navigateTo('profile')}
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
          <AiChat userId={userId} />
        </div>
      ) : currentPage === 'tasks' ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : null}
    </TaskProvider>
  );
}

export default App;
