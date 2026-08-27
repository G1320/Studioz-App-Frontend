import React, { useEffect, useRef } from 'react';
import { motion, PanInfo, useReducedMotion } from 'framer-motion';
import { CartItemCard } from './CartItemCard';
import Cart from 'src/types/cart';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { featureFlags } from '@core/config/featureFlags';

interface CartAsideProps {
  cart?: Cart;
  isOpen: boolean;
  onClose: () => void;
}

/** Critically damped sheet spring — Apple §4 */
const SHEET_SPRING = { type: 'spring' as const, bounce: 0, duration: 0.38 };

export const CartAside: React.FC<CartAsideProps> = ({ cart, isOpen, onClose }) => {
  const totalPrice = cart?.items?.reduce((total, item) => total + (item.price * (item.quantity || 0) || 0), 0);
  const { t, i18n } = useTranslation('common');
  const asideRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isRTL = i18n.dir() === 'rtl';
  // Pixel exit distance so drag (px) and animate share one unit space
  const closedX = isRTL ? -420 : 420;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const dismissByDistance = isRTL ? offset < -96 : offset > 96;
    const dismissByVelocity = isRTL ? velocity < -450 : velocity > 450;
    if (dismissByDistance || dismissByVelocity) {
      onClose();
    }
  };

  return (
    <motion.aside
      ref={asideRef}
      className={`cart-aside ${isOpen ? 'open' : ''}`}
      data-direction={i18n.dir()}
      aria-label={t('navigation.cart', 'Your cart')}
      aria-hidden={!isOpen}
      initial={false}
      animate={{ x: isOpen ? 0 : closedX }}
      transition={reduceMotion ? { duration: 0.15 } : SHEET_SPRING}
      drag={isOpen && !reduceMotion ? 'x' : false}
      dragConstraints={isRTL ? { left: -320, right: 0 } : { left: 0, right: 320 }}
      dragElastic={0.18}
      onDragEnd={handleDragEnd}
      style={{ touchAction: 'pan-y' }}
    >
      <div className="cart-aside-header">
        <h2>{t('navigation.cart', 'Your Cart')}</h2>
        <button type="button" onClick={onClose} className="close-btn" aria-label="Close cart">
          ×
        </button>
      </div>
      <div className="cart-aside-content">
        {cart?.items?.map((item) => <CartItemCard key={`${item.itemId}-${item.bookingDate}`} item={item} />)}
      </div>
      <div className="cart-aside-footer">
        <div className="total">
          <span>Total:</span>
          <span>₪{totalPrice?.toFixed(2)}</span>
        </div>
        {featureFlags.checkout && (
          <Link to={`${i18n.language}/order`} onClick={onClose} className="checkout-button">
            Checkout
          </Link>
        )}
      </div>
    </motion.aside>
  );
};
