import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateProjectMutation } from '@shared/hooks';
import { Item } from 'src/types/index';
import {
  EditNoteIcon,
  DescriptionIcon,
  LinkIcon,
  PersonIcon,
  EmailIcon,
  PhoneIcon,
  OfferIcon,
  ScheduleIcon,
  SyncIcon,
} from '@shared/components/icons';
import './styles/_project-request-form.scss';

interface ProjectRequestFormProps {
  item: Item;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess?: (projectId: string) => void;
  onCancel?: () => void;
}

export const ProjectRequestForm: React.FC<ProjectRequestFormProps> = ({
  item,
  customerId,
  customerName: initialName = '',
  customerEmail: initialEmail = '',
  customerPhone: initialPhone = '',
  onSuccess,
  onCancel
}) => {
  const { t, i18n } = useTranslation('remoteProjects');
  const isRTL = i18n.language === 'he';
  const createProjectMutation = useCreateProjectMutation();

  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [referenceLinks, setReferenceLinks] = useState<string[]>(['']);
  const [customerName, setCustomerName] = useState(initialName);
  const [customerEmail, setCustomerEmail] = useState(initialEmail);
  const [customerPhone, setCustomerPhone] = useState(initialPhone);

  const projectPricing = item.projectPricing;
  const price = projectPricing?.basePrice || item.price || 0;
  const depositAmount = projectPricing?.depositPercentage
    ? (price * projectPricing.depositPercentage) / 100
    : undefined;

  const handleAddReferenceLink = () => {
    if (referenceLinks.length < 5) {
      setReferenceLinks([...referenceLinks, '']);
    }
  };

  const handleRemoveReferenceLink = (index: number) => {
    setReferenceLinks(referenceLinks.filter((_, i) => i !== index));
  };

  const handleReferenceLinkChange = (index: number, value: string) => {
    const updated = [...referenceLinks];
    updated[index] = value;
    setReferenceLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !brief.trim()) {
      return;
    }

    try {
      const result = await createProjectMutation.mutateAsync({
        itemId: item._id,
        customerId,
        title: title.trim(),
        brief: brief.trim(),
        referenceLinks: referenceLinks.filter((link) => link.trim() !== ''),
        customerName: customerName.trim() || undefined,
        customerEmail: customerEmail.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined
      });

      if (onSuccess && result._id) {
        onSuccess(result._id);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
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
          <span className="project-form__pricing-value">{projectPricing?.estimatedDeliveryDays || 7} {t('days')}</span>
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
          <EditNoteIcon className="input-icon" />
          <input
            type="text"
            className="project-input has-icon"
            placeholder={t('titlePlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="input-container full-width">
          <DescriptionIcon className="input-icon" />
          <textarea
            className="project-input has-icon"
            placeholder={t('briefPlaceholder')}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            required
            maxLength={2000}
          />
          <span className="project-form__char-count">{brief.length}/2000</span>
        </div>

        {/* Reference Links */}
        <div className="project-form__links-section">
          <div className="project-form__links-header">
            <span className="project-form__links-label">{t('referenceLinks')}</span>
            {referenceLinks.length < 5 && (
              <button
                type="button"
                className="project-form__add-link"
                onClick={handleAddReferenceLink}
              >
                + {t('addLink')}
              </button>
            )}
          </div>
          <p className="project-form__hint">{t('referenceLinksHint')}</p>
          {referenceLinks.map((link, index) => (
            <div key={index} className="input-container full-width project-form__link-row">
              <LinkIcon className="input-icon" />
              <input
                type="url"
                className="project-input has-icon"
                value={link}
                onChange={(e) => handleReferenceLinkChange(index, e.target.value)}
                placeholder="https://spotify.com/track/..."
                dir="ltr"
              />
              {referenceLinks.length > 1 && (
                <button
                  type="button"
                  className="project-form__remove-link"
                  onClick={() => handleRemoveReferenceLink(index)}
                  aria-label={t('removeLink')}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="project-form__contact-section">
          <span className="project-form__section-label">{t('contactInfo')}</span>
          
          <div className="input-container">
            <PersonIcon className="input-icon" />
            <input
              type="text"
              className="project-input has-icon"
              placeholder={t('name')}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="input-container">
            <EmailIcon className="input-icon" />
            <input
              type="email"
              className="project-input has-icon"
              placeholder={t('email')}
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              dir="ltr"
            />
          </div>

          <div className="input-container full-width">
            <PhoneIcon className="input-icon" />
            <input
              type="tel"
              className="project-input has-icon"
              placeholder={t('phone')}
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              dir={isRTL ? 'rtl' : 'ltr'}
              pattern="[0-9]*"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="project-form__submit"
        disabled={!title.trim() || !brief.trim() || createProjectMutation.isPending}
      >
        {createProjectMutation.isPending ? t('common.submitting') : t('submitRequest')}
      </button>

      <p className="project-form__note">{t('submitNote')}</p>
    </form>
  );
};

export default ProjectRequestForm;
