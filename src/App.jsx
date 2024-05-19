import { Routes, Route } from 'react-router-dom';
import CreateStudio from './components/entities/studios/createStudio';
import StudioDetails from './components/entities/studios/studioDetails';
import Header from './components/layout/header/header';

import Home from './components/pages/home/home';
import Store from './components/pages/store/store';
import Studios from './components/pages/studios/studios';
import Services from './components/pages/services/services';
import WishLists from './components/pages/wishlists/wishlists';
import CreateUser from './components/user/create-user';
import ItemDetails from './components/entities/items/itemDetails';
import CreateItem from './components/entities/items/createItem';
import EditItem from './components/entities/items/editItem';
import WishlistDetails from './components/entities/wishlists/wishlistDetails';
import CreateWishlist from './components/entities/wishlists/createWishlist';
import EditWishlist from './components/entities/wishlists/editWishlist';
import EditStudio from './components/entities/studios/editStudio';
import CartDetails from './components/entities/cart/cartDetails';
import { useItems } from './hooks/dataFetching/useItems';
import { useStudios } from './hooks/dataFetching/useStudios';

import { Toaster } from 'sonner';
import { useUserContext } from './contexts/UserContext';
import { useOfflineCartContext } from './contexts/OfflineCartContext';

function App() {
  const user = useUserContext();
  const { data: items } = useItems();
  const { data: studios } = useStudios();
  const { offlineCart: offlineCartItemsIds } = useOfflineCartContext();

  // Function to count occurrences of each ID in offlineCartItemsIds
  const idCountMap = offlineCartItemsIds.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  // Filter items array based on offlineCartItemsIds
  const filteredItems = items
    ? items.flatMap((item) => Array.from({ length: idCountMap[item._id] || 0 }, () => item))
    : [];

  return (
    <>
      <Header filteredItems={filteredItems} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home studios={studios} items={items} />} />
          <Route path="/store" element={<Store items={items} />} />
          <Route path="/studio/:studioId" element={<StudioDetails items={items} />} />
          <Route path="/studios/:category?/:subcategory?" element={<Studios studios={studios} />} />
          <Route path="/services/:category?/:subcategory?" element={<Services items={items} />} />
          <Route path="/wishlists" element={<WishLists />} />
          <Route path="/wishlists/:wishlistId" element={<WishlistDetails items={items} />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/create-item/:studioName/:studioId" element={<CreateItem studios={studios} />} />
          <Route path="/edit-item/:itemId" element={<EditItem />} />
          <Route path="/edit-studio/:studioId" element={<EditStudio studios={studios} />} />
          <Route path="/create-studio" element={<CreateStudio />} />
          <Route path="/edit-wishlist/:wishlistId" element={<EditWishlist />} />
          <Route path="/create-wishlist" element={<CreateWishlist />} />
          <Route path="/item/:itemId" element={<ItemDetails />} />
          <Route path="/cart" element={<CartDetails user={user} filteredItems={filteredItems} />} />
        </Routes>
      </main>
      <Toaster richColors />
    </>
  );
}

export default App;
