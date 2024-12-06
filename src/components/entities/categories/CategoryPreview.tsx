import { useLanguageNavigate } from '@hooks/utils';

interface CategoryPreviewProps {
  category: string;
}

export const CategoryPreview: React.FC<CategoryPreviewProps> = ({ category }) => {
  const langNavigate = useLanguageNavigate();

  const handleClick = () => {
    langNavigate(`/studios/music/${category}`);
  };

  return (
    <article className=" category-preview" onClick={handleClick}>
      <span>{category}</span>
    </article>
  );
};
