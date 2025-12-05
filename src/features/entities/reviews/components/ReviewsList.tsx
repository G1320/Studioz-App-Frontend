import { useTranslation } from 'react-i18next';
import Review from 'src/types/review';
import { ReviewItem } from './ReviewItem';
import './ReviewsList/styles/_reviews-list.scss';

interface ReviewsListProps {
  reviews: Review[];
  studioId?: string;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  const { t } = useTranslation('common');

  if (!reviews || reviews.length === 0) {
    return (
      <div className="reviews-list reviews-list--empty">
        <p className="reviews-list__empty-message">
          {t('reviews.empty', 'No reviews yet. Be the first to review this studio!')}
        </p>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      <h3 className="reviews-list__title">
        {t('reviews.listTitle', 'Reviews')} ({reviews.length})
      </h3>
      <div className="reviews-list__items">
        {reviews.map((review) => (
          <ReviewItem key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
};
