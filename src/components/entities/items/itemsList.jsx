import React from 'react';

import ItemPreview from './itemPreview';
import GenericList from '../../common/lists/genericList';
import { getLocalUser } from '../../../services/user-service';
import { useWishlists } from '../../../hooks/dataFetching/useWishlists';

const ItemsList = ({ items = null }) => {
  const user = getLocalUser();

  const { data: wishlists } = useWishlists(user?._id);

  const renderItem = (item) => <ItemPreview item={item} key={item.name} wishlists={wishlists} />;

  return (
    <section className="items">
      <GenericList data={items} renderItem={renderItem} className="items-list" />{' '}
    </section>
  );
};
export default ItemsList;
