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

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center font-sans p-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="w-full max-w-md bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
            <Logo className="w-40 h-auto"/>
        </div>

        <div className={`${formAlignmentClass} mb-6 text-center`}>
            <h1 className="text-3xl font-bold text-white mb-2">{t('login.title')}</h1>
            <p className="text-blue-200/80">{t('login.subtitle')}</p>
        </div>

        <form noValidate onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="username" className={`block text-sm font-medium text-blue-200/90 ${formAlignmentClass} mb-1`}>{t('login.usernameLabel')}</label>
                <input
                    type="text"
                    id="username"
                    placeholder={t('login.usernamePlaceholder')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder:text-gray-400/50 ${inputAlignmentClass}`}
                    required
                    aria-required="true"
                    aria-invalid={!!error}
                    aria-describedby={error ? "error-message" : undefined}
                />
            </div>

            <div className="mb-4">
                <div className={`flex justify-between items-center mb-1 ${language === 'en' ? 'flex-row-reverse' : ''}`}>
                    <label htmlFor="password" className="text-sm font-medium text-blue-200/90">{t('login.passwordLabel')}</label>
                    <a href="#" className="text-xs text-blue-300 hover:underline">{t('login.forgotPassword')}</a>
                </div>
                <div className="relative">
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        id="password"
                        placeholder={t('login.passwordPlaceholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder:text-gray-400/50 ${inputAlignmentClass} ${language === 'ar' ? 'pl-10' : 'pr-10'}`}
                        required
                        aria-required="true"
                        aria-invalid={!!error}
                        aria-describedby={error ? "error-message" : undefined}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className={`absolute inset-y-0 flex items-center text-blue-300/60 hover:text-blue-300 ${language === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'}`}
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
                    className="text-red-400 text-sm text-center mb-4"
                    role="alert"
                    aria-live="assertive"
                >
                  {error}
                </p>
            )}

            <div className="flex items-center mb-6">
                <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 accent-blue-500 bg-black/30 border-blue-500/50 rounded focus:ring-blue-500"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className={`text-sm text-blue-200/90 ${language === 'ar' ? 'mr-2' : 'ml-2'}`}>{t('login.rememberMe')}</label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {loading ? t('login.loggingIn') : t('login.loginButton')}
            </button>
        </form>

        <p className="text-center text-xs text-gray-400/60 mt-8">
            {t('login.footerText')}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;