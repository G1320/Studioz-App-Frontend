import Axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { refreshAccessToken } from '@/services';

const BASE_URL:string =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://studioz-backend.onrender.com/api'
    : 'http://localhost:3003/api';

const axios = Axios.create({
  withCredentials: true,
});

export const httpService = {
  get: <T>(endpoint: string, data: unknown = null): Promise<T> => ajax<T>(endpoint, 'GET', data),
  post: <T>(endpoint: string, data: unknown = null): Promise<T> => ajax<T>(endpoint, 'POST', data),
  put: <T>(endpoint: string, data: unknown = null): Promise<T> => ajax<T>(endpoint, 'PUT', data),
  delete: <T>(endpoint: string, data: unknown = null): Promise<T> => ajax<T>(endpoint, 'DELETE', data),
};

async function ajax<T>(endpoint: string, method = 'GET', data: unknown = null): Promise<T> {
  try {
    const accessToken = await getAccessToken();
    setAuthorizationHeader(accessToken as string);
    // Building the request and returning the response data
    return (
      await axios({ url: `${BASE_URL}${endpoint}`, method, data, params: method === 'GET' && data })
    ).data;
  } catch (err) {
    // Retrying the request if 401 Unauthorized
    if (isAxiosError(err) && err.response && err.response.status === 401) {
      try {
        const refreshedToken = await refreshAccessToken();
        if (refreshedToken) return ajax(endpoint, method, data);
      } catch (refreshError) {
        console.error('Failed to refresh token', refreshError);
        sessionStorage.clear();
        localStorage.clear();
        // window.location.assign('/');
        throw refreshError;
      }
    }
    throw err;
  }
}

async function getAccessToken() {
  let accessToken = Cookies.get('accessToken');
  if (!accessToken) return null;

  const decodedToken: JwtPayload = jwtDecode<JwtPayload>(accessToken);
  
  if (!decodedToken.exp || decodedToken.exp < Date.now() / 1000) {
    try {
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken.accessToken) {
        accessToken = refreshedToken.accessToken;
      } else {
        throw new Error('Failed to get new access token');
      }
    } catch (refreshError) {
      console.error('Failed to refresh token', refreshError);
      throw refreshError;
    }
  }
  return accessToken;
}

function setAuthorizationHeader(accessToken:string) {
  if (accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
}

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}
