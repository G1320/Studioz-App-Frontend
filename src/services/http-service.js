import Axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { refreshAccessToken } from './auth-service';

const BASE_URL =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://studios-app-backend.onrender.com/api'
    : 'http://localhost:3003/api';

const axios = Axios.create({
  withCredentials: true,
});

export const httpService = {
  get: (endpoint, data) => ajax(endpoint, 'GET', data),
  post: (endpoint, data) => ajax(endpoint, 'POST', data),
  put: (endpoint, data) => ajax(endpoint, 'PUT', data),
  delete: (endpoint, data) => ajax(endpoint, 'DELETE', data),
};

async function ajax(endpoint, method = 'GET', data = null) {
  try {
    const accessToken = await getAccessToken();
    setAuthorizationHeader(accessToken);

    // Building the request and returning the response data
    return (
      await axios({ url: `${BASE_URL}${endpoint}`, method, data, params: method === 'GET' && data })
    ).data;
  } catch (err) {
    // Retrying the request if 401 Unauthorized
    if (err.response && err.response.status === 401) {
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

  const decodedToken = jwtDecode(accessToken);
  if (decodedToken.exp < Date.now() / 1000) {
    try {
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        accessToken = refreshedToken;
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

function setAuthorizationHeader(accessToken) {
  if (accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
}
