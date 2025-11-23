import Review from 'src/types/review';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import './ReviewItem/styles/_review-item.scss';

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
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
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return dateObj.toLocaleDateString('en-US', options);
    } catch {
      return '';
    }
  };

  const userName = review.user?.name || 'Anonymous';

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
      {review.comment && <p className="review-item__comment">{review.comment}</p>}
    </article>
  );
};
