import { useMutationHandler } from '@shared/hooks';
import { createReview, updateReview, deleteReview } from '@shared/services/review-service';
import Review, { Translation } from 'src/types/review';
import { useTranslation } from 'react-i18next';

export const useCreateReviewMutation = (studioId: string) => {
  const { t } = useTranslation('common');

  return useMutationHandler<Review, { rating: number; name?: Translation; comment?: Translation }>({
    mutationFn: (reviewData) => createReview(studioId, reviewData),
    successMessage: t('toasts.success.reviewSubmitted'),
    invalidateQueries: [
      { queryKey: 'reviews', targetId: studioId },
      { queryKey: 'studio', targetId: studioId }
    ]
  });
};

export const useUpdateReviewMutation = (reviewId: string, studioId: string) => {
  const { t } = useTranslation('common');

  return useMutationHandler<Review, { rating?: number; name?: Translation; comment?: Translation }>({
    mutationFn: (reviewData) => updateReview(reviewId, reviewData),
    successMessage: t('toasts.success.reviewUpdated'),
    invalidateQueries: [
      { queryKey: 'reviews', targetId: studioId },
      { queryKey: 'studio', targetId: studioId }
    ]
  });
};

export const useDeleteReviewMutation = (studioId: string) => {
  const { t } = useTranslation('common');

  return useMutationHandler<void, string>({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    successMessage: t('toasts.success.reviewDeleted'),
    invalidateQueries: [
      { queryKey: 'reviews', targetId: studioId },
      { queryKey: 'studio', targetId: studioId }
    ]
  });
};

