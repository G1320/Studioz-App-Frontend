import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useRef } from 'react';
import { useOfflineCartContext } from '@/contexts';
import { useItems, useStudios, useScrollToTop  } from '@/hooks';
import { getOfflineCartIdCountMap, filterOfflineCartItems } from '@/utils/cartUtils';
import { PropagateLoader } from 'react-spinners';
import { Toaster } from 'sonner';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


import { Header, Hero, Home, DesktopFooter,  Studios, StudioDetails, ItemDetails, Services, Store, WishLists, WishlistDetails, CreateStudio } from '@/components';

const CreateItem = lazy(() => import('@/components/entities/items/createItem')) ;
const EditItem = lazy(() => import('@/components/entities/items/editItem')) ;
const CreateWishlist = lazy(() => import('@/components/entities/wishlists/createWishlist')) ;
const EditWishlist = lazy(() => import('@/components/entities/wishlists/editWishlist')) ;
const EditStudio = lazy(() => import('@/components/entities/studios/editStudio')) ;
const CartDetails = lazy(() => import('@/components/entities/cart/cartDetails')) ;

function App() {
  const mainRef = useRef<HTMLElement>(null);  
  const scrollOffset = 0;  

  useScrollToTop(mainRef, scrollOffset); 

  const { data: items = [] } = useItems();
  const { data: studios } = useStudios();
  const { offlineCartContext: offlineCart } = useOfflineCartContext();

  const offlineCartIdCountMap = getOfflineCartIdCountMap(offlineCart);
  const offlineCartFilteredItems = filterOfflineCartItems(items, offlineCartIdCountMap);

  return (
    <>
   <Header filteredItems={offlineCartFilteredItems} />
      <main ref={mainRef} className="main-content">
       <Hero/>
        <Suspense fallback={<PropagateLoader className="loader" />}>
       <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Routes>
            <Route path="/" element={<Home studios={studios || []} items={items || []} />} />
            <Route path="/studio/:studioId" element={<StudioDetails items={items || []} />} />
            <Route path="/studios/:category?/:subcategory?" element={<Studios studios={studios || []} />} />
            <Route path="/services" element={<Store items={items || []} />} />
            <Route path="/services/:category?/:subcategory?" element={<Services items={items || []} />} />
            <Route path="/wishlists" element={<WishLists />} />
            <Route path="/wishlists/:wishlistId" element={<WishlistDetails items={items || []} />} />
            <Route path="/create-item/:studioName/:studioId" element={<CreateItem />} />
            <Route path="/edit-item/:itemId" element={<EditItem />} />
            <Route path="/edit-studio/:studioId" element={<EditStudio />} />
            <Route path="/create-studio" element={<CreateStudio />} />
            <Route path="/edit-wishlist/:wishlistId" element={<EditWishlist />} />
            <Route path="/create-wishlist" element={<CreateWishlist />} />
            <Route path="/item/:itemId" element={<ItemDetails />} />
            <Route path="/cart" element={<CartDetails filteredItems={offlineCartFilteredItems || []} />} />
          </Routes>
        </LocalizationProvider>
        </Suspense>
      </main>
      <DesktopFooter />
      {/* <MobileFooter/> */}
      <Toaster richColors />
    </>
  );
}

export default App;
