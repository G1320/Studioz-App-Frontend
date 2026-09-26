import { httpService } from '@shared/services';
import { parseJSON, stringifyJSON } from '@shared/utils';
import { Studio, StudioResponse, Item } from '../../types/index';

const studioEndpoint = '/studios';

export const setLocalSelectedStudio = (studio: Studio) => stringifyJSON('selectedStudio', studio);
export const getLocalSelectedStudio = (studio: Studio) => parseJSON('selectedStudio', studio);

export const createStudio = async (userId: string, studioData: Studio): Promise<Studio> => {
  try {
    return await httpService.post(`${studioEndpoint}/${userId}/create-studio`, studioData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStudios = async (params = {}): Promise<Studio[]> => {
  try {
    return await httpService.get(studioEndpoint, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStudioById = async (studioId: string): Promise<StudioResponse> => {
  try {
    return await httpService.get(`${studioEndpoint}/${studioId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateStudio = async (studioId: string, updatedData: Studio): Promise<Studio> => {
  try {
    const payload = sanitizeStudioWritePayload(updatedData);
    return await httpService.put(`${studioEndpoint}/${studioId}`, payload);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/** Strip Mongo subdoc _ids so GET→PUT echoes never fail Joi on studioAvailability._id */
function sanitizeStudioWritePayload(data: Studio): Studio {
  const payload = { ...data } as Studio & { studioAvailability?: { days?: string[]; times?: Array<{ start: string; end: string; _id?: string }> } };
  if (payload.studioAvailability) {
    payload.studioAvailability = {
      days: payload.studioAvailability.days,
      times: (payload.studioAvailability.times || []).map(({ start, end }) => ({ start, end }))
    };
  }
  return payload;
}

/** Partial studio update for manage-hub section saves (bypasses create Joi). */
export const patchStudio = async (
  studioId: string,
  patch: Partial<Studio>
): Promise<Studio> => {
  try {
    return await httpService.patch(`${studioEndpoint}/${studioId}`, patch);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteStudio = async (studioId: string): Promise<Studio> => {
  try {
    return await httpService.delete(`${studioEndpoint}/${studioId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateStudioItem = async (studioId: string, item: Item): Promise<Item> => {
  try {
    return await httpService.put<Item>(`${studioEndpoint}/${studioId}/item`, { item });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const toggleStudioActive = async (studioId: string, active: boolean): Promise<Studio> => {
  try {
    return await httpService.patch<Studio>(`${studioEndpoint}/${studioId}`, { active });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const toggleItemActive = async (studioId: string, itemId: string, active: boolean): Promise<Item> => {
  try {
    return await httpService.patch<Item>(`${studioEndpoint}/${studioId}/items/${itemId}`, { active });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
