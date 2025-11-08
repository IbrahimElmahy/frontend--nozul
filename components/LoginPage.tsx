import React, { useState, useEffect, useContext } from 'react';
import Logo from './icons/Logo';
import EyeIcon from './icons-redesign/EyeIcon';
import EyeOffIcon from './icons-redesign/EyeOffIcon';
import { LanguageContext } from '../contexts/LanguageContext';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('demo_hotel');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, language } = useContext(LanguageContext);

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setUsername(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const body = new URLSearchParams();
    body.append('role', 'hotel');
    body.append('username', username);
    body.append('password', password);

    try {
        const response = await fetch('https://www.osusideas.online/ar/auth/api/sessions/login/', {
            method: 'POST',
            body: body,
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('user', JSON.stringify(data));
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            } else {
                localStorage.removeItem('rememberedUser');
            }
            onLoginSuccess();
        } else {
            const errorMessage = data.detail || Object.values(data).flat().join(' ') || t('login.error');
            setError(errorMessage);
        }
    } catch (err) {
        setError(t('login.error'));
    } finally {
        setLoading(false);
    }
  };
  
  const formAlignmentClass = language === 'ar' ? 'text-right' : 'text-left';
  const inputAlignmentClass = language === 'ar' ? 'text-right' : 'text-left';

  return (
    <div 
      className="min-h-screen bg-cover bg-center font-sans"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="min-h-screen bg-black/60 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Marketing Section */}
          <div className={`hidden md:flex flex-col justify-center p-12 text-white bg-black/20 backdrop-blur-sm ${language === 'ar' ? 'order-1' : 'order-2'}`}>
            <div className={formAlignmentClass}>
                <p className="text-sm font-medium text-white/70">{t('login.marketingSubtitle')}</p>
                <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{t('login.marketingTitle')}</h2>
                <p className="text-lg text-white/80">{t('login.marketingDescription')}</p>
            </div>
          </div>

          {/* Form Section */}
          <div className={`p-8 md:p-12 bg-white dark:bg-slate-900 ${language === 'ar' ? 'order-2' : 'order-1'}`}>
            <div className="flex flex-col items-center mb-8">
                <Logo className="w-24 h-auto"/>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('login.logoSubtitle')}</p>
            </div>

            <div className={`text-center mb-8`}>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">{t('login.title')}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t('login.subtitle')}</p>
            </div>

            <form noValidate onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="username" className={`block text-sm font-medium text-slate-600 dark:text-slate-300 ${formAlignmentClass} mb-1`}>{t('login.usernameLabel')}</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-slate-200 ${inputAlignmentClass}`}
                        required
                        aria-required="true"
                    />
                </div>

                <div>
                    <div className={`flex justify-between items-center mb-1 ${language === 'en' ? 'flex-row-reverse' : ''}`}>
                        <label htmlFor="password" className="text-sm font-medium text-slate-600 dark:text-slate-300">{t('login.passwordLabel')}</label>
                        <a href="#" className="text-xs text-orange-500 hover:underline">{t('login.forgotPassword')}</a>
                    </div>
                    <div className="relative">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            id="password"
                            placeholder="************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-slate-200 ${inputAlignmentClass} ${language === 'ar' ? 'pl-10' : 'pr-10'}`}
                            required
                            aria-required="true"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className={`absolute inset-y-0 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ${language === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'}`}
                            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                        >
                            {isPasswordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                
                {error && (
                    <p className="text-red-500 text-sm text-center" role="alert">{error}</p>
                )}

                <div className="flex items-center">
                    <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 accent-orange-500 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember-me" className={`text-sm text-slate-600 dark:text-slate-300 ${language === 'ar' ? 'mr-2' : 'ml-2'}`}>{t('login.rememberMe')}</label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {loading ? t('login.loggingIn') : t('login.loginButton')}
                </button>
            </form>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8">
                {t('login.footerText')}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;