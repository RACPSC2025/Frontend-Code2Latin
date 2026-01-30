import React from 'react';
import amatiaLogo from '../../../assets/images/amatia_logo.png';

export const Logo = ({ variant = 'dark', size = 'md', withAppSuffix = true }) => {
  // Sizing mappings (updated for image)
  const sizePx = {
    sm: 32,
    md: 48,
    lg: 80
  };

  const fontSize = {
    sm: 'text-lg',
    md: 'text-4xl',
    lg: 'text-6xl'
  };

  const dividerStyle = {
    sm: { width: '1.5px', height: '16px' },
    md: { width: '2.5px', height: '32px' },
    lg: { width: '4px', height: '48px' }
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-slate-600';
  const appTextColor = variant === 'light' ? 'text-slate-300' : 'text-slate-400';
  const dividerColor = variant === 'light' ? 'bg-teal-400' : 'bg-teal-500';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Icon - Image amatia_logo.png */}
      <img
        src={amatiaLogo}
        alt="Amatia Logo"
        width={sizePx[size]}
        height={sizePx[size]}
        className="object-contain"
        style={{ width: sizePx[size], height: sizePx[size] }}
      />
      
      {/* Text Group */}
      <div className={`flex items-center leading-none ${textColor} tracking-tight`}>
        <span className={`font-sans ${fontSize[size]} font-normal`}>
          amatia
        </span>
        
        {withAppSuffix && (
          <>
            {/* Vertical Divider */}
            <div className={`mx-2.5 ${dividerColor} rounded-full`} 
                 style={dividerStyle[size]} 
            />
            
            <span className={`font-sans ${fontSize[size]} font-light ${appTextColor}`}>
              app
            </span>
          </>
        )}
      </div>
    </div>
  );
};
