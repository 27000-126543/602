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
  Check,
  Settings,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserRole } from '@/types';
import { roleNames, regionNames } from '@/data/mock/users';
import { venues } from '@/data/mock/venues';

interface UserItem {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  region?: string;
  venueId?: string;
  avatar: string;
  status: 'active' | 'disabled';
}

const initialUsers: UserItem[] = [
  {
    id: 'u001',
    username: 'admin',
    name: '张总监',
    role: 'headquarters',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    status: 'active',
  },
  {
    id: 'u002',
    username: 'region_east',
    name: '李经理',
    role: 'region',
    region: 'east',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=east',
    status: 'active',
  },
  {
    id: 'u003',
    username: 'venue_sh',
    name: '王主管',
    role: 'venue',
    venueId: 'v001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shanghai',
    status: 'active',
  },
  {
    id: 'u004',
    username: 'region_south',
    name: '陈经理',
    role: 'region',
    region: 'south',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=south',
    status: 'active',
  },
  {
    id: 'u005',
    username: 'venue_gz',
    name: '刘主管',
    role: 'venue',
    venueId: 'v002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guangzhou',
    status: 'active',
  },
  {
    id: 'u006',
    username: 'region_north',
    name: '赵经理',
    role: 'region',
    region: 'north',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=north',
    status: 'active',
  },
  {
    id: 'u007',
    username: 'venue_cd',
    name: '孙主管',
    role: 'venue',
    venueId: 'v005',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chengdu',
    status: 'disabled',
  },
  {
    id: 'u008',
    username: 'venue_wh',
    name: '周主管',
    role: 'venue',
    venueId: 'v007',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wuhan',
    status: 'active',
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
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    role: 'venue' as UserRole,
    region: 'east',
    venueId: 'v001',
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const getRegionOrVenueName = (user: UserItem) => {
    if (user.region) return regionNames[user.region] || '';
    if (user.venueId) {
      const venue = venues.find(v => v.id === user.venueId);
      return venue?.name || '';
    }
    return '全国';
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      name: '',
      password: '',
      role: 'venue',
      region: 'east',
      venueId: 'v001',
    });
    setShowAddModal(true);
  };

  const handleEdit = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      password: '',
      role: user.role,
      region: user.region || 'east',
      venueId: user.venueId || 'v001',
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该用户吗？')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } 
        : u
    ));
  };

  const handleSubmit = () => {
    if (!formData.username || !formData.name) {
      alert('请填写完整信息');
      return;
    }
    
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              username: formData.username, 
              name: formData.name, 
              role: formData.role,
              region: formData.role === 'region' ? formData.region : undefined,
              venueId: formData.role === 'venue' ? formData.venueId : undefined,
            } 
          : u
      ));
    } else {
      if (!formData.password) {
        alert('请设置密码');
        return;
      }
      
      const newUser: UserItem = {
        id: 'u' + Date.now(),
        username: formData.username,
        name: formData.name,
        role: formData.role,
        region: formData.role === 'region' ? formData.region : undefined,
        venueId: formData.role === 'venue' ? formData.venueId : undefined,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
        status: 'active',
      };
      setUsers([...users, newUser]);
    }
    
    setShowAddModal(false);
    setEditingUser(null);
  };

  const stats = {
    total: users.length,
    headquarters: users.filter(u => u.role === 'headquarters').length,
    region: users.filter(u => u.role === 'region').length,
    venue: users.filter(u => u.role === 'venue').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">权限管理</h1>
          <p className="text-slate-500 mt-1">用户与角色权限配置管理</p>
        </div>
        <button 
          onClick={handleAdd}
          className="px-4 py-2.5 btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加用户
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">用户总数</p>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
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
              <p className="text-2xl font-bold text-slate-800">{stats.headquarters}</p>
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
              <p className="text-2xl font-bold text-slate-800">{stats.region}</p>
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
              <p className="text-2xl font-bold text-slate-800">{stats.venue}</p>
            </div>
          </div>
        </div>
      </div>

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
                    {role === 'all' ? '全部' : roleNames[role as UserRole]}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
                            src={user.avatar}
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
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`inline-flex items-center gap-1.5 text-sm ${
                            user.status === 'active' ? 'text-success-600' : 'text-slate-400'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${
                            user.status === 'active' ? 'bg-success-500' : 'bg-slate-300'
                          }`}></span>
                          {user.status === 'active' ? '正常' : '已停用'}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-slate-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                            title="删除"
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {editingUser ? '编辑用户' : '添加用户'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    用户名 <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-field w-full"
                    placeholder="请输入用户名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    姓名 <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field w-full"
                    placeholder="请输入姓名"
                  />
                </div>
              </div>
              
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    初始密码 <span className="text-danger-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input-field w-full pr-10"
                      placeholder="请设置初始密码"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
              
              {editingUser && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">
                    提示：编辑用户时不修改密码，如需重置密码请联系系统管理员
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  角色 <span className="text-danger-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(roleNames) as UserRole[]).map((role) => {
                    const rs = getRoleColor(role);
                    const RoleIcon = rs.icon;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData({ ...formData, role })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.role === role
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
              
              {formData.role === 'region' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    管辖区域 <span className="text-danger-500">*</span>
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="input-field w-full"
                  >
                    {Object.entries(regionNames).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {formData.role === 'venue' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    所属展馆 <span className="text-danger-500">*</span>
                  </label>
                  <select
                    value={formData.venueId}
                    onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                    className="input-field w-full"
                  >
                    {venues.map((venue) => (
                      <option key={venue.id} value={venue.id}>{venue.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  权限预览
                </label>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {rolePermissions[formData.role].map((perm, index) => (
                      <span key={index} className="px-2 py-1 bg-white text-slate-600 text-xs rounded-md border border-slate-200">
                        {perm}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    共 {rolePermissions[formData.role].length} 项权限
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
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
