import { ReactNode } from 'react';
import { GenericMuiDropdown, DistanceBadge, Button } from '@shared/components';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Item, Wishlist } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { ItemBadges } from './ItemBadges';
import '../styles/_item-features.scss';

interface ItemFeaturesProps {
  item: Item;
  wishlists?: Wishlist[];
  distance?: number | null;
  renderWishlistItem: (wishlist: Wishlist) => ReactNode;
  userId?: string;
  showDistanceBadge?: boolean;
}

export const ItemFeatures: React.FC<ItemFeaturesProps> = ({
  item,
  wishlists = [],
  distance,
  renderWishlistItem,
  userId,
  showDistanceBadge = true
}) => {
  const { t } = useTranslation('common');
  const langNavigate = useLanguageNavigate();

  const getCityForDisplay = (address: string) => {
    if (!address || !address.includes(',')) return '';
    const addressParts = address.split(',').map((part) => part.trim());
    const cityPart = addressParts[addressParts.length - 2];
    if (/^\d+$/.test(cityPart)) {
      return addressParts[addressParts.length - 3] || '';
    }
    return cityPart || '';
  };

  const city = item.address ? getCityForDisplay(item.address) : '';

  const handleCreateWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    langNavigate('/create-wishlist');
  };

  const emptyState = (
    <Button onClick={handleCreateWishlist} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1rem' }}>
      <AddIcon style={{ marginRight: '0.5rem' }} />
      {t('wishlists.create_new')}
    </Button>
  );

  return (
    <div className="item-features-container">
      {showDistanceBadge && distance !== null && distance !== undefined && (
        <DistanceBadge distance={distance} showIcon={true} />
      )}
      {city && (
        <div className="item-city-badge">
          <span>{city}</span>
        </div>
      )}
      {item.studioName?.en && (
        <div className="item-studio-badge">
          <LocationOnIcon className="item-studio-badge__icon" />
          <span>{item.studioName.en}</span>
        </div>
      )}
      {userId && (
        <ItemBadges>
          <GenericMuiDropdown
            data={wishlists}
            renderItem={renderWishlistItem}
            className="item-card-wishlists-dropdown"
            icon={<FavoriteBorderIcon />}
            emptyState={emptyState}
          />
        </ItemBadges>
      )}
    </div>
  );
};
