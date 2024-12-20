import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useMemo } from 'react';
import { useOfflineCartContext, useUserContext } from '@contexts/index';
import { useItems, useStudios, useOnlineCart } from '@hooks/index';
import { PropagateLoader } from 'react-spinners';
import { Toaster } from 'sonner';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { initialOptions } from '@config/paypal/paypalConfig';
import { HelmetProvider } from 'react-helmet-async';

import i18n from './i18n';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Header, ProfilePage, ResponsiveFooter, ScrollToTop, StudiosMap } from '@components/index';
import HomePage from '@pages/home-page/HomePage';
import WishListsPage from '@pages/wishlists-page/WishlistsPage';
import StudioDetailsPage from '@pages/details-pages/StudioDetailsPage';
import ItemDetailsPage from '@pages/details-pages/ItemDetailsPage';
import CheckoutPage from '@pages/checkout-page/CheckoutPage';
import OrderPage from '@pages/order-page/OrderPage';
import SearchPage from '@pages/search-page/SearchPage';
import CreateStudioPage from '@pages/create-pages/CreateStudioPage';
import EditStudioPage from '@pages/edit-pages/EditStudioPage';
import { shuffleArray } from '@utils/index';
import { SEOTags } from '@components/utility/SEOTags';

const ServicesPage = lazy(() => import('@pages/services-page/ServicesPage'));
const StudiosPage = lazy(() => import('@pages/studios-page/StudiosPage'));
const CreateItemPage = lazy(() => import('@pages/create-pages/CreateItemPage'));
const CreateWishlistPage = lazy(() => import('@pages/create-pages/CreateWishlistPage'));
const EditItemPage = lazy(() => import('@pages/edit-pages/EditItemPage'));
const EditWishlistPage = lazy(() => import('@pages/edit-pages/EditWishlistPage'));
const CartDetailsPage = lazy(() => import('@pages/details-pages/CartDetailsPage'));
const WishlistDetailsPage = lazy(() => import('@pages/details-pages/WishlistDetailsPage'));

function App() {
  const customLocaleText = {
    okButtonLabel: 'Confirm Booking',
    cancelButtonLabel: 'Cancel'
  };
  const location = useLocation();

  const { user } = useUserContext();
  const { offlineCart } = useOfflineCartContext();

  const { data: onlineCart } = useOnlineCart(user?._id || '');
  const { data: originalItems } = useItems();
  const { data: originalStudios } = useStudios();

  const items = useMemo(() => shuffleArray(originalItems || []), [originalItems]);
  const studios = useMemo(() => shuffleArray(originalStudios || []), [originalStudios]);

  return (
    <HelmetProvider>
      <PayPalScriptProvider options={initialOptions}>
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={customLocaleText}>
          <Header cart={onlineCart || offlineCart} user={user} />
          <SEOTags path={location.pathname} />

          <main className="main-content" id="main-content">
            <Suspense fallback={<PropagateLoader color="#fff" className="loader" />}>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Navigate to={`/${i18n.language}`} />} />

                <Route path="/:lang" element={<HomePage studios={studios || []} items={items || []} />} />
                <Route
                  path="/:lang?/studio/:studioId"
                  element={<StudioDetailsPage items={items || []} cart={onlineCart || offlineCart} />}
                />
                <Route
                  path="/:lang?/studios/:category?/:subcategory?"
                  element={<StudiosPage studios={studios || []} />}
                />
                <Route
                  path="/:lang?/services/:category?/:subCategory?"
                  element={<ServicesPage items={items || []} />}
                />
                <Route path="/:lang?/wishlists" element={<WishListsPage />} />
                <Route path="/:lang?/wishlists/:wishlistId" element={<WishlistDetailsPage items={items || []} />} />
                <Route path="/:lang?/create-item/:studioName/:studioId" element={<CreateItemPage />} />
                <Route path="/:lang?/edit-item/:itemId" element={<EditItemPage />} />
                <Route path="/:lang?/edit-studio/:studioId" element={<EditStudioPage />} />
                <Route path="/:lang?/create-studio" element={<CreateStudioPage />} />
                <Route path="/:lang?/edit-wishlist/:wishlistId" element={<EditWishlistPage />} />
                <Route path="/:lang?/create-wishlist" element={<CreateWishlistPage />} />
                <Route path="/:lang?/item/:itemId" element={<ItemDetailsPage />} />
                <Route path="/:lang?/cart" element={<CartDetailsPage cart={onlineCart || offlineCart} />} />
                <Route path="/:lang?/order/:studioId?" element={<OrderPage cart={onlineCart || offlineCart} />} />
                <Route path="/:lang?/checkout" element={<CheckoutPage cart={onlineCart || offlineCart} />} />
                <Route path="/:lang?/complete-order" element={<CartDetailsPage cart={onlineCart || offlineCart} />} />
                <Route path="/:lang?/search" element={<SearchPage studios={studios} items={originalItems} />} />
                <Route path="/:lang?/profile" element={<ProfilePage user={user} />} />
                <Route path="/:lang?/map" element={<StudiosMap studios={studios} />} />
              </Routes>
            </Suspense>
          </main>
          <ResponsiveFooter />
          <Toaster
            richColors
            toastOptions={{
              style: {
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#333',
                border: 'none',
                color: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontSize: '0.875rem'
              },
              className: 'toast'
            }}
          />
        </LocalizationProvider>
      </PayPalScriptProvider>
    </HelmetProvider>
  );
}

export default App;
