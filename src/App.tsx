import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useMemo } from 'react';
import { useOfflineCartContext, useUserContext } from '@/contexts';
import { useItems, useStudios, useOnlineCart } from '@/hooks';
import { PropagateLoader } from 'react-spinners';
import { Toaster } from 'sonner';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Header, Hero, DesktopFooter, Studios, WishLists } from '@/components';
import { Home, Services, StudioDetails, ItemDetails, WishlistDetails } from '@/pages';
import { shuffleArray } from '@/utils';

const CreateStudio = lazy(() => import('@/forms/create-forms/createStudio'));
const CreateItem = lazy(() => import('@/forms/create-forms/createItem'));
const CreateWishlist = lazy(() => import('@/forms/create-forms/createWishlist'));
const EditStudio = lazy(() => import('@/forms/edit-forms/editStudio'));
const EditItem = lazy(() => import('@/forms/edit-forms/editItem'));
const EditWishlist = lazy(() => import('@/forms/edit-forms/editWishlist'));
const CartDetails = lazy(() => import('@/pages/details-pages/cartDetails'));

function App() {
  const { user } = useUserContext();
  const customLocaleText = {
    okButtonLabel: 'Confirm Booking',
    cancelButtonLabel: 'Cancel'
  };

  const { data: onlineCart } = useOnlineCart(user?._id || '');
  const { offlineCartContext: offlineCart } = useOfflineCartContext();
  const { data: originalItems } = useItems();
  const { data: originalStudios } = useStudios();

  const studios = useMemo(() => shuffleArray(originalStudios || []), [originalStudios]);
  const items = useMemo(() => shuffleArray(originalItems || []), [originalItems]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} localeText={customLocaleText}>
      <Header cart={onlineCart || offlineCart} user={user} />
      <main className="main-content">
        <Hero />
        <Suspense fallback={<PropagateLoader className="loader" />}>
          <Routes>
            <Route path="/" element={<Home studios={studios || []} items={items || []} />} />
            <Route path="/studio/:studioId" element={<StudioDetails items={items || []} />} />
            <Route path="/studios/:category?/:subcategory?" element={<Studios studios={studios || []} />} />
            <Route path="/services/:category?/:subCategory?" element={<Services items={items || []} />} />
            <Route path="/wishlists" element={<WishLists />} />
            <Route path="/wishlists/:wishlistId" element={<WishlistDetails items={items || []} />} />
            <Route path="/create-item/:studioName/:studioId" element={<CreateItem />} />
            <Route path="/edit-item/:itemId" element={<EditItem />} />
            <Route path="/edit-studio/:studioId" element={<EditStudio />} />
            <Route path="/create-studio" element={<CreateStudio />} />
            <Route path="/edit-wishlist/:wishlistId" element={<EditWishlist />} />
            <Route path="/create-wishlist" element={<CreateWishlist />} />
            <Route path="/item/:itemId" element={<ItemDetails />} />
            <Route path="/cart" element={<CartDetails cart={onlineCart || offlineCart} />} />
          </Routes>
        </Suspense>
      </main>
      <DesktopFooter />
      {/* <MobileFooter/> */}
      <Toaster
        richColors
        toastOptions={{
          style: {
            padding: '0 0.5rem'
          },
          className: 'toast'
        }}
      />
    </LocalizationProvider>
  );
}

export default App;
