import React, { useState, useEffect, useContext } from 'react';
import Logo from './icons/Logo';
import EyeIcon from './icons-redesign/EyeIcon';
import EyeOffIcon from './icons-redesign/EyeOffIcon';
import { LanguageContext } from '../contexts/LanguageContext';
import welcomeBg from '../images/login-hero.png';
import { API_BASE_URL } from '../config/api';

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
    const [isDayMode, setIsDayMode] = useState(() => {
        if (typeof window === 'undefined') return true;
        const stored = localStorage.getItem('nozulkumTheme');
        if (!stored) return true;
        return stored === 'day';
    });
    const { t, language } = useContext(LanguageContext);

    useEffect(() => {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            setUsername(rememberedUser);
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('nozulkumTheme', isDayMode ? 'day' : 'night');
    }, [isDayMode]);

    const togglePasswordVisibility = () => setIsPasswordVisible((v) => !v);
    const toggleThemeMode = () => setIsDayMode((prev) => !prev);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const body = new URLSearchParams();
        body.append('role', 'hotel');
        body.append('username', username);
        body.append('password', password);

        try {
            const response = await fetch(`${API_BASE_URL}/ar/auth/api/sessions/login/`, {
                method: 'POST',
                body,
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('user', JSON.stringify(data));
                if (rememberMe) localStorage.setItem('rememberedUser', username);
                else localStorage.removeItem('rememberedUser');
                onLoginSuccess();
            } else {
                const errorMessage =
                    data.detail || (Object.values(data).flat() as string[]).join(' ') || t('login.error');
                setError(errorMessage);
            }
        } catch {
            setError(t('login.error'));
        } finally {
            setLoading(false);
        }
    };

    const isRTL = language?.startsWith('ar');
    const formAlignmentClass = isRTL ? 'text-right' : 'text-left';
    const inputAlignmentClass = isRTL ? 'text-right' : 'text-left';
    const themeTokens = isDayMode
        ? {
            backgroundOverlay: 'bg-gradient-to-br from-[#fef0df]/96 via-[#f8dcb8]/88 to-[#f1c592]/78',
            glowGradient: 'from-[#ffe5bf] via-[#ffd094] to-[#ffb05f]',
            brandGradient: 'from-[#fff9f1] via-[#ffe2c4] to-[#f5c18a]',
            accentGradient: 'from-[#f5c46f] via-[#eba351] to-[#e4832f]',
            cardText: 'text-[#2b1c11]',
            heroPrimaryText: 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]',
            heroSecondaryText: 'text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]',
            heroListText: 'text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]',
            heroBadgeClass: 'bg-white/90 border-[#efc080]/80 text-[#ba7422]',
            toggleButtonClass: 'bg-[#fff3dc]/90 text-[#7c4b20] hover:bg-[#ffe8c3]',
            toggleIconClass: 'text-[#f0a434]',
            pillBackground: 'bg-gradient-to-r from-[#fff2d9] to-[#fedfb2] text-[#2d1f15]',
            cardBorder: 'border-[#f2d9ba]/80',
            inputBg: 'bg-white/95',
            inputText: 'text-[#2b1c11]',
            helperText: 'text-[#4a321f]',
            cardHeadingText: 'text-[#1c120c]',
            cardLabelText: 'text-[#3d2918]',
            cardLinkText: 'text-[#a25c1f]',
            inputBorder: 'border-[#f0c48c]',
            inputPlaceholder: 'placeholder:text-[#835a37]',
            iconColor: 'text-[#b47a3d]',
            checkboxAccent: 'accent-[#e79e3c]',
            errorText: 'text-[#b91c1c]',
        }
        : {
            backgroundOverlay: 'bg-gradient-to-br from-[#030e16]/95 via-[#061a27]/85 to-[#0a2432]/80',
            glowGradient: 'from-[#1e88b4] via-[#39a8cf] to-[#7fd8ff]',
            brandGradient: 'from-[#0f2c3d] via-[#163f55] to-[#0f2b3d]',
            accentGradient: 'from-[#f7c873] via-[#f3af58] to-[#ec9140]',
            cardText: 'text-white',
            heroPrimaryText: 'text-white',
            heroSecondaryText: 'text-white/80',
            heroListText: 'text-white/90',
            heroBadgeClass: 'bg-white/10 border-white/20 text-[#f7c873]',
            toggleButtonClass: 'bg-white/15 text-white hover:bg-white/25',
            toggleIconClass: 'text-white',
            pillBackground: 'bg-gradient-to-r from-[#fdf5e1] to-[#f6deb0] text-[#1a2b36]',
            cardBorder: 'border-white/10',
            inputBg: 'bg-white/10',
            inputText: 'text-white',
            helperText: 'text-white/80',
            cardHeadingText: 'text-white',
            cardLabelText: 'text-white/80',
            cardLinkText: 'text-white/80',
            inputBorder: 'border-white/20',
            inputPlaceholder: 'placeholder:text-white/60',
            iconColor: 'text-white/70',
            checkboxAccent: 'accent-[#f9c46a]',
            errorText: 'text-[#ffb4a6]',
        };
    const {
        backgroundOverlay,
        glowGradient,
        brandGradient,
        accentGradient,
        cardText,
        heroPrimaryText,
        heroSecondaryText,
        heroListText,
        heroBadgeClass,
        toggleButtonClass,
        toggleIconClass,
        pillBackground,
        cardBorder,
        inputBg,
        inputText,
        helperText,
        cardHeadingText,
        cardLabelText,
        cardLinkText,
        inputBorder,
        inputPlaceholder,
        iconColor,
        checkboxAccent,
        errorText,
    } = themeTokens;

    const heroContent = isRTL
        ? {
            eyebrow: 'منصة نزلكم',
            title: 'منصة نزلكم مهيأة لإدارة الفنادق الراقية',
            lead:
                'تابع الحجوزات والمدفوعات، وتجارب الضيوف لحظة بلحظة عبر لوحة تحكم واحدة تنبض بروح الضيافة العربية.',
            bullets: [
                'إطلالة فورية على نسب الإشغال والإيرادات اليومية',
                'تنبيهات ذكية لأي طلبات أو تعليقات من الضيوف',
                'أتمتة للتقارير التشغيلية ومتابعة سلسة لفرق العمل',
            ],
        }
        : {
            eyebrow: 'Luxury hospitality OS',
            title: 'Nozulkum keeps premium hotels in total control',
            lead:
                'Follow bookings, payments, and guest experiences in real time from a single Arabic-first control hub.',
            bullets: [
                'Live visibility into occupancy and revenue performance',
                'Smart nudges whenever guests share requests or feedback',
                'Automated ops reports so every team member stays in sync',
            ],
        };

    const toggleLabel = isDayMode
        ? (language === 'ar' ? 'ليلي' : 'Night')
        : (language === 'ar' ? 'نهاري' : 'Day');

    return (
        <div className="relative min-h-screen flex flex-col items-center px-4 py-10 font-sans overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${welcomeBg})` }}
            />
            <div className={`absolute inset-0 ${backgroundOverlay}`} />

            <button
                type="button"
                onClick={toggleThemeMode}
                className={`fixed top-6 right-6 z-20 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-black/30 backdrop-blur transition ${toggleButtonClass}`}
                aria-label={isDayMode ? 'Switch to night mode' : 'Switch to day mode'}
            >
                <span className={`text-lg ${toggleIconClass}`}>{isDayMode ? '🌙' : '☀️'}</span>
                {toggleLabel}
            </button>

            <div className="relative z-10 flex-1 w-full flex items-center justify-center">
                <div className="relative w-full max-w-6xl">
                    <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-2">
                        {/* Hero copy */}
                        <section
                            className={`order-2 lg:order-1 flex flex-col gap-6 ${heroPrimaryText} ${isRTL ? 'text-right items-end' : 'text-left items-start'
                                }`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            <div className="w-full">
                                <span
                                    className={`px-4 py-1 text-[11px] tracking-[0.35em] uppercase rounded-full shadow-lg shadow-black/10 inline-flex ${pillBackground} ${isRTL ? 'ml-auto justify-end text-right' : 'mr-auto justify-start text-left'
                                        }`}
                                >
                                    {heroContent.eyebrow}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h1 className={`text-3xl sm:text-4xl font-semibold leading-snug ${heroPrimaryText}`}>
                                    {heroContent.title}
                                </h1>
                                <p className={`text-base sm:text-lg leading-relaxed ${heroSecondaryText}`}>
                                    {heroContent.lead}
                                </p>
                            </div>

                            {/* ✅ RTL/LTR مزايا مُحاذاة نهائية: رقم ثابت + نص */}
                            {isRTL ? (
                                <ul dir="rtl" className="space-y-3 text-right w-full" role="list">
                                    {heroContent.bullets.map((bullet, index) => (
                                        <li key={index} role="listitem" className="flex items-start gap-3">
                                            <span
                                                aria-hidden="true"
                                                className={`h-8 w-8 flex items-center justify-center rounded-full border text-sm shrink-0 [font-variant-numeric:tabular-nums] leading-none mt-0.5 select-none ${heroBadgeClass}`}
                                            >
                                                {(index + 1).toLocaleString('ar-SA')}
                                            </span>
                                            <p className={`text-sm sm:text-base leading-relaxed break-words flex-1 text-right ${heroListText}`}>
                                                {bullet}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul dir="ltr" className="space-y-3 text-left w-full" role="list">
                                    {heroContent.bullets.map((bullet, index) => (
                                        <li key={index} role="listitem" className="flex items-start gap-3">
                                            <span
                                                aria-hidden="true"
                                                className={`h-8 w-8 flex items-center justify-center rounded-full border text-sm shrink-0 [font-variant-numeric:tabular-nums] leading-none mt-0.5 select-none ${heroBadgeClass}`}
                                            >
                                                {index + 1}
                                            </span>
                                            <p className={`text-sm sm:text-base leading-relaxed break-words flex-1 text-left ${heroListText}`}>
                                                {bullet}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Card / form */}
                        <div className="order-1 lg:order-2 relative w-full max-w-lg sm:max-w-md lg:max-w-full lg:justify-self-end">
                            <div className={`absolute inset-0 -z-10 blur-3xl opacity-80 bg-gradient-to-r ${glowGradient}`} />
                            <div
                                className={`relative w-full bg-gradient-to-br ${brandGradient} ${cardText} rounded-[30px] shadow-[0_30px_70px_rgba(3,18,28,0.85)] border ${cardBorder} backdrop-blur-[28px] p-7 sm:p-9 transition-all duration-300`}
                            >
                                <div className="absolute inset-x-12 -top-4 h-1 rounded-full bg-gradient-to-r from-white/20 via-white/60 to-white/20 opacity-70" />
                                <div className="flex flex-col items-center text-center gap-3 mb-6">
                                    <span className={`px-4 py-1 text-[11px] tracking-[0.4em] uppercase rounded-full shadow-lg shadow-black/10 ${pillBackground}`}>
                                        {isRTL ? 'سعداء بعودتك' : 'Welcome Back'}
                                    </span>
                                    <Logo className="w-28 h-auto drop-shadow-lg" variant="light" />
                                </div>

                                <div className={`${formAlignmentClass} mb-6 text-center`}>
                                    <h2 className={`text-2xl font-semibold mb-1 ${cardHeadingText}`}>{t('login.title')}</h2>
                                    <p className={`${helperText} text-sm leading-relaxed`}>{t('login.subtitle')}</p>
                                </div>

                                <form noValidate onSubmit={handleSubmit} className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="username"
                                            className={`block text-sm font-medium ${cardLabelText} ${formAlignmentClass} mb-1`}
                                        >
                                            {t('login.usernameLabel')}
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            placeholder={t('login.usernamePlaceholder')}
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={`w-full px-4 py-3 ${inputBg} ${inputBorder} rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#f7c873]/40 ${inputText} ${inputPlaceholder} ${inputAlignmentClass} transition-colors`}
                                            required
                                            aria-required="true"
                                            aria-invalid={!!error}
                                            aria-describedby={error ? 'error-message' : undefined}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <div
                                            className={`flex justify-between items-center mb-1 ${isRTL ? 'flex-row' : 'flex-row-reverse'
                                                }`}
                                        >
                                            <label htmlFor="password" className={`text-sm font-medium ${cardLabelText}`}>
                                                {t('login.passwordLabel')}
                                            </label>
                                            <a href="#" className={`text-xs ${cardLinkText} hover:text-white transition-colors`}>
                                                {t('login.forgotPassword')}
                                            </a>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type={isPasswordVisible ? 'text' : 'password'}
                                                id="password"
                                                placeholder={t('login.passwordPlaceholder')}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={`w-full px-4 py-3 ${inputBg} ${inputBorder} rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#f7c873]/40 ${inputText} ${inputPlaceholder} ${inputAlignmentClass} ${isRTL ? 'pl-10' : 'pr-10'
                                                    } transition-colors`}
                                                required
                                                aria-required="true"
                                                aria-invalid={!!error}
                                                aria-describedby={error ? 'error-message' : undefined}
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className={`absolute inset-y-0 flex items-center ${iconColor} hover:text-white transition-colors ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'
                                                    }`}
                                                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                                                aria-controls="password"
                                            >
                                                {isPasswordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <p
                                            id="error-message"
                                            className={`${errorText} text-sm text-center mb-4 font-semibold`}
                                            role="alert"
                                            aria-live="assertive"
                                        >
                                            {error}
                                        </p>
                                    )}

                                    <div className={`flex items-center mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                                        <input
                                            id="remember-me"
                                            type="checkbox"
                                            className={`h-4 w-4 ${checkboxAccent} bg-white/20 border-white/40 rounded focus:ring-[#f7c873]`}
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label htmlFor="remember-me" className={`text-sm ${helperText} ${isRTL ? 'mr-2' : 'ml-2'}`}>
                                            {t('login.rememberMe')}
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full bg-gradient-to-r ${accentGradient} text-[#3c1c05] font-semibold py-3 rounded-2xl hover:brightness-110 transition duration-200 disabled:from-[#f7c873]/40 disabled:to-[#ec9140]/40 disabled:text-white/70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-black/30`}
                                    >
                                        {loading && (
                                            <svg
                                                className={`animate-spin h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                        )}
                                        {loading ? t('login.loggingIn') : t('login.loginButton')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p className="relative z-10 w-full text-center text-white/80 text-xs pb-4">
                {t('login.footerText')}
            </p>
        </div>
    );
};

export default LoginPage;
