import { useState } from 'react';
import { Button } from '@shared/components';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useTranslation } from 'react-i18next';
import './CreateReviewForm/styles/_create-review-form.scss';

interface CreateReviewFormProps {
  studioId: string;
  onSubmit: (rating: number, comment?: string) => void;
  isLoading?: boolean;
  existingRating?: number;
  existingComment?: string;
}

export const CreateReviewForm: React.FC<CreateReviewFormProps> = ({
  onSubmit,
  isLoading = false,
  existingRating,
  existingComment
}) => {
  const { t } = useTranslation('common');
  const [rating, setRating] = useState<number>(existingRating || 0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(existingComment || '');

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, comment.trim() || undefined);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <form className="create-review-form" onSubmit={handleSubmit}>
      <div className="create-review-form__rating">
        <label className="create-review-form__label">{t('reviews.rating') || 'Rating'}</label>
        <div className="create-review-form__stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className="create-review-form__star-button"
              onClick={() => handleStarClick(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              aria-label={`Rate ${value} out of 5`}
            >
              {value <= displayRating ? (
                <StarIcon className="create-review-form__star create-review-form__star--filled" />
              ) : (
                <StarBorderIcon className="create-review-form__star" />
              )}
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="create-review-form__rating-value">
            {rating} {rating === 1 ? t('reviews.star') || 'star' : t('reviews.stars') || 'stars'}
          </span>
        )}
      </div>

      <div className="create-review-form__comment">
        <label htmlFor="review-comment" className="create-review-form__label">
          {t('reviews.comment') || 'Comment (optional)'}
        </label>
        <textarea
          id="review-comment"
          className="create-review-form__textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('reviews.comment_placeholder') || 'Share your experience...'}
          rows={4}
          maxLength={500}
        />
        <span className="create-review-form__char-count">{comment.length}/500</span>
      </div>

      <Button type="submit" className="create-review-form__submit" disabled={rating === 0 || isLoading}>
        {isLoading ? t('reviews.submitting') || 'Submitting...' : t('reviews.submit') || 'Submit Review'}
      </Button>
    </form>
  );
};
