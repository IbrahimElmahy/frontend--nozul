import React, { useState, useEffect, useContext } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UserProfilePage from './components/UserProfilePage';
import UnitsPage from './components/UnitsPage'; // Import the new UnitsPage
import SettingsCog from './components/SettingsCog';
import { LanguageContext } from './contexts/LanguageContext';

export interface ThemeSettings {
  colorScheme: 'light' | 'dark';
  layoutWidth: 'full' | 'boxed';
  sidebarColor: 'light' | 'dark' | 'brand' | 'gradient';
  sidebarSize: 'default' | 'compact' | 'condensed';
  showUserInfo: boolean;
  topbarColor: 'light' | 'dark';
}

export type Page = 'dashboard' | 'profile' | 'units'; // Add 'units' page type

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
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('units');

  const layoutWidthClass = settings.layoutWidth === 'boxed' ? 'max-w-screen-xl mx-auto shadow-2xl' : 'w-full';

  return (
    <div className={`${layoutWidthClass} h-screen overflow-hidden`}>
        <div className={`relative flex h-full bg-slate-50 dark:bg-slate-900 font-sans`}>
            {/* Overlay for mobile sidebar */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              ></div>
            )}
            <Sidebar onLogout={onLogout} settings={settings} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} setCurrentPage={setCurrentPage} currentPage={currentPage} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header onLogout={onLogout} settings={settings} onMenuButtonClick={() => setMobileMenuOpen(true)} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                <main className={`flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-6`}>
                    {currentPage === 'dashboard' && <Dashboard />}
                    {currentPage === 'profile' && <UserProfilePage />}
                    {currentPage === 'units' && <UnitsPage />}
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
  const { language } = useContext(LanguageContext);


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

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);


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
