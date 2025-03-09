import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserRole = 'student' | 'teacher' | 'admin';

interface User {
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const mockUsers = [
  { email: 'admin@supnum.mr', password: '12344321', role: 'admin' as UserRole },
  { email: 'teacher@supnum.mr', password: '12344321', role: 'teacher' as UserRole }
];

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string, role: UserRole) => {
        // For admin and teacher, check against mock users
        if (role === 'admin' || role === 'teacher') {
          const user = mockUsers.find(u => u.email === email && u.password === password && u.role === role);
          if (user) {
            set({
              isAuthenticated: true,
              user: {
                email: user.email,
                role: user.role
              }
            });
            return;
          }
        }
        
        // For students, we would typically validate against an API
        // For now, just check if the email ends with @student.supnum.mr
        if (role === 'student' && email.endsWith('@student.supnum.mr') && password.length >= 8) {
          set({
            isAuthenticated: true,
            user: {
              email,
              role: 'student'
            }
          });
          return;
        }

        throw new Error('Invalid credentials');
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null
        });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

export default useAuthStore; 