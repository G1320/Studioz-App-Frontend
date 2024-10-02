import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useRef } from 'react';
import { useOfflineCartContext, useUserContext } from '@/contexts';
import { useItems, useStudios, useScrollToTop, useCart  } from '@/hooks';
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
  const { user } = useUserContext();
  const mainRef = useRef<HTMLElement>(null);  
  const scrollOffset = 0;  
  const customLocaleText = {
    okButtonLabel: "Confirm Booking",
    cancelButtonLabel: "Cancel",
  };
  
  useScrollToTop(mainRef, scrollOffset); 
  
  const { data: onlineCart } = useCart(user?._id || '');
  const { offlineCartContext: offlineCart } = useOfflineCartContext();
  const { data: items = [] } = useItems();
  const { data: studios } = useStudios();


  return (
    <>
   <Header cart={ onlineCart || offlineCart } />
      <main ref={mainRef} className="main-content">
       <Hero/>
        <Suspense fallback={<PropagateLoader className="loader" />}>
         <LocalizationProvider dateAdapter={AdapterDayjs} localeText={customLocaleText}>
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
            <Route path="/cart" element={<CartDetails cart={offlineCart || onlineCart} />} />
          </Routes>
         </LocalizationProvider>
        </Suspense>
      </main>
      <DesktopFooter />
      {/* <MobileFooter/> */}
      <Toaster richColors 
      toastOptions={{
        style: {
          padding: '0 0.5rem',
        },
        className: 'toast',
      }}/>
    </>
  );
}

export default App;
