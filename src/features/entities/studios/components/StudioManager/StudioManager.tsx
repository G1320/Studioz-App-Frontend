import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useToggleStudioActiveMutation, useToggleItemActiveMutation } from '@shared/hooks/mutations/studios/studioMutations';
import { useItems, useMerchantStats } from '@shared/hooks';
import Item from 'src/types/item';
import { StudioBlockModal } from '../StudioBlockTimeSlotModal';
import { useUserContext } from '@core/contexts';
import dayjs from 'dayjs';

import {
  BusinessIcon,
  LocationIcon,
  EditIcon,
  CalendarIcon,
  SettingsIcon,
  MicIcon,
  CameraIcon,
  MusicNoteIcon,
  VideocamIcon,
  AddIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  FilterIcon,
  WalletIcon,
  ExternalLinkIcon
} from '@shared/components/icons';

import { Studio } from 'src/types/index';
import './styles/_studio-manager.scss';

// --- Types ---
type Status = 'active' | 'offline' | 'maintenance';

interface StudioManagerProps {
  studios: Studio[];
  onAddStudio?: () => void;
  onEditStudio?: (studioId: string) => void;
  onAddItem?: (studioId: string) => void;
}

// --- Helper function to get status from active boolean ---
const getStatusFromActive = (active?: boolean): Status => {
  if (active === false) return 'offline';
  return 'active'; // default to active if undefined or true
};

// --- Helper Components ---

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const { t } = useTranslation('studioManager');
  
  const labels = {
    active: t('status.active', 'Active'),
    offline: t('status.offline', 'Offline'),
    maintenance: t('status.maintenance', 'Maintenance')
  };

  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" />
      {labels[status]}
    </span>
  );
};

const Toggle: React.FC<{ 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  disabled?: boolean;
}> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    className={`toggle ${checked ? 'toggle--active' : ''} ${disabled ? 'toggle--disabled' : ''}`}
    disabled={disabled}
    aria-pressed={checked}
  >
    <span className="toggle__thumb" />
  </button>
);

const ItemTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'audio':
    case 'recording':
    case 'Music Production':
    case 'Mixing':
    case 'Mastering':
      return <MicIcon />;
    case 'photo':
    case 'photography':
      return <CameraIcon />;
    case 'video':
    case 'Film & Post Production':
      return <VideocamIcon />;
    case 'podcast':
    case 'Podcast Recording':
      return <MusicNoteIcon />;
    default:
      return <SettingsIcon />;
  }
};

// --- Studio Card Component ---
interface StudioCardProps {
  studio: Studio;
  itemsMap: Map<string, Item>;
  onToggleStudio: (id: string, newActive: boolean) => void;
  onToggleItem: (studioId: string, itemId: string, newActive: boolean) => void;
  isTogglingStudio: boolean;
  isTogglingItem: boolean;
  onEdit?: (studioId: string) => void;
  onAddItem?: (studioId: string) => void;
}

const StudioCard: React.FC<StudioCardProps> = ({ 
  studio, 
  itemsMap,
  onToggleStudio, 
  onToggleItem,
  isTogglingStudio,
  isTogglingItem,
  onEdit,
  onAddItem
}) => {
  const { t, i18n } = useTranslation('studioManager');
  const langNavigate = useLanguageNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const currentLang = i18n.language as 'en' | 'he';

  const studioName = studio.name?.[currentLang] || studio.name?.en || studio.name?.he || 'Studio';
  const studioImage = studio.coverImage || studio.galleryImages?.[0] || '/images/studio-placeholder.jpg';
  const status = getStatusFromActive(studio.active);
  const isActive = studio.active !== false;

  // Get items from studio
  const items = studio.items || [];

  return (
    <div className={`studio-card ${status !== 'active' ? 'studio-card--inactive' : ''}`}>
      {/* Studio Header */}
      <div className="studio-card__header">
        <Link
          to={`/${currentLang}/studio/${studio._id}`}
          className="studio-card__image-wrapper"
          aria-label={studioName}
        >
          <img src={studioImage} alt={studioName} className="studio-card__image" />
          <div className="studio-card__image-overlay" aria-hidden="true" />
        </Link>

        <div className="studio-card__info">
          <div className="studio-card__info-main">
            <Link to={`/${currentLang}/studio/${studio._id}`} className="studio-card__title-row">
              <h3 className="studio-card__title">
                {studioName}
                <StatusBadge status={status} />
              </h3>
              <div className="studio-card__address">
                <LocationIcon />
                {studio.address || studio.city || t('noAddress', 'No address')}
              </div>
            </Link>
            
            <div className="studio-card__stats">
              <div className="studio-card__stat">
                <div className="studio-card__stat-value">{studio.averageRating?.toFixed(1) || '—'}</div>
                <div className="studio-card__stat-label">{t('rating', 'Rating')}</div>
              </div>
              <div className="studio-card__stat-divider" />
              <div className="studio-card__stat">
                <div className="studio-card__stat-value">{studio.reviewCount || 0}</div>
                <div className="studio-card__stat-label">{t('reviews', 'Reviews')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="studio-card__controls">
          <div className="studio-card__toggle-section">
            <span className={`studio-card__toggle-label ${isActive ? 'studio-card__toggle-label--active' : ''}`}>
              {isActive ? t('available', 'Available') : t('notAvailable', 'Not Available')}
            </span>
            <Toggle 
              checked={isActive} 
              onChange={(checked) => onToggleStudio(studio._id, checked)}
              disabled={isTogglingStudio}
            />
          </div>
          
          <div className="studio-card__actions">
            <button 
              className="studio-card__action-btn" 
              title={t('viewStudio', 'View Studio')}
              onClick={() => window.open(`/studio/${studio._id}`, '_blank')}
            >
              <ExternalLinkIcon />
            </button>
            <button 
              className="studio-card__action-btn" 
              title={t('editStudio', 'Edit Studio Details')}
              onClick={() => onEdit?.(studio._id)}
            >
              <EditIcon />
            </button>
            <button 
              className="studio-card__action-btn" 
              title={t('calendar', 'Calendar')}
              onClick={() => setIsBlockModalOpen(true)}
            >
              <CalendarIcon />
            </button>
            <button 
              className="studio-card__action-btn" 
              title={t('addNewService', 'Add New Service')}
              onClick={() => onAddItem?.(studio._id)}
            >
              <AddIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Block Time Modal */}
      <StudioBlockModal
        studioId={studio._id}
        studioAvailability={studio.studioAvailability}
        open={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
      />

      {/* Items Section */}
      <div className="studio-card__items-section">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="studio-card__items-toggle"
        >
          <span>{t('itemsAndServices', 'Items & Services')} ({items.length})</span>
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
        
        {isExpanded && (
          <div className="studio-card__items-list">
            {items.map((item) => {
              const itemActive = item.active !== false;
              const itemStatus = getStatusFromActive(item.active);
              const itemId = item.itemId || item._id || '';
              // Get full item data from map for the actual name
              const fullItem = itemsMap.get(itemId);
              const itemName = fullItem?.name?.[currentLang] || fullItem?.name?.en || fullItem?.name?.he || 
                               item.name?.[currentLang] || item.name?.en || item.name?.he || 
                               item.subCategories?.[0] || item.categories?.[0] || t('service', 'Service');
              const itemPrice = fullItem?.price ?? item.price;
              const itemPricePer = fullItem?.pricePer;
              
              // Detect if this is a remote/project item (not hourly booking)
              const isRemoteItem = fullItem?.remoteService || 
                                   fullItem?.serviceDeliveryType === 'remote' ||
                                   itemName.toLowerCase().includes('remote') ||
                                   itemPricePer === 'project' || itemPricePer === 'song';
              
              // Get duration info - only relevant for hourly items
              const durationValue = fullItem?.minimumBookingDuration?.value || item.minimumBookingDuration?.value;
              const durationUnit = fullItem?.minimumBookingDuration?.unit || item.minimumBookingDuration?.unit || 'minutes';
              const isHourlyItem = itemPricePer === 'hour' && !isRemoteItem;
              
              // Format price display
              const getPriceDisplay = () => {
                // Remote/project items - show price per project or contact for pricing
                if (isRemoteItem) {
                  if (itemPrice && itemPrice > 0) {
                    if (itemPricePer === 'song') return `₪${itemPrice} ${t('perSong', 'per song')}`;
                    return `₪${itemPrice} ${t('perProject', 'per project')}`;
                  }
                  return t('priceOnRequest', 'Price on request');
                }
                
                // Hourly items
                if (itemPricePer === 'hour' || !itemPricePer) {
                  if (itemPrice && itemPrice > 0) {
                    return `₪${itemPrice} ${t('perHour', 'per hour')}`;
                  }
                  return t('priceOnRequest', 'Price on request');
                }
                
                // Other price types
                const priceLabels: Record<string, string> = {
                  'session': t('perSession', 'per session'),
                  'day': t('perDay', 'per day'),
                  'project': t('perProject', 'per project'),
                  'song': t('perSong', 'per song'),
                };
                const priceLabel = (itemPricePer && priceLabels[itemPricePer]) || `/${itemPricePer}`;
                
                if (itemPrice && itemPrice > 0) {
                  return `₪${itemPrice} ${priceLabel}`;
                }
                return t('priceOnRequest', 'Price on request');
              };
              
              // Format duration display
              const getDurationLabel = () => {
                if (!durationValue) return null;
                switch (durationUnit) {
                  case 'hours': return `${durationValue} ${t('hours', 'hours')}`;
                  case 'days': return `${durationValue} ${t('days', 'days')}`;
                  default: return `${durationValue} ${t('minutes', 'min')}`;
                }
              };
              
              return (
                <div 
                  key={itemId} 
                  className={`studio-card__item ${itemStatus === 'offline' ? 'studio-card__item--inactive' : ''}`}
                >
                  <div className="studio-card__item-info">
                    <div className={`studio-card__item-icon ${itemActive ? 'studio-card__item-icon--active' : ''}`}>
                      <ItemTypeIcon type={item.subCategories?.[0] || item.categories?.[0] || 'audio'} />
                    </div>
                    <div className="studio-card__item-details">
                      <div className="studio-card__item-name-row">
                        <h4 className={`studio-card__item-name ${!itemActive ? 'studio-card__item-name--inactive' : ''}`}>
                          {itemName}
                        </h4>
                        <span className={`studio-card__item-status-tag ${itemActive ? 'studio-card__item-status-tag--hidden' : ''}`}>
                          {t('unavailable', 'Unavailable')}
                        </span>
                      </div>
                      <p className="studio-card__item-meta">
                        <span>{getPriceDisplay()}</span>
                        {isHourlyItem && durationValue && (
                          <>
                            <span className="studio-card__item-meta-divider" />
                            <span>{t('minimum', 'minimum')} {getDurationLabel()}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="studio-card__item-controls">
                    <button 
                      className="studio-card__item-link"
                      onClick={() => langNavigate(`/item/${itemId}/edit?step=booking-settings`)}
                    >
                      {t('manageAvailability', 'Manage Availability')}
                    </button>
                    
                    <div className="studio-card__item-divider" />

                    <div className="studio-card__item-toggle-group">
                      <span className="studio-card__item-toggle-label">
                        {itemActive ? t('available', 'Available') : t('notAvailable', 'Not Available')}
                      </span>
                      <Toggle 
                        checked={itemActive} 
                        onChange={(checked) => onToggleItem(studio._id, itemId, checked)}
                        disabled={isTogglingItem}
                      />
                      <button 
                        className="studio-card__item-more"
                        onClick={() => langNavigate(`/item/${itemId}/edit`)}
                        title={t('editItem', 'Edit Service')}
                      >
                        <EditIcon />
                      </button>
                      <button 
                        className="studio-card__item-more"
                        onClick={() => window.open(`/studio/${studio._id}?item=${itemId}`, '_blank')}
                        title={t('viewItem', 'View Service')}
                      >
                        <ExternalLinkIcon />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="studio-card__add-item">
              <button 
                className="studio-card__add-item-btn"
                onClick={() => onAddItem?.(studio._id)}
              >
                <AddIcon />
                {t('addNewService', 'Add new service to this studio')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
export const StudioManager: React.FC<StudioManagerProps> = ({ 
  studios,
  onAddStudio,
  onEditStudio,
  onAddItem
}) => {
  const { t } = useTranslation('studioManager');
  const langNavigate = useLanguageNavigate();
  const { user } = useUserContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'offline'>('all');

  // Fetch all items to get full item data including names
  const { data: items = [] } = useItems();
  const { data: merchantStats } = useMerchantStats({
    startDate: dayjs().startOf('month').toDate(),
    endDate: dayjs().endOf('month').toDate()
  });
  
  // Create a map of itemId -> full Item for quick lookup
  const itemsMap = useMemo(() => {
    const map = new Map<string, Item>();
    items.forEach((item) => {
      if (item._id) map.set(item._id, item);
    });
    return map;
  }, [items]);

  // Mutations
  const toggleStudioMutation = useToggleStudioActiveMutation();
  const toggleItemMutation = useToggleItemActiveMutation();

  // Handle studio toggle
  const handleToggleStudio = (studioId: string, newActive: boolean) => {
    toggleStudioMutation.mutate({ studioId, active: newActive });
  };

  // Handle item toggle
  const handleToggleItem = (studioId: string, itemId: string, newActive: boolean) => {
    toggleItemMutation.mutate({ studioId, itemId, active: newActive });
  };

  // Filter studios
  const filteredStudios = useMemo(() => {
    return studios.filter(studio => {
      const studioName = studio.name?.en || studio.name?.he || '';
      const matchesSearch = studioName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (studio.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (studio.city || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const status = getStatusFromActive(studio.active);
      const matchesFilter = filter === 'all' || status === filter;
      
      return matchesSearch && matchesFilter;
    });
  }, [studios, searchTerm, filter]);

  // Stats
  const stats = useMemo(() => ({
    totalStudios: studios.length,
    activeStudios: studios.filter(s => s.active !== false).length,
    // Items are only considered active if both the item AND its parent studio are active
    activeItems: studios.reduce((acc, s) => {
      if (s.active === false) return acc; // Studio disabled = 0 active items from this studio
      return acc + (s.items?.filter(i => i.active !== false).length || 0);
    }, 0),
    totalItems: studios.reduce((acc, s) => acc + (s.items?.length || 0), 0)
  }), [studios]);
  const monthlyRevenueDisplay = useMemo(() => {
    if (user?.isAdmin) {
      return '—';
    }
    const amount = merchantStats?.totalRevenue ?? 0;
    return `₪${amount.toLocaleString()}`;
  }, [merchantStats?.totalRevenue, user?.isAdmin]);

  const handleAddStudio = () => {
    if (onAddStudio) {
      onAddStudio();
    } else {
      langNavigate('/studio/create');
    }
  };

  const handleEditStudio = (studioId: string) => {
    if (onEditStudio) {
      onEditStudio(studioId);
    } else {
      langNavigate(`/studio/${studioId}/edit`);
    }
  };

  const handleAddItem = (studioId: string) => {
    if (onAddItem) {
      onAddItem(studioId);
    } else {
      langNavigate(`/studio/${studioId}/items/create`);
    }
  };

  return (
    <div className="studio-manager">
      <div className="studio-manager__container">
        
        {/* Header */}
        <div className="studio-manager__header">
          <div className="studio-manager__title-row">
            <BusinessIcon className="studio-manager__title-icon" />
            <h1 className="studio-manager__title">{t('assetManagement', 'Asset Management')}</h1>
          </div>
          
          <div className="studio-manager__header-actions">
            <button className="studio-manager__add-btn" onClick={handleAddStudio}>
              <AddIcon />
              <span>{t('addNewStudio', 'Add New Studio')}</span>
            </button>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="studio-manager__filters">
          <div className="studio-manager__search">
            <SearchIcon className="studio-manager__search-icon" />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder', 'Search by studio name or address...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="studio-manager__search-input"
            />
          </div>
          
          <div className="studio-manager__filters-divider" />
          
          <div className="studio-manager__filter-tabs">
            {(['all', 'active', 'offline'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`studio-manager__filter-tab ${filter === f ? 'studio-manager__filter-tab--active' : ''}`}
              >
                {f === 'all' ? t('filterAll', 'All') : f === 'active' ? t('filterActive', 'Active') : t('filterOffline', 'Offline')}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="studio-manager__stats">
          <div className="studio-manager__stat-card">
            <div className="studio-manager__stat-content">
              <p className="studio-manager__stat-label">{t('totalStudios', 'Total Studios')}</p>
              <p className="studio-manager__stat-value">{stats.totalStudios}</p>
            </div>
            <div className="studio-manager__stat-icon">
              <BusinessIcon />
            </div>
          </div>
          <div className="studio-manager__stat-card">
            <div className="studio-manager__stat-content">
              <p className="studio-manager__stat-label">{t('activeStudios', 'Active Studios')}</p>
              <p className="studio-manager__stat-value">{stats.activeStudios}</p>
            </div>
            <div className="studio-manager__stat-icon">
              <BusinessIcon />
            </div>
          </div>
          <div className="studio-manager__stat-card">
            <div className="studio-manager__stat-content">
              <p className="studio-manager__stat-label">{t('activeServices', 'Active Services')}</p>
              <p className="studio-manager__stat-value">{stats.activeItems}/{stats.totalItems}</p>
            </div>
            <div className="studio-manager__stat-icon">
              <MicIcon />
            </div>
          </div>
          <div className="studio-manager__stat-card">
            <div className="studio-manager__stat-content">
              <p className="studio-manager__stat-label">{t('monthlyRevenue', 'Monthly Revenue')}</p>
              <p className="studio-manager__stat-value">{monthlyRevenueDisplay}</p>
            </div>
            <div className="studio-manager__stat-icon">
              <WalletIcon />
            </div>
          </div>
        </div>

        {/* Studios List */}
        <div className="studio-manager__list">
          {filteredStudios.map(studio => (
            <StudioCard 
              key={studio._id} 
              studio={studio}
              itemsMap={itemsMap}
              onToggleStudio={handleToggleStudio}
              onToggleItem={handleToggleItem}
              isTogglingStudio={toggleStudioMutation.isPending}
              isTogglingItem={toggleItemMutation.isPending}
              onEdit={handleEditStudio}
              onAddItem={handleAddItem}
            />
          ))}
          
          {filteredStudios.length === 0 && (
            <div className="studio-manager__empty">
              <div className="studio-manager__empty-icon">
                <FilterIcon />
              </div>
              <h3 className="studio-manager__empty-title">{t('noResults', 'No Results Found')}</h3>
              <p className="studio-manager__empty-text">
                {t('tryDifferentFilters', 'Try adjusting your filters or add a new studio')}
              </p>
              <button 
                onClick={() => { setSearchTerm(''); setFilter('all'); }}
                className="studio-manager__empty-clear"
              >
                {t('clearFilters', 'Clear Filters')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioManager;
