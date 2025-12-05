import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyDetails } from '@shared/services';
import { useUserContext } from '@core/contexts';
import { useCreateVendorMutation } from '@shared/hooks/mutations';

export const VendorOnboardingForm = () => {
  const { t, i18n } = useTranslation('forms');
  const { user } = useUserContext();
  const isRTL = i18n.language === 'he';
  const createVendorMutation = useCreateVendorMutation(user?._id || '');

  const [formData, setFormData] = useState<CompanyDetails>({
    Name: '',
    EmailAddress: '',
    Phone: '',
    Address: '',
    CorporateNumber: '',
    Country: 'Israel',
    Title: 'Vendor at Studioz',
    Website: '',
    bankCode: 0,
    branchCode: 0,
    accountNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVendorMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`vendor-onboarding-form ${isRTL ? 'rtl' : ''}`}>
      <div className="vendor-onboarding-form__header">
        <h2>{t(`form.vendorOnboarding.title`)}</h2>
        <p>{t(`form.vendorOnboarding.subtitle`)}</p>
      </div>

      <form onSubmit={handleSubmit} className="vendor-onboarding-form__form">
        <div className="vendor-onboarding-form__section">
          <h3>{t(`form.vendorOnboarding.companyDetails.title`)}</h3>

          <div className="vendor-onboarding-form__field">
            <label htmlFor="Name">{t(`form.vendorOnboarding.companyDetails.name.label`)}</label>
            <input
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder={t(`form.vendorOnboarding.companyDetails.name.placeholder`)}
              required
            />
          </div>

          <div className="vendor-onboarding-form__field">
            <label htmlFor="EmailAddress">{t(`form.vendorOnboarding.companyDetails.email.label`)}</label>
            <input
              id="EmailAddress"
              type="email"
              name="EmailAddress"
              value={formData.EmailAddress}
              onChange={handleChange}
              placeholder={t(`form.vendorOnboarding.companyDetails.email.placeholder`)}
              required
            />
          </div>

          <div className="vendor-onboarding-form__field">
            <label htmlFor="Phone">{t(`form.vendorOnboarding.companyDetails.phone.label`)}</label>
            <input
              id="Phone"
              type="tel"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              placeholder={t(`form.vendorOnboarding.companyDetails.phone.placeholder`)}
              required
            />
          </div>

          <div className="vendor-onboarding-form__field">
            <label htmlFor="Address">{t(`form.vendorOnboarding.companyDetails.address.label`)}</label>
            <input
              id="Address"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              placeholder={t(`form.vendorOnboarding.companyDetails.address.placeholder`)}
              required
            />
          </div>

          <div className="vendor-onboarding-form__field">
            <label htmlFor="CorporateNumber">{t(`form.vendorOnboarding.companyDetails.corporateNumber.label`)}</label>
            <input
              id="CorporateNumber"
              name="CorporateNumber"
              value={formData.CorporateNumber}
              onChange={handleChange}
              placeholder={t(`form.vendorOnboarding.companyDetails.corporateNumber.placeholder`)}
              required
            />
          </div>

          <div className="vendor-onboarding-form__field">
            <label htmlFor="Website">{t(`form.vendorOnboarding.companyDetails.website.label`)}</label>
            <input
              id="Website"
              type="url"
              name="Website"
              value={formData.Website}
              onChange={handleChange}
              placeholder={t(`form.vendorOnboarding.companyDetails.website.placeholder`)}
            />
          </div>
        </div>

        <div className="vendor-onboarding-form__section">
          <h3>{t(`form.vendorOnboarding.bankDetails.title`)}</h3>

          <div className="vendor-onboarding-form__bank-details">
            <div className="vendor-onboarding-form__field">
              <label htmlFor="bankCode">{t(`form.vendorOnboarding.bankDetails.bankCode.label`)}</label>
              <input
                id="bankCode"
                type="number"
                name="bankCode"
                onChange={handleChange}
                placeholder={t(`form.vendorOnboarding.bankDetails.bankCode.placeholder`)}
                required
              />
            </div>

            <div className="vendor-onboarding-form__field">
              <label htmlFor="branchCode">{t(`form.vendorOnboarding.bankDetails.branchCode.label`)}</label>
              <input
                id="branchCode"
                type="number"
                name="branchCode"
                onChange={handleChange}
                placeholder={t(`form.vendorOnboarding.bankDetails.branchCode.placeholder`)}
                required
              />
            </div>

            <div className="vendor-onboarding-form__field">
              <label htmlFor="accountNumber">{t(`form.vendorOnboarding.bankDetails.accountNumber.label`)}</label>
              <input
                id="accountNumber"
                name="accountNumber"
                onChange={handleChange}
                placeholder={t(`form.vendorOnboarding.bankDetails.accountNumber.placeholder`)}
                required
              />
            </div>
          </div>
        </div>

        <div className="vendor-onboarding-form__submit">
          <button type="submit">{t(`form.vendorOnboarding.submit`)}</button>
        </div>
      </form>

      <div className="vendor-onboarding-form__footer">
        <p>{t(`form.vendorOnboarding.footer.terms`)}</p>
      </div>
    </div>
  );
};
