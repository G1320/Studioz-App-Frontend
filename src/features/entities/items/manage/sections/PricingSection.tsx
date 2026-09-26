import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
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
      const base = projectPricing.basePrice;
      if (base == null || !(base > 0)) {
        toast.error(t('form.pricing.invalidPrice', 'Price must be greater than zero'));
        return;
      }
      if (projectPricing.revisionPrice != null && projectPricing.revisionPrice < 0) {
        toast.error(t('form.pricing.invalidPrice', 'Price must be greater than zero'));
        return;
      }
      savePatch({ projectPricing, pricePer: 'project', price: base });
      return;
    }
    if (price == null || !(price > 0)) {
      toast.error(t('form.pricing.invalidPrice', 'Price must be greater than zero'));
      return;
    }
    if (
      (blockDiscounts.eightHour != null && blockDiscounts.eightHour < 0) ||
      (blockDiscounts.twelveHour != null && blockDiscounts.twelveHour < 0)
    ) {
      toast.error(t('form.pricing.invalidPrice', 'Price must be greater than zero'));
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

  const setProjectField = (key: keyof ProjectPricing, value: number | undefined) => {
    setProjectPricing((prev) => ({ ...prev, [key]: value }));
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
            <>
              <div className="studio-manage-grid studio-manage-grid--2">
                <div className="studio-manage-field">
                  <label className="studio-manage-label" htmlFor="item-price-base">
                    {t('form.remoteSettings.projectPricing.basePrice', 'Base Price')}
                  </label>
                  <div className="studio-manage-price-cell">
                    <span className="studio-manage-price-cell__currency">₪</span>
                    <input
                      id="item-price-base"
                      type="number"
                      min={0.01}
                      step="0.01"
                      className="studio-manage-input studio-manage-input--price"
                      value={projectPricing.basePrice ?? ''}
                      onChange={(e) =>
                        setProjectField('basePrice', e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </div>
                </div>

                <div className="studio-manage-field">
                  <label className="studio-manage-label" htmlFor="item-price-deposit">
                    {t('form.remoteSettings.projectPricing.deposit', 'Deposit Required')}
                  </label>
                  <div className="studio-manage-price-cell">
                    <input
                      id="item-price-deposit"
                      type="number"
                      className="studio-manage-input studio-manage-input--price"
                      value={projectPricing.depositPercentage ?? ''}
                      onChange={(e) =>
                        setProjectField(
                          'depositPercentage',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                    <span className="studio-manage-price-cell__currency">%</span>
                  </div>
                </div>

                <div className="studio-manage-field">
                  <label className="studio-manage-label" htmlFor="item-price-delivery">
                    {t('form.remoteSettings.projectPricing.deliveryDays', 'Delivery Time')}
                  </label>
                  <div className="studio-manage-price-cell">
                    <input
                      id="item-price-delivery"
                      type="number"
                      className="studio-manage-input studio-manage-input--price"
                      value={projectPricing.estimatedDeliveryDays ?? ''}
                      onChange={(e) =>
                        setProjectField(
                          'estimatedDeliveryDays',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                    <span className="studio-manage-price-cell__currency">
                      {t('form.remoteSettings.projectPricing.days', 'days')}
                    </span>
                  </div>
                </div>

                <div className="studio-manage-field">
                  <label className="studio-manage-label" htmlFor="item-price-revisions">
                    {t('form.remoteSettings.projectPricing.revisions', 'Revisions Included')}
                  </label>
                  <input
                    id="item-price-revisions"
                    type="number"
                    className="studio-manage-input"
                    value={projectPricing.revisionsIncluded ?? ''}
                    onChange={(e) =>
                      setProjectField(
                        'revisionsIncluded',
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>

                <div className="studio-manage-field">
                  <label className="studio-manage-label" htmlFor="item-price-revision-extra">
                    {t('form.remoteSettings.projectPricing.revisionPrice', 'Extra Revision Price')}
                  </label>
                  <div className="studio-manage-price-cell">
                    <span className="studio-manage-price-cell__currency">₪</span>
                    <input
                      id="item-price-revision-extra"
                      type="number"
                      className="studio-manage-input studio-manage-input--price"
                      value={projectPricing.revisionPrice ?? ''}
                      onChange={(e) =>
                        setProjectField(
                          'revisionPrice',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="studio-manage-status-control item-manage-inline-toggle">
                <span className="studio-manage-label studio-manage-label--inline">
                  {t(
                    'form.remoteSettings.projectPricing.lockDownloads',
                    'Lock deliverable downloads until approval'
                  )}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!projectPricing.lockDownloadsUntilPaid}
                  className={`studio-manage-toggle ${
                    projectPricing.lockDownloadsUntilPaid ? 'is-on' : ''
                  }`}
                  onClick={() =>
                    setProjectPricing((prev) => ({
                      ...prev,
                      lockDownloadsUntilPaid: !prev.lockDownloadsUntilPaid
                    }))
                  }
                >
                  <span className="studio-manage-toggle__thumb" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="studio-manage-field">
                <span className="studio-manage-label">
                  {t('form.pricing.pricePerLabel', 'Price per')}
                </span>
                <div className="studio-manage-choice-grid" role="radiogroup">
                  {pricePerOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={pricePer === option.value}
                      className={`studio-manage-choice ${
                        pricePer === option.value ? 'is-selected' : ''
                      }`}
                      onClick={() => setPricePer(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="studio-manage-grid studio-manage-grid--2">
                <div className="studio-manage-field">
                  <label className="studio-manage-label" htmlFor="item-price-amount">
                    {t('form.pricing.priceLabel', 'Price')}
                  </label>
                  <div className="studio-manage-price-cell">
                    <span className="studio-manage-price-cell__currency">₪</span>
                    <input
                      id="item-price-amount"
                      type="number"
                      min={0.01}
                      step="0.01"
                      className="studio-manage-input studio-manage-input--price"
                      value={price ?? ''}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <span className="studio-manage-price-cell__currency">/ {pricePer}</span>
                  </div>
                </div>

                {pricePer === 'hour' && (
                  <div className="studio-manage-field">
                    <label className="studio-manage-label" htmlFor="item-price-min-book">
                      {t('form.pricing.minimumBooking', 'Minimum Booking')}
                    </label>
                    <div className="studio-manage-price-cell">
                      <input
                        id="item-price-min-book"
                        type="number"
                        min={1}
                        className="studio-manage-input studio-manage-input--price"
                        value={minimumBookingDuration.value ?? ''}
                        onChange={(e) =>
                          setMinimumBookingDuration({
                            value: e.target.value ? Number(e.target.value) : undefined,
                            unit: 'hours'
                          })
                        }
                      />
                      <span className="studio-manage-price-cell__currency">
                        {t('form.pricing.hours', 'hours')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {pricePer === 'hour' && (
                <div className="studio-manage-field">
                  <span className="studio-manage-label">
                    {t('form.pricing.blockDiscounts.title', 'Block Discounts (Optional)')}
                  </span>
                  <div className="studio-manage-grid studio-manage-grid--2">
                    {(['eightHour', 'twelveHour'] as const).map((key) => (
                      <div key={key} className="studio-manage-field">
                        <label className="studio-manage-label" htmlFor={`item-price-${key}`}>
                          {t(
                            `form.pricing.blockDiscounts.${key}`,
                            key === 'eightHour' ? '8 Hour Block Price' : '12 Hour Block Price'
                          )}
                        </label>
                        <div className="studio-manage-price-cell">
                          <span className="studio-manage-price-cell__currency">₪</span>
                          <input
                            id={`item-price-${key}`}
                            type="number"
                            className="studio-manage-input studio-manage-input--price"
                            value={blockDiscounts[key] ?? ''}
                            onChange={(e) =>
                              setBlockDiscounts((prev) => ({
                                ...prev,
                                [key]: e.target.value ? Number(e.target.value) : undefined
                              }))
                            }
                          />
                          <span className="studio-manage-price-cell__currency">
                            {t('form.pricing.blockDiscounts.total', 'total')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="studio-manage-hint">
                {t(
                  'form.pricing.platformFee.description',
                  'Studioz takes a 9% commission on confirmed bookings.'
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </SectionChrome>
  );
};
