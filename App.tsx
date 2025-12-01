
import React, { useState, useEffect, useContext } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UserProfilePage from './components/UserProfilePage';
import UnitsPage from './components/UnitsPage';
import BookingsPage from './components/BookingsPage';
import GuestsPage from './components/GuestsPage';
import BookingAgenciesPage from './components/BookingAgenciesPage';
import OrdersPage from './components/OrdersPage';
import ReceiptsPage from './components/ReceiptsPage';
import SettingsCog from './components/SettingsCog';
import ReportsPage from './components/ReportsPage';
import ArchivesPage from './components/ArchivesPage';
import NotificationsPage from './components/NotificationsPage';
import HotelSettingsPage from './components/HotelSettingsPage';
import HotelInfoPage from './components/HotelInfoPage';
import UsersPage from './components/UsersPage';
import ApartmentPricesPage from './components/ApartmentPricesPage';
import PeakTimesPage from './components/PeakTimesPage';
import TaxesPage from './components/TaxesPage';
import ItemsPage from './components/ItemsPage';
import CurrenciesPage from './components/CurrenciesPage';
import FundsPage from './components/FundsPage';
import BanksPage from './components/BanksPage';
import ExpensesPage from './components/ExpensesPage';
import HotelConditionsPage from './components/HotelConditionsPage';
import { LanguageContext } from './contexts/LanguageContext';
import { User } from './types';

export type ColorSchemeName = 'blue' | 'violet' | 'teal' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'slate' | 'orange' | 'indigo' | 'fuchsia' | 'lime' | 'sky' | 'pink';

export interface ThemeSettings {
  colorScheme: 'light' | 'dark';
  layoutWidth: 'full' | 'boxed';
  sidebarColor: 'light' | 'dark' | 'brand' | 'gradient';
  sidebarSize: 'default' | 'compact' | 'condensed';
  showUserInfo: boolean;
  topbarColor: 'light' | 'dark' | 'brand';
  themeColor: ColorSchemeName;
  cardStyle?: 'solid' | 'soft' | 'glass';
  animatedBackground?: boolean;
}

export type Page = 'dashboard' | 'profile' | 'units' | 'bookings' | 'guests' | 'agencies' | 'orders' | 'receipts' | 'reports' | 'archives' | 'notifications' | 'hotel-settings' | 'hotel-info' | 'hotel-users' | 'apartment-prices' | 'peak-times' | 'taxes' | 'items' | 'currencies' | 'funds' | 'banks' | 'expenses' | 'hotel-conditions';

const defaultSettings: ThemeSettings = {
  colorScheme: 'light',
  layoutWidth: 'full',
  sidebarColor: 'brand',
  sidebarSize: 'condensed',
  showUserInfo: false,
  topbarColor: 'light',
  themeColor: 'blue',
  cardStyle: 'soft',
  animatedBackground: false,
};

// RGB values for color palettes (Tailwind colors)
const colorPalettes: Record<ColorSchemeName, Record<number, string>> = {
  blue: { // Default Tailwind Blue
    50: '239 246 255', 100: '219 234 254', 200: '191 219 254', 300: '147 197 253', 400: '96 165 250',
    500: '59 130 246', 600: '37 99 235', 700: '29 78 216', 800: '30 64 175', 900: '30 58 138', 950: '23 37 84',
  },
  violet: { // Tailwind Violet
    50: '245 243 255', 100: '237 233 254', 200: '221 214 254', 300: '196 181 253', 400: '167 139 250',
    500: '139 92 246', 600: '124 58 237', 700: '109 40 217', 800: '91 33 182', 900: '76 29 149', 950: '46 16 101',
  },
  teal: { // Tailwind Teal
    50: '240 253 250', 100: '204 251 241', 200: '153 246 228', 300: '94 234 212', 400: '45 212 191',
    500: '20 184 166', 600: '13 148 136', 700: '15 118 110', 800: '17 94 89', 900: '19 78 74', 950: '4 47 46',
  },
  emerald: { // Tailwind Emerald
    50: '236 253 245', 100: '209 250 229', 200: '167 243 208', 300: '110 231 183', 400: '52 211 153',
    500: '16 185 129', 600: '5 150 105', 700: '4 120 87', 800: '6 95 70', 900: '6 78 59', 950: '2 44 34',
  },
  amber: { // Tailwind Amber
    50: '255 251 235', 100: '254 243 199', 200: '253 230 138', 300: '252 211 77', 400: '251 191 36',
    500: '245 158 11', 600: '217 119 6', 700: '180 83 9', 800: '146 64 14', 900: '120 53 15', 950: '69 26 3',
  },
  rose: { // Tailwind Rose
    50: '255 241 242', 100: '255 228 230', 200: '254 205 211', 300: '253 164 175', 400: '251 113 133',
    500: '244 63 94', 600: '225 29 72', 700: '190 18 60', 800: '159 18 57', 900: '136 19 55', 950: '76 5 25',
  },
  cyan: { // Tailwind Cyan
    50: '236 254 255', 100: '207 250 254', 200: '165 243 252', 300: '103 232 249', 400: '34 211 238',
    500: '6 182 212', 600: '8 145 178', 700: '14 116 144', 800: '21 94 117', 900: '22 78 99', 950: '8 51 68',
  },
  slate: { // Tailwind Slate (Monochrome feel)
    50: '248 250 252', 100: '241 245 249', 200: '226 232 240', 300: '203 213 225', 400: '148 163 184',
    500: '100 116 139', 600: '71 85 105', 700: '51 65 85', 800: '30 41 59', 900: '15 23 42', 950: '2 6 23',
  },
  orange: { // Tailwind Orange
    50: '255 247 237', 100: '255 237 213', 200: '254 215 170', 300: '253 186 116', 400: '251 146 60',
    500: '249 115 22', 600: '234 88 12', 700: '194 65 12', 800: '154 52 18', 900: '124 45 18', 950: '67 20 7',
  },
  indigo: { // Tailwind Indigo
    50: '238 242 255', 100: '224 231 255', 200: '199 210 254', 300: '165 180 252', 400: '129 140 248',
    500: '99 102 241', 600: '79 70 229', 700: '67 56 202', 800: '55 48 163', 900: '49 46 129', 950: '30 27 75',
  },
  fuchsia: { // Tailwind Fuchsia
    50: '253 244 255', 100: '250 232 255', 200: '245 208 254', 300: '240 171 252', 400: '232 121 249',
    500: '217 70 239', 600: '192 38 211', 700: '162 28 175', 800: '134 25 143', 900: '112 26 117', 950: '74 4 78',
  },
  lime: { // Tailwind Lime
    50: '247 254 231', 100: '236 252 203', 200: '217 249 157', 300: '190 242 100', 400: '163 230 53',
    500: '132 204 22', 600: '101 163 13', 700: '77 124 15', 800: '63 98 18', 900: '54 83 20', 950: '26 46 5',
  },
  sky: { // Tailwind Sky
    50: '240 249 255', 100: '224 242 254', 200: '186 230 253', 300: '125 211 252', 400: '56 189 248',
    500: '14 165 233', 600: '2 132 199', 700: '3 105 161', 800: '7 89 133', 900: '12 74 110', 950: '8 47 73',
  },
  pink: { // Tailwind Pink
    50: '253 242 248', 100: '252 231 243', 200: '251 207 232', 300: '249 168 212', 400: '244 114 182',
    500: '236 72 153', 600: '219 39 119', 700: '190 24 93', 800: '157 23 77', 900: '131 24 67', 950: '80 7 36',
  },
};


interface DashboardPageProps {
  onLogout: () => void;
  settings: ThemeSettings;
  setSettings: (settings: ThemeSettings | ((prev: ThemeSettings) => ThemeSettings)) => void;
  user: User | null;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, settings, setSettings, user }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Load current page from localStorage, default to 'dashboard' if not found
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const savedPage = localStorage.getItem('currentPage');
    return (savedPage as Page) || 'dashboard';
  });

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const layoutWidthClass = settings.layoutWidth === 'boxed' ? 'max-w-screen-xl mx-auto shadow-2xl' : 'w-full';

  // Updated: Use primary color (blue-*) for background gradient so it follows the theme.
  // The 'blue' classes here are mapped to var(--color-primary-*) in index.html
  // Increased opacity/strength of the gradient for better visibility.
  // In dark mode, we add a slight tint of the primary color to the dark background.
  const animatedBgClass = settings.animatedBackground
    ? 'animate-gradient-x bg-gradient-to-r from-blue-100 via-white to-blue-200 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30'
    : 'bg-slate-50 dark:bg-slate-900';

  return (
    <div className={`${layoutWidthClass} h-screen overflow-hidden`}>
      <div className={`relative flex h-full ${animatedBgClass} font-sans transition-colors duration-500`}>
        {/* Overlay for mobile sidebar */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          ></div>
        )}
        <Sidebar onLogout={onLogout} settings={settings} isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} setCurrentPage={setCurrentPage} currentPage={currentPage} user={user} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onLogout={onLogout} settings={settings} onMenuButtonClick={() => setMobileMenuOpen(true)} setCurrentPage={setCurrentPage} currentPage={currentPage} user={user} />
          <main className={`flex-1 overflow-y-auto p-4 sm:p-6 ${settings.animatedBackground ? 'bg-transparent' : 'bg-slate-100 dark:bg-slate-950'}`}>
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'profile' && <UserProfilePage user={user} />}
            {currentPage === 'units' && <UnitsPage />}
            {currentPage === 'bookings' && <BookingsPage />}
            {currentPage === 'guests' && <GuestsPage />}
            {currentPage === 'agencies' && <BookingAgenciesPage />}
            {currentPage === 'orders' && <OrdersPage />}
            {currentPage === 'receipts' && <ReceiptsPage user={user} />}
            {currentPage === 'reports' && <ReportsPage />}
            {currentPage === 'archives' && <ArchivesPage />}
            {currentPage === 'notifications' && <NotificationsPage />}
            {currentPage === 'hotel-settings' && <HotelSettingsPage setCurrentPage={setCurrentPage} />}
            {currentPage === 'hotel-info' && <HotelInfoPage setCurrentPage={setCurrentPage} />}
            {currentPage === 'hotel-users' && <UsersPage setCurrentPage={setCurrentPage} />}
            {currentPage === 'apartment-prices' && <ApartmentPricesPage />}
            {currentPage === 'peak-times' && <PeakTimesPage />}
            {currentPage === 'taxes' && <TaxesPage />}
            {currentPage === 'items' && <ItemsPage />}
            {currentPage === 'currencies' && <CurrenciesPage />}
            {currentPage === 'funds' && <FundsPage />}
            {currentPage === 'banks' && <BanksPage />}
            {currentPage === 'expenses' && <ExpensesPage />}
            {currentPage === 'hotel-conditions' && <HotelConditionsPage />}
          </main>
        </div>
        <SettingsCog settings={settings} setSettings={setSettings} />
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    const loadedSettings = savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;

    // Ensure backwards compatibility if new properties are missing in local storage
    if (!loadedSettings.themeColor) loadedSettings.themeColor = 'blue';
    if (!loadedSettings.topbarColor) loadedSettings.topbarColor = 'light';
    if (!loadedSettings.cardStyle) loadedSettings.cardStyle = 'soft';
    if (loadedSettings.animatedBackground === undefined) loadedSettings.animatedBackground = false;

    loadedSettings.sidebarSize = 'condensed'; // Force condensed size
    return loadedSettings;
  });
  const { language } = useContext(LanguageContext);


  useEffect(() => {
    if (isAuthenticated) {
      document.title = "نزلكم";
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      document.title = "نزلكم - تسجيل الدخول";
      setUser(null);
    }
  }, [isAuthenticated]);

  // Apply Theme Settings and CSS Variables
  useEffect(() => {
    const currentSettings = { ...settings };
    // @ts-ignore
    delete currentSettings.menuPosition; // Clean up old setting
    localStorage.setItem('themeSettings', JSON.stringify(currentSettings));

    // Apply Dark Mode
    if (settings.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply Color Palette Variables
    const root = document.documentElement;
    const palette = colorPalettes[settings.themeColor || 'blue'];

    if (palette) {
      Object.entries(palette).forEach(([shade, rgbValue]) => {
        root.style.setProperty(`--color-primary-${shade}`, String(rgbValue));
      });
    }

  }, [settings]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);


  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? <DashboardPage onLogout={handleLogout} settings={settings} setSettings={setSettings} user={user} /> : <LoginPage onLoginSuccess={handleLogin} />}
    </>
  );
};

export default App;
