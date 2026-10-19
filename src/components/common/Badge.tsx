import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'outline' | 'navy' | 'ice' | 'accent';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral',
  size = 'md' 
}) => {
  const variantStyles = {
    success: 'bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/30 font-semibold',
    warning: 'bg-[#FF6B4A]/10 text-[#FF6B4A] border-[#FF6B4A]/30 font-semibold',
    danger: 'bg-rose-50 text-rose-600 border-rose-200 font-semibold',
    info: 'bg-[#E8F0FE] text-[#4D8DFF] border-[#4D8DFF]/30 font-semibold',
    accent: 'bg-[#4D8DFF] text-white border-transparent font-bold',
    navy: 'bg-[#2C3E50]/10 text-[#2C3E50] border-[#2C3E50]/20 font-semibold',
    ice: 'bg-[#E8F0FE] text-[#4D8DFF] border-[#4D8DFF]/25 font-semibold',
    neutral: 'bg-slate-100 text-[#718096] border-slate-200',
    outline: 'bg-transparent text-[#718096] border-slate-300'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-xs px-3 py-1 rounded-full font-medium'
  };

  return (
    <span className={`inline-flex items-center gap-1 border ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
};
