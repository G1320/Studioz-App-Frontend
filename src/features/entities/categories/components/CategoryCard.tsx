import { useLanguageNavigate } from '@shared/hooks/utils';
import { useCategories } from '@shared/hooks';
import { useParams, useLocation } from 'react-router-dom';
import { getSubcategoryIcon } from '@shared/components/icons/CategoryIcons';
import '../styles/_category-card.scss';

interface CategoryCardProps {
  pathPrefix?: string;
  category: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, pathPrefix = 'studios' }) => {
  const langNavigate = useLanguageNavigate();
  const { getEnglishByDisplay } = useCategories();
  const params = useParams();
  const location = useLocation();

  const handleClick = () => {
    const categoryKey = getEnglishByDisplay(category);
    const searchParams = new URLSearchParams(location.search);
    const searchString = searchParams.toString();
    const basePath = `/${pathPrefix}/music`;

    if (isSelected) {
      langNavigate(`${basePath}${searchString ? `?${searchString}` : ''}`);
      return;
    }

    langNavigate(`${basePath}/${categoryKey}${searchString ? `?${searchString}` : ''}`);
  };

  // Check if this category is currently selected
  const categoryKey = getEnglishByDisplay(category);
  const subcategoryParam = pathPrefix === 'services' ? params.subCategory : params.subcategory;
  const isSelected = subcategoryParam === categoryKey;
  
  // Get icon component using centralized helper
  const IconComponent = getSubcategoryIcon(categoryKey);

  return (
    <article className={`category-card ${isSelected ? 'category-card--selected' : ''}`} onClick={handleClick}>
      <div className="category-card__icon">
        <IconComponent />
      </div>
      <span>{category}</span>
    </article>
  );
};

