import { httpService } from './http-service';
import { parseJSON, stringifyJSON } from '../utils/storageUtils';

const studioEndpoint = '/studios';

export const setLocalSelectedStudio = (studio) => stringifyJSON('selectedStudio', studio);
export const getLocalSelectedStudio = (studio) => parseJSON('selectedStudio', studio);

export const createStudio = async (userId, studioData) => {
  try {
    return await httpService.post(`${studioEndpoint}/${userId}/create-studio`, studioData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStudioById = async (studioId) => {
  try {
    return await httpService.get(`${studioEndpoint}/${studioId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStudios = async (params = {}) => {
  try {
    return await httpService.get(studioEndpoint, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateStudio = async (studioId, updatedData) => {
  try {
    return await httpService.put(`${studioEndpoint}/${studioId}`, updatedData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteStudio = async (studioId) => {
  try {
    return await httpService.delete(`${studioEndpoint}/${studioId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStudioItems = async (studioId) => {
  try {
    return await httpService.get(`${studioEndpoint}/${studioId}/items`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateStudioItem = async (studioId, item) => {
  try {
    return await httpService.put(`${studioEndpoint}/${studioId}/item`, { item });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
