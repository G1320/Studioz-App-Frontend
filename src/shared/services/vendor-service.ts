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
