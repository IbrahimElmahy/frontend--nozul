import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SettingsCog from './components/SettingsCog';

export interface ThemeSettings {
  colorScheme: 'light' | 'dark';
  layoutWidth: 'full' | 'boxed';
  sidebarColor: 'light' | 'dark' | 'brand' | 'gradient';
  sidebarSize: 'default' | 'compact' | 'condensed';
  showUserInfo: boolean;
  topbarColor: 'light' | 'dark';
}

const defaultSettings: ThemeSettings = {
  colorScheme: 'light',
  layoutWidth: 'full',
  sidebarColor: 'brand',
  sidebarSize: 'default',
  showUserInfo: false,
  topbarColor: 'light',
};


interface DashboardPageProps {
  onLogout: () => void;
  settings: ThemeSettings;
  setSettings: (settings: ThemeSettings | ((prev: ThemeSettings) => ThemeSettings)) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, settings, setSettings }) => {
  const layoutWidthClass = settings.layoutWidth === 'boxed' ? 'max-w-screen-xl mx-auto shadow-2xl' : 'w-full';

  return (
    <div className={`${layoutWidthClass} h-screen overflow-hidden`}>
        <div className={`flex h-full bg-slate-50 dark:bg-slate-900 font-sans`}>
            <Sidebar onLogout={onLogout} settings={settings} />
            <div className="flex-1 flex flex-col">
                <Header onLogout={onLogout} settings={settings} />
                <main className={`flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6`}>
                    <Dashboard />
                </main>
            </div>
            <SettingsCog settings={settings} setSettings={setSettings} />
        </div>
    </div>
  );
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });

  useEffect(() => {
    if (isAuthenticated) {
      document.title = "Hotel Dashboard";
    } else {
      document.title = "Hotel Dashboard - Login";
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    const currentSettings = { ...settings };
    // @ts-ignore
    delete currentSettings.menuPosition; // Clean up old setting if it exists
    localStorage.setItem('themeSettings', JSON.stringify(currentSettings));

    if (settings.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);


  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? <DashboardPage onLogout={handleLogout} settings={settings} setSettings={setSettings} /> : <LoginPage onLoginSuccess={handleLogin} />}
    </>
  );
};

export default App;