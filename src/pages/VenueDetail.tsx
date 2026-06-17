import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Users, 
  Percent, 
  ThumbsUp,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { getExhibitorStats } from '@/data/mock/exhibitors';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import BarChart from '@/components/charts/BarChart';
import { formatNumber, formatPercent } from '@/utils/format';

const VenueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVenueById, get7DayVisitorTrend } = useDataStore();

  const venue = getVenueById(id || '');
  const visitorTrend = get7DayVisitorTrend(id || '');
  const exhibitorStats = getExhibitorStats(id || '');

  if (!venue) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">展馆不存在</p>
          <button 
            onClick={() => navigate('/venues')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  const lineData = {
    dates: visitorTrend.map(d => d.date),
    series: [
      { name: '实际观众', data: visitorTrend.map(d => d.actual), areaStyle: true, color: '#0A2540' },
      { name: '预期观众', data: visitorTrend.map(d => d.expected), color: '#94A3B8' },
    ],
  };

  const boothData = {
    categories: ['标准展位', '精装展位', '特装展位', '光地展位'],
    series: [
      { name: '已预订', data: [320, 180, 95, 45], color: '#0A2540' },
      { name: '空置', data: [80, 45, 25, 10], color: '#CBD5E1' },
    ],
  };

  const avgVisitor = visitorTrend.reduce((sum, d) => sum + d.actual, 0) / visitorTrend.length;
  const visitorChange = ((visitorTrend[visitorTrend.length - 1].actual - visitorTrend[0].actual) / visitorTrend[0].actual) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/venues')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{venue.name}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {venue.province} · {venue.city}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {venue.totalBooths} 个展位
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">今日观众</span>
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 font-mono">
            {formatNumber(visitorTrend[visitorTrend.length - 1].actual)}
          </p>
          <div className={`flex items-center gap-1 text-sm mt-2 ${visitorChange >= 0 ? 'text-success-600' : 'text-danger-500'}`}>
            {visitorChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{visitorChange >= 0 ? '+' : ''}{visitorChange.toFixed(1)}%</span>
            <span className="text-slate-400">较7天前</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">展位利用率</span>
            <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-success-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 font-mono">78.5%</p>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-3">
            <div className="h-7/8 bg-gradient-to-r from-success-400 to-success-600 rounded-full" style={{ width: '78.5%' }}></div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">参展商满意度</span>
            <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-accent-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 font-mono">{exhibitorStats.avgSatisfaction}<span className="text-base font-normal text-slate-500">分</span></p>
          <div className="flex items-center gap-1 text-sm text-success-600 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>+2.3分 较上周</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">在办展会</span>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 font-mono">{venue.exhibitionCount}<span className="text-base font-normal text-slate-500">场</span></p>
          <div className="text-sm text-slate-500 mt-2">
            本月新增 3 场
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">近7天人流趋势</h3>
            <div className="text-sm text-slate-500">
              日均观众: <span className="font-semibold text-slate-700">{formatNumber(Math.round(avgVisitor))} 人</span>
            </div>
          </div>
          <LineChart data={lineData} height={300} />
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">参展商规模分布</h3>
          <PieChart data={exhibitorStats.byScale} height={260} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">行业分布</h3>
          <PieChart data={exhibitorStats.byIndustry.slice(0, 6)} height={260} />
        </div>

        <div className="col-span-2 card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">展位类型分布</h3>
          <BarChart data={boothData} height={280} />
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">参展商列表</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">公司名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">行业</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">规模</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">展位号</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">满意度</th>
              </tr>
            </thead>
            <tbody>
              {exhibitorStats.byIndustry.slice(0, 5).map((item, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm text-slate-800">示例公司{item.name}{index + 1}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{item.name}</td>
                  <td className="py-3 px-4">
                    <span className="badge badge-info">
                      {['大型', '中型', '小型'][index % 3]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 font-mono">A{String(index + 1).padStart(3, '0')}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${
                      exhibitorStats.avgSatisfaction >= 85 ? 'text-success-600' :
                      exhibitorStats.avgSatisfaction >= 75 ? 'text-amber-600' : 'text-danger-600'
                    }`}>
                      {exhibitorStats.avgSatisfaction + index - 2}分
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
