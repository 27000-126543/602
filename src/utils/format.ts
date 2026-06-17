export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
};

export const formatMoney = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return '¥' + num.toLocaleString();
};

export const formatPercent = (num: number, decimals: number = 1): string => {
  return num.toFixed(decimals) + '%';
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (dateTimeStr: string): string => {
  if (!dateTimeStr) return '-';
  const date = new Date(dateTimeStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getChangeColor = (change: number): string => {
  if (change > 0) return 'text-success-600';
  if (change < 0) return 'text-danger-500';
  return 'text-slate-500';
};

export const getChangeIcon = (change: number): 'up' | 'down' | 'equal' => {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'equal';
};

const roleNameMap: Record<string, string> = {
  headquarters: '集团总部',
  region: '区域运营',
  venue: '会展中心',
};

export const formatRoleName = (role: string): string => {
  return roleNameMap[role] || role;
};
