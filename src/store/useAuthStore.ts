import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { loginUser, roleNames, regionNames } from '@/data/mock/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  getRoleName: () => string;
  getRegionName: () => string;
  hasPermission: (permission: string) => boolean;
}

const permissions: Record<UserRole, string[]> = {
  headquarters: ['dashboard', 'venue_detail', 'alerts', 'alerts_approve_level3', 'contracts', 'reports', 'permissions'],
  region: ['dashboard', 'venue_detail', 'alerts', 'alerts_approve_level2', 'contracts', 'reports'],
  venue: ['dashboard', 'venue_detail', 'alerts', 'alerts_approve_level1', 'contracts', 'reports'],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: (username, password, role) => {
        const user = loginUser(username, password, role);
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      getRoleName: () => {
        const user = get().user;
        if (!user) return '';
        return roleNames[user.role] || '';
      },
      
      getRegionName: () => {
        const user = get().user;
        if (!user || !user.region) return '';
        return regionNames[user.region] || '';
      },
      
      hasPermission: (permission: string) => {
        const user = get().user;
        if (!user) return false;
        return permissions[user.role]?.includes(permission) || false;
      },
    }),
    {
      name: 'expo-auth-storage',
    }
  )
);
