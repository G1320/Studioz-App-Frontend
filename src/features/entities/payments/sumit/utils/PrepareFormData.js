/**
 * Prepare form data for Sumit token request
 * @param {HTMLFormElement} form - The form element
 * @param {Object} vendorCredentials - Optional vendor credentials for marketplace payments
 * @param {string} vendorCredentials.companyId - Vendor's Sumit Company ID
 * @param {string} vendorCredentials.publicKey - Vendor's Sumit Public API Key
 */
export const prepareFormData = (form, vendorCredentials = null) => {
  // Validate that all required fields exist
  const fields = {
    cardNumber: form.CreditCardNumber,
    expMonth: form.ExpMonth,
    expYear: form.ExpYear,
    cvv: form.CVV,
    citizenId: form['citizen-id'] || form.CardHolderId // Support both naming conventions
  };

  // Check for missing fields and provide helpful error messages
  const missingFields = [];
  if (!fields.cardNumber || !fields.cardNumber.value) missingFields.push('card number');
  if (!fields.expMonth || !fields.expMonth.value) missingFields.push('expiration month');
  if (!fields.expYear || !fields.expYear.value) missingFields.push('expiration year');
  if (!fields.cvv || !fields.cvv.value) missingFields.push('CVV');
  if (!fields.citizenId || !fields.citizenId.value) missingFields.push('ID number');

  if (missingFields.length > 0) {
    throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
  }

  const formData = new FormData();
  formData.append('CardNumber', fields.cardNumber.value.trim());
  formData.append('ExpirationMonth', fields.expMonth.value);
  formData.append('ExpirationYear', fields.expYear.value);
  formData.append('CVV', fields.cvv.value.trim());
  formData.append('CitizenID', fields.citizenId.value.trim());
  
  // Use vendor credentials for marketplace payments, otherwise use platform credentials
  if (vendorCredentials?.companyId && vendorCredentials?.publicKey) {
    formData.append('Credentials.CompanyID', vendorCredentials.companyId);
    formData.append('Credentials.APIPublicKey', vendorCredentials.publicKey);
  } else {
    formData.append('Credentials.CompanyID', import.meta.env.VITE_SUMIT_COMPANY_ID);
    formData.append('Credentials.APIPublicKey', import.meta.env.VITE_SUMIT_PUBLIC_API_KEY);
  }
  
  formData.append('ResponseLanguage', 'he');
  return formData;
};
