import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BoltIcon, EventAvailableIcon, HourglassIcon } from '@shared/components/icons';
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
          <div className="booking-settings-step">
            <div className="booking-settings-step__mode-grid">
              <button
                type="button"
                onClick={() => setInstantBook(false)}
                className={`booking-settings-step__mode-card ${
                  !instantBook ? 'booking-settings-step__mode-card--active' : ''
                }`}
              >
                <div
                  className={`booking-settings-step__mode-icon ${
                    !instantBook
                      ? 'booking-settings-step__mode-icon--active'
                      : 'booking-settings-step__mode-icon--default'
                  }`}
                >
                  <EventAvailableIcon />
                </div>
                <h3 className="booking-settings-step__mode-title">
                  {t('form.bookingSettings.requestToBook.title', 'Request to Book')}
                </h3>
                <p className="booking-settings-step__mode-description">
                  {t(
                    'form.bookingSettings.requestToBook.description',
                    'Review every booking request before accepting.'
                  )}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setInstantBook(true)}
                className={`booking-settings-step__mode-card ${
                  instantBook ? 'booking-settings-step__mode-card--active' : ''
                }`}
              >
                <div
                  className={`booking-settings-step__mode-icon ${
                    instantBook
                      ? 'booking-settings-step__mode-icon--active'
                      : 'booking-settings-step__mode-icon--default'
                  }`}
                >
                  <BoltIcon />
                </div>
                <h3 className="booking-settings-step__mode-title">
                  {t('form.bookingSettings.instantBook.title', 'Instant Book')}
                </h3>
                <p className="booking-settings-step__mode-description">
                  {t(
                    'form.bookingSettings.instantBook.description',
                    'Allow users to book instantly without approval.'
                  )}
                </p>
              </button>
            </div>

            <div className="booking-settings-step__settings-grid">
              <div className="booking-settings-step__field">
                <label className="booking-settings-step__label">
                  {t('form.bookingSettings.advanceNotice.label', 'Advance Notice')}
                  <HourglassIcon />
                </label>
                <div className="booking-settings-step__select-wrapper">
                  <select
                    className="booking-settings-step__select"
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
              </div>

              <div className="booking-settings-step__field">
                <label className="booking-settings-step__label">
                  {t('form.bookingSettings.preparationTime.label', 'Preparation Time (Buffer)')}
                </label>
                <div className="booking-settings-step__select-wrapper">
                  <select
                    className="booking-settings-step__select"
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
              </div>
            </div>

            {pricePer !== 'hour' && (
              <div className="booking-settings-step__field">
                <label className="booking-settings-step__label">
                  {t('form.bookingSettings.minimumQuantity.label')}
                </label>
                <input
                  type="number"
                  min={1}
                  className="booking-settings-step__input"
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
