import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import './ProTip.scss';

export interface ProTipProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** If true, children will be rendered as HTML (use with caution) */
  dangerouslySetInnerHTML?: boolean;
}

/**
 * ProTip - A reusable info/tip component with a blue accent
 * 
 * @example
 * ```tsx
 * <ProTip>
 *   Studios with detailed descriptions get <strong>2x more bookings</strong>.
 * </ProTip>
 * ```
 */
export const ProTip = ({ 
  title, 
  children, 
  className = '',
  dangerouslySetInnerHTML = false 
}: ProTipProps) => {
  const { t } = useTranslation('forms');
  const displayTitle = title || t('form.proTip', 'Pro Tip');

  return (
    <div className={`pro-tip ${className}`}>
      <div className="pro-tip__icon">
        <InfoIcon />
      </div>
      <div className="pro-tip__content">
        <h4 className="pro-tip__title">{displayTitle}</h4>
        {dangerouslySetInnerHTML && typeof children === 'string' ? (
          <p 
            className="pro-tip__text" 
            dangerouslySetInnerHTML={{ __html: children }}
          />
        ) : (
          <p className="pro-tip__text">{children}</p>
        )}
      </div>
    </div>
  );
};
