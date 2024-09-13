import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useOfflineCartContext } from '@/contexts';
import { useItems, useStudios  } from '@/hooks';
import { getOfflineCartIdCountMap, filterOfflineCartItems } from '@/utils/cartUtils';
import { PropagateLoader } from 'react-spinners';
import { Toaster } from 'sonner';

import { Header, Home, Footer, Studios, StudioDetails, ItemDetails, Services, Store, WishLists, WishlistDetails, CreateStudio, ScrollToTop } from '@/components';

const CreateUser = lazy(() => import('@/components/user/create-user')) 
const CreateItem = lazy(() => import('@/components/entities/items/createItem')) ;
const EditItem = lazy(() => import('@/components/entities/items/editItem')) ;
const CreateWishlist = lazy(() => import('@/components/entities/wishlists/createWishlist')) ;
const EditWishlist = lazy(() => import('@/components/entities/wishlists/editWishlist')) ;
const EditStudio = lazy(() => import('@/components/entities/studios/editStudio')) ;
const CartDetails = lazy(() => import('@/components/entities/cart/cartDetails')) ;

function App() {
  const { data: items = [] } = useItems();
  const { data: studios } = useStudios();
  const { offlineCartContext: offlineCart } = useOfflineCartContext();

  const offlineCartIdCountMap = getOfflineCartIdCountMap(offlineCart);
  const offlineCartFilteredItems = filterOfflineCartItems(items, offlineCartIdCountMap);

  return (
    <>
      <Header filteredItems={offlineCartFilteredItems} />
      <main className="main-content">
       <ScrollToTop>
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
          <Route 
              path="/create-user" 
              element={
                <Suspense fallback={<PropagateLoader className='loader' />}>
                  <CreateUser />
                </Suspense>
              } 
            />
            <Route 
              path="/create-item/:studioName/:studioId" 
              element={
                <Suspense fallback={<PropagateLoader className='loader' />}>
                  <CreateItem />
                </Suspense>
              } 
            />
            <Route 
              path="/edit-item/:itemId" 
              element={
                <Suspense fallback={<PropagateLoader className='loader' />}>
                  <EditItem />
                </Suspense>
              } 
            />
            <Route 
              path="/edit-studio/:studioId" 
              element={
                <Suspense fallback={<PropagateLoader className='loader' />}>
                  <EditStudio />
                </Suspense>
              } 
            />
            <Route 
              path="/create-studio" 
              element={
                <Suspense fallback={<PropagateLoader className='loader' />}>
                  <CreateStudio />
                </Suspense>
              } 
            />
            <Route 
              path="/edit-wishlist/:wishlistId" 
              element={
                <Suspense fallback={<PropagateLoader className='loader' />}>
                  <EditWishlist />
                </Suspense>
              } 
            />
            <Route 
              path="/create-wishlist" 
              element={
                <Suspense fallback={<PropagateLoader className='loader' />}>
                  <CreateWishlist />
                </Suspense>
              } 
            />
            <Route 
              path="/item/:itemId" 
              element={
                <Suspense fallback={<PropagateLoader className='loader' />}>
                  <ItemDetails />
                </Suspense>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <Suspense fallback={<PropagateLoader className='loader' />}>
                  <CartDetails filteredItems={offlineCartFilteredItems} />
                </Suspense>
              } 
            />
        </Routes>
      </ScrollToTop>
      </main>
      <Footer />
      <Toaster richColors />
    </>
  );
}

export default App;
