import { httpService } from '@shared/services';
import { Company } from 'src/types/company';

const vendorEndpoint = '/vendors';

export interface CompanyDetails {
  Name: string;
  EmailAddress: string;
  Country: string;
  Address: string;
  Phone: string;
  Title: string;
  CorporateNumber: string;
  Website?: string;
  bankCode: number;
  branchCode: number;
  accountNumber: string;
}

export const createVendor = async (companyDetails: CompanyDetails, userId: string): Promise<Company> => {
  try {
    return await httpService.post(`${vendorEndpoint}/create`, { companyDetails, userId });
  } catch (error) {
    console.error('Error creating vendor:', error);
    throw error;
  }
};

export interface SaveVendorCardResponse {
  success: boolean;
  savedCardLastFour?: string;
}

/**
 * Save vendor's credit card for platform fee billing (authenticated).
 * Call after vendor onboarding (create) so the user has Sumit credentials.
 */
export const saveVendorCard = async (singleUseToken: string): Promise<SaveVendorCardResponse> => {
  const response = await httpService.post<SaveVendorCardResponse>(`${vendorEndpoint}/save-card`, {
    singleUseToken
  });
  return response;
};
