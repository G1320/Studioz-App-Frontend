import '../styles/_index.scss';
import { useUserContext } from '@core/contexts';
import { CartItemCard } from '@features/entities/cart/components/CartItemCard';
import { useParams, Navigate } from 'react-router-dom';
import { Cart, Studio } from 'src/types/index';
import { PaymeCheckout } from '@shared/components/checkout';
import { PayMeCartItem } from '@shared/services/payme-service';
import { useTranslation } from 'react-i18next';
import { featureFlags } from '@core/config/featureFlags';
import { EmptyState } from '@shared/components';
import { ShoppingCartIcon } from '@shared/components/icons';
import { useLanguageNavigate } from '@shared/hooks/utils';

interface OrderPageProps {
  studios: Studio[];
  cart?: Cart;
}

const OrderPage: React.FC<OrderPageProps> = ({ cart, studios }) => {
  const { studioId } = useParams();
  const { user } = useUserContext();
  const { t, i18n } = useTranslation('orders');
  const langNavigate = useLanguageNavigate();

  // Redirect if checkout is disabled
  if (!featureFlags.checkout) {
    return <Navigate to={`/${i18n.language}`} replace />;
  }

  const filteredCart = { items: cart?.items?.filter((item) => item?.studioId === studioId) };
  const cartItems = (studioId ? filteredCart.items : cart?.items) || [];

  const vendorId = studios.find((studio) => studio._id === studioId)?.createdBy;

  // Convert cart items to PayMe format
  const paymeCartItems: PayMeCartItem[] = cartItems
    .filter((item) => item.studioId) // Filter out items without studioId
    .map((item) => ({
      name: `${item.name?.en || item.name?.he || 'Item'} at ${item.studioName?.en || item.studioName?.he || 'Studio'}`,
      price: item.price || 0,
      quantity: item.hours || item.quantity || 1,
      itemId: item.itemId,
      studioId: item.studioId as string // Type assertion safe after filter
    }));

  return (
    <section className="order-page">
      <h1 className="order-page__title">{t('title', 'Checkout')}</h1>
      <div className="cart-content">
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item) => (
              <CartItemCard key={`${item.itemId}-${item.bookingDate}`} item={item} />
            ))}
            <PaymeCheckout
              cartItems={paymeCartItems}
              customer={{
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone
              }}
              vendorId={vendorId}
            />
          </>
        ) : (
          <EmptyState
            icon={<ShoppingCartIcon />}
            title={t('empty', 'Your cart is empty')}
            subtitle={t('emptyHint', 'Browse studios and add a session to check out.')}
            actionLabel={t('browseStudios', 'Browse studios')}
            onAction={() => langNavigate('/')}
          />
        )}
      </div>
    </section>
  );
};

export default OrderPage;
