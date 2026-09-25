import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyGoogleAddressAutocomplete } from '@shared/components';
import { Studio } from 'src/types/index';
import { useStudioSectionSave } from '../useStudioSectionSave';
import { SectionChrome } from './SectionChrome';

type Parking = 'private' | 'street' | 'paid' | 'none';

const PARKING_OPTIONS: Parking[] = ['private', 'street', 'paid', 'none'];

interface LocationSectionProps {
  studio: Studio;
}

export const LocationSection = ({ studio }: LocationSectionProps) => {
  const { t } = useTranslation('forms');
  const { savePatch, isSaving } = useStudioSectionSave(studio, studio._id);

  const [address, setAddress] = useState(studio.address || '');
  const [city, setCity] = useState(studio.city || '');
  const [lat, setLat] = useState<number | undefined>(studio.lat);
  const [lng, setLng] = useState<number | undefined>(studio.lng);
  const [phone, setPhone] = useState(studio.phone || '');
  const [website, setWebsite] = useState(studio.website || '');
  const [maxOccupancy, setMaxOccupancy] = useState<string>(
    studio.maxOccupancy != null ? String(studio.maxOccupancy) : ''
  );
  const [size, setSize] = useState<string>(studio.size != null ? String(studio.size) : '');
  const [parking, setParking] = useState<Parking>(
    (studio.parking as Parking) || 'street'
  );

  useEffect(() => {
    setAddress(studio.address || '');
    setCity(studio.city || '');
    setLat(studio.lat);
    setLng(studio.lng);
    setPhone(studio.phone || '');
    setWebsite(studio.website || '');
    setMaxOccupancy(studio.maxOccupancy != null ? String(studio.maxOccupancy) : '');
    setSize(studio.size != null ? String(studio.size) : '');
    setParking((studio.parking as Parking) || 'street');
  }, [
    studio._id,
    studio.address,
    studio.city,
    studio.lat,
    studio.lng,
    studio.phone,
    studio.website,
    studio.maxOccupancy,
    studio.size,
    studio.parking
  ]);

  const baselineParking = (studio.parking as Parking) || 'street';
  const isDirty =
    address !== (studio.address || '') ||
    city !== (studio.city || '') ||
    lat !== studio.lat ||
    lng !== studio.lng ||
    phone !== (studio.phone || '') ||
    website !== (studio.website || '') ||
    maxOccupancy !== (studio.maxOccupancy != null ? String(studio.maxOccupancy) : '') ||
    size !== (studio.size != null ? String(studio.size) : '') ||
    parking !== baselineParking;

  const handleDiscard = () => {
    setAddress(studio.address || '');
    setCity(studio.city || '');
    setLat(studio.lat);
    setLng(studio.lng);
    setPhone(studio.phone || '');
    setWebsite(studio.website || '');
    setMaxOccupancy(studio.maxOccupancy != null ? String(studio.maxOccupancy) : '');
    setSize(studio.size != null ? String(studio.size) : '');
    setParking(baselineParking);
  };

  const handlePlaceSelected = (
    place: google.maps.places.PlaceResult,
    englishData?: { address: string; city: string }
  ) => {
    if (!place.geometry?.location) return;

    const nextLat = place.geometry.location.lat();
    const nextLng = place.geometry.location.lng();
    setLat(nextLat);
    setLng(nextLng);

    const addressToStore = englishData?.address || place.formatted_address || '';
    if (addressToStore) setAddress(addressToStore);

    if (englishData?.city) {
      setCity(englishData.city);
    } else {
      const cityComponent = place.address_components?.find((c) =>
        c.types.includes('locality')
      );
      if (cityComponent) setCity(cityComponent.long_name);
    }
  };

  const handleSave = () => {
    savePatch({
      address: address.trim(),
      city: city.trim(),
      lat,
      lng,
      phone: phone.trim(),
      website: website.trim(),
      maxOccupancy: maxOccupancy ? parseInt(maxOccupancy, 10) || undefined : undefined,
      size: size ? parseFloat(size) || undefined : undefined,
      parking
    });
  };

  return (
    <SectionChrome
      title={t('manage.sections.location', 'Location')}
      subtitle={t('manage.location.subtitle', 'Address, contact, and space specs.')}
      isDirty={isDirty}
      isSaving={isSaving}
      onDiscard={handleDiscard}
      onSave={handleSave}
    >
      <div className="studio-manage-panel">
        <div className="studio-manage-panel__body">
          <div className="studio-manage-grid studio-manage-grid--2">
            <div className="studio-manage-field studio-manage-field--span-2">
              <label className="studio-manage-label" htmlFor="sm-address">
                {t('form.address.label', 'Address')}
              </label>
              <Suspense
                fallback={
                  <input
                    id="sm-address"
                    className="studio-manage-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('form.address.placeholder', 'Street, city')}
                  />
                }
              >
                <LazyGoogleAddressAutocomplete
                  fieldName="sm-address"
                  className="studio-manage-input"
                  defaultValue={address}
                  placeholder={t('form.address.placeholder', 'Street, city')}
                  onPlaceSelected={handlePlaceSelected}
                  onInputChange={setAddress}
                />
              </Suspense>
            </div>
            <div className="studio-manage-field">
              <label className="studio-manage-label" htmlFor="sm-phone">
                {t('form.phone.label', 'Phone')}
              </label>
              <input
                id="sm-phone"
                className="studio-manage-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="studio-manage-field">
              <label className="studio-manage-label" htmlFor="sm-website">
                {t('form.website.label', 'Website')}
              </label>
              <input
                id="sm-website"
                className="studio-manage-input"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="studio-manage-field">
              <label className="studio-manage-label" htmlFor="sm-occupancy">
                {t('form.maxOccupancy.label', 'Max occupancy')}
              </label>
              <input
                id="sm-occupancy"
                type="number"
                min={0}
                className="studio-manage-input"
                value={maxOccupancy}
                onChange={(e) => setMaxOccupancy(e.target.value)}
              />
            </div>
            <div className="studio-manage-field">
              <label className="studio-manage-label" htmlFor="sm-size">
                {t('form.size.label', 'Size (m²)')}
              </label>
              <input
                id="sm-size"
                type="number"
                min={0}
                className="studio-manage-input"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
          </div>

          <div className="studio-manage-field">
            <span className="studio-manage-label">{t('form.parking.label', 'Parking')}</span>
            <div className="studio-manage-choice-grid" role="radiogroup" aria-label={t('form.parking.label', 'Parking')}>
              {PARKING_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={parking === option}
                  className={`studio-manage-choice ${parking === option ? 'is-selected' : ''}`}
                  onClick={() => setParking(option)}
                >
                  {t(`form.parking.options.${option}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionChrome>
  );
};
