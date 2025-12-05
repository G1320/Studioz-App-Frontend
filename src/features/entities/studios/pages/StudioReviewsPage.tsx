import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StudioRating } from '@shared/components';
import { useReviews, useStudio, useCreateReviewMutation } from '@shared/hooks';
import { CreateReviewForm, ReviewsList } from '@features/entities/reviews';
import { useUserContext } from '@core/contexts';

const StudioReviewsPage: React.FC = () => {
  const { studioId = '' } = useParams();
  const { user } = useUserContext();
  const { t } = useTranslation('common');
  const { data: studioResponse } = useStudio(studioId);
  const studio = studioResponse?.currStudio;
  const { data: reviews = [] } = useReviews(studioId);
  const createReviewMutation = useCreateReviewMutation(studioId);

  const handleReviewSubmit = (rating: number, comment?: string) => {
    if (!studioId) {
      return;
    }
    createReviewMutation.mutate({ rating, comment });
  };

  if (!studioId) {
    return (
      <section className="studio-reviews-page">
        <p>{t('reviews.studioNotFound', 'Studio not found.')}</p>
      </section>
    );
  }

  return (
    <section className="studio-reviews-page">
      <header className="studio-reviews-page__header">
        <div>
          <h1>{studio?.name?.en || t('reviews.title', 'Studio Reviews')}</h1>
          {studio?.city && <p className="studio-reviews-page__location">{studio.city}</p>}
        </div>
        <StudioRating
          averageRating={studio?.averageRating}
          reviewCount={studio?.reviewCount}
          className="studio-reviews-page__rating"
        />
      </header>

      {user && (
        <CreateReviewForm
          studioId={studioId}
          onSubmit={handleReviewSubmit}
          isLoading={createReviewMutation.isPending}
        />
      )}

      <ReviewsList reviews={reviews} studioId={studioId} />
    </section>
  );
};

export default StudioReviewsPage;

