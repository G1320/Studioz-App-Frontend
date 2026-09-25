import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

  const options = [
    {
      id: 'in-studio' as const,
      title: t('form.serviceType.inStudio.title', 'In-Studio'),
      description: t(
        'form.serviceType.inStudio.description',
        'Clients book time at your studio for recording, rehearsal, or sessions'
      ),
      hint: t(
        'form.serviceType.inStudio.info',
        'Uses hourly or session pricing. Clients book available calendar slots.'
      )
    },
    {
      id: 'remote' as const,
      title: t('form.serviceType.remote.title', 'Remote Project'),
      description: t(
        'form.serviceType.remote.description',
        'Clients upload files and you deliver the finished work online'
      ),
      hint: t(
        'form.serviceType.remote.info',
        'Uses project-based pricing. Clients submit files and requirements.'
      )
    }
  ];

  const activeHint = options.find((o) => o.id === delivery)?.hint;

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
          <div className="studio-manage-policy-list" role="radiogroup" aria-label={t('manage.item.sections.delivery', 'Delivery')}>
            {options.map((option) => {
              const selected = delivery === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`studio-manage-policy ${selected ? 'is-selected' : ''}`}
                  onClick={() => setDelivery(option.id)}
                >
                  <span className={`studio-manage-policy__radio ${selected ? 'is-on' : ''}`} aria-hidden />
                  <span className="studio-manage-policy__copy">
                    <span className="studio-manage-policy__title">{option.title}</span>
                    <span className="studio-manage-policy__desc">{option.description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {activeHint && <p className="studio-manage-hint">{activeHint}</p>}
        </div>
      </div>
    </SectionChrome>
  );
};
