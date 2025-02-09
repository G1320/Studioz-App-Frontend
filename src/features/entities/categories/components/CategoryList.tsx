import { GenericList } from '@shared/components';
import { CategoryPreview } from './CategoryPreview';
import { useMusicSubCategories } from '@shared/hooks';

export const CategoryList = () => {
  const musicSubCategories = useMusicSubCategories();

  const renderItem = (category: string) => <CategoryPreview category={category} />;

  return (
    <section className="category-list">
      <GenericList data={musicSubCategories} renderItem={renderItem} className="categories-list" />
    </section>
  );
};
