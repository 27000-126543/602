import { AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { Alert } from '@/types';
import { alertTypeNames, alertLevelNames, alertStatusNames } from '@/data/mock/alerts';
import { formatDateTime } from '@/utils/format';
import { useNavigate } from 'react-router-dom';

interface AlertCardProps {
  alert: Alert;
  compact?: boolean;
}

const levelColors = {
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  danger: {
    bg: 'bg-danger-50',
    text: 'text-danger-600',
    border: 'border-danger-200',
    dot: 'bg-danger-500',
  },
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  resolved: 'bg-success-100 text-success-700',
  rejected: 'bg-slate-100 text-slate-600',
};

const AlertCard = ({ alert, compact = false }: AlertCardProps) => {
  const navigate = useNavigate();
  const level = levelColors[alert.level];
  const status = statusColors[alert.status];

  const handleClick = () => {
    navigate(`/alerts?id=${alert.id}`);
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={`p-3 rounded-lg border ${level.border} ${level.bg} cursor-pointer hover:shadow-md transition-all`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <AlertTriangle className={`w-4 h-4 ${level.text} mt-0.5 flex-shrink-0`} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{alert.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{alert.venueName}</p>
            </div>
          </div>
          <span className={`badge ${status} flex-shrink-0`}>
            {alertStatusNames[alert.status]}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`p-5 rounded-xl border ${level.border} ${level.bg} cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${level.dot} pulse-dot ${level.text}`}></div>
          <span className={`text-sm font-medium ${level.text}`}>
            {alertLevelNames[alert.level]}·{alertTypeNames[alert.type]}
          </span>
        </div>
        <span className={`badge ${status}`}>
          {alertStatusNames[alert.status]}
        </span>
      </div>

      <h4 className="text-base font-semibold text-slate-800 mb-2">{alert.title}</h4>
      <p className="text-sm text-slate-600 line-clamp-2 mb-4">{alert.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDateTime(alert.createdAt)}
          </span>
          <span>当前审批：第{alert.currentApprovalLevel}级</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};

export default AlertCard;
