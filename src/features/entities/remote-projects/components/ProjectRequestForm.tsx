import { useState } from 'react';
import { Button } from '@shared/components';
import { useTranslation } from 'react-i18next';
import { useCreateProjectMutation } from '@shared/hooks';
import { Item } from 'src/types/index';
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
  onCancel,
}) => {
  const { t } = useTranslation('common');
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
        customerPhone: customerPhone.trim() || undefined,
      });

      if (onSuccess && result._id) {
        onSuccess(result._id);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <form className="project-request-form" onSubmit={handleSubmit}>
      <div className="project-request-form__header">
        <h2 className="project-request-form__title">
          {t('remoteProjects.requestProject', 'Request Project')}
        </h2>
        <p className="project-request-form__service-name">
          {item.name?.en || item.name?.he}
        </p>
      </div>

      <div className="project-request-form__pricing">
        <div className="project-request-form__price">
          <span className="project-request-form__price-label">
            {t('remoteProjects.projectPrice', 'Project Price')}
          </span>
          <span className="project-request-form__price-value">
            {price.toLocaleString()} ILS
          </span>
        </div>
        {depositAmount && (
          <div className="project-request-form__deposit">
            <span className="project-request-form__deposit-label">
              {t('remoteProjects.depositRequired', 'Deposit Required')}
            </span>
            <span className="project-request-form__deposit-value">
              {depositAmount.toLocaleString()} ILS ({projectPricing?.depositPercentage}%)
            </span>
          </div>
        )}
        <div className="project-request-form__delivery">
          <span className="project-request-form__delivery-label">
            {t('remoteProjects.estimatedDelivery', 'Estimated Delivery')}
          </span>
          <span className="project-request-form__delivery-value">
            {projectPricing?.estimatedDeliveryDays || 7}{' '}
            {t('remoteProjects.days', 'days')}
          </span>
        </div>
        <div className="project-request-form__revisions">
          <span className="project-request-form__revisions-label">
            {t('remoteProjects.revisionsIncluded', 'Revisions Included')}
          </span>
          <span className="project-request-form__revisions-value">
            {projectPricing?.revisionsIncluded || 1}
          </span>
        </div>
      </div>

      <div className="project-request-form__field">
        <label className="project-request-form__label" htmlFor="project-title">
          {t('remoteProjects.projectTitle', 'Project Title')} *
        </label>
        <input
          id="project-title"
          type="text"
          className="project-request-form__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('remoteProjects.titlePlaceholder', 'e.g., Mix and Master - My Song Name')}
          required
          maxLength={100}
        />
      </div>

      <div className="project-request-form__field">
        <label className="project-request-form__label" htmlFor="project-brief">
          {t('remoteProjects.projectBrief', 'Project Brief')} *
        </label>
        <textarea
          id="project-brief"
          className="project-request-form__textarea"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder={t(
            'remoteProjects.briefPlaceholder',
            'Describe your project, desired style, reference tracks, any specific requirements...'
          )}
          required
          rows={5}
          maxLength={2000}
        />
        <span className="project-request-form__char-count">
          {brief.length}/2000
        </span>
      </div>

      <div className="project-request-form__field">
        <label className="project-request-form__label">
          {t('remoteProjects.referenceLinks', 'Reference Links')}
        </label>
        <p className="project-request-form__hint">
          {t(
            'remoteProjects.referenceLinksHint',
            'Add Spotify, YouTube, or SoundCloud links for reference'
          )}
        </p>
        {referenceLinks.map((link, index) => (
          <div key={index} className="project-request-form__link-row">
            <input
              type="url"
              className="project-request-form__input"
              value={link}
              onChange={(e) => handleReferenceLinkChange(index, e.target.value)}
              placeholder="https://..."
            />
            {referenceLinks.length > 1 && (
              <button
                type="button"
                className="project-request-form__remove-link"
                onClick={() => handleRemoveReferenceLink(index)}
                aria-label={t('remoteProjects.removeLink', 'Remove link')}
              >
                &times;
              </button>
            )}
          </div>
        ))}
        {referenceLinks.length < 5 && (
          <button
            type="button"
            className="project-request-form__add-link"
            onClick={handleAddReferenceLink}
          >
            + {t('remoteProjects.addLink', 'Add another link')}
          </button>
        )}
      </div>

      <div className="project-request-form__contact">
        <h3 className="project-request-form__section-title">
          {t('remoteProjects.contactInfo', 'Contact Information')}
        </h3>

        <div className="project-request-form__field">
          <label className="project-request-form__label" htmlFor="customer-name">
            {t('remoteProjects.name', 'Name')}
          </label>
          <input
            id="customer-name"
            type="text"
            className="project-request-form__input"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="project-request-form__field">
          <label className="project-request-form__label" htmlFor="customer-email">
            {t('remoteProjects.email', 'Email')}
          </label>
          <input
            id="customer-email"
            type="email"
            className="project-request-form__input"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>

        <div className="project-request-form__field">
          <label className="project-request-form__label" htmlFor="customer-phone">
            {t('remoteProjects.phone', 'Phone')}
          </label>
          <input
            id="customer-phone"
            type="tel"
            className="project-request-form__input"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="project-request-form__actions">
        {onCancel && (
          <Button
            type="button"
            className="button--secondary"
            onClick={onCancel}
            disabled={createProjectMutation.isPending}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
        )}
        <Button
          type="submit"
          className="button--primary"
          disabled={!title.trim() || !brief.trim() || createProjectMutation.isPending}
        >
          {createProjectMutation.isPending
            ? t('common.submitting', 'Submitting...')
            : t('remoteProjects.submitRequest', 'Submit Request')}
        </Button>
      </div>

      <p className="project-request-form__note">
        {t(
          'remoteProjects.submitNote',
          'After submitting, you can upload your files. The studio will review your request and accept or decline within 24-48 hours.'
        )}
      </p>
    </form>
  );
};

export default ProjectRequestForm;
