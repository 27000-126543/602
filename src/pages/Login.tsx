import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';

const roles = [
  { id: 'headquarters', name: '集团总部', desc: '全国数据总览、终审权限', icon: '🏢' },
  { id: 'region', name: '区域运营', desc: '区域数据管理、二级审批', icon: '🏬' },
  { id: 'venue', name: '会展中心', desc: '展馆数据查看、一级审批', icon: '🏛️' },
];

const demoAccounts = [
  { role: 'headquarters', username: 'admin', password: '123456', name: '张总监' },
  { role: 'region', username: 'region_east', password: '123456', name: '李经理(华东区)' },
  { role: 'venue', username: 'venue_sh', password: '123456', name: '王主管(上海国家会展中心)' },
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('headquarters');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId as UserRole);
    const account = demoAccounts.find(a => a.role === roleId);
    if (account) {
      setUsername(account.username);
      setPassword(account.password);
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(username, password, selectedRole);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('用户名或密码错误，请重试');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-success-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
             backgroundSize: '40px 40px'
           }}>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Building2 className="w-9 h-9" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">会展智析</h1>
                <p className="text-white/70 text-lg mt-1">智能运营分析平台</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">全国会展运营数据<br/>一站式智能分析</h2>
            <p className="text-white/60 leading-relaxed mb-8">
              实时接入多源数据流，智能计算展位利用率、观众流量热度、参展商满意度，
              支持三级预警审批，助力高效决策。
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-success-300">✓</span>
                </div>
                <span className="text-white/80">全国会展热力图，实时监控运营状态</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-accent-300">✓</span>
                </div>
                <span className="text-white/80">智能预警系统，三级审批流程</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-300/30 rounded-lg flex items-center justify-center">
                  <span className="text-primary-200">✓</span>
                </div>
                <span className="text-white/80">自动生成运营报告，数据驱动决策</span>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">欢迎登录</h3>
            <p className="text-slate-500 mb-6">请选择您的身份并登录系统</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedRole === role.id
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-2">{role.icon}</div>
                  <div className="font-medium text-slate-800 text-sm">{role.name}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-tight">{role.desc}</div>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">用户名</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field pl-10"
                    placeholder="请输入用户名"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">密码</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="请输入密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    登录中...
                  </span>
                ) : '登 录'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-2">演示账号：</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p>总部：admin / 123456</p>
                <p>区域：region_east / 123456</p>
                <p>展馆：venue_sh / 123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
