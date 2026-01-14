import React, { useState, useEffect } from 'react';
import { GenericModal, Button } from '@shared/components';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { useGeolocation } from '@shared/hooks/utils/geolocation';
import { useTranslation } from 'react-i18next';
import { LocationIcon } from '@shared/components/icons';
import './styles/_location-welcome-popup.scss';

interface LocationWelcomePopupProps {
  open: boolean;
  onClose: () => void;
  onLocationGranted?: (position: { latitude: number; longitude: number }) => void;
}

export const LocationWelcomePopup: React.FC<LocationWelcomePopupProps> = ({ open, onClose, onLocationGranted }) => {
  const { t } = useTranslation('location');
  const { grantPermission, denyPermission, setUserLocation } = useLocationPermission();
  const { getCurrentPosition, isLoading, error } = useGeolocation();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Handle exit animation
  useEffect(() => {
    if (!open && isExiting) {
      // Reset exiting state after animation completes
      const timer = setTimeout(() => setIsExiting(false), 50);
      return () => clearTimeout(timer);
    }
  }, [open, isExiting]);

  const handleAllow = async () => {
    setIsRequesting(true);
    const position = await getCurrentPosition();

    if (position) {
      grantPermission();
      // Save location to storage and update context
      setUserLocation({ latitude: position.latitude, longitude: position.longitude });
      onLocationGranted?.(position);
      setIsExiting(true);
      // Delay onClose to allow exit animation
      setTimeout(() => {
        onClose();
      }, 350);
    } else {
      // User denied browser permission, but we still mark as asked
      denyPermission();
    }
    setIsRequesting(false);
  };

  const handleNotNow = () => {
    setIsExiting(true);
    denyPermission();
    // Delay onClose to allow exit animation
    setTimeout(() => {
      onClose();
    }, 350);
  };

  const handleClose = () => {
    setIsExiting(true);
    // Delay onClose to allow exit animation
    setTimeout(() => {
      onClose();
    }, 350);
  };

  const isProcessing = isLoading || isRequesting;

  return (
    <GenericModal open={open} onClose={handleClose} className="location-welcome-popup-modal">
      <div className={`location-welcome-popup ${isExiting ? 'exiting' : ''}`}>
        <div className="location-welcome-popup__icon">
          <LocationIcon />
        </div>

        <h2 className="location-welcome-popup__title">{t('popup.title')}</h2>
        <p className="location-welcome-popup__description">{t('popup.description')}</p>
        <p className="location-welcome-popup__note">{t('popup.note')}</p>

        {error && (
          <div className="location-welcome-popup__error">
            <p>{t('popup.error')}</p>
          </div>
        )}

        <div className="location-welcome-popup__actions">
          <Button
            onClick={handleAllow}
            className="location-welcome-popup__button location-welcome-popup__button--primary"
            disabled={isProcessing}
          >
            {isProcessing ? t('popup.loading') : t('popup.allow')}
          </Button>
          <Button
            onClick={handleNotNow}
            className="location-welcome-popup__button location-welcome-popup__button--secondary"
            disabled={isProcessing}
          >
            {t('popup.not_now')}
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};
