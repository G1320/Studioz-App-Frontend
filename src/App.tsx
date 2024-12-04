import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect, useMemo } from 'react';
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
import OrderPage from '@pages/order-page/OrderPage';
import { shuffleArray } from '@utils/index';
import SearchPage from '@pages/search-page/SearchPage';
import { ResponsiveFooter } from '@components/layout/footer/Footer';
import i18n from './i18n';

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

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

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
                <Route path="/" element={<Navigate to={`/${i18n.language}`} />} />

                <Route path="/:lang/" element={<HomePage studios={studios || []} items={originalItems || []} />} />
                <Route path="/:lang/studio/:studioId" element={<StudioDetailsPage items={originalItems || []} />} />
                <Route
                  path="/:lang/studios/:category?/:subcategory?"
                  element={<StudiosPage studios={studios || []} />}
                />
                <Route
                  path="/:lang/services/:category?/:subCategory?"
                  element={<ServicesPage items={originalItems || []} />}
                />
                <Route path="/:lang/wishlists" element={<WishListsPage />} />
                <Route
                  path="/:lang/wishlists/:wishlistId"
                  element={<WishlistDetailsPage items={originalItems || []} />}
                />
                <Route path="/:lang/create-item/:studioName/:studioId" element={<CreateItemPage />} />
                <Route path="/:lang/edit-item/:itemId" element={<EditItemPage />} />
                <Route path="/:lang/edit-studio/:studioId" element={<EditStudioPage />} />
                <Route path="/:lang/create-studio" element={<CreateStudioPage />} />
                <Route path="/:lang/edit-wishlist/:wishlistId" element={<EditWishlistPage />} />
                <Route path="/:lang/create-wishlist" element={<CreateWishlistPage />} />
                <Route path="/:lang/item/:itemId" element={<ItemDetailsPage />} />
                <Route path="/:lang/cart" element={<CartDetailsPage cart={onlineCart || offlineCart} />} />
                <Route path="/:lang/order/:studioId?" element={<OrderPage cart={onlineCart || offlineCart} />} />
                <Route path="/:lang/checkout" element={<CheckoutPage cart={onlineCart || offlineCart} />} />
                <Route path="/:lang/complete-order" element={<CartDetailsPage cart={onlineCart || offlineCart} />} />
                <Route path="/:lang/search" element={<SearchPage studios={studios} items={originalItems} />} />
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
