import React from 'react';
import { MdOutlineChevronRight, MdOutlinePerson } from 'react-icons/md';
import { Input } from '../shared/Input';

export const EmailStep = ({ email, onChange, error, onContinue }) => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Iniciar Sesión</h2>
        <p className="text-slate-500">
          Ingrese su usuario corporativo para continuar.
        </p>
      </div>

      <form onSubmit={onContinue}>
        <Input 
          id="email"
          label="Usuario / Correo"
          value={email}
          onChange={onChange}
          error={error}
          icon={<MdOutlinePerson size={20} />}
          autoComplete="username"
          autoFocus
        />

        <button
          type="submit"
          className="w-full py-3.5 rounded-lg font-bold text-white shadow-lg shadow-teal-500/30 bg-gradient-to-r from-teal-600 to-teal-500 hover:to-teal-400 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mb-8 border-none cursor-pointer"
        >
          CONTINUAR <MdOutlineChevronRight size={20} />
        </button>
      </form>
    </div>
  );
};
