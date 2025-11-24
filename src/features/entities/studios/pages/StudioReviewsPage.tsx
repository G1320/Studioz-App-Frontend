import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { StudioRating } from '@shared/components';
import { useReviews, useStudio } from '@shared/hooks';
import { CreateReviewForm, ReviewsList } from '@features/entities/reviews';
import { createReview } from '@shared/services/review-service';
import { useUserContext } from '@core/contexts';
import { toast } from 'sonner';

export const StudioReviewsPage: React.FC = () => {
  const { studioId = '' } = useParams();
  const { user } = useUserContext();
  const { data: studioResponse } = useStudio(studioId);
  const studio = studioResponse?.currStudio;
  const { data: reviews = [], refetch } = useReviews(studioId);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (rating: number, comment?: string) => {
    if (!studioId) {
      toast.error('Missing studio reference');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await createReview(studioId, { rating, comment });
      toast.success('Review submitted successfully');
      refetch();
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Failed to submit review. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!studioId) {
    return (
      <section className="studio-reviews-page">
        <p>Studio not found.</p>
      </section>
    );
  }

  return (
    <section className="studio-reviews-page">
      <header className="studio-reviews-page__header">
        <div>
          <h1>{studio?.name?.en || 'Studio Reviews'}</h1>
          {studio?.city && <p className="studio-reviews-page__location">{studio.city}</p>}
        </div>
        <StudioRating
          averageRating={studio?.averageRating}
          reviewCount={studio?.reviewCount}
          className="studio-reviews-page__rating"
        />
      </header>

      {user && (
        <CreateReviewForm studioId={studioId} onSubmit={handleReviewSubmit} isLoading={isSubmittingReview} />
      )}

      <ReviewsList reviews={reviews} studioId={studioId} />
    </section>
  );
};

