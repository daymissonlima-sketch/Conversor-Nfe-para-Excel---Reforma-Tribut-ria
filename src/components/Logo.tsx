import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
}

export function Logo({ className = '', size = 'md', withText = false }: LogoProps) {
  const sizeMap = {
    sm: { icon: 'h-6 w-8', text: 'text-sm' },
    md: { icon: 'h-10 w-12', text: 'text-lg' },
    lg: { icon: 'h-14 w-18', text: 'text-2xl' },
    xl: { icon: 'h-24 w-32', text: 'text-4xl' },
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* SVG rendering the exact logo from the attachment */}
      <svg
        className={selectedSize.icon}
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Column (Short) */}
        <rect x="25" y="45" width="12" height="40" rx="1.5" fill="#e4b35e" />
        
        {/* Middle Column (Medium) */}
        <rect x="45" y="32" width="12" height="53" rx="1.5" fill="#e4b35e" />
        
        {/* Right Column (Tall) */}
        <rect x="65" y="18" width="12" height="67" rx="1.5" fill="#e4b35e" />
        
        {/* Elegant Sweeping Arch/Curve cutting through and highlighting the bottom financial growth */}
        <path
          d="M 20,65 C 20,65 50,45 82,56 C 82,56 40,55 24,90 C 20,85 20,65 20,65 Z"
          fill="#e4b35e"
          opacity="0.9"
        />
        
        <path
          d="M 25,60 Q 48,50 77,56 C 77,56 45,52 25,83"
          stroke="#04243b"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {withText && (
        <div className="flex flex-col">
          <span className={`font-extrabold tracking-tight text-[#e4b35e] ${selectedSize.text}`}>
            Moreira & Lima
          </span>
          <span className="text-[10px] font-medium tracking-widest text-slate-300 uppercase -mt-1">
            Contadores Associados
          </span>
        </div>
      )}
    </div>
  );
}
