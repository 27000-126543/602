import { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2,
  Shield,
  Building2,
  MapPin,
  User,
  Filter,
  ChevronDown,
  Check,
  X,
  Settings
} from 'lucide-react';
import { User as UserType, UserRole } from '@/types';
import { roleNames, regionNames } from '@/data/mock/users';
import { venues } from '@/data/mock/venues';

const mockUsers: UserType[] = [
  {
    id: 'u001',
    username: 'admin',
    name: '张总监',
    role: 'headquarters',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: 'u002',
    username: 'region_east',
    name: '李经理',
    role: 'region',
    region: 'east',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=east',
  },
  {
    id: 'u003',
    username: 'venue_sh',
    name: '王主管',
    role: 'venue',
    venueId: 'v001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shanghai',
  },
  {
    id: 'u004',
    username: 'region_south',
    name: '陈经理',
    role: 'region',
    region: 'south',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=south',
  },
  {
    id: 'u005',
    username: 'venue_gz',
    name: '刘主管',
    role: 'venue',
    venueId: 'v002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guangzhou',
  },
  {
    id: 'u006',
    username: 'region_north',
    name: '赵经理',
    role: 'region',
    region: 'north',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=north',
  },
  {
    id: 'u007',
    username: 'venue_cd',
    name: '孙主管',
    role: 'venue',
    venueId: 'v005',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chengdu',
  },
  {
    id: 'u008',
    username: 'venue_wh',
    name: '周主管',
    role: 'venue',
    venueId: 'v007',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wuhan',
  },
];

const rolePermissions: Record<UserRole, string[]> = {
  headquarters: [
    '数据总览', '全国会展热力图', '所有展馆管理', 
    '预警查看', '三级审批', '合同校验', 
    '运营报告', '用户管理', '权限配置', '系统设置'
  ],
  region: [
    '数据总览', '区域展馆热力图', '区域展馆管理',
    '预警查看', '二级审批', '合同校验',
    '运营报告'
  ],
  venue: [
    '数据总览', '本馆数据查看',
    '预警查看', '一级审批', '合同上传',
    '运营报告'
  ],
};

const PermissionManage = () => {
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const filteredUsers = useMemo(() => {
    let result = users;
    
    if (searchText) {
      result = result.filter(u => 
        u.name.includes(searchText) ||
        u.username.includes(searchText)
      );
    }
    
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }
    
    return result;
  }, [users, searchText, roleFilter]);

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'headquarters': return { bg: 'bg-primary-100', text: 'text-primary-700', icon: Shield };
      case 'region': return { bg: 'bg-accent-100', text: 'text-accent-700', icon: MapPin };
      case 'venue': return { bg: 'bg-success-100', text: 'text-success-700', icon: Building2 };
    }
  };

  const getRegionOrVenueName = (user: UserType) => {
    if (user.region) return regionNames[user.region] || '';
    if (user.venueId) {
      const venue = venues.find(v => v.id === user.venueId);
      return venue?.name || '';
    }
    return '全国';
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">权限管理</h1>
          <p className="text-slate-500 mt-1">用户与角色权限配置管理</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加用户
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-5">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">用户总数</p>
              <p className="text-2xl font-bold text-slate-800">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">集团总部</p>
              <p className="text-2xl font-bold text-slate-800">
                {users.filter(u => u.role === 'headquarters').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">区域运营</p>
              <p className="text-2xl font-bold text-slate-800">
                {users.filter(u => u.role === 'region').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-success-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">会展中心</p>
              <p className="text-2xl font-bold text-slate-800">
                {users.filter(u => u.role === 'venue').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'users'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          用户管理
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'roles'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          角色权限
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* 筛选栏 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索用户..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="input-field pl-9 w-64"
                />
              </div>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                {['all', 'headquarters', 'region', 'venue'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      roleFilter === role
                        ? 'bg-white text-slate-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {role === 'all' ? '全部' : roleNames[role]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 用户列表 */}
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">用户信息</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">角色</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">管辖范围</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">权限数量</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-500">状态</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-slate-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const roleStyle = getRoleColor(user.role);
                  const RoleIcon = roleStyle.icon;
                  const permissions = rolePermissions[user.role];
                  
                  return (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full bg-slate-100"
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                          {roleNames[user.role]}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-slate-600">{getRegionOrVenueName(user)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-slate-700">{permissions.length} 项</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 text-sm text-success-600">
                          <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                          正常
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingUser(user);
                              setShowAddModal(true);
                            }}
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-slate-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Users className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">暂无用户数据</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* 角色权限 */
        <div className="grid grid-cols-3 gap-6">
          {(Object.keys(rolePermissions) as UserRole[]).map((role) => {
            const roleStyle = getRoleColor(role);
            const RoleIcon = roleStyle.icon;
            const permissions = rolePermissions[role];
            
            return (
              <div key={role} className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 ${roleStyle.bg} rounded-xl flex items-center justify-center`}>
                    <RoleIcon className={`w-6 h-6 ${roleStyle.text}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{roleNames[role]}</h3>
                    <p className="text-sm text-slate-500">{permissions.length} 项权限</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {permissions.map((perm, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg"
                    >
                      <Check className={`w-4 h-4 ${roleStyle.text} flex-shrink-0`} />
                      <span className="text-sm text-slate-700">{perm}</span>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 py-2.5 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  配置权限
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 添加/编辑用户弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 animate-slide-up">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              {editingUser ? '编辑用户' : '添加用户'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">用户名</label>
                <input
                  type="text"
                  defaultValue={editingUser?.username || ''}
                  className="input-field w-full"
                  placeholder="请输入用户名"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">姓名</label>
                <input
                  type="text"
                  defaultValue={editingUser?.name || ''}
                  className="input-field w-full"
                  placeholder="请输入姓名"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">角色</label>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(roleNames) as UserRole[]).map((role) => {
                    const rs = getRoleColor(role);
                    const RoleIcon = rs.icon;
                    return (
                      <button
                        key={role}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          editingUser?.role === role
                            ? `border-primary-500 ${rs.bg}`
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <RoleIcon className={`w-5 h-5 mx-auto mb-1 ${rs.text}`} />
                        <p className="text-xs font-medium text-slate-700">{roleNames[role]}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">初始密码</label>
                <input
                  type="password"
                  defaultValue="123456"
                  className="input-field w-full"
                  placeholder="请输入初始密码"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                }}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                }}
                className="flex-1 py-2.5 btn-primary"
              >
                {editingUser ? '保存修改' : '确认添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionManage;
