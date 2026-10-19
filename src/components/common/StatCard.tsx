import React from 'react';
import * as LucideIcons from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral' | 'warning' | 'alert';
  iconName: keyof typeof LucideIcons;
  color?: string;
  badge?: React.ReactNode;
  subtitle?: string;
  isDemo?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  iconName,
  badge,
  subtitle,
  isDemo
}) => {
  const IconComponent = (LucideIcons[iconName] as React.ComponentType<{ className?: string }>) || LucideIcons.Activity;

  return (
    <div className="erp-card p-5 relative overflow-hidden group border border-white/80 bg-white shadow-bento hover:shadow-bento-hover transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#718096] truncate">
              {title}
            </p>
            {isDemo && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                Demo
              </span>
            )}
          </div>
          <h3 className="text-2xl font-extrabold text-[#2C3E50] tracking-tight truncate font-sans">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#718096] mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="w-11 h-11 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#4D8DFF] transition-transform duration-300 group-hover:scale-110 shadow-sm flex-shrink-0">
          <IconComponent className="w-5 h-5 text-[#4D8DFF]" />
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-2 text-xs pt-1 border-t border-slate-100/80">
        {change && (
          <div className="flex items-center gap-1.5 truncate">
            {trend === 'up' && (
              <span className="w-2 h-2 rounded-full bg-[#2ECC71] inline-block flex-shrink-0" />
            )}
            {trend === 'warning' && (
              <span className="w-2 h-2 rounded-full bg-[#FF6B4A] inline-block flex-shrink-0" />
            )}
            {trend === 'down' && (
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block flex-shrink-0" />
            )}
            {trend === 'neutral' && (
              <span className="w-2 h-2 rounded-full bg-[#718096] inline-block flex-shrink-0" />
            )}
            <span className={`text-[11px] font-medium truncate ${
              trend === 'up' ? 'text-[#2ECC71] font-semibold' :
              trend === 'warning' ? 'text-[#FF6B4A] font-semibold' :
              trend === 'down' ? 'text-rose-600' :
              'text-[#718096]'
            }`}>
              {change}
            </span>
          </div>
        )}
        {badge && (
          <div className="flex-shrink-0">
            {badge}
          </div>
        )}
      </div>

      {/* Soft periwinkle ambient glow on hover */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#E8F0FE] rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
