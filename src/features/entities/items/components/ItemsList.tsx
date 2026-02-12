import { ItemCard } from './ItemCard';
import { EmptyState, GenericList } from '@shared/components';
import { useLanguageNavigate } from '@shared/hooks/utils/useLangNavigation';
import { getLocalUser } from '@shared/services';
import { useWishlists } from '@shared/hooks';
import { useTranslation } from 'react-i18next';
import { Item } from 'src/types/index';
import { useModal } from '@core/contexts';

interface ItemListProps {
  items?: Item[];
  className?: string;
  hasFilters?: boolean;
}

export const ItemsList: React.FC<ItemListProps> = ({ items = [], className = '', hasFilters = false }) => {
  const user = getLocalUser();
  const { data: wishlists = [] } = useWishlists(user?._id || '');
  const { t } = useTranslation('services');
  const langNavigate = useLanguageNavigate();

  const { openModal } = useModal();

  const handleItemClick = (item: Item) => {
    openModal(item);
  };

  // const renderItem = (item: Item) => <ItemCard item={item} key={item.name} wishlists={wishlists} />;
  const renderItem = (item: Item) => (
    <div onClick={() => handleItemClick(item)} key={item._id}>
      <ItemCard item={item} wishlists={wishlists} />
    </div>
  );

  const containerClassName = ['items', className].filter(Boolean).join(' ');

  if (!items.length) {
    return (
      <section className={`${containerClassName} items--empty`.trim()}>
        <EmptyState
          icon="🎵"
          title={hasFilters ? t('emptyStates.noMatchingFilters') : t('emptyStates.noServices')}
          subtitle={
            hasFilters ? t('emptyStates.tryDifferentFilters') : t('emptyStates.discoverServices')
          }
          actionLabel={t('emptyStates.browseServices')}
          onAction={() => langNavigate('/services')}
        />
      </section>
    );
  }

  return (
    <section className={containerClassName}>
      <GenericList data={items} renderItem={renderItem} className="items-list" />
    </section>
  );
};
