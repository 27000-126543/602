import { useState, useMemo } from 'react';
import { 
  FileBarChart, 
  TrendingUp, 
  TrendingDown,
  Users,
  ThumbsUp,
  Building2,
  AlertTriangle,
  Lightbulb,
  Calendar,
  Download,
  ChevronRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  MessageSquareWarning,
  Target
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { formatNumber, formatPercent, formatDate } from '@/utils/format';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import BarChart from '@/components/charts/BarChart';

const ReportCenter = () => {
  const { getWeeklyReport, getTrafficComparison, getIndustryDistribution, getSatisfactionRanking } = useDataStore();
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'quarter'>('week');
  
  const report = getWeeklyReport();
  const trafficData = getTrafficComparison();
  const industryDist = getIndustryDistribution();
  const satisfactionRanking = getSatisfactionRanking();

  const tabs = [
    { key: 'week', label: '周报' },
    { key: 'month', label: '月报' },
    { key: 'quarter', label: '季报' },
  ];

  const lineChartData = {
    dates: trafficData.weeks,
    series: [
      { name: '实际观众', data: trafficData.actualVisitors, areaStyle: true, color: '#0A2540' },
      { name: '预期观众', data: trafficData.expectedVisitors, color: '#94A3B8' },
    ],
  };

  const complaintChartData = useMemo(() => {
    return report.complaints.map(c => ({
      name: c.type,
      value: c.count,
    }));
  }, [report]);

  const satisfactionChartData = useMemo(() => {
    const top5 = satisfactionRanking.slice(0, 5);
    return {
      categories: top5.map(r => r.name),
      series: [
        { name: '满意度', data: top5.map(r => r.value), color: '#0A2540' }
      ]
    };
  }, [satisfactionRanking]);

  const getChangeStyle = (value: number) => {
    if (value > 0) return 'text-success-600';
    if (value < 0) return 'text-danger-600';
    return 'text-slate-500';
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4" />;
    if (value < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">运营报告</h1>
          <p className="text-slate-500 mt-1">智能化运营诊断与优化建议</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'week' | 'month' | 'quarter')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="px-4 py-2.5 btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      {/* 报告概览卡片 */}
      <div className="card p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileBarChart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">第28周运营诊断报告</h2>
              <p className="text-white/70 text-sm">
                {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Calendar className="w-4 h-4" />
            <span>自动生成于 2026-06-16 09:00</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-white/70" />
              <span className="text-white/70 text-sm">观众总流量</span>
            </div>
            <p className="text-3xl font-bold">{formatNumber(report.totalVisitors)}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              report.visitorWoW >= 0 ? 'text-success-300' : 'text-danger-300'
            }`}>
              {getChangeIcon(report.visitorWoW)}
              <span>环比 {report.visitorWoW > 0 ? '+' : ''}{formatPercent(report.visitorWoW)}</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-5 h-5 text-white/70" />
              <span className="text-white/70 text-sm">平均满意度</span>
            </div>
            <p className="text-3xl font-bold">{report.avgSatisfaction}<span className="text-lg">分</span></p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              report.satisfactionYoY >= 0 ? 'text-success-300' : 'text-danger-300'
            }`}>
              {getChangeIcon(report.satisfactionYoY)}
              <span>同比 {report.satisfactionYoY > 0 ? '+' : ''}{formatPercent(report.satisfactionYoY)}</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-white/70" />
              <span className="text-white/70 text-sm">在办展会</span>
            </div>
            <p className="text-3xl font-bold">{report.totalExhibitions}<span className="text-lg">场</span></p>
            <div className="flex items-center gap-1 mt-2 text-sm text-white/70">
              <span>展位利用率 {report.boothOccupancyRate}%</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareWarning className="w-5 h-5 text-white/70" />
              <span className="text-white/70 text-sm">投诉数量</span>
            </div>
            <p className="text-3xl font-bold">{report.complaintCount}<span className="text-lg">起</span></p>
            <div className="flex items-center gap-1 mt-2 text-sm text-white/70">
              <span>空置率 {report.vacancyRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 核心分析区域 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 观众流量趋势 */}
        <div className="col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">观众流量趋势</h3>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getChangeStyle(report.visitorYoY)}`}>
                  同比 {report.visitorYoY > 0 ? '+' : ''}{formatPercent(report.visitorYoY)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getChangeStyle(report.visitorWoW)}`}>
                  环比 {report.visitorWoW > 0 ? '+' : ''}{formatPercent(report.visitorWoW)}
                </span>
              </div>
            </div>
          </div>
          <LineChart data={lineChartData} height={280} />
        </div>

        {/* 投诉分布 */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">投诉分布</h3>
          </div>
          <PieChart data={complaintChartData} height={240} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 行业分布 */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-success-50 rounded-lg flex items-center justify-center">
              <PieChartIcon className="w-4 h-4 text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">行业分布</h3>
          </div>
          <PieChart data={industryDist} height={240} />
        </div>

        {/* 满意度排名 */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-accent-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-accent-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">满意度排名 TOP5</h3>
          </div>
          <BarChart data={satisfactionChartData} height={240} horizontal={false} />
        </div>

        {/* 关键指标详情 */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">关键指标</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">展位利用率</span>
                <span className="text-sm font-bold text-slate-800">{report.boothOccupancyRate}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all" 
                  style={{ width: `${report.boothOccupancyRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">展位空置率</span>
                <span className="text-sm font-bold text-danger-600">{report.vacancyRate}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-danger-400 rounded-full transition-all" 
                  style={{ width: `${report.vacancyRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">观众同比增长</span>
                <span className={`text-sm font-bold ${getChangeStyle(report.visitorYoY)}`}>
                  {report.visitorYoY > 0 ? '+' : ''}{formatPercent(report.visitorYoY)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    report.visitorYoY >= 0 ? 'bg-success-500' : 'bg-danger-400'
                  }`} 
                  style={{ width: `${Math.min(Math.abs(report.visitorYoY) * 5, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">满意度同比</span>
                <span className={`text-sm font-bold ${getChangeStyle(report.satisfactionYoY)}`}>
                  {report.satisfactionYoY > 0 ? '+' : ''}{formatPercent(report.satisfactionYoY)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    report.satisfactionYoY >= 0 ? 'bg-success-500' : 'bg-danger-400'
                  }`} 
                  style={{ width: `${Math.min(Math.abs(report.satisfactionYoY) * 10, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 优化建议 */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-accent-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">优化建议</h3>
            <p className="text-sm text-slate-500">基于本周数据分析，系统智能推荐以下优化方案</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {report.suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  index < 3 ? 'bg-accent-100 text-accent-600' : 'bg-primary-100 text-primary-600'
                }`}>
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-relaxed">{suggestion}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 投诉详情列表 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-danger-50 rounded-lg flex items-center justify-center">
              <MessageSquareWarning className="w-4 h-4 text-danger-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">投诉类型明细</h3>
          </div>
          <span className="text-sm text-slate-500">共 {report.complaintCount} 起投诉</span>
        </div>
        
        <div className="space-y-3">
          {report.complaints.map((complaint, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                index === 0 ? 'bg-danger-100 text-danger-600' :
                index === 1 ? 'bg-amber-100 text-amber-600' :
                index === 2 ? 'bg-primary-100 text-primary-600' :
                'bg-slate-200 text-slate-600'
              }`}>
                <span className="text-sm font-bold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{complaint.type}</span>
                  <span className="text-sm text-slate-500">{complaint.count} 起</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      index === 0 ? 'bg-danger-500' :
                      index === 1 ? 'bg-amber-500' :
                      index === 2 ? 'bg-primary-500' :
                      'bg-slate-400'
                    }`}
                    style={{ width: `${complaint.percentage * 3}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-600 w-16 text-right">
                {complaint.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportCenter;
