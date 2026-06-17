import { Bell, Search, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { useAuthStore } from '@/store/useAuthStore';

const industries = [
  { id: 'all', name: '全部行业' },
  { id: '电子信息', name: '电子信息' },
  { id: '机械制造', name: '机械制造' },
  { id: '服装纺织', name: '服装纺织' },
  { id: '食品饮料', name: '食品饮料' },
  { id: '医疗健康', name: '医疗健康' },
  { id: '建筑建材', name: '建筑建材' },
  { id: '汽车配件', name: '汽车配件' },
  { id: '文化创意', name: '文化创意' },
];

const Header = () => {
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const { selectedIndustry, setSelectedIndustry } = useDataStore();
  const { getRoleName, getRegionName } = useAuthStore();
  
  const currentIndustry = industries.find(i => i.id === selectedIndustry) || industries[0];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="text-sm text-slate-600">{currentIndustry.name}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          
          {showIndustryDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
              {industries.map(ind => (
                <button
                  key={ind.id}
                  onClick={() => {
                    setSelectedIndustry(ind.id);
                    setShowIndustryDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                    selectedIndustry === ind.id ? 'text-primary-600 bg-primary-50' : 'text-slate-700'
                  }`}
                >
                  {ind.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索展馆、展会..."
            className="pl-10 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right mr-2">
          <p className="text-xs text-slate-500">当前权限</p>
          <p className="text-sm font-medium text-slate-700">
            {getRoleName()}
            {getRegionName() && <span className="text-slate-400 ml-1">({getRegionName()})</span>}
          </p>
        </div>

        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full pulse-dot text-danger-500"></span>
        </button>

        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
