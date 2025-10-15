import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SettingsCog from './components/SettingsCog';

interface DashboardPageProps {
  onLogout: () => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, theme, setTheme }) => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
          <Dashboard />
        </main>
      </div>
      <SettingsCog theme={theme} setTheme={setTheme} />
    </div>
  );
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (isAuthenticated) {
      document.title = "Hotel Dashboard";
    } else {
      document.title = "Hotel Dashboard - Login";
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);


  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? <DashboardPage onLogout={handleLogout} theme={theme} setTheme={setTheme} /> : <LoginPage onLoginSuccess={handleLogin} />}
    </>
  );
};

export default App;