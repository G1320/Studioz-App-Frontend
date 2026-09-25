import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoOutlinedIcon, OfferIcon } from '@shared/components/icons';
import { Item } from 'src/types/index';
import type { Duration } from 'src/types/item';
import { SectionChrome } from '@features/entities/studios/manage/sections/SectionChrome';
import { useItemSectionSave } from '../useItemSectionSave';

interface PricingSectionProps {
  item: Item;
}

type ProjectPricing = NonNullable<Item['projectPricing']>;
type PricePer = NonNullable<Item['pricePer']>;

export const PricingSection = ({ item }: PricingSectionProps) => {
  const { t } = useTranslation('forms');
  const { savePatch, isSaving } = useItemSectionSave(item, item._id);

  const isRemote =
    item.serviceDeliveryType === 'remote' || (item as Item & { remoteService?: boolean }).remoteService === true;

  const [pricePer, setPricePer] = useState<PricePer>(
    item.pricePer || (isRemote ? 'project' : 'hour')
  );
  const [price, setPrice] = useState<number | undefined>(item.price);
  const [blockDiscounts, setBlockDiscounts] = useState(item.blockDiscounts || {});
  const [minimumBookingDuration, setMinimumBookingDuration] = useState<Duration>(
    item.minimumBookingDuration || {}
  );
  const [projectPricing, setProjectPricing] = useState<ProjectPricing>(
    item.projectPricing || {
      depositPercentage: 50,
      estimatedDeliveryDays: 7,
      revisionsIncluded: 2
    }
  );

  useEffect(() => {
    setPricePer(item.pricePer || (isRemote ? 'project' : 'hour'));
    setPrice(item.price);
    setBlockDiscounts(item.blockDiscounts || {});
    setMinimumBookingDuration(item.minimumBookingDuration || {});
    setProjectPricing(
      item.projectPricing || {
        depositPercentage: 50,
        estimatedDeliveryDays: 7,
        revisionsIncluded: 2
      }
    );
  }, [item._id, item.pricePer, item.price, item.blockDiscounts, item.minimumBookingDuration, item.projectPricing, isRemote]);

  const pricePerOptions: { value: PricePer; label: string }[] = [
    { value: 'hour', label: t('form.pricePer.hour') },
    { value: 'session', label: t('form.pricePer.session') },
    { value: 'unit', label: t('form.pricePer.unit') },
    { value: 'song', label: t('form.pricePer.song') },
    { value: 'project', label: t('form.pricePer.project') },
    { value: 'day', label: t('form.pricePer.day') }
  ];

  const isDirty = isRemote
    ? JSON.stringify(projectPricing) !==
      JSON.stringify(
        item.projectPricing || {
          depositPercentage: 50,
          estimatedDeliveryDays: 7,
          revisionsIncluded: 2
        }
      )
    : pricePer !== (item.pricePer || 'hour') ||
      price !== item.price ||
      JSON.stringify(blockDiscounts) !== JSON.stringify(item.blockDiscounts || {}) ||
      JSON.stringify(minimumBookingDuration) !== JSON.stringify(item.minimumBookingDuration || {});

  const handleDiscard = () => {
    setPricePer(item.pricePer || (isRemote ? 'project' : 'hour'));
    setPrice(item.price);
    setBlockDiscounts(item.blockDiscounts || {});
    setMinimumBookingDuration(item.minimumBookingDuration || {});
    setProjectPricing(
      item.projectPricing || {
        depositPercentage: 50,
        estimatedDeliveryDays: 7,
        revisionsIncluded: 2
      }
    );
  };

  const handleSave = () => {
    if (isRemote) {
      savePatch({ projectPricing, pricePer: 'project', price: projectPricing.basePrice ?? price });
      return;
    }
    const patch: Partial<Item> = {
      pricePer,
      price,
      blockDiscounts:
        blockDiscounts.eightHour || blockDiscounts.twelveHour ? blockDiscounts : undefined
    };
    if (pricePer === 'hour' && minimumBookingDuration.value) {
      patch.minimumBookingDuration = { ...minimumBookingDuration, unit: 'hours' };
    }
    savePatch(patch);
  };

  return (
    <SectionChrome
      title={t('manage.item.sections.pricing', 'Pricing')}
      subtitle={
        isRemote
          ? t('manage.item.pricing.remoteSubtitle', 'Project pricing and delivery terms.')
          : t('manage.item.pricing.subtitle', 'Rates and optional block discounts.')
      }
      isDirty={isDirty}
      isSaving={isSaving}
      onDiscard={handleDiscard}
      onSave={handleSave}
    >
      <div className="studio-manage-panel">
        <div className="studio-manage-panel__body">
          {isRemote ? (
            <div className="remote-settings-step">
              <div className="remote-settings-step__grid">
                {(
                  [
                    ['basePrice', 'Base Price', '₪', undefined],
                    ['depositPercentage', 'Deposit Required', undefined, '%'],
                    ['estimatedDeliveryDays', 'Delivery Time', undefined, 'days'],
                    ['revisionsIncluded', 'Revisions Included', undefined, undefined],
                    ['revisionPrice', 'Extra Revision Price', '₪', undefined]
                  ] as const
                ).map(([key, label, prefix, suffix]) => (
                  <div key={key} className="remote-settings-step__field">
                    <label className="remote-settings-step__label">
                      {t(`form.remoteSettings.projectPricing.${key === 'depositPercentage' ? 'deposit' : key === 'estimatedDeliveryDays' ? 'deliveryDays' : key === 'revisionsIncluded' ? 'revisions' : key}`, label)}
                    </label>
                    <div className="remote-settings-step__input-wrapper">
                      {prefix && <span className="remote-settings-step__input-prefix">{prefix}</span>}
                      <input
                        type="number"
                        className={`remote-settings-step__input ${
                          prefix ? 'remote-settings-step__input--with-prefix' : ''
                        } ${suffix ? 'remote-settings-step__input--with-suffix' : ''}`}
                        value={(projectPricing as Record<string, number | undefined>)[key] ?? ''}
                        onChange={(e) =>
                          setProjectPricing((prev) => ({
                            ...prev,
                            [key]: e.target.value ? Number(e.target.value) : undefined
                          }))
                        }
                      />
                      {suffix && (
                        <span className="remote-settings-step__input-suffix">
                          {suffix === 'days'
                            ? t('form.remoteSettings.projectPricing.days', 'days')
                            : suffix}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="remote-settings-step__toggle-section remote-settings-step__toggle-section--compact">
                <div className="remote-settings-step__toggle-info">
                  <p className="remote-settings-step__toggle-title">
                    {t(
                      'form.remoteSettings.projectPricing.lockDownloads',
                      'Lock deliverable downloads until approval'
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!projectPricing.lockDownloadsUntilPaid}
                  className={`remote-settings-step__toggle-btn${
                    projectPricing.lockDownloadsUntilPaid
                      ? ' remote-settings-step__toggle-btn--active'
                      : ''
                  }`}
                  onClick={() =>
                    setProjectPricing((prev) => ({
                      ...prev,
                      lockDownloadsUntilPaid: !prev.lockDownloadsUntilPaid
                    }))
                  }
                >
                  <span className="remote-settings-step__toggle-slider" />
                </button>
              </div>
            </div>
          ) : (
            <div className="pricing-step">
              <div className="pricing-step__field pricing-step__field--full">
                <label className="pricing-step__label">
                  {t('form.pricing.pricePerLabel', 'Price per')}
                </label>
                <div className="pricing-step__radio-group">
                  {pricePerOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPricePer(option.value)}
                      className={`pricing-step__radio-btn ${
                        pricePer === option.value ? 'pricing-step__radio-btn--active' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pricing-step__grid">
                <div className="pricing-step__field">
                  <label className="pricing-step__label">
                    {t('form.pricing.priceLabel', 'Price')}
                  </label>
                  <div className="pricing-step__input-wrapper">
                    <span className="pricing-step__input-prefix">₪</span>
                    <input
                      type="number"
                      className="pricing-step__input pricing-step__input--with-prefix pricing-step__input--with-suffix"
                      value={price ?? ''}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <span className="pricing-step__input-suffix">/ {pricePer}</span>
                  </div>
                </div>

                {pricePer === 'hour' && (
                  <div className="pricing-step__field">
                    <label className="pricing-step__label">
                      {t('form.pricing.minimumBooking', 'Minimum Booking')}
                    </label>
                    <div className="pricing-step__input-wrapper">
                      <input
                        type="number"
                        min={1}
                        className="pricing-step__input pricing-step__input--with-suffix"
                        value={minimumBookingDuration.value ?? ''}
                        onChange={(e) =>
                          setMinimumBookingDuration({
                            value: e.target.value ? Number(e.target.value) : undefined,
                            unit: 'hours'
                          })
                        }
                      />
                      <span className="pricing-step__input-suffix">
                        {t('form.pricing.hours', 'hours')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {pricePer === 'hour' && (
                <div className="pricing-step__block-discounts">
                  <div className="pricing-step__block-discounts-header">
                    <OfferIcon className="pricing-step__block-discounts-icon" />
                    <span className="pricing-step__block-discounts-title">
                      {t('form.pricing.blockDiscounts.title', 'Block Discounts (Optional)')}
                    </span>
                  </div>
                  <div className="pricing-step__grid">
                    {(['eightHour', 'twelveHour'] as const).map((key) => (
                      <div key={key} className="pricing-step__field">
                        <label className="pricing-step__label">
                          {t(
                            `form.pricing.blockDiscounts.${key}`,
                            key === 'eightHour' ? '8 Hour Block Price' : '12 Hour Block Price'
                          )}
                        </label>
                        <div className="pricing-step__input-wrapper">
                          <span className="pricing-step__input-prefix">₪</span>
                          <input
                            type="number"
                            className="pricing-step__input pricing-step__input--with-prefix pricing-step__input--with-suffix"
                            value={blockDiscounts[key] ?? ''}
                            onChange={(e) =>
                              setBlockDiscounts((prev) => ({
                                ...prev,
                                [key]: e.target.value ? Number(e.target.value) : undefined
                              }))
                            }
                          />
                          <span className="pricing-step__input-suffix">
                            {t('form.pricing.blockDiscounts.total', 'total')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pricing-step__info-box">
                <InfoOutlinedIcon className="pricing-step__info-icon" />
                <div className="pricing-step__info-content">
                  <h4 className="pricing-step__info-title">
                    {t('form.pricing.platformFee.title', 'Platform Fee')}
                  </h4>
                  <p className="pricing-step__info-text">
                    {t(
                      'form.pricing.platformFee.description',
                      'Studioz takes a 9% commission on confirmed bookings.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionChrome>
  );
};
