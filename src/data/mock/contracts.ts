import { Contract } from '@/types';

export const contracts: Contract[] = [
  {
    id: 'c001',
    venueId: 'v001',
    venueName: '国家会展中心（上海）',
    exhibitorName: '华创科技有限公司',
    boothNumber: 'A012',
    boothArea: 54,
    standardFee: 162000,
    actualFee: 162000,
    deviation: 0,
    status: 'normal',
    contractDate: '2026-06-10',
  },
  {
    id: 'c002',
    venueId: 'v001',
    venueName: '国家会展中心（上海）',
    exhibitorName: '盛源实业集团',
    boothNumber: 'B025',
    boothArea: 36,
    standardFee: 108000,
    actualFee: 105000,
    deviation: -2.78,
    status: 'normal',
    contractDate: '2026-06-12',
  },
  {
    id: 'c003',
    venueId: 'v002',
    venueName: '广交会展馆',
    exhibitorName: '恒泰贸易有限公司',
    boothNumber: 'C008',
    boothArea: 27,
    standardFee: 67500,
    actualFee: 78800,
    deviation: 16.74,
    status: 'warning',
    contractDate: '2026-06-08',
  },
  {
    id: 'c004',
    venueId: 'v005',
    venueName: '成都世纪城新国际会展中心',
    exhibitorName: '永发股份有限公司',
    boothNumber: 'D015',
    boothArea: 45,
    standardFee: 90000,
    actualFee: 108000,
    deviation: 20,
    status: 'danger',
    contractDate: '2026-06-05',
  },
  {
    id: 'c005',
    venueId: 'v004',
    venueName: '深圳国际会展中心',
    exhibitorName: '博远发展集团',
    boothNumber: 'E020',
    boothArea: 72,
    standardFee: 216000,
    actualFee: 216000,
    deviation: 0,
    status: 'normal',
    contractDate: '2026-06-15',
  },
  {
    id: 'c006',
    venueId: 'v012',
    venueName: '青岛国际会展中心',
    exhibitorName: '宏创新材料有限公司',
    boothNumber: 'F006',
    boothArea: 18,
    standardFee: 36000,
    actualFee: 42500,
    deviation: 18.06,
    status: 'danger',
    contractDate: '2026-06-11',
  },
  {
    id: 'c007',
    venueId: 'v007',
    venueName: '武汉国际博览中心',
    exhibitorName: '智慧数字科技',
    boothNumber: 'G018',
    boothArea: 30,
    standardFee: 60000,
    actualFee: 60000,
    deviation: 0,
    status: 'normal',
    contractDate: '2026-06-14',
  },
  {
    id: 'c008',
    venueId: 'v009',
    venueName: '西安国际会展中心',
    exhibitorName: '绿色能源科技',
    boothNumber: 'H022',
    boothArea: 40,
    standardFee: 80000,
    actualFee: 85000,
    deviation: 6.25,
    status: 'normal',
    contractDate: '2026-06-09',
  },
];

export const getContracts = (venueId?: string): Contract[] => {
  if (!venueId) return contracts;
  return contracts.filter(c => c.venueId === venueId);
};

export const getContractById = (id: string): Contract | undefined => {
  return contracts.find(c => c.id === id);
};

export const getAbnormalContracts = (): Contract[] => {
  return contracts.filter(c => c.status !== 'normal');
};

export const validateContract = (contractData: Partial<Contract>): { valid: boolean; deviation: number; status: string } => {
  const { standardFee, actualFee } = contractData;
  if (!standardFee || !actualFee) return { valid: false, deviation: 0, status: 'normal' };
  
  const deviation = ((actualFee - standardFee) / standardFee) * 100;
  let status = 'normal';
  if (Math.abs(deviation) > 15) {
    status = 'danger';
  } else if (Math.abs(deviation) > 10) {
    status = 'warning';
  }
  
  return { valid: true, deviation: Math.round(deviation * 100) / 100, status };
};
