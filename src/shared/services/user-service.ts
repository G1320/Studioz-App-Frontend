import { httpService } from '@services/http-service';
import { sanitizeUserObject, parseJSON, stringifyJSON } from '@utils/index';
import { User, Studio } from 'src/types/index';

const userEndpoint = '/users';

export const getLocalUser = (): User | null => parseJSON('user', null);
export const setLocalUser = (user: User): void => stringifyJSON('user', sanitizeUserObject(user));

export const createUser = async (userData: User): Promise<User> => {
  try {
    return await httpService.post(userEndpoint, userData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserBySub = async (sub: string): Promise<User> => {
  try {
    return await httpService.get(`${userEndpoint}/${sub}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getUserByMerchantId = async (merchantId: string): Promise<User> => {
  try {
    return await httpService.get(`${userEndpoint}/${merchantId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserStudios = async (userId: string): Promise<Studio[]> => {
  try {
    return await httpService.get(`${userEndpoint}/my-studios/${userId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addStudioToUser = async (userId: string, studioId: string): Promise<Studio> => {
  try {
    return await httpService.post(`${userEndpoint}/${userId}/add-studio/${studioId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeStudioFromUser = async (userId: string, studioId: string): Promise<Studio> => {
  try {
    return await httpService.post(`${userEndpoint}/${userId}/remove-studio/${studioId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    return await httpService.get(userEndpoint);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    return await httpService.put(`${userEndpoint}/${userId}`, userData);
  } catch (error) {
    console.error('Failed to update user', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<null> => {
  try {
    return await httpService.delete<null>(`${userEndpoint}/${userId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
