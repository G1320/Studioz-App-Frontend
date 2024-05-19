import React from 'react';

import ItemPreview from './itemPreview';
import GenericList from '../../common/lists/genericList';
import { useAddItemToCartMutation } from '../../../hooks/mutations/cart/cartMutations';
import { getLocalUser } from '../../../services/user-service';
import { useWishlists } from '../../../hooks/dataFetching/useWishlists';
import { useOfflineCartContext } from '../../../contexts/OfflineCartContext';

const ItemsList = ({ items = null }) => {
  const user = getLocalUser();
  const { offlineCart: offlineCartContext, setOfflineCart: setOfflineCartContext } =
    useOfflineCartContext();

  const { data: wishlists } = useWishlists(user?._id);

  const addItemToCartMutation = useAddItemToCartMutation(user?._id);
  const handleAddItemToCart = (item) => {
    if (!user) {
      setOfflineCartContext([...offlineCartContext, item]);
    }
    addItemToCartMutation.mutate(item);
  };

  const renderItem = (item) => (
    <ItemPreview
      item={item}
      key={item.name}
      onAddItemToCart={handleAddItemToCart}
      wishlists={wishlists}
    />
  );

  return (
    <section className="items">
      <GenericList data={items} renderItem={renderItem} className="items-list" />{' '}
    </section>
  );
};
export default ItemsList;
