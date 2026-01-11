import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useMemo } from 'react';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';

import DiscoverPage from '@features/home/pages/DiscoverPage';
import WishListsPage from '@features/entities/wishlists/pages/WishlistsPage';
import StudioDetailsPage from '@features/entities/studios/pages/StudioDetailsPage';
import StudioReviewsPage from '@features/entities/studios/pages/StudioReviewsPage';
import ItemDetailsPage from '@features/entities/items/pages/ItemDetailsPage';
import OrderPage from '@features/entities/orders/pages/OrderPage';
import SearchPage from '@features/search/pages/SearchPage';
import CreateStudioPage from '@features/entities/studios/pages/CreateStudioPage';
import EditStudioPage from '@features/entities/studios/pages/EditStudioPage';
import OrderSuccessPage from '@features/entities/orders/pages/OrderSuccessPage';
import StudioCalendarPage from '@features/entities/bookings/calender/pages/CalenderPage';
import DashboardPage from '@features/entities/dashboard/pages/DashboardPage';
import Studio from 'src/types/studio';
import Item from 'src/types/item';
import Cart from 'src/types/cart';
import User from 'src/types/user';
import { SumitSubscriptionPage, MySubscriptionPage } from '@features/entities/subscriptions';
import { useTranslation } from 'react-i18next';
import VendorOnboardingPage from '@features/vendor-onboarding/sumit/pages/VendorOnboardingPage';
import { featureFlags, isFeatureEnabled } from '@core/config/featureFlags';

const PrivacyPolicyPage = lazy(() => import('@features/static/pages/compliance-pages/PrivacyPolicyPage'));
const TermsAndConditionsPage = lazy(() => import('@features/static/pages/compliance-pages/TermAndConditionsPage'));
const NotFoundPage = lazy(() => import('@features/static/pages/NotFoundPage'));
const ForOwnersPage = lazy(() => import('@features/static/pages/ForOwnersPage'));
const HowItWorksPage = lazy(() => import('@features/static/pages/HowItWorksPage'));
const ServicesPage = lazy(() => import('@features/entities/items/pages/ServicesPage'));
const StudiosPage = lazy(() => import('@features/entities/studios/pages/StudiosPage'));
const CreateItemPage = lazy(() => import('@features/entities/items/pages/CreateItemPage'));
const CreateWishlistPage = lazy(() => import('@features/entities/wishlists/pages/CreateWishlistPage'));
const EditItemPage = lazy(() => import('@features/entities/items/pages/EditItemPage'));
const EditWishlistPage = lazy(() => import('@features/entities/wishlists/pages/EditWishlistPage'));
const CartDetailsPage = lazy(() => import('@features/entities/cart/pages/CartDetailsPage'));
const WishlistDetailsPage = lazy(() => import('@features/entities/wishlists/pages/WishlistDetailsPage'));
const MyReservationsPage = lazy(() => import('@features/entities/reservations/pages/MyReservationsPage'));
const ReservationDetailsPage = lazy(() => import('@features/entities/reservations/pages/ReservationDetailsPage'));
const LandingPage = lazy(() => import('@features/landing/pages/LandingPage'));
const ProfilePage = lazy(() => import('@features/entities/profile/pages/ProfilePage'));

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

// Moved outside AnimatedRoutes to prevent recreation on every render
const AnimatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      onAnimationComplete={(definition) => {
        // Only scroll on enter animation, not exit
        if (definition === 'enter') {
          scrollToTop();
        }
      }}
      style={{
        position: 'relative',
        minHeight: '100%',
        width: '100%'
      }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({ studios, items, onlineCart, offlineCart, user }) => {
  const location = useLocation();
  const { i18n } = useTranslation();

  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

  return (
    <AnimatePresence mode="wait">
      <Suspense>
        <Routes location={location}>
          <Route path="/" element={<Navigate to={`/${i18n.language}`} />} />
          <Route
            path="/:lang"
            element={
              <AnimatedRoute>
                <LandingPage studios={studios} />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang/discover"
            element={
              isFeatureEnabled('discoverPage') ? (
                <AnimatedRoute>
                  <DiscoverPage studios={studios} items={items} />
                </AnimatedRoute>
              ) : (
                <Navigate to={`/${i18n.language}/studios`} replace />
              )
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
          <Route
            path="/:lang?/studio/:studioId/reviews"
            element={
              <AnimatedRoute>
                <StudioReviewsPage />
              </AnimatedRoute>
            }
          />
          <Route path="/:lang?/studios/:category?/:subcategory?" element={<StudiosPage studios={studios} />} />
          {featureFlags.servicesPage && (
            <Route path="/:lang?/services/:category?/:subCategory?" element={<ServicesPage items={items} />} />
          )}
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
          {/* Studio CRUD - RESTful routes */}
          <Route path="/:lang?/studio/create" element={<CreateStudioPage />} />
          <Route path="/:lang?/studio/:studioId/edit" element={<EditStudioPage />} />
          <Route path="/:lang?/studio/:studioId/items/create" element={<CreateItemPage />} />
          {/* Item CRUD */}
          <Route path="/:lang?/item/:itemId/edit" element={<EditItemPage />} />
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
            path="/:lang?/onboarding"
            element={
              <AnimatedRoute>
                <VendorOnboardingPage />
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
            path="/:lang?/dashboard"
            element={
              <AnimatedRoute>
                <DashboardPage user={user || null} studios={studios} />
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
            path="/:lang?/reservations"
            element={
              <AnimatedRoute>
                <MyReservationsPage />
              </AnimatedRoute>
            }
          />
          {isFeatureEnabled('reservationDetailsPage') && (
            <Route
              path="/:lang?/reservations/:reservationId"
              element={
                <AnimatedRoute>
                  <ReservationDetailsPage />
                </AnimatedRoute>
              }
            />
          )}

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
          {isFeatureEnabled('forOwnersPage') && (
            <Route
              path="/:lang?/for-owners"
              element={
                <AnimatedRoute>
                  <ForOwnersPage />
                </AnimatedRoute>
              }
            />
          )}
          <Route
            path="/:lang?/how-it-works"
            element={
              <AnimatedRoute>
                <HowItWorksPage videoEmbedUrl="https://player.mediadelivery.net/embed/576930/69015e74-dfee-42fc-9122-0d757293b2af" />
              </AnimatedRoute>
            }
          />
          {/* Catch-all route for 404 */}
          <Route
            path="*"
            element={
              <AnimatedRoute>
                <NotFoundPage />
              </AnimatedRoute>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
