import React, { useState, useEffect, useContext } from 'react';
import Logo from './icons/Logo';
import EyeIcon from './icons-redesign/EyeIcon';
import EyeOffIcon from './icons-redesign/EyeOffIcon';
import { LanguageContext } from '../contexts/LanguageContext';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
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
  const rememberMeAlignmentClass = language === 'ar' ? 'justify-end' : 'justify-start';
  const logoAlignmentClass = language === 'ar' ? 'items-end' : 'items-start';

  return (
    <div className="min-h-screen flex font-sans">
      {/* Login Form Section */}
      <div className="w-full lg:w-2/5 xl:w-1/3 bg-white flex flex-col p-8 lg:p-12">
        <div className={`flex flex-col ${logoAlignmentClass}`}>
            <Logo className="w-32 h-auto"/>
        </div>

        <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-sm">
                <div className={`${formAlignmentClass} mb-8`}>
                    <h1 className="text-3xl font-bold text-slate-700 mb-2">{t('login.title')}</h1>
                    <p className="text-gray-500">{t('login.subtitle')}</p>
                </div>

                <form noValidate onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className={`block text-sm font-medium text-gray-700 ${formAlignmentClass} mb-1`}>{t('login.usernameLabel')}</label>
                        <input
                            type="text"
                            id="username"
                            placeholder={t('login.usernamePlaceholder')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full px-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${inputAlignmentClass}`}
                            required
                            aria-required="true"
                            aria-invalid={!!error}
                            aria-describedby={error ? "error-message" : undefined}
                        />
                    </div>

                    <div className="mb-6">
                        <div className={`flex justify-between items-center mb-1 ${language === 'en' ? 'flex-row-reverse' : ''}`}>
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">{t('login.passwordLabel')}</label>
                            <a href="#" className="text-xs text-blue-500 hover:underline">{t('login.forgotPassword')}</a>
                        </div>
                        <div className="relative">
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                id="password"
                                placeholder={t('login.passwordPlaceholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${inputAlignmentClass} ${language === 'ar' ? 'pl-10' : 'pr-10'}`}
                                required
                                aria-required="true"
                                aria-invalid={!!error}
                                aria-describedby={error ? "error-message" : undefined}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className={`absolute inset-y-0 flex items-center text-gray-400 hover:text-gray-600 ${language === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'}`}
                                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                                aria-controls="password"
                            >
                                {isPasswordVisible ? (
                                    <EyeOffIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {error && (
                        <p
                            id="error-message"
                            className={`text-red-500 text-sm ${formAlignmentClass} mb-4`}
                            role="alert"
                            aria-live="assertive"
                        >
                          {error}
                        </p>
                    )}

                    <div className={`flex items-center mb-6 ${rememberMeAlignmentClass}`}>
                        <label htmlFor="remember-me" className={`text-sm text-gray-700 ${language === 'ar' ? 'mr-2' : 'ml-2'}`}>{t('login.rememberMe')}</label>
                        <input
                            id="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-200 rounded"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2.5 rounded-md font-bold hover:bg-blue-600 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {loading ? '...جاري تسجيل الدخول' : t('login.loginButton')}
                    </button>
                </form>
            </div>
        </div>

        <p className="text-center text-xs text-gray-400">
            {t('login.footerText')}
        </p>
      </div>

      {/* Background Image Section */}
      <div className="hidden lg:block lg:w-3/5 xl:w-2/3">
        <img
          src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7207?q=80&w=2070&auto=format&fit=crop"
          alt="New York City skyline with Brooklyn Bridge at night"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;