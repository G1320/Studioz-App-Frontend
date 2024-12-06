import { GenericList } from '@components/common';
import { musicSubCategories } from '@config/index';
import { CategoryPreview } from './CategoryPreview';

export const CategoryList = () => {
  const renderItem = (category: string) => <CategoryPreview category={category} />;

  return (
    <section>
      <GenericList data={musicSubCategories} renderItem={renderItem} className="categories-list" />
    </section>
  );
};
