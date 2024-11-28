import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useMemo } from 'react';
import { useOfflineCartContext, useUserContext } from '@contexts/index';
import { useItems, useStudios, useOnlineCart } from '@hooks/index';
import { PropagateLoader } from 'react-spinners';
import { Toaster } from 'sonner';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { initialOptions } from '@config/paypal/paypalConfig';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import Checkout from './Checkout';

import { Header } from '@components/layout/index';
import HomePage from '@pages/home-page/HomePage';
import WishListsPage from '@pages/wishlists-page/WishlistsPage';
import StudioDetailsPage from '@pages/details-pages/StudioDetailsPage';
import ItemDetailsPage from '@pages/details-pages/ItemDetailsPage';
import CheckoutPage from '@pages/checkout-page/CheckoutPage';
import { shuffleArray } from '@utils/index';
import SearchPage from '@pages/search-page/SearchPage';
import { ResponsiveFooter } from '@components/layout/footer/Footer';

const ServicesPage = lazy(() => import('@pages/services-page/ServicesPage'));
const StudiosPage = lazy(() => import('@pages/studios-page/StudiosPage'));
const CreateStudioPage = lazy(() => import('@pages/create-pages/CreateStudioPage'));
const CreateItemPage = lazy(() => import('@pages/create-pages/CreateItemPage'));
const CreateWishlistPage = lazy(() => import('@pages/create-pages/CreateWishlistPage'));
const EditStudioPage = lazy(() => import('@pages/edit-pages/EditStudioPage'));
const EditItemPage = lazy(() => import('@pages/edit-pages/EditItemPage'));
const EditWishlistPage = lazy(() => import('@pages/edit-pages/EditWishlistPage'));
const CartDetailsPage = lazy(() => import('@pages/details-pages/CartDetailsPage'));
const WishlistDetailsPage = lazy(() => import('@pages/details-pages/WishlistDetailsPage'));

function App() {
  const customLocaleText = {
    okButtonLabel: 'Confirm Booking',
    cancelButtonLabel: 'Cancel'
  };

  const { user } = useUserContext();
  const { offlineCart } = useOfflineCartContext();

  const { data: onlineCart } = useOnlineCart(user?._id || '');
  const { data: originalItems } = useItems();
  const { data: originalStudios } = useStudios();

  const studios = useMemo(() => shuffleArray(originalStudios || []), [originalStudios]);

  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={customLocaleText}>
          <Header cart={onlineCart || offlineCart} user={user} />
          <main className="main-content">
            <Suspense fallback={<PropagateLoader color="#fff" className="loader" />}>
              <Routes>
                <Route path="/" element={<HomePage studios={studios || []} items={originalItems || []} />} />
                <Route path="/studio/:studioId" element={<StudioDetailsPage items={originalItems || []} />} />
                <Route path="/studios/:category?/:subcategory?" element={<StudiosPage studios={studios || []} />} />
                <Route
                  path="/services/:category?/:subCategory?"
                  element={<ServicesPage items={originalItems || []} />}
                />
                <Route path="/wishlists" element={<WishListsPage />} />
                <Route path="/wishlists/:wishlistId" element={<WishlistDetailsPage items={originalItems || []} />} />
                <Route path="/create-item/:studioName/:studioId" element={<CreateItemPage />} />
                <Route path="/edit-item/:itemId" element={<EditItemPage />} />
                <Route path="/edit-studio/:studioId" element={<EditStudioPage />} />
                <Route path="/create-studio" element={<CreateStudioPage />} />
                <Route path="/edit-wishlist/:wishlistId" element={<EditWishlistPage />} />
                <Route path="/create-wishlist" element={<CreateWishlistPage />} />
                <Route path="/item/:itemId" element={<ItemDetailsPage />} />
                <Route path="/cart" element={<CartDetailsPage cart={onlineCart || offlineCart} />} />
                <Route path="/checkout" element={<CheckoutPage cart={onlineCart || offlineCart} />} />
                <Route path="/search" element={<SearchPage studios={studios} items={originalItems} />} />
              </Routes>
            </Suspense>
          </main>
          <ResponsiveFooter />
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
      </PayPalScriptProvider>
    </>
  );
}

export default App;
