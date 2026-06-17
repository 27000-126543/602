import { ProvinceData, RankingItem } from '@/types';

const industryList = ['电子信息', '机械制造', '服装纺织', '食品饮料', '建筑建材', '医疗健康', '汽车配件', '文化创意'];

const industryFactors: Record<string, number> = {
  '电子信息': 1.2,
  '机械制造': 0.9,
  '服装纺织': 0.85,
  '食品饮料': 0.75,
  '建筑建材': 0.7,
  '医疗健康': 0.8,
  '汽车配件': 0.65,
  '文化创意': 0.6,
};

export const provinceData: ProvinceData[] = [
  { name: '北京', value: 85, venueCount: 3, exhibitionCount: 85, avgSatisfaction: 84.2 },
  { name: '天津', value: 45, venueCount: 2, exhibitionCount: 45, avgSatisfaction: 79.5 },
  { name: '上海', value: 128, venueCount: 3, exhibitionCount: 128, avgSatisfaction: 88.6 },
  { name: '重庆', value: 66, venueCount: 2, exhibitionCount: 66, avgSatisfaction: 81.3 },
  { name: '广东', value: 201, venueCount: 5, exhibitionCount: 201, avgSatisfaction: 86.5 },
  { name: '江苏', value: 128, venueCount: 4, exhibitionCount: 128, avgSatisfaction: 83.7 },
  { name: '浙江', value: 105, venueCount: 3, exhibitionCount: 105, avgSatisfaction: 85.2 },
  { name: '山东', value: 78, venueCount: 3, exhibitionCount: 78, avgSatisfaction: 80.8 },
  { name: '湖北', value: 54, venueCount: 2, exhibitionCount: 54, avgSatisfaction: 78.6 },
  { name: '四川', value: 68, venueCount: 2, exhibitionCount: 68, avgSatisfaction: 82.1 },
  { name: '陕西', value: 48, venueCount: 2, exhibitionCount: 48, avgSatisfaction: 75.4 },
  { name: '河南', value: 38, venueCount: 1, exhibitionCount: 38, avgSatisfaction: 77.2 },
  { name: '湖南', value: 42, venueCount: 2, exhibitionCount: 42, avgSatisfaction: 79.8 },
  { name: '福建', value: 55, venueCount: 2, exhibitionCount: 55, avgSatisfaction: 81.5 },
  { name: '安徽', value: 32, venueCount: 1, exhibitionCount: 32, avgSatisfaction: 76.9 },
  { name: '辽宁', value: 45, venueCount: 2, exhibitionCount: 45, avgSatisfaction: 78.3 },
  { name: '河北', value: 28, venueCount: 1, exhibitionCount: 28, avgSatisfaction: 75.6 },
  { name: '江西', value: 22, venueCount: 1, exhibitionCount: 22, avgSatisfaction: 74.8 },
  { name: '云南', value: 25, venueCount: 1, exhibitionCount: 25, avgSatisfaction: 77.5 },
  { name: '广西', value: 30, venueCount: 1, exhibitionCount: 30, avgSatisfaction: 76.2 },
  { name: '山西', value: 18, venueCount: 1, exhibitionCount: 18, avgSatisfaction: 73.5 },
  { name: '贵州', value: 15, venueCount: 1, exhibitionCount: 15, avgSatisfaction: 74.2 },
  { name: '黑龙江', value: 20, venueCount: 1, exhibitionCount: 20, avgSatisfaction: 75.8 },
  { name: '吉林', value: 16, venueCount: 1, exhibitionCount: 16, avgSatisfaction: 74.5 },
  { name: '甘肃', value: 12, venueCount: 1, exhibitionCount: 12, avgSatisfaction: 72.8 },
  { name: '内蒙古', value: 10, venueCount: 1, exhibitionCount: 10, avgSatisfaction: 73.2 },
  { name: '新疆', value: 8, venueCount: 1, exhibitionCount: 8, avgSatisfaction: 71.5 },
  { name: '海南', value: 22, venueCount: 1, exhibitionCount: 22, avgSatisfaction: 79.1 },
  { name: '宁夏', value: 6, venueCount: 1, exhibitionCount: 6, avgSatisfaction: 70.8 },
  { name: '青海', value: 5, venueCount: 1, exhibitionCount: 5, avgSatisfaction: 70.2 },
  { name: '西藏', value: 3, venueCount: 1, exhibitionCount: 3, avgSatisfaction: 68.5 },
  { name: '台湾', value: 0, venueCount: 0, exhibitionCount: 0, avgSatisfaction: 0 },
  { name: '香港', value: 0, venueCount: 0, exhibitionCount: 0, avgSatisfaction: 0 },
  { name: '澳门', value: 0, venueCount: 0, exhibitionCount: 0, avgSatisfaction: 0 },
];

const baseSatisfactionRanking: RankingItem[] = [
  { rank: 1, name: '国家会展中心（上海）', value: 88.6, change: 2.3, province: '上海' },
  { rank: 2, name: '深圳国际会展中心', value: 86.9, change: 1.8, province: '广东' },
  { rank: 3, name: '广交会展馆', value: 85.7, change: -0.5, province: '广东' },
  { rank: 4, name: '杭州国际博览中心', value: 84.8, change: 3.1, province: '浙江' },
  { rank: 5, name: '中国国际展览中心（北京）', value: 84.2, change: 0.9, province: '北京' },
  { rank: 6, name: '南京国际博览中心', value: 82.7, change: 1.5, province: '江苏' },
  { rank: 7, name: '重庆国际博览中心', value: 81.3, change: -1.2, province: '重庆' },
  { rank: 8, name: '成都世纪城新国际会展中心', value: 80.5, change: -2.8, province: '四川' },
  { rank: 9, name: '武汉国际博览中心', value: 78.6, change: 0.6, province: '湖北' },
  { rank: 10, name: '青岛国际会展中心', value: 76.8, change: -1.8, province: '山东' },
];

export const getSatisfactionRanking = (industry?: string): RankingItem[] => {
  if (!industry || industry === 'all') {
    return baseSatisfactionRanking;
  }
  
  const factor = industryFactors[industry] || 1;
  
  return baseSatisfactionRanking.map((item, index) => ({
    ...item,
    rank: index + 1,
    value: Math.round((item.value * (0.9 + factor * 0.2)) * 10) / 10,
    change: Math.round((item.change * factor) * 10) / 10,
  }));
};

export const getProvinceData = (industry?: string): ProvinceData[] => {
  if (!industry || industry === 'all') {
    return provinceData;
  }
  
  const factor = industryFactors[industry] || 1;
  
  return provinceData.map(p => ({
    ...p,
    value: Math.round(p.value * factor),
    exhibitionCount: Math.round(p.exhibitionCount * factor),
    avgSatisfaction: Math.round((p.avgSatisfaction * (0.95 + factor * 0.1)) * 10) / 10,
  }));
};

export const getProvinceByName = (name: string): ProvinceData | undefined => {
  return provinceData.find(p => p.name === name);
};

export const getIndustryList = () => industryList;
