import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import './styles/_studio-rating.scss';

interface StudioRatingProps {
  averageRating?: number | null;
  reviewCount?: number | null;
  size?: 'sm' | 'md';
  className?: string;
  showCount?: boolean;
  variant?: 'stars' | 'badge';
}

const MAX_STARS = 5;

const formatReviewCount = (count?: number | null) => {
  if (!count || count <= 0) return 'No reviews yet';
  if (count === 1) return '1 review';
  return `${count} reviews`;
};

export const StudioRating: React.FC<StudioRatingProps> = ({
  averageRating,
  reviewCount,
  size = 'md',
  className = '',
  variant = 'stars',
  showCount = variant !== 'badge'
}) => {
  const validRating = typeof averageRating === 'number' && !Number.isNaN(averageRating) ? averageRating : undefined;

  const displayRating = validRating ? Math.min(Math.max(validRating, 0), MAX_STARS) : undefined;
  const roundedHalfRating = displayRating ? Math.round(displayRating * 2) / 2 : undefined;

  const renderStars = () => {
    return Array.from({ length: MAX_STARS }).map((_, index) => {
      if (!roundedHalfRating) {
        return <StarBorderIcon key={index} className="studio-rating__star" />;
      }

      const diff = roundedHalfRating - index;

      if (diff >= 1) {
        return <StarIcon key={index} className="studio-rating__star studio-rating__star--filled" />;
      }

      if (diff === 0.5) {
        return <StarHalfIcon key={index} className="studio-rating__star studio-rating__star--filled" />;
      }

      return <StarBorderIcon key={index} className="studio-rating__star" />;
    });
  };

  const hasReviews = !!(reviewCount && reviewCount > 0);
  const summaryLabel =
    validRating && showCount && hasReviews
      ? `${displayRating?.toFixed(1)} · ${formatReviewCount(reviewCount)}`
      : hasReviews && showCount
        ? formatReviewCount(reviewCount)
        : null;

  const badgeLabel = displayRating ? displayRating.toFixed(1) : '—';
  const containerClasses = [
    'studio-rating',
    variant === 'stars' ? `studio-rating--${size}` : 'studio-rating--badge',
    className
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <div
      className={containerClasses}
      aria-label={
        validRating ? `Rated ${displayRating?.toFixed(1)} out of 5 from ${reviewCount || 0} reviews` : 'No reviews yet'
      }
    >
      {variant === 'badge' ? (
        <div className="studio-rating__badge">
          <StarIcon className="studio-rating__badge-icon" />
          <span className="studio-rating__badge-value">{badgeLabel}</span>
          {showCount && hasReviews && (
            <span className="studio-rating__badge-count">{formatReviewCount(reviewCount)}</span>
          )}
        </div>
      ) : (
        <>
          <div className="studio-rating__stars">{renderStars()}</div>
          {summaryLabel && <p className="studio-rating__summary">{summaryLabel}</p>}
        </>
      )}
    </div>
  );
};
