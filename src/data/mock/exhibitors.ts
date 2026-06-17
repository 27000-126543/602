import { Exhibitor } from '@/types';

const industries = ['电子信息', '机械制造', '服装纺织', '食品饮料', '建筑建材', '医疗健康', '汽车配件', '文化创意'];

const generateExhibitors = (venueId: string, count: number): Exhibitor[] => {
  const exhibitors: Exhibitor[] = [];
  const companyNames = ['科技', '实业', '贸易', '集团', '股份', '发展', '创新', '智慧', '数字', '绿色'];
  const companyPrefixes = ['华', '中', '国', '新', '恒', '永', '盛', '宏', '远', '博'];
  
  for (let i = 0; i < count; i++) {
    const name = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)] + 
                 companyNames[Math.floor(Math.random() * companyNames.length)] + '有限公司';
    
    exhibitors.push({
      id: `ex_${venueId}_${i + 1}`,
      name,
      industry: industries[Math.floor(Math.random() * industries.length)],
      boothId: `b_${venueId}_${i + 1}`,
      exhibitionId: `exh_${venueId}_01`,
      venueId,
      satisfaction: Math.floor(70 + Math.random() * 28),
      scale: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as 'small' | 'medium' | 'large',
    });
  }
  
  return exhibitors;
};

export const allExhibitors: Record<string, Exhibitor[]> = {
  v001: generateExhibitors('v001', 120),
  v002: generateExhibitors('v002', 95),
  v003: generateExhibitors('v003', 85),
  v004: generateExhibitors('v004', 100),
  v005: generateExhibitors('v005', 65),
  v006: generateExhibitors('v006', 75),
  v007: generateExhibitors('v007', 55),
  v008: generateExhibitors('v008', 60),
  v009: generateExhibitors('v009', 48),
  v010: generateExhibitors('v010', 42),
  v011: generateExhibitors('v011', 70),
  v012: generateExhibitors('v012', 38),
};

export const getExhibitors = (venueId: string): Exhibitor[] => {
  return allExhibitors[venueId] || [];
};

export const getAvgSatisfaction = (venueId: string): number => {
  const exhibitors = getExhibitors(venueId);
  if (exhibitors.length === 0) return 0;
  const sum = exhibitors.reduce((acc, e) => acc + e.satisfaction, 0);
  return Math.round(sum / exhibitors.length);
};

export const getExhibitorStats = (venueId: string) => {
  const exhibitors = getExhibitors(venueId);
  
  const industryStats: Record<string, number> = {};
  const scaleStats: Record<string, number> = { small: 0, medium: 0, large: 0 };
  
  exhibitors.forEach(e => {
    industryStats[e.industry] = (industryStats[e.industry] || 0) + 1;
    scaleStats[e.scale]++;
  });
  
  return {
    total: exhibitors.length,
    avgSatisfaction: getAvgSatisfaction(venueId),
    byIndustry: Object.entries(industryStats).map(([name, value]) => ({ name, value })),
    byScale: Object.entries(scaleStats).map(([name, value]) => ({ 
      name: name === 'small' ? '小型' : name === 'medium' ? '中型' : '大型', 
      value 
    })),
  };
};

export const getIndustryList = () => industries;
