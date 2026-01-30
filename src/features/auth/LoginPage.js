import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Logo } from './shared/Logo';
import { DesktopSidebar } from './shared/DesktopSidebar';
import { PartnersSlider } from './shared/PartnersSlider';
import { EmailStep } from './steps/EmailStep';
import { RecaptchaStep } from './steps/RecaptchaStep';
import { PasswordStep } from './steps/PasswordStep';
import { WelcomeScreen } from './WelcomeScreen';
import { setLoginStep, setTempEmail, loginSuccess, setAuthError, clearAuthError } from '../../stores/authSlice';
import { setUserDetails } from '../../stores/globalDataSlice';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const { loginStep, tempEmail, error } = useSelector((state) => state.auth);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Practice user credentials
  const PRACTICE_USER = 'admin';
  const PRACTICE_PASS = '123456';

  const handleRecaptchaSuccess = useCallback((token) => {
    setTimeout(() => {
      dispatch(setLoginStep(2));
    }, 500);
  }, [dispatch]);

  const handleRecaptchaExpired = useCallback(() => {
    dispatch(setAuthError('La verificación ha expirado.'));
  }, [dispatch]);

  const handleContinue = (e) => {
    e.preventDefault();
    if (!tempEmail) {
      dispatch(setAuthError('El usuario o correo es requerido'));
      return;
    }
    // For practice: only let 'admin' pass, or allow any for now but user said "admin/123456"
    if (tempEmail.toLowerCase() !== PRACTICE_USER) {
      dispatch(setAuthError('Usuario no reconocido (use: admin)'));
      return;
    }
    dispatch(clearAuthError());
    dispatch(setLoginStep('recaptcha'));
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      dispatch(setAuthError('La contraseña es requerida'));
      return;
    }

    setIsLoading(true);
    // Simulate API call and check practice credentials
    setTimeout(() => {
      setIsLoading(false);
      if (password === PRACTICE_PASS) {
        const userData = { id: "1", fullname: "Administrador", email: tempEmail };
        dispatch(loginSuccess(userData));
        dispatch(setUserDetails(userData));
      } else {
        dispatch(setAuthError('Contraseña incorrecta (use: 123456)'));
      }
    }, 1500);
  };

  const handleBackToEmail = () => {
    dispatch(setLoginStep(1));
    dispatch(clearAuthError());
    setPassword('');
  };

  const handleBackFromRecaptcha = () => {
    dispatch(setLoginStep(1));
  };

  if (loginStep === 'welcome') {
    return <WelcomeScreen onComplete={() => window.location.href = '#/'} />; // This will be handled by Router
  }

  return (
    <div className="min-h-screen w-full flex overflow-hidden relative font-sans">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* MOBILE BACKGROUND */}
      <div className="absolute inset-0 z-0 lg:hidden bg-gradient-to-br from-teal-600 to-teal-500">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      </div>

      <DesktopSidebar />

      {/* RIGHT SIDE / MOBILE CARD */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-24 lg:bg-white relative z-10">
        
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl lg:shadow-none lg:bg-transparent lg:rounded-none p-8 lg:p-0 transition-all duration-500 ease-in-out relative z-20">
          
          <div className="mb-6 lg:hidden">
              <Logo variant="dark" size="sm" />
          </div>

          {loginStep === 1 ? (
            <EmailStep 
              email={tempEmail}
              onChange={(e) => dispatch(setTempEmail(e.target.value))}
              error={error}
              onContinue={handleContinue}
            />
          ) : loginStep === 'recaptcha' ? (
            <RecaptchaStep 
              email={tempEmail}
              onBack={handleBackFromRecaptcha}
              onVerify={handleRecaptchaSuccess}
              onExpire={handleRecaptchaExpired}
              step={loginStep}
            />
          ) : (
            <PasswordStep 
              email={tempEmail}
              password={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              onBack={handleBackToEmail}
              onSubmit={handleFinalSubmit}
              isLoading={isLoading}
              onForgotPassword={() => console.log("Forgot password clicked")}
            />
          )}

          <div className="mt-12 pt-6 border-t border-slate-100 border-solid flex items-center justify-center gap-2 text-xs text-slate-400 lg:hidden">
             <div className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-slate-400" stroke="currentColor" strokeWidth="2">
                   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Acceso Seguro SSL</span>
             </div>
          </div>
        </div>

        <PartnersSlider />
        
      </div>
    </div>
  );
};

export default LoginPage;
