import '../styles/_index.scss';
import { GenericList } from '@shared/components';
import { CategoryCard } from './CategoryCard';
import { useMusicSubCategories } from '@shared/hooks';

export const CategoryList = () => {
  const musicSubCategories = useMusicSubCategories();

  const renderItem = (category: string) => <CategoryCard category={category} />;

  return (
    <section className="category-list">
      <GenericList data={musicSubCategories} renderItem={renderItem} className="categories-list" />
    </section>
  );
};
