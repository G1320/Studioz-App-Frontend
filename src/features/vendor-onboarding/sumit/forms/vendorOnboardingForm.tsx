import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createVendor, CompanyDetails } from '@shared/services';
import { toast } from 'sonner';
import { useUserContext } from '@core/contexts';

export const VendorOnboardingForm = () => {
  const { t } = useTranslation('forms');

  const { user } = useUserContext();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createVendor(formData, user?._id || '');
      console.log('response: ', response);
      toast.success(t('form.vendorCreated'));
    } catch (error) {
      toast.error(t('form.vendorError'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="Name" value={formData.Name} onChange={handleChange} placeholder={t('form.companyName')} required />
      <input
        type="email"
        name="EmailAddress"
        value={formData.EmailAddress}
        onChange={handleChange}
        placeholder={t('form.email')}
        required
      />
      <input
        type="tel"
        name="Phone"
        value={formData.Phone}
        onChange={handleChange}
        placeholder={t('form.phone')}
        required
      />
      <input name="Address" value={formData.Address} onChange={handleChange} placeholder={t('form.address')} required />
      <input
        name="CorporateNumber"
        value={formData.CorporateNumber}
        onChange={handleChange}
        placeholder={t('form.corporateNumber')}
        required
      />
      <input
        type="url"
        name="Website"
        value={formData.Website}
        onChange={handleChange}
        placeholder={t('form.website')}
      />
      <input
        type="number"
        name="bankCode"
        // value={formData.bankCode}
        onChange={handleChange}
        placeholder={t('form.bankCode')}
        required
      />
      <input
        type="number"
        name="branchCode"
        // value={formData.branchCode}
        onChange={handleChange}
        placeholder={t('form.branchCode')}
        required
      />
      <input
        name="accountNumber"
        // value={formData.accountNumber || ''}
        onChange={handleChange}
        placeholder={t('form.accountNumber')}
        required
      />
      <button type="submit">{t('form.submit')}</button>
    </form>
  );
};
