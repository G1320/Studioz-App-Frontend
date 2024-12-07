import { GenericList } from '@components/common';
import { CategoryPreview } from './CategoryPreview';
import { useMusicSubCategories } from '@hooks/utils/useMusicSubcategories';

export const CategoryList = () => {
  const musicSubCategories = useMusicSubCategories();

  const renderItem = (category: string) => <CategoryPreview category={category} />;

  return (
    <section className="category-list">
      <GenericList data={musicSubCategories} renderItem={renderItem} className="categories-list" />
    </section>
  );
};
