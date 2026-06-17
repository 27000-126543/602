export type UserRole = 'headquarters' | 'region' | 'venue';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  region?: string;
  venueId?: string;
  avatar: string;
  status?: 'active' | 'disabled';
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  province: string;
  region: 'north' | 'east' | 'south' | 'west' | 'central';
  totalBooths: number;
  exhibitionCount: number;
  latitude: number;
  longitude: number;
}

export interface Exhibition {
  id: string;
  name: string;
  venueId: string;
  industry: string;
  startDate: string;
  endDate: string;
  totalBooths: number;
  bookedBooths: number;
  expectedVisitors: number;
  actualVisitors: number;
  satisfactionScore: number;
}

export interface Exhibitor {
  id: string;
  name: string;
  industry: string;
  boothId: string;
  exhibitionId: string;
  venueId: string;
  satisfaction: number;
  scale: 'small' | 'medium' | 'large';
}

export interface VisitorRecord {
  id: string;
  date: string;
  venueId: string;
  exhibitionId?: string;
  visitorCount: number;
  expectedCount: number;
}

export type AlertType = 'visitor_low' | 'satisfaction_drop' | 'booth_vacancy' | 'contract_deviation';
export type AlertLevel = 'info' | 'warning' | 'danger';
export type AlertStatus = 'pending' | 'processing' | 'resolved' | 'rejected';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  venueId: string;
  venueName: string;
  level: AlertLevel;
  status: AlertStatus;
  currentApprovalLevel: number;
  createdAt: string;
  data: {
    visitorDropRate?: number;
    satisfactionDrop?: number;
    boothVacancyRate?: number;
    contractDeviation?: number;
  };
}

export interface ApprovalRecord {
  id: string;
  alertId: string;
  level: number;
  levelName: string;
  approver: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected';
  comment: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  venueId: string;
  venueName: string;
  exhibitorName: string;
  boothNumber: string;
  boothArea: number;
  standardFee: number;
  actualFee: number;
  deviation: number;
  status: 'normal' | 'warning' | 'danger';
  contractDate: string;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalVisitors: number;
  visitorYoY: number;
  visitorWoW: number;
  totalExhibitions: number;
  avgSatisfaction: number;
  satisfactionYoY: number;
  boothOccupancyRate: number;
  vacancyRate: number;
  complaintCount: number;
  complaints: ComplaintItem[];
  suggestions: string[];
}

export interface ComplaintItem {
  type: string;
  count: number;
  percentage: number;
}

export interface ProvinceData {
  name: string;
  value: number;
  venueCount: number;
  exhibitionCount: number;
  avgSatisfaction: number;
}

export interface IndustryFilter {
  id: string;
  name: string;
}

export interface RankingItem {
  rank: number;
  name: string;
  value: number;
  change: number;
  province?: string;
}

export type TabType = 'all' | 'pending' | 'processing' | 'resolved';
