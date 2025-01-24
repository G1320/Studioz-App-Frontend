import User from './user';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface LoginCredentials {
  sub: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
