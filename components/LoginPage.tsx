import React, { useState, useEffect } from 'react';
import Logo from './icons/Logo';
import EyeIcon from './icons/EyeIcon';
import EyeOffIcon from './icons/EyeOffIcon';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username === 'admin' && password === 'password') {
        setError('');
        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }
        onLoginSuccess();
    } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Login Form Section */}
      <div className="w-full lg:w-2/5 xl:w-1/3 bg-white flex flex-col p-8 lg:p-12">
        <div className="flex flex-col items-end">
            <Logo className="w-20 h-auto"/>
            <p className="text-xs text-gray-500 mt-1">سراكم لإدارة الأملاك</p>
        </div>

        <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-sm">
                <div className="text-right mb-8">
                    <h1 className="text-3xl font-bold text-slate-700 mb-2">تسجيل الدخول</h1>
                    <p className="text-gray-500">أدخل اسم المستخدم وكلمة المرور للوصول إلى لوحة التحكم.</p>
                </div>

                <form noValidate onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 text-right mb-1">اسم المستخدم</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="أدخل اسم المستخدم"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-900"
                            required
                            aria-required="true"
                            aria-invalid={!!error}
                            aria-describedby={error ? "error-message" : undefined}
                        />
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">كلمة المرور</label>
                            <a href="#" className="text-xs text-blue-500 hover:underline">نسيت كلمة المرور؟</a>
                        </div>
                        <div className="relative">
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                id="password"
                                placeholder="أدخل كلمة المرور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-900"
                                required
                                aria-required="true"
                                aria-invalid={!!error}
                                aria-describedby={error ? "error-message" : undefined}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
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
                            className="text-red-500 text-sm text-right mb-4"
                            role="alert"
                            aria-live="assertive"
                        >
                          {error}
                        </p>
                    )}

                    <div className="flex justify-end items-center mb-6">
                        <label htmlFor="remember-me" className="text-sm text-gray-700 mr-2">تذكرني</label>
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
                        className="w-full bg-blue-500 text-white py-2.5 rounded-md font-bold hover:bg-blue-600 transition-colors duration-200"
                    >
                        تسجيل الدخول
                    </button>
                </form>
            </div>
        </div>

        <p className="text-center text-xs text-gray-400">
            جميع الحقوق محفوظة نزلك
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