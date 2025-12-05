import { useMutationHandler } from '@shared/hooks';
import { createVendor } from '@shared/services/vendor-service';
import { Company, CompanyDetails } from 'src/types/vendor';

export const useCreateVendorMutation = (userId: string) => {
  return useMutationHandler<Company, CompanyDetails>({
    mutationFn: (companyDetails: CompanyDetails) => createVendor(companyDetails, userId),
    successMessage: 'Vendor account created successfully',
    invalidateQueries: [{ queryKey: 'vendor', targetId: userId }]
  });
};

