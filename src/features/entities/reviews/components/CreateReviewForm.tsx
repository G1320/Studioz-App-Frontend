import { useState } from 'react';
import { Button } from '@shared/components';
import { StarIcon, StarBorderIcon } from '@shared/components/icons';
import { useTranslation } from 'react-i18next';
import { Translation } from 'src/types/review';
import './CreateReviewForm/styles/_create-review-form.scss';

interface CreateReviewFormProps {
  studioId: string;
  onSubmit: (rating: number, name?: Translation, comment?: Translation) => void;
  isLoading?: boolean;
  existingRating?: number;
  existingName?: Translation;
  existingComment?: Translation;
}

export const CreateReviewForm: React.FC<CreateReviewFormProps> = ({
  onSubmit,
  isLoading = false,
  existingRating,
  existingName,
  existingComment
}) => {
  const { t } = useTranslation('common');
  const [rating, setRating] = useState<number>(existingRating || 0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [nameEn, setNameEn] = useState<string>(existingName?.en || '');
  const [nameHe, setNameHe] = useState<string>(existingName?.he || '');
  const [commentEn, setCommentEn] = useState<string>(existingComment?.en || '');
  const [commentHe, setCommentHe] = useState<string>(existingComment?.he || '');

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      const name: Translation | undefined = (nameEn.trim() || nameHe.trim()) 
        ? { en: nameEn.trim() || undefined, he: nameHe.trim() || undefined }
        : undefined;
      const comment: Translation | undefined = (commentEn.trim() || commentHe.trim())
        ? { en: commentEn.trim() || undefined, he: commentHe.trim() || undefined }
        : undefined;
      onSubmit(rating, name, comment);
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
              aria-label={t('reviews.rateAriaLabel', `Rate ${value} out of 5`, { value })}
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

      <div className="create-review-form__name">
        <label htmlFor="review-name-en" className="create-review-form__label">
          {t('reviews.name') || 'Review Title (optional)'} 🇺🇸
        </label>
        <input
          id="review-name-en"
          type="text"
          className="create-review-form__input"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder={t('reviews.name_placeholder') || 'Enter review title in English...'}
          maxLength={100}
        />
        <label htmlFor="review-name-he" className="create-review-form__label">
          {t('reviews.name') || 'Review Title (optional)'} 🇮🇱
        </label>
        <input
          id="review-name-he"
          type="text"
          className="create-review-form__input"
          value={nameHe}
          onChange={(e) => setNameHe(e.target.value)}
          placeholder={t('reviews.name_placeholder') || 'Enter review title in Hebrew...'}
          maxLength={100}
        />
      </div>

      <div className="create-review-form__comment">
        <label htmlFor="review-comment-en" className="create-review-form__label">
          {t('reviews.comment') || 'Comment (optional)'} 🇺🇸
        </label>
        <textarea
          id="review-comment-en"
          className="create-review-form__textarea"
          value={commentEn}
          onChange={(e) => setCommentEn(e.target.value)}
          placeholder={t('reviews.comment_placeholder') || 'Share your experience in English...'}
          rows={4}
          maxLength={500}
        />
        <span className="create-review-form__char-count">{commentEn.length}/500</span>
        <label htmlFor="review-comment-he" className="create-review-form__label">
          {t('reviews.comment') || 'Comment (optional)'} 🇮🇱
        </label>
        <textarea
          id="review-comment-he"
          className="create-review-form__textarea"
          value={commentHe}
          onChange={(e) => setCommentHe(e.target.value)}
          placeholder={t('reviews.comment_placeholder') || 'Share your experience in Hebrew...'}
          rows={4}
          maxLength={500}
        />
        <span className="create-review-form__char-count">{commentHe.length}/500</span>
      </div>

      <Button type="submit" className="create-review-form__submit" disabled={rating === 0 || isLoading}>
        {isLoading ? t('reviews.submitting') || 'Submitting...' : t('reviews.submit') || 'Submit Review'}
      </Button>
    </form>
  );
};
