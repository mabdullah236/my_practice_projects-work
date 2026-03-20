
import { User, AuthResponse } from '../types';

const USERS_KEY = 'secureauth_users';
const TOKEN_KEY = 'secureauth_token';
const CURRENT_USER_KEY = 'secureauth_current_user';

export const authService = {
  // Simulate a signup
  signup: async (userData: any): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const existingUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userExists = existingUsers.some((u: any) => u.email === userData.email);
    
    if (userExists) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
    };

    const users = [...existingUsers, { ...newUser, password: userData.password }];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const token = btoa(JSON.stringify({ id: newUser.id, exp: Date.now() + 3600000 }));
    authService.setSession(token, newUser);

    return { user: newUser, token };
  },

  // Simulate a login
  login: async (credentials: any): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = existingUsers.find((u: any) => u.email === credentials.email && u.password === credentials.password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password, ...userWithoutPassword } = user;
    const token = btoa(JSON.stringify({ id: user.id, exp: Date.now() + 3600000 }));
    
    authService.setSession(token, userWithoutPassword);

    return { user: userWithoutPassword, token };
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  setSession: (token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  getSession: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    if (!token || !userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return { token, user };
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    const session = authService.getSession();
    if (!session) return false;
    
    try {
      const payload = JSON.parse(atob(session.token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }
};
