import { WeeklyReport } from '@/types';

export const weeklyReport: WeeklyReport = {
  weekStart: '2026-06-09',
  weekEnd: '2026-06-15',
  totalVisitors: 125680,
  visitorYoY: 8.5,
  visitorWoW: -3.2,
  totalExhibitions: 28,
  avgSatisfaction: 82.5,
  satisfactionYoY: 2.1,
  boothOccupancyRate: 78.6,
  vacancyRate: 21.4,
  complaintCount: 36,
  complaints: [
    { type: '物流服务', count: 12, percentage: 33.3 },
    { type: '展位搭建', count: 8, percentage: 22.2 },
    { type: '餐饮配套', count: 7, percentage: 19.4 },
    { type: '现场服务', count: 5, percentage: 13.9 },
    { type: '停车交通', count: 4, percentage: 11.1 },
  ],
  suggestions: [
    '建议增加华南区域展会推广力度，该区域观众流量同比下降明显',
    '物流服务投诉占比最高，建议对合作物流公司进行季度考核',
    '展位空置率较上周上升，建议研究灵活定价策略吸引中小参展商',
    '周末人流量普遍低于工作日，建议增加周末主题活动吸引观众',
    '建议优化参展商报到流程，减少排队等待时间',
    '可考虑增加线上展厅功能，扩大展会影响力和覆盖面',
  ],
};

export const getWeeklyReport = (): WeeklyReport => weeklyReport;

export const getTrafficComparison = () => {
  const weeks = ['第23周', '第24周', '第25周', '第26周', '第27周', '第28周'];
  const actualVisitors = [115000, 128000, 132000, 118000, 129500, 125680];
  const expectedVisitors = [120000, 125000, 130000, 125000, 130000, 130000];
  
  return { weeks, actualVisitors, expectedVisitors };
};

export const getIndustryDistribution = () => {
  return [
    { name: '电子信息', value: 285, percentage: 23.5 },
    { name: '机械制造', value: 210, percentage: 17.3 },
    { name: '服装纺织', value: 175, percentage: 14.4 },
    { name: '食品饮料', value: 156, percentage: 12.8 },
    { name: '医疗健康', value: 132, percentage: 10.9 },
    { name: '建筑建材', value: 118, percentage: 9.7 },
    { name: '汽车配件', value: 95, percentage: 7.8 },
    { name: '文化创意', value: 42, percentage: 3.6 },
  ];
};
