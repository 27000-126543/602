import * as XLSX from 'xlsx';
import { Contract } from '@/types';
import { validateContract } from '@/data/mock/contracts';
import { venues } from '@/data/mock/venues';

export interface ParsedContract {
  exhibitorName: string;
  boothNumber: string;
  boothArea: number;
  standardFee: number;
  actualFee: number;
  deviation: number;
  status: 'normal' | 'warning' | 'danger';
}

export const parseContractExcel = async (file: File): Promise<ParsedContract[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];
        
        const contracts: ParsedContract[] = jsonData.map((row: any, index: number) => {
          const exhibitorName = row['参展商名称'] || row['公司名称'] || row['name'] || `参展商${index + 1}`;
          const boothNumber = row['展位号'] || row['展位编号'] || row['booth'] || `B00${index + 1}`;
          const boothArea = parseFloat(row['展位面积'] || row['面积'] || row['area'] || '18');
          const standardFee = parseFloat(row['标准费用'] || row['标准价'] || row['standardFee'] || '50000');
          const actualFee = parseFloat(row['实际费用'] || row['合同金额'] || row['actualFee'] || row['费用'] || '50000');
          
          const validation = validateContract({ standardFee, actualFee });
          
          return {
            exhibitorName,
            boothNumber,
            boothArea,
            standardFee,
            actualFee,
            deviation: validation.deviation,
            status: validation.status as 'normal' | 'warning' | 'danger',
          };
        });
        
        resolve(contracts);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsBinaryString(file);
  });
};

export const generateSampleContractData = (): any[] => {
  return [
    {
      '参展商名称': '示例科技有限公司',
      '展位号': 'A001',
      '展位面积': 36,
      '标准费用': 108000,
      '实际费用': 108000,
    },
    {
      '参展商名称': '示例贸易公司',
      '展位号': 'B002',
      '展位面积': 18,
      '标准费用': 54000,
      '实际费用': 65000,
    },
    {
      '参展商名称': '示例集团',
      '展位号': 'C003',
      '展位面积': 54,
      '标准费用': 162000,
      '实际费用': 158000,
    },
  ];
};

export const downloadSampleExcel = () => {
  const data = generateSampleContractData();
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '合同模板');
  XLSX.writeFile(workbook, '参展合同模板.xlsx');
};
