import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  AlertTriangle, 
  FileCheck, 
  FileBarChart, 
  Users,
  LogOut,
  Building2
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', label: '核心看板', icon: LayoutDashboard, permission: 'dashboard' },
  { path: '/venues', label: '展馆管理', icon: MapPin, permission: 'venue_detail' },
  { path: '/alerts', label: '预警中心', icon: AlertTriangle, permission: 'alerts' },
  { path: '/contracts', label: '合同校验', icon: FileCheck, permission: 'contracts' },
  { path: '/reports', label: '运营报告', icon: FileBarChart, permission: 'reports' },
  { path: '/permissions', label: '权限管理', icon: Users, permission: 'permissions' },
];

const Sidebar = () => {
  const location = useLocation();
  const { user, getRoleName, logout } = useAuthStore();
  const navigate = useNavigate();
  const hasPermission = useAuthStore(state => state.hasPermission);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleMenuItems = menuItems.filter(item => hasPermission(item.permission));

  return (
    <aside className="w-64 bg-gradient-to-b from-primary-500 to-primary-700 min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">会展智析</h1>
            <p className="text-white/60 text-xs">智能运营分析平台</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
              alt="avatar" 
              className="w-10 h-10 rounded-full bg-white/20"
            />
            <div>
              <p className="text-white font-medium text-sm">{user?.name}</p>
              <p className="text-white/60 text-xs">{getRoleName()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-white/70 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
