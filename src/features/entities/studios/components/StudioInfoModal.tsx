import { Suspense } from 'react';
import { GenericModal } from '@shared/components';
import { LazyMinimap } from '@shared/components/maps';
import { Studio } from 'src/types/index';
import '../styles/_studio-minimap-modal.scss';

interface StudioInfoModalProps {
  open: boolean;
  onClose: () => void;
  studio?: Studio;
}

export const StudioInfoModal: React.FC<StudioInfoModalProps> = ({ open, onClose, studio }) => {
  if (!studio?.lat || !studio?.lng) {
    return null;
  }

  return (
    <GenericModal open={open} onClose={onClose} className="studio-minimap-modal">
      <div className="studio-minimap-modal__content">
        <h2 className="studio-minimap-modal__title">{studio?.name.en}</h2>
        {studio?.address && <p className="studio-minimap-modal__address">{studio.address}</p>}
        <Suspense
          fallback={
            <div className="map-loader">
              <div className="map-loader__spinner"></div>
            </div>
          }
        >
          <LazyMinimap
            latitude={studio.lat!}
            longitude={studio.lng!}
            width="100%"
            height="400px"
            className="studio-minimap-modal__map"
          />
        </Suspense>
      </div>
    </GenericModal>
  );
};

