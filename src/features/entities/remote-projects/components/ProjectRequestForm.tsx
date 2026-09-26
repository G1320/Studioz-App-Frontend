import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Item } from 'src/types/index';
import { EditNoteIcon, DescriptionIcon, LinkIcon, OfferIcon, ScheduleIcon, SyncIcon } from '@shared/components/icons';
import './styles/_project-request-form.scss';

interface ProjectRequestFormProps {
  item: Item;
  title: string;
  brief: string;
  referenceLinks: string[];
  onTitleChange: (value: string) => void;
  onBriefChange: (value: string) => void;
  onReferenceLinksChange: (links: string[]) => void;
}

export const ProjectRequestForm: React.FC<ProjectRequestFormProps> = ({
  item,
  title,
  brief,
  referenceLinks,
  onTitleChange,
  onBriefChange,
  onReferenceLinksChange
}) => {
  const { t } = useTranslation('remoteProjects');

  const projectPricing = item.projectPricing;
  const price = projectPricing?.basePrice || item.price || 0;
  const depositAmount = projectPricing?.depositPercentage
    ? (price * projectPricing.depositPercentage) / 100
    : undefined;

  const handleAddReferenceLink = () => {
    if (referenceLinks.length < 5) {
      onReferenceLinksChange([...referenceLinks, '']);
    }
  };

  const handleRemoveReferenceLink = (index: number) => {
    onReferenceLinksChange(referenceLinks.filter((_, i) => i !== index));
  };

  const handleReferenceLinkChange = (index: number, value: string) => {
    const updated = [...referenceLinks];
    updated[index] = value;
    onReferenceLinksChange(updated);
  };

  return (
    <div className="project-form">
      {/* Pricing Summary */}
      <div className="project-form__pricing">
        <div className="project-form__pricing-item">
          <OfferIcon className="project-form__pricing-icon project-form__pricing-icon--price" />
          <span className="project-form__pricing-label">{t('projectPrice')}</span>
          <span className="project-form__pricing-value">₪{price.toLocaleString()}</span>
        </div>
        {depositAmount && (
          <div className="project-form__pricing-item">
            <OfferIcon className="project-form__pricing-icon project-form__pricing-icon--deposit" />
            <span className="project-form__pricing-label">{t('depositRequired')}</span>
            <span className="project-form__pricing-value">₪{depositAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="project-form__pricing-item">
          <ScheduleIcon className="project-form__pricing-icon project-form__pricing-icon--delivery" />
          <span className="project-form__pricing-label">{t('estimatedDelivery')}</span>
          <span className="project-form__pricing-value">
            {projectPricing?.estimatedDeliveryDays || 7} {t('days')}
          </span>
        </div>
        <div className="project-form__pricing-item">
          <SyncIcon className="project-form__pricing-icon project-form__pricing-icon--revisions" />
          <span className="project-form__pricing-label">{t('revisionsIncluded')}</span>
          <span className="project-form__pricing-value">{projectPricing?.revisionsIncluded || 1}</span>
        </div>
      </div>

      {/* Project Details */}
      <div className="project-form__fields">
        <div className="input-container full-width">
          <label className="project-form__field-label" htmlFor="project-request-title">
            {t('projectTitle')}
          </label>
          <div className="project-form__field-control">
            <EditNoteIcon className="input-icon" aria-hidden />
            <input
              id="project-request-title"
              type="text"
              className="project-input has-icon"
              placeholder={t('titlePlaceholder')}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
              maxLength={100}
              aria-required="true"
            />
          </div>
        </div>

        <div className="input-container full-width">
          <label className="project-form__field-label" htmlFor="project-request-brief">
            {t('projectBrief')}
          </label>
          <div className="project-form__field-control">
            <DescriptionIcon className="input-icon" aria-hidden />
            <textarea
              id="project-request-brief"
              className="project-input has-icon"
              placeholder={t('briefPlaceholder')}
              value={brief}
              onChange={(e) => onBriefChange(e.target.value)}
              required
              maxLength={2000}
              aria-required="true"
            />
            <span className="project-form__char-count">{brief.length}/2000</span>
          </div>
        </div>

        {/* Reference Links */}
        <div className="project-form__links-section">
          <div className="project-form__links-header">
            <span className="project-form__links-label" id="project-reference-links-label">
              {t('referenceLinks')}
            </span>
            {referenceLinks.length < 5 && (
              <button type="button" className="project-form__add-link" onClick={handleAddReferenceLink}>
                + {t('addLink')}
              </button>
            )}
          </div>
          <p className="project-form__hint">{t('referenceLinksHint')}</p>
          {referenceLinks.map((link, index) => (
            <div key={index} className="input-container full-width project-form__link-row">
              <LinkIcon className="input-icon" aria-hidden />
              <input
                type="url"
                className="project-input has-icon"
                value={link}
                onChange={(e) => handleReferenceLinkChange(index, e.target.value)}
                placeholder="https://spotify.com/track/..."
                dir="ltr"
                aria-labelledby="project-reference-links-label"
                aria-label={`${t('referenceLinks')} ${index + 1}`}
              />
              {referenceLinks.length > 1 && (
                <button
                  type="button"
                  className="project-form__remove-link"
                  onClick={() => handleRemoveReferenceLink(index)}
                  aria-label={t('removeLink')}
                >
                  <X size={14} aria-hidden />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectRequestForm;
