import { create } from 'zustand';
import { Venue, Alert, Contract, WeeklyReport, ProvinceData, RankingItem, Exhibitor } from '@/types';
import { venues, getVenueById } from '@/data/mock/venues';
import { alerts, getAlerts, getAlertById, getApprovalRecords, approvalRecords } from '@/data/mock/alerts';
import { contracts, getContracts, getAbnormalContracts } from '@/data/mock/contracts';
import { getWeeklyReport, getTrafficComparison, getIndustryDistribution } from '@/data/mock/reports';
import { getProvinceData, getSatisfactionRanking } from '@/data/mock/provinces';
import { get7DayVisitorTrend, getTodayVisitors, getTotalVisitors, getVisitorRecords } from '@/data/mock/visitors';
import { getExhibitorStats, getExhibitors } from '@/data/mock/exhibitors';
import { useAuthStore } from './useAuthStore';
interface DataState {
 selectedIndustry: string;
 selectedProvince: string | null;
 setSelectedIndustry: (industry: string) => void;
 setSelectedProvince: (province: string | null) => void;
 getVenues: () => Venue[];
 getVenueById: (id: string) => Venue | undefined;
 getAlerts: (status?: string) => Alert[];
 getAlertById: (id: string) => Alert | undefined;
 getApprovalRecords: (alertId: string) => any[];
 getContracts: (venueId?: string) => Contract[];
 getAbnormalContracts: () => Contract[];
 getWeeklyReport: () => WeeklyReport;
 getProvinceData: () => ProvinceData[];
 getSatisfactionRanking: () => RankingItem[];
 get7DayVisitorTrend: (venueId: string) => any[];
 getTodayVisitors: () => number;
 getTotalVisitors: () => number;
 getExhibitorStats: (venueId: string) => any;
 getTrafficComparison: () => any;
 getIndustryDistribution: () => any[];
 getBoothOccupancyRate: () => number;
 getAvgSatisfaction: () => number;
 getExecutionEfficiency: () => number;
 approveAlert: (alertId: string, level: number, comment: string) => boolean;
 rejectAlert: (alertId: string, level: number, comment: string) => boolean;
}
export const useDataStore = create<DataState>((set, get) => {
 const filterByRole = (venueList: Venue[]) => {
 const user = useAuthStore.getState().user;
 if (!user)
 return venueList;
 if (user.role === 'headquarters')
 return venueList;
 if (user.role === 'region' && user.region) {
 return venueList.filter(v => v.region === user.region);
 }
 if (user.role === 'venue' && user.venueId) {
 return venueList.filter(v => v.id === user.venueId);
 }
 return venueList;
 };
 return {
 selectedIndustry: 'all',
 selectedProvince: null,
 setSelectedIndustry: (industry) => set({ selectedIndustry: industry }),
 setSelectedProvince: (province) => set({ selectedProvince: province }),
 getVenues: () => filterByRole(venues),
 getVenueById: (id) => getVenueById(id),
 getAlerts: (status) => {
 const user = useAuthStore.getState().user;
 let result = getAlerts(status);
 if (user?.role === 'region' && user.region) {
 const regionVenues = venues.filter(v => v.region === user.region).map(v => v.id);
 result = result.filter(a => regionVenues.includes(a.venueId));
 }
 else if (user?.role === 'venue' && user.venueId) {
 result = result.filter(a => a.venueId === user.venueId);
 }
 return result;
 },
 getAlertById: (id) => getAlertById(id),
 getApprovalRecords: (alertId) => getApprovalRecords(alertId),
 getContracts: (venueId) => {
 const user = useAuthStore.getState().user;
 let result = getContracts(venueId);
 if (user?.role === 'region' && user.region) {
 const regionVenues = venues.filter(v => v.region === user.region).map(v => v.id);
 result = result.filter(c => regionVenues.includes(c.venueId));
 }
 else if (user?.role === 'venue' && user.venueId) {
 result = result.filter(c => c.venueId === user.venueId);
 }
 return result;
 },
 getAbnormalContracts: () => {
 return getAbnormalContracts();
 },
 getWeeklyReport: () => getWeeklyReport(),
 getProvinceData: () => getProvinceData(get().selectedIndustry),
 getSatisfactionRanking: () => getSatisfactionRanking(get().selectedIndustry),
 get7DayVisitorTrend: (venueId) => get7DayVisitorTrend(venueId),
 getTodayVisitors: () => getTodayVisitors(),
 getTotalVisitors: () => getTotalVisitors(),
 getExhibitorStats: (venueId) => getExhibitorStats(venueId),
 getTrafficComparison: () => getTrafficComparison(get().selectedIndustry),
 getIndustryDistribution: () => getIndustryDistribution(get().selectedIndustry),
 getBoothOccupancyRate: () => {
 const filteredVenues = filterByRole(venues);
 const totalBooths = filteredVenues.reduce((sum, v) => sum + v.totalBooths, 0);
 const occupied = Math.floor(totalBooths * 0.786);
 return Math.round((occupied / totalBooths) * 1000) / 10;
 },
 getAvgSatisfaction: () => {
 const filteredVenues = filterByRole(venues);
 if (filteredVenues.length === 0)
 return 0;
 const total = filteredVenues.reduce((sum, v) => {
 const stats = getExhibitorStats(v.id);
 return sum + stats.avgSatisfaction;
 }, 0);
 return Math.round((total / filteredVenues.length) * 10) / 10;
 },
 getExecutionEfficiency: () => {
 return 87.5;
 },
 approveAlert: (alertId, level, comment) => {
 const records = approvalRecords[alertId];
 if (!records)
 return false;
 const record = records.find(r => r.level === level);
 if (!record || record.status !== 'pending')
 return false;
 const user = useAuthStore.getState().user;
 record.status = 'approved';
 record.approver = user?.name || '';
 record.approverRole = user?.role || '';
 record.comment = comment;
 record.createdAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
 const alertIndex = alerts.findIndex(a => a.id === alertId);
 if (alertIndex >= 0) {
 alerts[alertIndex].currentApprovalLevel = level;
 if (level >= 3) {
 alerts[alertIndex].status = 'resolved';
 }
 else {
 alerts[alertIndex].status = 'processing';
 }
 }
 return true;
 },
 rejectAlert: (alertId, level, comment) => {
 const records = approvalRecords[alertId];
 if (!records)
 return false;
 const record = records.find(r => r.level === level);
 if (!record || record.status !== 'pending')
 return false;
 const user = useAuthStore.getState().user;
 record.status = 'rejected';
 record.approver = user?.name || '';
 record.approverRole = user?.role || '';
 record.comment = comment;
 record.createdAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
 const alertIndex = alerts.findIndex(a => a.id === alertId);
 if (alertIndex >= 0) {
 alerts[alertIndex].status = 'rejected';
 }
 return true;
 },
 };
});
