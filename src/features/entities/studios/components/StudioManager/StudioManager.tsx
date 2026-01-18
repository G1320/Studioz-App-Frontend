import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useToggleStudioActiveMutation, useToggleItemActiveMutation } from '@shared/hooks/mutations/studios/studioMutations';
import { useItems } from '@shared/hooks';
import Item from 'src/types/item';
import { StudioBlockModal } from '../StudioBlockTimeSlotModal';

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
    active: t('status.active', 'פעיל'),
    offline: t('status.offline', 'לא זמין'),
    maintenance: t('status.maintenance', 'בתחזוקה')
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
        <div className="studio-card__image-wrapper">
          <img src={studioImage} alt={studioName} className="studio-card__image" />
          <div className="studio-card__image-overlay" />
        </div>

        <div className="studio-card__info">
          <div className="studio-card__info-main">
            <div className="studio-card__title-row">
              <h3 className="studio-card__title">
                {studioName}
                <StatusBadge status={status} />
              </h3>
              <div className="studio-card__address">
                <LocationIcon />
                {studio.address || studio.city || t('noAddress', 'No address')}
              </div>
            </div>
            
            <div className="studio-card__stats">
              <div className="studio-card__stat">
                <div className="studio-card__stat-value">{studio.averageRating?.toFixed(1) || '—'}</div>
                <div className="studio-card__stat-label">{t('rating', 'דירוג')}</div>
              </div>
              <div className="studio-card__stat-divider" />
              <div className="studio-card__stat">
                <div className="studio-card__stat-value">{studio.reviewCount || 0}</div>
                <div className="studio-card__stat-label">{t('reviews', 'ביקורות')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="studio-card__controls">
          <div className="studio-card__toggle-section">
            <span className={`studio-card__toggle-label ${isActive ? 'studio-card__toggle-label--active' : ''}`}>
              {isActive ? t('available', 'זמין') : t('notAvailable', 'לא זמין')}
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
              title={t('viewStudio', 'צפה בסטודיו')}
              onClick={() => window.open(`/studio/${studio._id}`, '_blank')}
            >
              <ExternalLinkIcon />
            </button>
            <button 
              className="studio-card__action-btn" 
              title={t('editStudio', 'ערוך פרטי סטודיו')}
              onClick={() => onEdit?.(studio._id)}
            >
              <EditIcon />
            </button>
            <button 
              className="studio-card__action-btn" 
              title={t('calendar', 'יומן')}
              onClick={() => setIsBlockModalOpen(true)}
            >
              <CalendarIcon />
            </button>
            <button 
              className="studio-card__action-btn" 
              title={t('addNewService', 'הוסף שירות חדש')}
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
          <span>{t('itemsAndServices', 'פריטים ושירותים')} ({items.length})</span>
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
                               item.subCategories?.[0] || item.categories?.[0] || 'Service';
              const itemPrice = fullItem?.price ?? item.price ?? 0;
              const itemPricePer = fullItem?.pricePer || 'hour';
              const itemDuration = fullItem?.minimumBookingDuration?.value || item.minimumBookingDuration?.value || 60;
              
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
                        {!itemActive && (
                          <span className="studio-card__item-status-tag">
                            {t('unavailable', 'לא זמין')}
                          </span>
                        )}
                      </div>
                      <p className="studio-card__item-meta">
                        <span>₪{itemPrice} {itemPricePer === 'hour' ? t('perHour', 'לשעה') : `/${itemPricePer}`}</span>
                        <span className="studio-card__item-meta-divider" />
                        <span>{t('upTo', 'עד')} {itemDuration} {t('minutes', 'דק׳')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="studio-card__item-controls">
                    <button 
                      className="studio-card__item-link"
                      onClick={() => langNavigate(`/studio/${studio._id}/items/${itemId}/edit`)}
                    >
                      {t('manageAvailability', 'ניהול זמינות')}
                    </button>
                    
                    <div className="studio-card__item-divider" />

                    <div className="studio-card__item-toggle-group">
                      <span className="studio-card__item-toggle-label">
                        {itemActive ? t('available', 'זמין') : t('notAvailable', 'לא זמין')}
                      </span>
                      <Toggle 
                        checked={itemActive} 
                        onChange={(checked) => onToggleItem(studio._id, itemId, checked)}
                        disabled={isTogglingItem}
                      />
                      <button 
                        className="studio-card__item-more"
                        onClick={() => window.open(`/studio/${studio._id}?item=${itemId}`, '_blank')}
                        title={t('viewItem', 'צפה בשירות')}
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
                {t('addNewService', 'הוסף שירות חדש לסטודיו זה')}
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'offline'>('all');

  // Fetch all items to get full item data including names
  const { data: items = [] } = useItems();
  
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
            <h1 className="studio-manager__title">{t('assetManagement', 'ניהול נכסים')}</h1>
          </div>
          
          <div className="studio-manager__header-actions">
            <button className="studio-manager__add-btn" onClick={handleAddStudio}>
              <AddIcon />
              <span>{t('addNewStudio', 'הוסף סטודיו חדש')}</span>
            </button>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="studio-manager__filters">
          <div className="studio-manager__search">
            <SearchIcon className="studio-manager__search-icon" />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder', 'חפש לפי שם סטודיו או כתובת...')}
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
                {f === 'all' ? t('filterAll', 'הכל') : f === 'active' ? t('filterActive', 'פעילים') : t('filterOffline', 'לא זמינים')}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="studio-manager__stats">
          <div className="studio-manager__stat-card">
            <div className="studio-manager__stat-content">
              <p className="studio-manager__stat-label">{t('totalStudios', 'סה״כ סטודיוס')}</p>
              <p className="studio-manager__stat-value">{stats.totalStudios}</p>
            </div>
            <div className="studio-manager__stat-icon">
              <BusinessIcon />
            </div>
          </div>
          <div className="studio-manager__stat-card">
            <div className="studio-manager__stat-content">
              <p className="studio-manager__stat-label">{t('activeStudios', 'סטודיוס פעילים')}</p>
              <p className="studio-manager__stat-value">{stats.activeStudios}</p>
            </div>
            <div className="studio-manager__stat-icon">
              <BusinessIcon />
            </div>
          </div>
          <div className="studio-manager__stat-card">
            <div className="studio-manager__stat-content">
              <p className="studio-manager__stat-label">{t('activeServices', 'שירותים פעילים')}</p>
              <p className="studio-manager__stat-value">{stats.activeItems}/{stats.totalItems}</p>
            </div>
            <div className="studio-manager__stat-icon">
              <MicIcon />
            </div>
          </div>
          <div className="studio-manager__stat-card">
            <div className="studio-manager__stat-content">
              <p className="studio-manager__stat-label">{t('monthlyRevenue', 'הכנסות החודש')}</p>
              <p className="studio-manager__stat-value">—</p>
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
              <h3 className="studio-manager__empty-title">{t('noResults', 'לא נמצאו תוצאות')}</h3>
              <p className="studio-manager__empty-text">
                {t('tryDifferentFilters', 'נסה לשנות את מסנני החיפוש או הוסף סטודיו חדש')}
              </p>
              <button 
                onClick={() => { setSearchTerm(''); setFilter('all'); }}
                className="studio-manager__empty-clear"
              >
                {t('clearFilters', 'נקה סינון')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioManager;
