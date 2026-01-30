import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

export const Input = ({ 
  label, 
  id, 
  type = 'text', 
  error, 
  icon,
  value,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const hasValue = value && String(value).length > 0;
  
  // Logic to determine if label should float
  const shouldFloat = isFocused || hasValue;

  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            peer w-full rounded-lg border-2 bg-white px-4 pt-6 pb-2 text-slate-800 outline-none transition-all duration-200
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' 
              : 'border-slate-200 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(13,148,136,0.1)]'
            }
            placeholder-transparent
          `}
          placeholder={label}
          {...props}
        />
        <label
          htmlFor={id}
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none select-none
            ${shouldFloat 
              ? 'top-1.5 text-xs font-medium text-teal-600' 
              : 'top-4 text-base text-slate-400'
            }
          `}
        >
          {label}
        </label>

        {/* Icons container */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-slate-600 focus:outline-none transition-colors p-0 border-none bg-transparent cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          )}
          {!isPassword && icon}
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-xs font-medium text-red-500 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};
