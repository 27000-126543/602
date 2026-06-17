import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  color: 'primary' | 'success' | 'accent' | 'danger';
  suffix?: string;
}

const colorStyles = {
  primary: {
    bg: 'from-primary-500 to-primary-600',
    iconBg: 'bg-white/20',
  },
  success: {
    bg: 'from-success-500 to-success-600',
    iconBg: 'bg-white/20',
  },
  accent: {
    bg: 'from-accent-500 to-accent-600',
    iconBg: 'bg-white/20',
  },
  danger: {
    bg: 'from-danger-500 to-danger-600',
    iconBg: 'bg-white/20',
  },
};

const StatCard = ({ title, value, change, changeLabel, icon, color, suffix }: StatCardProps) => {
  const styles = colorStyles[color];
  
  const getChangeIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getChangeColor = () => {
    if (change === undefined) return 'text-white/70';
    if (change > 0) return 'text-white';
    if (change < 0) return 'text-white';
    return 'text-white/70';
  };

  return (
    <div className={`stat-card bg-gradient-to-br ${styles.bg} text-white overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/80 text-sm font-medium">{title}</span>
          <div className={`w-12 h-12 ${styles.iconBg} rounded-xl flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        
        <div className="mb-3">
          <span className="text-3xl font-bold font-mono">{value}</span>
          {suffix && <span className="text-white/70 ml-1 text-lg">{suffix}</span>}
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center gap-1.5 text-sm ${getChangeColor()}`}>
            {getChangeIcon()}
            <span>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
            {changeLabel && <span className="text-white/60">{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
