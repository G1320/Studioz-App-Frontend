import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useMemo } from 'react';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import Studio from 'src/types/studio';
import Item from 'src/types/item';
import Cart from 'src/types/cart';
import User from 'src/types/user';
import { useTranslation } from 'react-i18next';
import { featureFlags, isFeatureEnabled } from '@core/config/featureFlags';
import { ProtectedAdminRoute } from '@shared/components/route-guards';

// Lazy load all pages for better code splitting
const DiscoverPage = lazy(() => import('@features/home/pages/DiscoverPage'));
const WishListsPage = lazy(() => import('@features/entities/wishlists/pages/WishlistsPage'));
const StudioDetailsPage = lazy(() => import('@features/entities/studios/pages/StudioDetailsPage'));
const StudioReviewsPage = lazy(() => import('@features/entities/studios/pages/StudioReviewsPage'));
const ItemDetailsPage = lazy(() => import('@features/entities/items/pages/ItemDetailsPage'));
const OrderPage = lazy(() => import('@features/entities/orders/pages/OrderPage'));
const SearchPage = lazy(() => import('@features/search/pages/SearchPage'));
const CreateStudioPage = lazy(() => import('@features/entities/studios/pages/CreateStudioPage'));
const EditStudioPage = lazy(() => import('@features/entities/studios/pages/EditStudioPage'));
const OrderSuccessPage = lazy(() => import('@features/entities/orders/pages/OrderSuccessPage'));
const StudioCalendarPage = lazy(() => import('@features/entities/bookings/calender/pages/CalenderPage'));
const DashboardPage = lazy(() => import('@features/entities/dashboard/pages/DashboardPage'));
const SumitSubscriptionPage = lazy(() => import('@features/entities/subscriptions/pages/SumitSubscriptionPage'));
const MySubscriptionPage = lazy(() => import('@features/entities/subscriptions/pages/MySubscriptionPage'));
const VendorOnboardingPage = lazy(() => import('@features/vendor-onboarding/sumit/pages/VendorOnboardingPage'));

const PrivacyPolicyPage = lazy(() => import('@features/static/pages/compliance-pages/PrivacyPolicyPage'));
const TermsAndConditionsPage = lazy(() => import('@features/static/pages/compliance-pages/TermAndConditionsPage'));
const NotFoundPage = lazy(() => import('@features/static/pages/NotFoundPage'));
const ForOwnersPage = lazy(() => import('@features/static/pages/ForOwnersPage'));
// HowItWorksPage content is now embedded in ForOwnersPage as a section
const ChangelogPage = lazy(() => import('@features/static/pages/ChangelogPage'));
const SecurityPage = lazy(() => import('@features/static/pages/SecurityPage'));
const FeaturesPage = lazy(() => import('@features/static/pages/FeaturesPage'));
const FeatureDetailPage = lazy(() => import('@features/static/pages/FeatureDetailPage'));
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
// const LandingPage = lazy(() => import('@features/landing/pages/LandingPage'));
const ProfilePage = lazy(() => import('@features/entities/profile/pages/ProfilePage'));
const AdminPage = lazy(() => import('@features/entities/admin/pages/AdminPage'));
const ProjectsListPage = lazy(() => import('@features/entities/remote-projects/pages/ProjectsListPage'));
const ProjectDetailPage = lazy(() => import('@features/entities/remote-projects/pages/ProjectDetailPage'));

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
                <ForOwnersPage />
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
                <Navigate to={`/${i18n.language}`} replace />
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
          {/* Admin Panel - Protected route for admins only */}
          <Route
            path="/:lang?/admin"
            element={
              <ProtectedAdminRoute>
                <AnimatedRoute>
                  <AdminPage user={user || null} studios={studios} />
                </AnimatedRoute>
              </ProtectedAdminRoute>
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

          {/* Remote Projects */}
          <Route
            path="/:lang?/projects"
            element={
              <AnimatedRoute>
                <ProjectsListPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/projects/:projectId"
            element={
              <AnimatedRoute>
                <ProjectDetailPage />
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
          <Route
            path="/:lang?/security"
            element={
              <AnimatedRoute>
                <SecurityPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/features/:featureId"
            element={
              <AnimatedRoute>
                <FeatureDetailPage />
              </AnimatedRoute>
            }
          />
          <Route
            path="/:lang?/features"
            element={
              <AnimatedRoute>
                <FeaturesPage />
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
          {/* Redirect old how-it-works page to home with anchor */}
          <Route
            path="/:lang?/how-it-works"
            element={<Navigate to={`/${i18n.language}#how-it-works`} replace />}
          />
          <Route
            path="/:lang?/changelog"
            element={
              <AnimatedRoute>
                <ChangelogPage />
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
