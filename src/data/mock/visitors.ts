import { VisitorRecord } from '@/types';

const generateVisitorRecords = (venueId: string, days: number = 30): VisitorRecord[] => {
  const records: VisitorRecord[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const baseVisitors = 5000 + Math.floor(Math.random() * 3000);
    const expected = baseVisitors + Math.floor(Math.random() * 2000);
    const actual = i < 3 && venueId === 'v005' 
      ? Math.floor(expected * 0.6 + Math.random() * 500)
      : Math.floor(baseVisitors * (0.85 + Math.random() * 0.3));
    
    records.push({
      id: `vr_${venueId}_${dateStr}`,
      date: dateStr,
      venueId,
      visitorCount: actual,
      expectedCount: expected,
    });
  }
  
  return records;
};

export const allVisitorRecords: Record<string, VisitorRecord[]> = {
  v001: generateVisitorRecords('v001'),
  v002: generateVisitorRecords('v002'),
  v003: generateVisitorRecords('v003'),
  v004: generateVisitorRecords('v004'),
  v005: generateVisitorRecords('v005'),
  v006: generateVisitorRecords('v006'),
  v007: generateVisitorRecords('v007'),
  v008: generateVisitorRecords('v008'),
  v009: generateVisitorRecords('v009'),
  v010: generateVisitorRecords('v010'),
  v011: generateVisitorRecords('v011'),
  v012: generateVisitorRecords('v012'),
};

export const getVisitorRecords = (venueId: string, days?: number): VisitorRecord[] => {
  const records = allVisitorRecords[venueId] || [];
  if (days) {
    return records.slice(-days);
  }
  return records;
};

export const get7DayVisitorTrend = (venueId: string) => {
  const records = getVisitorRecords(venueId, 7);
  return records.map(r => ({
    date: r.date.slice(5),
    actual: r.visitorCount,
    expected: r.expectedCount,
  }));
};

export const getTotalVisitors = (): number => {
  return Object.values(allVisitorRecords).reduce((total, records) => {
    return total + records.reduce((sum, r) => sum + r.visitorCount, 0);
  }, 0);
};

export const getTodayVisitors = (): number => {
  return Object.values(allVisitorRecords).reduce((total, records) => {
    const today = records[records.length - 1];
    return total + (today?.visitorCount || 0);
  }, 0);
};
