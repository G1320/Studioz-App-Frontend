import { useLanguageNavigate } from '@hooks/utils';

interface CategoryPreviewProps {
  pathPrefix?: string;
  category: string;
}

export const CategoryPreview: React.FC<CategoryPreviewProps> = ({ category, pathPrefix = 'studios' }) => {
  const langNavigate = useLanguageNavigate();

  const handleClick = () => {
    langNavigate(`/${pathPrefix}/music/${category}`);
  };

  return (
    <article className=" category-preview" onClick={handleClick}>
      <span>{category}</span>
    </article>
  );
};
