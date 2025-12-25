import { PopupDropdown, DistanceBadge } from '@shared/components';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ListIcon from '@mui/icons-material/List';
import { Item, Wishlist } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { ItemBadges } from './ItemBadges';
import '../styles/_item-features.scss';
import '../../../../app/layout/header/components/styles/menu-dropdown.scss';

interface ItemFeaturesProps {
  item: Item;
  wishlists?: Wishlist[];
  distance?: number | null;
  onAddToWishlist?: (wishlistId: string) => void;
  userId?: string;
  showDistanceBadge?: boolean;
}

export const ItemFeatures: React.FC<ItemFeaturesProps> = ({
  item,
  wishlists = [],
  distance,
  onAddToWishlist,
  userId,
  showDistanceBadge = true
}) => {
  const { t } = useTranslation('common');
  const langNavigate = useLanguageNavigate();

  const getCityForDisplay = (address: string) => {
    if (!address || !address?.includes(',')) return '';
    const addressParts = address?.split(',').map((part) => part.trim());
    const cityPart = addressParts[addressParts.length - 2];
    if (/^\d+$/.test(cityPart)) {
      return addressParts[addressParts.length - 3] || '';
    }
    return cityPart || '';
  };

  const city = item?.address ? getCityForDisplay(item.address) : '';

  const handleCreateWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    langNavigate('/create-wishlist');
  };

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
      {item?.studioName?.en && (
        <div className="item-studio-badge">
          <LocationOnIcon className="item-studio-badge__icon" />
          <span>{item.studioName.en}</span>
        </div>
      )}
      {userId && (
        <ItemBadges>
          <PopupDropdown
            trigger={
              <button className="item-card-wishlists-dropdown-trigger" aria-label="Add to wishlist">
                <FavoriteBorderIcon />
              </button>
            }
            className="menu-dropdown item-card-wishlists-dropdown"
            anchor="bottom-right"
            minWidth="200px"
            maxWidth="300px"
          >
            <div className="menu-dropdown__content">
              {wishlists.length === 0 ? (
                <button className="menu-dropdown__item menu-dropdown__item--login" onClick={handleCreateWishlist}>
                  <AddIcon className="menu-dropdown__icon" />
                  <span>{t('wishlists.create_new')}</span>
                </button>
              ) : (
                <>
                  <button className="menu-dropdown__item menu-dropdown__item--login" onClick={handleCreateWishlist}>
                    <AddIcon className="menu-dropdown__icon" />
                    <span>{t('wishlists.create_new')}</span>
                  </button>
                  {wishlists.map((wishlist) => (
                    <button
                      key={wishlist._id}
                      className="menu-dropdown__item"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAddToWishlist) {
                          onAddToWishlist(wishlist._id);
                        }
                      }}
                    >
                      <ListIcon className="menu-dropdown__icon" />
                      <span>{wishlist.name}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </PopupDropdown>
        </ItemBadges>
      )}
    </div>
  );
};
