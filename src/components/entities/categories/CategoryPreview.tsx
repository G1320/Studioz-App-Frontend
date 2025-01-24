import { useLanguageNavigate } from '@shared/hooks/utils';
import { useCategories } from '@shared/hooks/index';

interface CategoryPreviewProps {
  pathPrefix?: string;
  category: string;
}

export const CategoryPreview: React.FC<CategoryPreviewProps> = ({ category, pathPrefix = 'studios' }) => {
  const langNavigate = useLanguageNavigate();
  const { getEnglishByDisplay } = useCategories();

  const handleClick = () => {
    const categoryKey = getEnglishByDisplay(category);
    langNavigate(`/${pathPrefix}/music/${categoryKey}`);
  };

  return (
    <article className=" category-preview" onClick={handleClick}>
      <span>{category}</span>
    </article>
  );
};
