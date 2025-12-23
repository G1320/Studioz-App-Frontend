import { useMutationHandler } from '@shared/hooks';
import { createReview, updateReview, deleteReview } from '@shared/services/review-service';
import Review, { Translation } from 'src/types/review';

export const useCreateReviewMutation = (studioId: string) => {
  return useMutationHandler<Review, { rating: number; name?: Translation; comment?: Translation }>({
    mutationFn: (reviewData) => createReview(studioId, reviewData),
    successMessage: 'Review submitted successfully',
    invalidateQueries: [
      { queryKey: 'reviews', targetId: studioId },
      { queryKey: 'studio', targetId: studioId }
    ]
  });
};

export const useUpdateReviewMutation = (reviewId: string, studioId: string) => {
  return useMutationHandler<Review, { rating?: number; name?: Translation; comment?: Translation }>({
    mutationFn: (reviewData) => updateReview(reviewId, reviewData),
    successMessage: 'Review updated successfully',
    invalidateQueries: [
      { queryKey: 'reviews', targetId: studioId },
      { queryKey: 'studio', targetId: studioId }
    ]
  });
};

export const useDeleteReviewMutation = (studioId: string) => {
  return useMutationHandler<void, string>({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    successMessage: 'Review deleted successfully',
    invalidateQueries: [
      { queryKey: 'reviews', targetId: studioId },
      { queryKey: 'studio', targetId: studioId }
    ]
  });
};

