import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Item } from 'src/types/index';
import type { Duration, AdvanceBookingRequired } from 'src/types/item';
import { SectionChrome } from '@features/entities/studios/manage/sections/SectionChrome';
import { useItemSectionSave } from '../useItemSectionSave';

interface BookingSectionProps {
  item: Item;
}

export const BookingSection = ({ item }: BookingSectionProps) => {
  const { t } = useTranslation('forms');
  const { savePatch, isSaving } = useItemSectionSave(item, item._id);

  const [instantBook, setInstantBook] = useState(!!item.instantBook);
  const [advanceBookingRequired, setAdvance] = useState<Duration>(
    item.advanceBookingRequired || { value: 1, unit: 'hours' }
  );
  const [preparationTime, setPrep] = useState<Duration>(item.preparationTime || {});
  const [minimumQuantity, setMinQty] = useState<number | undefined>(item.minimumQuantity);
  const pricePer = item.pricePer || 'hour';

  useEffect(() => {
    setInstantBook(!!item.instantBook);
    setAdvance(item.advanceBookingRequired || { value: 1, unit: 'hours' });
    setPrep(item.preparationTime || {});
    setMinQty(item.minimumQuantity);
  }, [item._id, item.instantBook, item.advanceBookingRequired, item.preparationTime, item.minimumQuantity]);

  const isDirty =
    instantBook !== !!item.instantBook ||
    JSON.stringify(advanceBookingRequired) !==
      JSON.stringify(item.advanceBookingRequired || { value: 1, unit: 'hours' }) ||
    JSON.stringify(preparationTime) !== JSON.stringify(item.preparationTime || {}) ||
    minimumQuantity !== item.minimumQuantity;

  const modes = [
    {
      id: false as const,
      title: t('form.bookingSettings.requestToBook.title', 'Request to Book'),
      description: t(
        'form.bookingSettings.requestToBook.description',
        'Review every booking request before accepting.'
      )
    },
    {
      id: true as const,
      title: t('form.bookingSettings.instantBook.title', 'Instant Book'),
      description: t(
        'form.bookingSettings.instantBook.description',
        'Allow clients to book instantly without approval.'
      )
    }
  ];

  return (
    <SectionChrome
      title={t('manage.item.sections.booking', 'Booking')}
      subtitle={t('manage.item.booking.subtitle', 'How clients reserve this service.')}
      isDirty={isDirty}
      isSaving={isSaving}
      onDiscard={() => {
        setInstantBook(!!item.instantBook);
        setAdvance(item.advanceBookingRequired || { value: 1, unit: 'hours' });
        setPrep(item.preparationTime || {});
        setMinQty(item.minimumQuantity);
      }}
      onSave={() => {
        const patch: Partial<Item> = {
          instantBook,
          preparationTime:
            preparationTime.value && preparationTime.unit ? preparationTime : undefined
        };
        if (advanceBookingRequired.value && advanceBookingRequired.unit) {
          patch.advanceBookingRequired = {
            value: advanceBookingRequired.value,
            unit: advanceBookingRequired.unit
          } satisfies AdvanceBookingRequired;
        }
        if (pricePer !== 'hour' && minimumQuantity != null) {
          patch.minimumQuantity = minimumQuantity;
        }
        savePatch(patch);
      }}
    >
      <div className="studio-manage-panel">
        <div className="studio-manage-panel__body">
          <div
            className="studio-manage-policy-list"
            role="radiogroup"
            aria-label={t('manage.item.booking.mode', 'Booking mode')}
          >
            {modes.map((mode) => {
              const selected = instantBook === mode.id;
              return (
                <button
                  key={String(mode.id)}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`studio-manage-policy ${selected ? 'is-selected' : ''}`}
                  onClick={() => setInstantBook(mode.id)}
                >
                  <span className={`studio-manage-policy__radio ${selected ? 'is-on' : ''}`} aria-hidden />
                  <span className="studio-manage-policy__copy">
                    <span className="studio-manage-policy__title">{mode.title}</span>
                    <span className="studio-manage-policy__desc">{mode.description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="studio-manage-grid studio-manage-grid--2">
            <div className="studio-manage-field">
              <label className="studio-manage-label" htmlFor="item-manage-advance">
                {t('form.bookingSettings.advanceNotice.label', 'Advance Notice')}
              </label>
              <select
                id="item-manage-advance"
                className="studio-manage-input"
                value={
                  advanceBookingRequired.value && advanceBookingRequired.unit
                    ? `${advanceBookingRequired.value}-${advanceBookingRequired.unit}`
                    : '1-hours'
                }
                onChange={(e) => {
                  const [value, unit] = e.target.value.split('-');
                  setAdvance({ value: parseInt(value, 10), unit: unit as 'hours' | 'days' });
                }}
              >
                <option value="1-hours">
                  {t('form.bookingSettings.advanceNotice.options.1hour', 'At least 1 hour')}
                </option>
                <option value="24-hours">
                  {t('form.bookingSettings.advanceNotice.options.24hours', 'At least 24 hours')}
                </option>
                <option value="48-hours">
                  {t('form.bookingSettings.advanceNotice.options.48hours', 'At least 48 hours')}
                </option>
                <option value="3-days">
                  {t('form.bookingSettings.advanceNotice.options.3days', 'At least 3 days')}
                </option>
              </select>
            </div>

            <div className="studio-manage-field">
              <label className="studio-manage-label" htmlFor="item-manage-prep">
                {t('form.bookingSettings.preparationTime.label', 'Preparation Time (Buffer)')}
              </label>
              <select
                id="item-manage-prep"
                className="studio-manage-input"
                value={
                  preparationTime.value && preparationTime.unit
                    ? `${preparationTime.value}-${preparationTime.unit}`
                    : '0'
                }
                onChange={(e) => {
                  if (e.target.value === '0') setPrep({});
                  else {
                    const [value, unit] = e.target.value.split('-');
                    setPrep({ value: parseInt(value, 10), unit: unit as 'hours' | 'days' });
                  }
                }}
              >
                <option value="0">
                  {t('form.bookingSettings.preparationTime.options.none', 'None')}
                </option>
                <option value="1-hours">
                  {t('form.bookingSettings.preparationTime.options.1hour', '1 hour')}
                </option>
                <option value="2-hours">
                  {t('form.bookingSettings.preparationTime.options.2hours', '2 hours')}
                </option>
                <option value="3-hours">
                  {t('form.bookingSettings.preparationTime.options.3hours', '3 hours')}
                </option>
              </select>
            </div>

            {pricePer !== 'hour' && (
              <div className="studio-manage-field">
                <label className="studio-manage-label" htmlFor="item-manage-min-qty">
                  {t('form.bookingSettings.minimumQuantity.label', 'Minimum Quantity')}
                </label>
                <input
                  id="item-manage-min-qty"
                  type="number"
                  min={1}
                  className="studio-manage-input"
                  value={minimumQuantity ?? ''}
                  onChange={(e) =>
                    setMinQty(e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionChrome>
  );
};
