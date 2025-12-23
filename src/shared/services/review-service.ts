import { httpService } from '@shared/services';
import Review, { Translation } from '../../types/review';

const reviewEndpoint = '/reviews';

export const createReview = async (
  studioId: string,
  reviewData: { rating: number; name?: Translation; comment?: Translation }
): Promise<Review> => {
  try {
    return await httpService.post(`${reviewEndpoint}/${studioId}`, reviewData);
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getReviewsByStudioId = async (studioId: string): Promise<Review[]> => {
  try {
    // GET /api/reviews/studio/:studioId
    return await httpService.get(`${reviewEndpoint}/studio/${studioId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateReview = async (
  reviewId: string,
  reviewData: { rating?: number; name?: Translation; comment?: Translation }
): Promise<Review> => {
  try {
    return await httpService.put(`${reviewEndpoint}/${reviewId}`, reviewData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    return await httpService.delete(`${reviewEndpoint}/${reviewId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
