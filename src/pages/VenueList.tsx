import { useState } from 'react';
import { Search, Building2, MapPin, Users, ThumbsUp, ChevronRight, Filter } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '@/utils/format';
import { getExhibitorStats } from '@/data/mock/exhibitors';

const VenueList = () => {
  const navigate = useNavigate();
  const { getVenues } = useDataStore();
  const [searchText, setSearchText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const venues = getVenues();
  
  const filteredVenues = venues.filter(venue => {
    const matchSearch = venue.name.includes(searchText) || venue.city.includes(searchText) || venue.province.includes(searchText);
    const matchRegion = selectedRegion === 'all' || venue.region === selectedRegion;
    return matchSearch && matchRegion;
  });

  const regions = [
    { id: 'all', name: '全部区域' },
    { id: 'east', name: '华东区' },
    { id: 'south', name: '华南区' },
    { id: 'north', name: '华北区' },
    { id: 'west', name: '西部区' },
    { id: 'central', name: '华中区' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">展馆管理</h1>
          <p className="text-slate-500 mt-1">共 {venues.length} 个会展中心</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索展馆名称、城市..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          {regions.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedRegion === region.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {filteredVenues.map((venue, index) => {
          const stats = getExhibitorStats(venue.id);
          return (
            <div
              key={venue.id}
              onClick={() => navigate(`/venues/${venue.id}`)}
              className="card p-6 cursor-pointer hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{venue.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {venue.province} · {venue.city}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 mb-1">展会数量</p>
                  <p className="text-lg font-bold text-slate-800">{venue.exhibitionCount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">展位总数</p>
                  <p className="text-lg font-bold text-slate-800">{formatNumber(venue.totalBooths)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">满意度</p>
                  <p className="text-lg font-bold text-success-600">{stats.avgSatisfaction}<span className="text-sm font-normal">分</span></p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">参展商</span>
                  <span className="text-slate-700 font-medium">{stats.total} 家</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                    style={{ width: `${Math.min(100, stats.total / 2)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVenues.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">没有找到匹配的展馆</p>
        </div>
      )}
    </div>
  );
};

export default VenueList;
