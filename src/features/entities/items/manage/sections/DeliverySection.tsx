import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HomeIcon, PublicIcon, InfoOutlinedIcon } from '@shared/components/icons';
import {
  useMusicCategories,
  isPhotoMainCategory,
  toEnglishMainCategory
} from '@shared/hooks';
import { Item } from 'src/types/index';
import { SectionChrome } from '@features/entities/studios/manage/sections/SectionChrome';
import { useItemSectionSave } from '../useItemSectionSave';
import {
  REMOTE_PROJECT_ACCEPTED_FILE_TYPES,
  REMOTE_PROJECT_MAX_FILE_SIZE_MB,
  REMOTE_PROJECT_MAX_FILES_PER_PROJECT
} from '@shared/constants/remoteProjectFileLimits';

interface DeliverySectionProps {
  item: Item;
}

export const DeliverySection = ({ item }: DeliverySectionProps) => {
  const { t } = useTranslation('forms');
  const musicCategories = useMusicCategories();
  const { savePatch, isSaving } = useItemSectionSave(item, item._id);

  const baseline: 'in-studio' | 'remote' =
    item.serviceDeliveryType === 'remote' || (item as Item & { remoteService?: boolean }).remoteService
      ? 'remote'
      : 'in-studio';

  const [delivery, setDelivery] = useState<'in-studio' | 'remote'>(baseline);

  useEffect(() => {
    setDelivery(baseline);
  }, [item._id, baseline]);

  const isDirty = delivery !== baseline;

  const handleSave = () => {
    const patch: Partial<Item> = {
      serviceDeliveryType: delivery
    };

    if (delivery === 'remote') {
      const cats = (item.categories || []).map(toEnglishMainCategory);
      if (cats.some((c) => isPhotoMainCategory(c))) {
        patch.categories = musicCategories.map(toEnglishMainCategory);
      }
      patch.acceptedFileTypes = [...REMOTE_PROJECT_ACCEPTED_FILE_TYPES];
      patch.maxFileSize = REMOTE_PROJECT_MAX_FILE_SIZE_MB;
      patch.maxFilesPerProject = REMOTE_PROJECT_MAX_FILES_PER_PROJECT;
      if (!item.pricePer || item.pricePer === 'hour') {
        patch.pricePer = 'project';
      }
    }

    savePatch(patch);
  };

  return (
    <SectionChrome
      title={t('manage.item.sections.delivery', 'Delivery')}
      subtitle={t('manage.item.delivery.subtitle', 'How customers receive this service.')}
      isDirty={isDirty}
      isSaving={isSaving}
      onDiscard={() => setDelivery(baseline)}
      onSave={handleSave}
    >
      <div className="studio-manage-panel">
        <div className="studio-manage-panel__body">
          <div className="service-type-step__options item-manage-delivery">
            <button
              type="button"
              onClick={() => setDelivery('in-studio')}
              className={`service-type-step__option ${
                delivery === 'in-studio' ? 'service-type-step__option--active' : ''
              }`}
            >
              <div
                className={`service-type-step__option-icon ${
                  delivery === 'in-studio' ? 'service-type-step__option-icon--active' : ''
                }`}
              >
                <HomeIcon />
              </div>
              <h4 className="service-type-step__option-title">
                {t('form.serviceType.inStudio.title', 'In-Studio')}
              </h4>
              <p className="service-type-step__option-description">
                {t(
                  'form.serviceType.inStudio.description',
                  'Clients book time at your studio for recording, rehearsal, or sessions'
                )}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDelivery('remote')}
              className={`service-type-step__option ${
                delivery === 'remote' ? 'service-type-step__option--active' : ''
              }`}
            >
              <div
                className={`service-type-step__option-icon ${
                  delivery === 'remote' ? 'service-type-step__option-icon--active' : ''
                }`}
              >
                <PublicIcon />
              </div>
              <h4 className="service-type-step__option-title">
                {t('form.serviceType.remote.title', 'Remote Project')}
              </h4>
              <p className="service-type-step__option-description">
                {t(
                  'form.serviceType.remote.description',
                  'Clients upload files and you deliver the finished work online'
                )}
              </p>
            </button>
          </div>

          <div className="service-type-step__info-box">
            <InfoOutlinedIcon className="service-type-step__info-icon" />
            <p className="service-type-step__info-text">
              {delivery === 'in-studio'
                ? t(
                    'form.serviceType.inStudio.info',
                    'In-studio services use hourly or session-based pricing. Clients book available time slots.'
                  )
                : t(
                    'form.serviceType.remote.info',
                    'Remote projects use project-based pricing. Clients submit files and requirements.'
                  )}
            </p>
          </div>
        </div>
      </div>
    </SectionChrome>
  );
};
