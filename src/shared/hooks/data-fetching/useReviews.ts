import { useQuery } from '@tanstack/react-query';
import { getReviewsByStudioId } from '@shared/services/review-service';
import Review from 'src/types/review';

export const useReviews = (studioId: string) => {
  return useQuery<Review[]>({
    queryKey: ['reviews', studioId],
    queryFn: () => getReviewsByStudioId(studioId),
    enabled: !!studioId
  });
};

