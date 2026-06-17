import { Alert, ApprovalRecord } from '@/types';

export const alerts: Alert[] = [
  {
    id: 'a001',
    type: 'visitor_low',
    title: '观众人流量连续3天低于预期',
    description: '成都世纪城新国际会展中心近3天观众人流量连续低于预期30%以上，需关注是否需要调整展位定价或启动临时活动。',
    venueId: 'v005',
    venueName: '成都世纪城新国际会展中心',
    level: 'danger',
    status: 'processing',
    currentApprovalLevel: 2,
    createdAt: '2026-06-15 09:30:00',
    data: {
      visitorDropRate: 35.2,
    },
  },
  {
    id: 'a002',
    type: 'satisfaction_drop',
    title: '参展商满意度连续下滑',
    description: '西安国际会展中心参展商满意度连续两周下滑，从85分降至72分，需调查原因并制定改进方案。',
    venueId: 'v009',
    venueName: '西安国际会展中心',
    level: 'warning',
    status: 'processing',
    currentApprovalLevel: 1,
    createdAt: '2026-06-16 14:20:00',
    data: {
      satisfactionDrop: 13,
    },
  },
  {
    id: 'a003',
    type: 'booth_vacancy',
    title: '展位空置率偏高',
    description: '武汉国际博览中心本次展会展位空置率达到28%，建议启动招展优惠政策。',
    venueId: 'v007',
    venueName: '武汉国际博览中心',
    level: 'warning',
    status: 'pending',
    currentApprovalLevel: 1,
    createdAt: '2026-06-17 08:45:00',
    data: {
      boothVacancyRate: 28,
    },
  },
  {
    id: 'a004',
    type: 'contract_deviation',
    title: '合同费用偏差超标',
    description: '青岛国际会展中心近期3份合同费用偏差超过15%，需复核合同条款与展位定价。',
    venueId: 'v012',
    venueName: '青岛国际会展中心',
    level: 'warning',
    status: 'resolved',
    currentApprovalLevel: 3,
    createdAt: '2026-06-14 16:00:00',
    data: {
      contractDeviation: 18.5,
    },
  },
  {
    id: 'a005',
    type: 'visitor_low',
    title: '周末人流量不及预期',
    description: '天津梅江会展中心上周六日观众人流量比预期低22%，建议加强周末营销推广。',
    venueId: 'v010',
    venueName: '天津梅江会展中心',
    level: 'info',
    status: 'resolved',
    currentApprovalLevel: 3,
    createdAt: '2026-06-13 10:15:00',
    data: {
      visitorDropRate: 22,
    },
  },
  {
    id: 'a006',
    type: 'satisfaction_drop',
    title: '物流服务满意度下降',
    description: '重庆国际博览中心参展商对物流货运服务满意度下降明显，需协调物流服务商整改。',
    venueId: 'v011',
    venueName: '重庆国际博览中心',
    level: 'warning',
    status: 'pending',
    currentApprovalLevel: 1,
    createdAt: '2026-06-17 11:30:00',
    data: {
      satisfactionDrop: 8,
    },
  },
];

export const approvalRecords: Record<string, ApprovalRecord[]> = {
  a001: [
    {
      id: 'ap001-1',
      alertId: 'a001',
      level: 1,
      levelName: '展会项目经理确认',
      approver: '赵经理',
      approverRole: '会展中心',
      status: 'approved',
      comment: '情况属实，已核实近3天门禁数据，人流量确实大幅低于预期。建议启动临时活动方案。',
      createdAt: '2026-06-15 10:30:00',
    },
    {
      id: 'ap001-2',
      alertId: 'a001',
      level: 2,
      levelName: '区域运营复核',
      approver: '钱总监',
      approverRole: '区域运营',
      status: 'approved',
      comment: '同意启动调整方案，建议同时开展线上宣传引流活动。',
      createdAt: '2026-06-16 09:15:00',
    },
    {
      id: 'ap001-3',
      alertId: 'a001',
      level: 3,
      levelName: '集团总部批准',
      approver: '',
      approverRole: '',
      status: 'pending',
      comment: '',
      createdAt: '',
    },
  ],
  a002: [
    {
      id: 'ap002-1',
      alertId: 'a002',
      level: 1,
      levelName: '展会项目经理确认',
      approver: '孙经理',
      approverRole: '会展中心',
      status: 'approved',
      comment: '正在调查满意度下滑原因，初步判断与现场服务质量下降有关。',
      createdAt: '2026-06-16 15:30:00',
    },
    {
      id: 'ap002-2',
      alertId: 'a002',
      level: 2,
      levelName: '区域运营复核',
      approver: '',
      approverRole: '',
      status: 'pending',
      comment: '',
      createdAt: '',
    },
    {
      id: 'ap002-3',
      alertId: 'a002',
      level: 3,
      levelName: '集团总部批准',
      approver: '',
      approverRole: '',
      status: 'pending',
      comment: '',
      createdAt: '',
    },
  ],
  a003: [
    {
      id: 'ap003-1',
      alertId: 'a003',
      level: 1,
      levelName: '展会项目经理确认',
      approver: '',
      approverRole: '',
      status: 'pending',
      comment: '',
      createdAt: '',
    },
    {
      id: 'ap003-2',
      alertId: 'a003',
      level: 2,
      levelName: '区域运营复核',
      approver: '',
      approverRole: '',
      status: 'pending',
      comment: '',
      createdAt: '',
    },
    {
      id: 'ap003-3',
      alertId: 'a003',
      level: 3,
      levelName: '集团总部批准',
      approver: '',
      approverRole: '',
      status: 'pending',
      comment: '',
      createdAt: '',
    },
  ],
};

export const getAlerts = (status?: string): Alert[] => {
  if (!status || status === 'all') return alerts;
  return alerts.filter(a => a.status === status);
};

export const getAlertById = (id: string): Alert | undefined => {
  return alerts.find(a => a.id === id);
};

export const getApprovalRecords = (alertId: string): ApprovalRecord[] => {
  return approvalRecords[alertId] || [];
};

export const getPendingAlertsCount = (): number => {
  return alerts.filter(a => a.status === 'pending' || a.status === 'processing').length;
};

export const alertTypeNames: Record<string, string> = {
  visitor_low: '人流量预警',
  satisfaction_drop: '满意度预警',
  booth_vacancy: '展位空置预警',
  contract_deviation: '合同偏差预警',
};

export const alertLevelNames: Record<string, string> = {
  info: '提示',
  warning: '警告',
  danger: '危险',
};

export const alertStatusNames: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已解决',
  rejected: '已驳回',
};
