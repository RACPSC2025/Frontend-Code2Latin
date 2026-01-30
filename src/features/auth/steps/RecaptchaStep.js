import React from 'react';
import { MdOutlineArrowBack, MdOutlinePerson, MdOutlineShield } from 'react-icons/md';
import { useRecaptcha } from '../../../hooks/useRecaptcha';

export const RecaptchaStep = ({ email, onBack, onVerify, onExpire, step }) => {
  const { containerRef } = useRecaptcha(step, onVerify, onExpire);

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="mb-6 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-sm font-medium border-none bg-transparent cursor-pointer"
        >
          <MdOutlineArrowBack size={16} /> Volver
        </button>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Verificación de Seguridad</h2>
        <p className="text-slate-500">
          Complete el reCAPTCHA para continuar al paso siguiente.
        </p>
      </div>

      {/* Email Chip */}
      <div className="bg-teal-50 border border-teal-100 border-solid rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 flex-shrink-0">
            <MdOutlinePerson size={16} />
          </div>
          <span className="text-sm font-medium text-slate-700 truncate">{email}</span>
        </div>
      </div>

      {/* reCAPTCHA Container */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="flex items-center gap-2 mb-6 text-slate-600">
          <MdOutlineShield size={20} className="text-teal-600" />
          <span className="text-sm font-medium">Verificación requerida</span>
        </div>
        
        {/* reCAPTCHA Widget */}
        <div 
          ref={containerRef}
          className="flex justify-center"
        ></div>
      </div>

      <div className="text-center text-xs text-slate-400 mt-4">
        Este sitio está protegido por reCAPTCHA y aplican la{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline no-underline">
          Política de Privacidad
        </a>{' '}
        y los{' '}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline no-underline">
          Términos de Servicio
        </a>{' '}
        de Google.
      </div>
    </div>
  );
};
