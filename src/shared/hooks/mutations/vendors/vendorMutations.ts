import { useMutationHandler } from '@shared/hooks';
import { createVendor, CompanyDetails } from '@shared/services/vendor-service';
import { Company } from 'src/types/company';

export const useCreateVendorMutation = (userId: string) => {
  return useMutationHandler<Company, CompanyDetails>({
    mutationFn: (companyDetails: CompanyDetails) => createVendor(companyDetails, userId),
    successMessage: 'Vendor account created successfully',
    invalidateQueries: [{ queryKey: 'vendor', targetId: userId }]
  });
};

