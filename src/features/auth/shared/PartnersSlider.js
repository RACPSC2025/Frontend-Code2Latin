import React from 'react';

const PARTNERS = [
  { name: 'HEXAGON', icon: <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z" fill="currentColor" /> },
  { name: 'VORTEX', icon: <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" fill="currentColor" /> },
  { name: 'NEXUS', icon: <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" /> },
  { name: 'OPTIC', icon: <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="4" fill="none" /> },
  { name: 'ZENITH', icon: <path d="M4 12L20 12M12 4L12 20" stroke="currentColor" strokeWidth="4" /> },
  { name: 'PULSE', icon: <path d="M3 12H6L9 3L15 21L18 12H21" stroke="currentColor" strokeWidth="2" fill="none" /> },
];

export const PartnersSlider = () => {
  return (
    <div className="hidden lg:block absolute bottom-0 left-0 w-full p-6 pb-8 z-10">
      <p className="text-xs font-bold text-slate-300 mb-6 uppercase tracking-[0.2em] text-center">
        Empresas Conectadas
      </p>
      
      <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {/* Tripled array for smoother infinite loop */}
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-400 hover:text-teal-600 transition-colors mx-12 cursor-pointer group select-none">
                  <svg width="28" height="28" viewBox="0 0 24 24" className="w-7 h-7 fill-current group-hover:scale-110 transition-transform duration-300">
                    {partner.icon}
                  </svg>
                  <span className="text-sm font-bold font-sans tracking-wide">{partner.name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
