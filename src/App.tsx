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
import { useOfflineCartContext } from './contexts/OfflineCartContext';
// import Footer from './components/layout/footer/footer';

function App() {
  const { data: items } = useItems();
  const { data: studios } = useStudios();
  const { offlineCartContext: offlineCart  } = useOfflineCartContext();

  //Function to count occurrences of each ID in offlineCartItemsIds
  const offlineCartIdCountMap = offlineCart?.items.reduce<{ [key: string]: number }>((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  // Filter items array based on offlineCartItemsIds
  const offlineCartFilteredItems = items
  ? items?.flatMap((item) => Array.from({ length: offlineCartIdCountMap[item._id] || 0 }, () => item))
  : [];

  return (
    <>
      <Header filteredItems={offlineCartFilteredItems} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home studios={studios || []} items={items || []} />} />
          <Route path="/store" element={<Store items={items ||[]} />} />
          <Route path="/studio/:studioId" element={<StudioDetails items={items ||[]} />} />
          <Route path="/studios/:category?/:subcategory?" element={<Studios studios={studios ||[]} />} />
          <Route path="/services/:category?/:subcategory?" element={<Services items={items ||[]} />} />
          <Route path="/wishlists" element={<WishLists />} />
          <Route path="/wishlists/:wishlistId" element={<WishlistDetails items={items ||[]} />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/create-item/:studioName/:studioId" element={<CreateItem  />} />
          <Route path="/edit-item/:itemId" element={<EditItem />} />
          <Route path="/edit-studio/:studioId" element={<EditStudio  />} />
          <Route path="/create-studio" element={<CreateStudio />} />
          <Route path="/edit-wishlist/:wishlistId" element={<EditWishlist />} />
          <Route path="/create-wishlist" element={<CreateWishlist />} />
          <Route path="/item/:itemId" element={<ItemDetails />} />
          <Route path="/cart" element={<CartDetails filteredItems={offlineCartFilteredItems} />} />
        </Routes>
      </main>
      {/* <Footer /> */}
      <Toaster richColors />
    </>
  );
}

export default App;
