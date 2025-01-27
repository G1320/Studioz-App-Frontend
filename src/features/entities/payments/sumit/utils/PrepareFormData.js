export const prepareFormData = (form) => {
  const formData = new FormData();
  formData.append('CardNumber', form.CreditCardNumber.value);
  formData.append('ExpirationMonth', form.ExpMonth.value);
  formData.append('ExpirationYear', form.ExpYear.value);
  formData.append('CVV', form.CVV.value);
  formData.append('CitizenID', form.CardHolderId.value);
  formData.append('Credentials.CompanyID', import.meta.env.VITE_SUMIT_COMPANY_ID);
  formData.append('Credentials.APIPublicKey', import.meta.env.VITE_SUMIT_PUBLIC_API_KEY);
  formData.append('ResponseLanguage', 'he');
  return formData;
};
