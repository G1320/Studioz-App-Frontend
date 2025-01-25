import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useMemo } from 'react';

import HomePage from '@features/home/pages/HomePage';
import WishListsPage from '@features/entities/wishlists/pages/WishlistsPage';
import StudioDetailsPage from '@features/entities/studios/pages/StudioDetailsPage';
import ItemDetailsPage from '@features/entities/items/pages/ItemDetailsPage';
// import OrderPage from '@pages/order-page/OrderPage';
import SearchPage from '@features/search/pages/SearchPage';
import CreateStudioPage from '@features/entities/studios/pages/CreateStudioPage';
import EditStudioPage from '@features/entities/studios/pages/EditStudioPage';
import OrderSuccessPage from '@features/entities/orders/pages/OrderSuccessPage';
import StudioCalendarPage from '@features/entities/bookings/calender/pages/CalenderPage';
import ProfilePage from '@features/entities/profile/pages/ProfilePage';
import Studio from 'src/types/studio';
import Item from 'src/types/item';
import Cart from 'src/types/cart';
import User from 'src/types/user';
import { SumitSubscriptionPage, MySubscriptionPage } from '@features/entities/subscriptions';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyPage = lazy(() => import('@features/static/pages/compliance-pages/PrivacyPolicyPage'));
const TermsAndConditionsPage = lazy(() => import('@features/static/pages/compliance-pages/TermAndConditionsPage'));
const ServicesPage = lazy(() => import('@features/entities/items/pages/ServicesPage'));
const StudiosPage = lazy(() => import('@features/entities/studios/pages/StudiosPage'));
const CreateItemPage = lazy(() => import('@features/entities/items/pages/CreateItemPage'));
const CreateWishlistPage = lazy(() => import('@features/entities/wishlists/pages/CreateWishlistPage'));
const EditItemPage = lazy(() => import('@features/entities/items/pages/EditItemPage'));
const EditWishlistPage = lazy(() => import('@features/entities/wishlists/pages/EditWishlistPage'));
const CartDetailsPage = lazy(() => import('@features/entities/cart/pages/CartDetailsPage'));
const WishlistDetailsPage = lazy(() => import('@features/entities/wishlists/pages/WishlistDetailsPage'));

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
  const { i18n } = useTranslation();

  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

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
          {/* <Route
            path="/:lang?/order/:studioId?"
            element={
              <AnimatedRoute>
                <OrderPage cart={onlineCart || offlineCart} studios={studios} />
              </AnimatedRoute>
            }
          /> */}
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
            path="/:lang?/profile/:onboarding?"
            element={
              <AnimatedRoute>
                <ProfilePage user={user || null} />
              </AnimatedRoute>
            }
          />

          <Route
            path="/:lang?/subscription"
            element={
              <AnimatedRoute>
                <SumitSubscriptionPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/my-subscription"
            element={
              <AnimatedRoute>
                <MySubscriptionPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/calendar"
            element={
              <AnimatedRoute>
                <StudioCalendarPage studios={userStudios} items={items} />
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
