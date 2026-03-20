
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
