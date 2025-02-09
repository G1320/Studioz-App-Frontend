import { httpService } from '@shared/services';
import Cookies from 'js-cookie';
import { sanitizeUserObject } from '@shared/utils';
import { LoginCredentials, AuthResponse, User } from 'src/types/index';
import { sendWelcomeEmail } from '@shared/services';

const authEndpoint = '/auth';

export const register = async (userData: Partial<User>): Promise<User> => {
  try {
    const { accessToken, user } = await httpService.post<AuthResponse>(`${authEndpoint}/register`, userData);
    if (user && accessToken) {
      localStorage.setItem('user', JSON.stringify(sanitizeUserObject(user)));
      Cookies.set('accessToken', accessToken, { expires: 1 / 96 });
      await sendWelcomeEmail(user?.email || '', user?.name || '');
    }

    return user;
  } catch (error: any) {
    console.error('Registration failed', error);
    if (error.response && error.response.status === 400) {
      console.error('A user with that email or username already exists.');
    }
    throw error;
  }
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const { user, accessToken } = await httpService.post<AuthResponse>(`${authEndpoint}/login`, credentials);
    if (user && accessToken) {
      localStorage.setItem('user', JSON.stringify(sanitizeUserObject(user)));
      Cookies.set('accessToken', accessToken, { expires: 1 / 96 });
    }
    return user;
  } catch (error: unknown) {
    console.error('Login failed', error);
    throw error;
  }
};

export const refreshAccessToken = async (): Promise<{ accessToken: string }> => {
  try {
    const { accessToken } = await httpService.post<{ accessToken: string }>(`${authEndpoint}/refresh-token`);
    Cookies.set('accessToken', accessToken, { expires: 1 / 96 });
    return { accessToken };
  } catch (error: unknown) {
    console.error('Refresh token failed', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await httpService.post<void>(`${authEndpoint}/logout`);
    localStorage.removeItem('user');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  } catch (error: unknown) {
    console.error('Logout failed', error);
    throw error;
  }
};
