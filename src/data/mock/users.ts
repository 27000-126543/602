import { User } from '@/types';

export const mockUsers: (User & { password: string })[] = [
  {
    id: 'u001',
    username: 'admin',
    password: '123456',
    name: '张总监',
    role: 'headquarters',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: 'u002',
    username: 'region_east',
    password: '123456',
    name: '李经理',
    role: 'region',
    region: 'east',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=east',
  },
  {
    id: 'u003',
    username: 'venue_sh',
    password: '123456',
    name: '王主管',
    role: 'venue',
    venueId: 'v001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shanghai',
  },
  {
    id: 'u004',
    username: 'region_south',
    password: '123456',
    name: '陈经理',
    role: 'region',
    region: 'south',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=south',
  },
  {
    id: 'u005',
    username: 'venue_gz',
    password: '123456',
    name: '刘主管',
    role: 'venue',
    venueId: 'v002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guangzhou',
  },
];

export const loginUser = (username: string, password: string, role: string): User | null => {
  const user = mockUsers.find(u => u.username === username && u.password === password && u.role === role);
  return user || null;
};

export const roleNames: Record<string, string> = {
  headquarters: '集团总部',
  region: '区域运营',
  venue: '会展中心',
};

export const regionNames: Record<string, string> = {
  north: '华北区',
  east: '华东区',
  south: '华南区',
  west: '西部区',
  central: '华中区',
};
