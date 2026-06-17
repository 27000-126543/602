import { useMemo, useState } from 'react';
import { 
  Users, 
  MapPin, 
  Percent, 
  ThumbsUp, 
  TrendingUp,
  Building2,
  ChevronRight
} from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import LineChart from '@/components/charts/LineChart';
import AlertCard from '@/components/common/AlertCard';
import { useDataStore } from '@/store/useDataStore';
import { formatNumber, formatPercent } from '@/utils/format';
import { getSatisfactionRanking, getProvinceData } from '@/data/mock/provinces';
import { getIndustryDistribution, getTrafficComparison } from '@/data/mock/reports';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    getVenues, 
    getAlerts, 
    getTodayVisitors, 
    getBoothOccupancyRate, 
    getAvgSatisfaction,
    getExecutionEfficiency,
    selectedProvince,
    setSelectedProvince,
  } = useDataStore();

  const venues = getVenues();
  const alerts = getAlerts();
  const pendingAlerts = alerts.filter(a => a.status === 'pending' || a.status === 'processing');
  const provinceData = getProvinceData();
  const satisfactionRanking = getSatisfactionRanking();
  const industryDist = getIndustryDistribution();
  const trafficData = getTrafficComparison();

  const todayVisitors = getTodayVisitors();
  const boothRate = getBoothOccupancyRate();
  const avgSatisfaction = getAvgSatisfaction();
  const execEfficiency = getExecutionEfficiency();

  const heatMapColors = useMemo(() => {
    const maxVal = Math.max(...provinceData.map(p => p.value));
    return provinceData.map(p => {
      const intensity = p.value / maxVal;
      if (intensity > 0.8) return 'bg-primary-500';
      if (intensity > 0.6) return 'bg-primary-400';
      if (intensity > 0.4) return 'bg-primary-300';
      if (intensity > 0.2) return 'bg-primary-200';
      return 'bg-primary-100';
    });
  }, [provinceData]);

  const handleProvinceClick = (name: string) => {
    setSelectedProvince(selectedProvince === name ? null : name);
  };

  const lineChartData = {
    dates: trafficData.weeks,
    series: [
      { name: '实际观众', data: trafficData.actualVisitors, areaStyle: true, color: '#0A2540' },
      { name: '预期观众', data: trafficData.expectedVisitors, color: '#94A3B8' },
    ],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">运营总览</h1>
          <p className="text-slate-500 mt-1">实时监控全国会展运营数据</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="w-2 h-2 bg-success-500 rounded-full pulse-dot text-success-500"></span>
          数据实时更新中
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5 animate-stagger">
        <StatCard
          title="今日观众流量"
          value={formatNumber(todayVisitors)}
          change={8.5}
          changeLabel="较昨日"
          icon={<Users className="w-6 h-6" />}
          color="primary"
          suffix="人"
        />
        <StatCard
          title="展位利用率"
          value={boothRate}
          change={-2.1}
          changeLabel="较上周"
          icon={<Percent className="w-6 h-6" />}
          color="success"
          suffix="%"
        />
        <StatCard
          title="参展商满意度"
          value={avgSatisfaction}
          change={1.2}
          changeLabel="较上周"
          icon={<ThumbsUp className="w-6 h-6" />}
          color="accent"
          suffix="分"
        />
        <StatCard
          title="活动执行效率"
          value={execEfficiency}
          change={3.8}
          changeLabel="较上月"
          icon={<TrendingUp className="w-6 h-6" />}
          color="success"
          suffix="%"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">全国会展热力图</h3>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>热度低</span>
                <div className="flex">
                  <div className="w-4 h-3 bg-primary-100"></div>
                  <div className="w-4 h-3 bg-primary-200"></div>
                  <div className="w-4 h-3 bg-primary-300"></div>
                  <div className="w-4 h-3 bg-primary-400"></div>
                  <div className="w-4 h-3 bg-primary-500"></div>
                </div>
                <span>热度高</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-8 gap-2">
            {provinceData.slice(0, 32).map((province, index) => (
              <div
                key={province.name}
                onClick={() => handleProvinceClick(province.name)}
                className={`
                  relative p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${heatMapColors[index]}
                  ${selectedProvince === province.name ? 'ring-2 ring-accent-500 ring-offset-2' : ''}
                  hover:scale-105 hover:shadow-md
                `}
                title={`${province.name}: ${province.value}场展会`}
              >
                <div className={`text-xs font-medium ${index > 16 ? 'text-white' : 'text-primary-700'}`}>
                  {province.name}
                </div>
                <div className={`text-lg font-bold mt-1 ${index > 16 ? 'text-white' : 'text-primary-800'}`}>
                  {province.value}
                </div>
              </div>
            ))}
          </div>
          
          {selectedProvince && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-slate-500">{selectedProvince}</span>
                  <span className="text-lg font-bold text-slate-800 ml-2">
                    {provinceData.find(p => p.name === selectedProvince)?.value} 场展会
                  </span>
                </div>
                <button 
                  onClick={() => navigate('/venues')}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  查看详情 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-xs text-slate-500">展馆数量</p>
                  <p className="text-base font-semibold text-slate-700">
                    {provinceData.find(p => p.name === selectedProvince)?.venueCount} 个
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">展会数量</p>
                  <p className="text-base font-semibold text-slate-700">
                    {provinceData.find(p => p.name === selectedProvince)?.exhibitionCount} 场
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">平均满意度</p>
                  <p className="text-base font-semibold text-success-600">
                    {provinceData.find(p => p.name === selectedProvince)?.avgSatisfaction} 分
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">满意度排名</h3>
            <button 
              onClick={() => navigate('/venues')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              全部
            </button>
          </div>
          
          <div className="space-y-3">
            {satisfactionRanking.slice(0, 6).map((item) => (
              <div 
                key={item.rank}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/venues`)}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  item.rank <= 3 ? 'bg-accent-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {item.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.province}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{item.value}分</p>
                  <p className={`text-xs ${item.change >= 0 ? 'text-success-600' : 'text-danger-500'}`}>
                    {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">观众流量趋势</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-primary-50 text-primary-600 rounded-md">近6周</button>
              <button className="px-3 py-1 text-sm text-slate-500 hover:bg-slate-50 rounded-md">近3月</button>
              <button className="px-3 py-1 text-sm text-slate-500 hover:bg-slate-50 rounded-md">近1年</button>
            </div>
          </div>
          <LineChart data={lineChartData} height={280} />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">行业分布</h3>
            <MapPin className="w-5 h-5 text-slate-400" />
          </div>
          <PieChart data={industryDist} height={260} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">预警概览</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                当前有 <span className="text-danger-600 font-semibold">{pendingAlerts.length}</span> 条预警待处理
              </p>
            </div>
            <button 
              onClick={() => navigate('/alerts')}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {pendingAlerts.slice(0, 4).map((alert) => (
              <AlertCard key={alert.id} alert={alert} compact />
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">展馆概览</h3>
            <button 
              onClick={() => navigate('/venues')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              管理
            </button>
          </div>
          
          <div className="space-y-3">
            {venues.slice(0, 5).map((venue) => (
              <div 
                key={venue.id}
                onClick={() => navigate(`/venues/${venue.id}`)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{venue.name}</p>
                  <p className="text-xs text-slate-500">{venue.city} · {venue.exhibitionCount}场展会</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
