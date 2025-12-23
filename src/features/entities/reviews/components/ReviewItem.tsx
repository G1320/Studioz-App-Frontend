import { useTranslation } from 'react-i18next';
import Review from 'src/types/review';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import './ReviewItem/styles/_review-item.scss';

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const { t, i18n } = useTranslation('common');
  const currentLanguage = i18n.language as 'en' | 'he';

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      const starValue = index + 1;
      return starValue <= review.rating ? (
        <StarIcon key={index} className="review-item__star review-item__star--filled" />
      ) : (
        <StarBorderIcon key={index} className="review-item__star" />
      );
    });
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const locale = i18n.language === 'he' ? 'he-IL' : 'en-US';
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return dateObj.toLocaleDateString(locale, options);
    } catch {
      return '';
    }
  };

  const userName = review.user?.name || t('reviews.anonymous', 'Anonymous');
  const reviewName = review.name?.[currentLanguage] || review.name?.en;
  const reviewComment = review.comment?.[currentLanguage] || review.comment?.en;

  return (
    <article className="review-item">
      <div className="review-item__header">
        <div className="review-item__user-info">
          <div className="review-item__avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="review-item__user-details">
            <h4 className="review-item__user-name">{userName}</h4>
            <span className="review-item__date">{formatDate(review.createdAt)}</span>
          </div>
        </div>
        <div className="review-item__rating">{renderStars()}</div>
      </div>
      {reviewName && <h5 className="review-item__name">{reviewName}</h5>}
      {reviewComment && <p className="review-item__comment">{reviewComment}</p>}
    </article>
  );
};
