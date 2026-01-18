import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { Studio } from 'src/types';
import {
  CreditCardIcon,
  CalendarIcon,
  FileTextIcon,
  BusinessIcon,
  MicIcon,
  BlockIcon,
  DownloadIcon,
  ChevronDownIcon
} from '@shared/components/icons';

interface QuickActionsProps {
  studios?: Studio[];
  onQuickCharge?: () => void;
  onNewInvoice?: () => void;
  onNewReservation?: (studioId?: string) => void;
  onBlockTime?: (studioId: string) => void;
  onDownloadReport?: () => void;
  className?: string;
}

type MenuType = 'add-service' | 'new-reservation' | 'block-time' | null;

export const QuickActions: React.FC<QuickActionsProps> = ({
  studios = [],
  onQuickCharge,
  onNewInvoice,
  onNewReservation,
  onBlockTime,
  onDownloadReport,
  className = ''
}) => {
  const { t, i18n } = useTranslation('dashboard');
  const langNavigate = useLanguageNavigate();
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentLang = i18n.language as 'en' | 'he';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  const getStudioName = (studio: Studio) => {
    return studio.name?.[currentLang] || studio.name?.en || studio.name?.he || 'Studio';
  };

  const handleStudioSelect = (studioId: string, actionType: MenuType) => {
    setOpenMenu(null);
    
    if (actionType === 'add-service') {
      langNavigate(`/studio/${studioId}/items/create`);
    } else if (actionType === 'new-reservation') {
      // Open manual booking modal with preselected studio
      onNewReservation?.(studioId);
    } else if (actionType === 'block-time') {
      onBlockTime?.(studioId);
    }
  };

  const handleActionClick = (actionId: string) => {
    // Actions that need studio selection
    if (actionId === 'add-service' || actionId === 'new-reservation' || actionId === 'block-time') {
      // If only one studio, go directly
      if (studios.length === 1) {
        handleStudioSelect(studios[0]._id, actionId as MenuType);
      } else if (studios.length > 1) {
        setOpenMenu(openMenu === actionId ? null : actionId as MenuType);
      }
      return;
    }

    // Other actions
    switch (actionId) {
      case 'quick-charge':
        if (onQuickCharge) {
          onQuickCharge();
        } else {
          langNavigate('/dashboard?tab=documents');
        }
        break;
      case 'new-invoice':
        if (onNewInvoice) {
          onNewInvoice();
        } else {
          langNavigate('/dashboard?tab=documents');
        }
        break;
      case 'add-studio':
        langNavigate('/studio/create');
        break;
      case 'download-report':
        if (onDownloadReport) {
          onDownloadReport();
        } else {
          langNavigate('/dashboard?tab=stats');
        }
        break;
    }
  };

  const actions = [
    {
      id: 'quick-charge',
      labelKey: 'quickActions.quickCharge',
      defaultLabel: 'סליקה מהירה',
      icon: <CreditCardIcon />,
      variant: 'primary' as const,
      hasMenu: false
    },
    {
      id: 'new-invoice',
      labelKey: 'quickActions.newInvoice',
      defaultLabel: 'חשבונית חדשה',
      icon: <FileTextIcon />,
      hasMenu: false
    },
    {
      id: 'new-reservation',
      labelKey: 'quickActions.newReservation',
      defaultLabel: 'הזמנה חדשה',
      icon: <CalendarIcon />,
      hasMenu: studios.length > 1
    },
    {
      id: 'block-time',
      labelKey: 'quickActions.blockTime',
      defaultLabel: 'חסום זמן',
      icon: <BlockIcon />,
      hasMenu: studios.length > 1
    },
    {
      id: 'add-service',
      labelKey: 'quickActions.addService',
      defaultLabel: 'הוסף שירות',
      icon: <MicIcon />,
      hasMenu: studios.length > 1
    },
    {
      id: 'add-studio',
      labelKey: 'quickActions.addStudio',
      defaultLabel: 'הוסף אולפן',
      icon: <BusinessIcon />,
      hasMenu: false
    },
    {
      id: 'download-report',
      labelKey: 'quickActions.downloadReport',
      defaultLabel: 'הורד דו״ח',
      icon: <DownloadIcon />,
      hasMenu: false
    }
  ];

  return (
    <div className={`quick-actions ${className}`} ref={menuRef}>
      <div className="quick-actions__header">
        <h2 className="quick-actions__title">
          {t('quickActions.title', 'פעולות מהירות')}
        </h2>
      </div>
      
      <div className="quick-actions__grid">
        {actions.map((action) => (
          <div key={action.id} className="quick-actions__btn-wrapper">
            <button
              className={`quick-actions__btn ${action.variant === 'primary' ? 'quick-actions__btn--primary' : ''} ${openMenu === action.id ? 'quick-actions__btn--active' : ''}`}
              onClick={() => handleActionClick(action.id)}
            >
              <span className="quick-actions__btn-icon">
                {action.icon}
              </span>
              <span className="quick-actions__btn-label">
                {t(action.labelKey, action.defaultLabel)}
              </span>
              {action.hasMenu && (
                <span className={`quick-actions__btn-chevron ${openMenu === action.id ? 'quick-actions__btn-chevron--open' : ''}`}>
                  <ChevronDownIcon />
                </span>
              )}
            </button>

            {/* Studio Selection Dropdown */}
            {action.hasMenu && openMenu === action.id && (
              <div className="quick-actions__menu">
                <div className="quick-actions__menu-header">
                  {t('quickActions.selectStudio', 'בחר אולפן')}
                </div>
                {studios.map((studio) => (
                  <button
                    key={studio._id}
                    className="quick-actions__menu-item"
                    onClick={() => handleStudioSelect(studio._id, action.id as MenuType)}
                  >
                    {studio.coverImage && (
                      <img 
                        src={studio.coverImage} 
                        alt="" 
                        className="quick-actions__menu-item-image" 
                      />
                    )}
                    <span className="quick-actions__menu-item-name">
                      {getStudioName(studio)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
