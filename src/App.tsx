import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useMemo } from 'react';
import { useOfflineCartContext, useUserContext } from '@/contexts';
import { useItems, useStudios, useOnlineCart } from '@/hooks';
import { PropagateLoader } from 'react-spinners';
import { Toaster } from 'sonner';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Header, Hero, DesktopFooter } from '@/components';
import {
  HomePage,
  ServicesPage,
  StudiosPage,
  WishListsPage,
  StudioDetailsPage,
  ItemDetailsPage,
  WishlistDetailsPage
} from '@/pages';
import { shuffleArray } from '@/utils';

const CreateStudio = lazy(() => import('@/pages/create-pages/CreateStudioPage'));
const CreateItem = lazy(() => import('@/pages/create-pages/CreateItemPage'));
const CreateWishlist = lazy(() => import('@/pages/create-pages/CreateWishlistPage'));
const EditStudio = lazy(() => import('@/pages/edit-pages/EditStudioPage'));
const EditItem = lazy(() => import('@/pages/edit-pages/EditItemPage'));
const EditWishlist = lazy(() => import('@/pages/edit-pages/EditWishlistPage'));
const CartDetails = lazy(() => import('@/pages/details-pages/CartDetailsPage'));

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
            <Route path="/" element={<HomePage studios={studios || []} items={items || []} />} />
            <Route path="/studio/:studioId" element={<StudioDetailsPage items={items || []} />} />
            <Route path="/studios/:category?/:subcategory?" element={<StudiosPage studios={studios || []} />} />
            <Route path="/services/:category?/:subCategory?" element={<ServicesPage items={items || []} />} />
            <Route path="/wishlists" element={<WishListsPage />} />
            <Route path="/wishlists/:wishlistId" element={<WishlistDetailsPage items={items || []} />} />
            <Route path="/create-item/:studioName/:studioId" element={<CreateItem />} />
            <Route path="/edit-item/:itemId" element={<EditItem />} />
            <Route path="/edit-studio/:studioId" element={<EditStudio />} />
            <Route path="/create-studio" element={<CreateStudio />} />
            <Route path="/edit-wishlist/:wishlistId" element={<EditWishlist />} />
            <Route path="/create-wishlist" element={<CreateWishlist />} />
            <Route path="/item/:itemId" element={<ItemDetailsPage />} />
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
