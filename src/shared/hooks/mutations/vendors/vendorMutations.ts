import { useMutationHandler } from '@shared/hooks';
import { createVendor, CompanyDetails } from '@shared/services/vendor-service';
import { Company } from 'src/types/company';
import { useTranslation } from 'react-i18next';

export const useCreateVendorMutation = (userId: string) => {
  const { t } = useTranslation('common');

  return useMutationHandler<Company, CompanyDetails>({
    mutationFn: (companyDetails: CompanyDetails) => createVendor(companyDetails, userId),
    successMessage: t('toasts.success.vendorCreated'),
    invalidateQueries: [{ queryKey: 'vendor', targetId: userId }]
  });
};

