// components/routing/AnimatedRoutes.tsx
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import i18n from '../i18n';

import HomePage from '@pages/home-page/HomePage';
import WishListsPage from '@pages/wishlists-page/WishlistsPage';
import StudioDetailsPage from '@pages/details-pages/StudioDetailsPage';
import ItemDetailsPage from '@pages/details-pages/ItemDetailsPage';
import OrderPage from '@pages/order-page/OrderPage';
import SearchPage from '@pages/search-page/SearchPage';
import CreateStudioPage from '@pages/create-pages/CreateStudioPage';
import EditStudioPage from '@pages/edit-pages/EditStudioPage';
import OrderSuccessPage from '@pages/order-success-page/OrderSuccessPage';
import StudioCalendarPage from '@pages/calender-page/StudioCalenderPage';
import { ProfilePage, StudiosMap } from '@components/index';
import Studio from 'src/types/studio';
import Item from 'src/types/item';
import Cart from 'src/types/cart';
import User from 'src/types/user';

const PrivacyPolicyPage = lazy(() => import('@pages/compliance-pages/PrivacyPolicyPage'));
const TermsAndConditionsPage = lazy(() => import('@pages/compliance-pages/TermAndConditionsPage'));
const ServicesPage = lazy(() => import('@pages/services-page/ServicesPage'));
const StudiosPage = lazy(() => import('@pages/studios-page/StudiosPage'));
const CreateItemPage = lazy(() => import('@pages/create-pages/CreateItemPage'));
const CreateWishlistPage = lazy(() => import('@pages/create-pages/CreateWishlistPage'));
const EditItemPage = lazy(() => import('@pages/edit-pages/EditItemPage'));
const EditWishlistPage = lazy(() => import('@pages/edit-pages/EditWishlistPage'));
const CartDetailsPage = lazy(() => import('@pages/details-pages/CartDetailsPage'));
const WishlistDetailsPage = lazy(() => import('@pages/details-pages/WishlistDetailsPage'));

interface AnimatedRoutesProps {
  studios: Studio[];
  items: Item[];
  onlineCart?: Cart;
  offlineCart?: Cart;
  user?: User;
}

const pageVariants = {
  initial: {
    opacity: 0
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: 'easeInOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0,
      ease: 'easeInOut'
    }
  }
};

const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({ studios, items, onlineCart, offlineCart, user }) => {
  const location = useLocation();

  const AnimatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <motion.div initial="initial" animate="enter" exit="exit" variants={pageVariants}>
        {children}
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <Suspense>
        <Routes location={location}>
          <Route path="/" element={<Navigate to={`/${i18n.language}`} />} />
          <Route
            path="/:lang"
            element={
              <AnimatedRoute>
                <HomePage studios={studios} items={items} />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/studio/:studioId"
            element={
              <AnimatedRoute>
                <StudioDetailsPage items={items} cart={onlineCart || offlineCart} />
              </AnimatedRoute>
            }
          />
          <Route path="/:lang?/studios/:category?/:subcategory?" element={<StudiosPage studios={studios} />} />
          <Route path="/:lang?/services/:category?/:subCategory?" element={<ServicesPage items={items} />} />
          <Route
            path="/:lang?/wishlists"
            element={
              <AnimatedRoute>
                <WishListsPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/wishlists/:wishlistId"
            element={
              <AnimatedRoute>
                <WishlistDetailsPage items={items} />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/create-item/:studioName/:studioId"
            element={
              <AnimatedRoute>
                <CreateItemPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/edit-item/:itemId"
            element={
              <AnimatedRoute>
                <EditItemPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/edit-studio/:studioId"
            element={
              <AnimatedRoute>
                <EditStudioPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/create-studio"
            element={
              <AnimatedRoute>
                <CreateStudioPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/edit-wishlist/:wishlistId"
            element={
              <AnimatedRoute>
                <EditWishlistPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/create-wishlist"
            element={
              <AnimatedRoute>
                <CreateWishlistPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/item/:itemId"
            element={
              <AnimatedRoute>
                <ItemDetailsPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/cart"
            element={
              <AnimatedRoute>
                <CartDetailsPage cart={onlineCart || offlineCart} />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/order/:studioId?"
            element={
              <AnimatedRoute>
                <OrderPage cart={onlineCart || offlineCart} studios={studios} />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/complete-order"
            element={
              <AnimatedRoute>
                <CartDetailsPage cart={onlineCart || offlineCart} />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/order-success/:orderId"
            element={
              <AnimatedRoute>
                <OrderSuccessPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/search"
            element={
              <AnimatedRoute>
                <SearchPage studios={studios} items={items} />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/profile"
            element={
              <AnimatedRoute>
                <ProfilePage user={user || null} />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/calendar"
            element={
              <AnimatedRoute>
                <StudioCalendarPage studios={studios} items={items} />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/map"
            element={
              <AnimatedRoute>
                <StudiosMap studios={studios} />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/privacy"
            element={
              <AnimatedRoute>
                <PrivacyPolicyPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/terms"
            element={
              <AnimatedRoute>
                <TermsAndConditionsPage />
              </AnimatedRoute>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
