import React from 'react';
import { Logo } from './Logo';
import loginImage from '../../../assets/images/login-image.jpg';

export const DesktopSidebar = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-slate-800 relative flex-col justify-between p-12 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-overlay" 
        style={{
          backgroundImage: `url(${loginImage})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900/90 via-slate-800/40 to-transparent" />

      {/* Content Top */}
      <div className="relative z-10">
        <Logo variant="light" size="lg" withAppSuffix={false} />
      </div>

      {/* Content Middle */}
      <div className="relative z-10 max-w-lg">
        <h1 className="text-5xl font-light mb-6 leading-tight drop-shadow-lg">
          Bienvenido a tu <br />
          <span className="font-bold text-teal-300">Ecosistema Digital</span>
        </h1>
        <p className="text-lg text-slate-100 mb-8 leading-relaxed font-light drop-shadow-md">
          Gestione sus accesos y recursos empresariales de forma segura, eficiente y conectada.
        </p>
      </div>

      {/* Content Bottom - Copyright */}
      <div className="relative z-10 w-full mt-auto">
        <div className="pt-6 border-t border-slate-600/30 flex justify-between items-center text-xs text-slate-400">
          <span>© {new Date().getFullYear()} Amatia. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors text-slate-400 no-underline">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors text-slate-400 no-underline">Términos</a>
          </div>
        </div>
      </div>
    </div>
  );
};
