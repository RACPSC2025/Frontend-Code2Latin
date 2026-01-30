import React from 'react';
import { MdOutlineArrowBack, MdOutlinePerson, MdOutlineShield, MdOutlineChevronRight, MdOutlineLock } from 'react-icons/md';
import { Input } from '../shared/Input';

export const PasswordStep = ({ email, password, onChange, error, onBack, onSubmit, isLoading, onForgotPassword }) => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="mb-6 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-sm font-medium border-none bg-transparent cursor-pointer"
        >
          <MdOutlineArrowBack size={16} /> Volver
        </button>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido de nuevo</h2>
        <p className="text-slate-500">
          Ingrese su contraseña para verificar su identidad.
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
        <button 
          onClick={onBack}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline flex-shrink-0 ml-2 border-none bg-transparent cursor-pointer"
        >
          Cambiar
        </button>
      </div>

      {/* Verified Badge */}
      <div className="bg-green-50 border border-green-100 border-solid rounded-lg p-3 mb-6 flex items-center gap-2">
        <MdOutlineShield size={16} className="text-green-600" />
        <span className="text-xs text-green-700 font-medium">Identidad verificada con reCAPTCHA</span>
      </div>

      <form onSubmit={onSubmit}>
        <Input 
          id="password"
          type="password"
          label="Contraseña"
          value={password}
          onChange={onChange}
          error={error}
          icon={<MdOutlineLock size={20} />}
          autoFocus
        />

        <div className="flex justify-end mb-6">
           <button 
            type="button" 
            onClick={onForgotPassword}
            className="text-sm text-teal-600 font-semibold hover:text-teal-700 border-none bg-transparent cursor-pointer"
          >
             ¿Olvidó su contraseña?
           </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full py-4 rounded-lg font-bold text-white shadow-lg shadow-teal-500/30
            flex items-center justify-center gap-2 transition-all duration-300 border-none cursor-pointer
            ${isLoading 
              ? 'bg-slate-400 cursor-not-allowed transform-none shadow-none' 
              : 'bg-gradient-to-r from-teal-600 to-teal-500 hover:to-teal-400 hover:shadow-teal-500/40 hover:-translate-y-0.5'
            }
          `}
        >
          {isLoading ? (
            <span className="w-6 h-6 border-2 border-solid border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              CONTINUAR <MdOutlineChevronRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
