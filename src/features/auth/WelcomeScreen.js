import React, { useEffect, useState } from 'react';
import { MdCheck, MdOutlineShield } from 'react-icons/md';
import { Logo } from './shared/Logo';

export const WelcomeScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Small delay after 100% before switch
          return 100;
        }
        return prev + 2; // Speed of loader
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
         <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-teal-500 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
         <div className="absolute left-0 bottom-0 h-[500px] w-[500px] bg-blue-500 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center animate-fadeInUp">
        
        <div className="mb-8 flex justify-center">
            <Logo size="md" />
        </div>

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MdCheck className="text-green-600 w-10 h-10 animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          ¡Acceso Correcto!
        </h2>
        
        <p className="text-slate-500 mb-8">
          Bienvenido de nuevo. Estamos preparando su plataforma, será redirigido en unos segundos.
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
           <MdOutlineShield size={16} />
           <span>Acceso seguro SSL verificado</span>
        </div>
      </div>

      <div className="absolute bottom-8 text-sm text-slate-400">
         ¿No fue redirigido automáticamente? <button className="text-teal-600 font-semibold hover:underline border-none bg-transparent cursor-pointer">Haga clic aquí</button>
      </div>
    </div>
  );
};
