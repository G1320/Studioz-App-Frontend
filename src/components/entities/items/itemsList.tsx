import React from 'react';
import ItemPreview from './itemPreview';
import GenericList from '../../common/lists/genericList';
import { getLocalUser } from '../../../services/user-service';
import { useWishlists } from '../../../hooks/index';

import { Item } from '../../../types/index';

interface ItemListProps {
  items?: Item[];
  className?: string;
}

const ItemsList: React.FC<ItemListProps> = ({ items = [], className }) => {
  const user = getLocalUser();
  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const renderItem = (item: Item) => (
    <ItemPreview item={item} key={item.name} wishlists={wishlists} />
  );

  return (
    <section className={`items ${className}`}>
      <GenericList data={items} renderItem={renderItem} className="items-list" />
    </section>
  );
};

export default ItemsList;
