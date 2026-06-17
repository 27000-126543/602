import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface UserWithPassword extends User {
  password: string;
}

interface UserStore {
  users: UserWithPassword[];
  addUser: (user: Omit<UserWithPassword, 'id' | 'avatar'> & { status: 'active' | 'disabled' }) => UserWithPassword;
  updateUser: (id: string, updates: Partial<Omit<UserWithPassword, 'id'>>) => boolean;
  deleteUser: (id: string) => boolean;
  toggleUserStatus: (id: string) => boolean;
  getUserByCredentials: (username: string, password: string, role: string) => User | null;
  getUserById: (id: string) => UserWithPassword | undefined;
}

const initialUsers: UserWithPassword[] = [
  {
    id: 'u001',
    username: 'admin',
    password: '123456',
    name: '张总监',
    role: 'headquarters',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    status: 'active',
  },
  {
    id: 'u002',
    username: 'region_east',
    password: '123456',
    name: '李经理',
    role: 'region',
    region: 'east',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=east',
    status: 'active',
  },
  {
    id: 'u003',
    username: 'venue_sh',
    password: '123456',
    name: '王主管',
    role: 'venue',
    venueId: 'v001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shanghai',
    status: 'active',
  },
  {
    id: 'u004',
    username: 'region_south',
    password: '123456',
    name: '陈经理',
    role: 'region',
    region: 'south',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=south',
    status: 'active',
  },
  {
    id: 'u005',
    username: 'venue_gz',
    password: '123456',
    name: '刘主管',
    role: 'venue',
    venueId: 'v002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guangzhou',
    status: 'active',
  },
  {
    id: 'u006',
    username: 'region_north',
    password: '123456',
    name: '赵经理',
    role: 'region',
    region: 'north',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=north',
    status: 'active',
  },
  {
    id: 'u007',
    username: 'venue_cd',
    password: '123456',
    name: '孙主管',
    role: 'venue',
    venueId: 'v005',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chengdu',
    status: 'disabled',
  },
  {
    id: 'u008',
    username: 'venue_wh',
    password: '123456',
    name: '周主管',
    role: 'venue',
    venueId: 'v006',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wuhan',
    status: 'active',
  },
];

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      
      addUser: (userData) => {
        const newUser: UserWithPassword = {
          ...userData,
          id: `u${Date.now()}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
        };
        set({ users: [...get().users, newUser] });
        return newUser;
      },
      
      updateUser: (id, updates) => {
        const users = get().users;
        const index = users.findIndex(u => u.id === id);
        if (index < 0) return false;
        
        const newUsers = [...users];
        newUsers[index] = { ...newUsers[index], ...updates };
        set({ users: newUsers });
        return true;
      },
      
      deleteUser: (id) => {
        const users = get().users;
        const filtered = users.filter(u => u.id !== id);
        if (filtered.length === users.length) return false;
        set({ users: filtered });
        return true;
      },
      
      toggleUserStatus: (id) => {
        const users = get().users;
        const index = users.findIndex(u => u.id === id);
        if (index < 0) return false;
        
        const newUsers = [...users];
        newUsers[index] = {
          ...newUsers[index],
          status: newUsers[index].status === 'active' ? 'disabled' : 'active',
        };
        set({ users: newUsers });
        return true;
      },
      
      getUserByCredentials: (username, password, role) => {
        const user = get().users.find(
          u => u.username === username && u.password === password && u.role === role && u.status === 'active'
        );
        if (!user) return null;
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      },
      
      getUserById: (id) => {
        return get().users.find(u => u.id === id);
      },
    }),
    {
      name: 'user-store',
    }
  )
);
