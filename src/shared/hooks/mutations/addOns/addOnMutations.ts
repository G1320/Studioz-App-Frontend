import { useInvalidateQueries, useMutationHandler } from '@shared/hooks';
import { createAddOn, deleteAddOn, updateAddOn } from '@shared/services';
import { AddOn } from 'src/types/index';
import { useTranslation } from 'react-i18next';

export const useCreateAddOnMutation = (itemId?: string) => {
  const { t } = useTranslation('common');

  return useMutationHandler<AddOn, AddOn>({
    mutationFn: (newAddOn) => createAddOn(newAddOn),
    successMessage: t('toasts.success.addOnCreated'),
    invalidateQueries: [
      { queryKey: 'addOns' },
      ...(itemId
        ? [
            { queryKey: 'addOns', targetId: itemId },
            { queryKey: 'item', targetId: itemId }
          ]
        : [])
    ],
    undoAction: (_variables, data) => deleteAddOn(data._id),
    onSuccess: () => {
      // Optionally navigate or handle success
    }
  });
};

export const useDeleteAddOnMutation = () => {
  const { t } = useTranslation('common');

  const invalidateQueries = useInvalidateQueries<AddOn>((addOn) => [
    { queryKey: 'addOns' },
    { queryKey: 'addOns', targetId: addOn?.itemId },
    { queryKey: 'item', targetId: addOn?.itemId }
  ]);

  return useMutationHandler<AddOn, string>({
    mutationFn: (addOnId) => deleteAddOn(addOnId),
    successMessage: t('toasts.success.addOnDeleted'),
    invalidateQueries: [],
    undoAction: (_variables, data) => createAddOn(data),
    onSuccess: (data) => {
      invalidateQueries(data);
    }
  });
};

export const useUpdateAddOnMutation = (addOnId: string, itemId?: string) => {
  const { t } = useTranslation('common');

  return useMutationHandler<AddOn, AddOn>({
    mutationFn: (updatedAddOn) => updateAddOn(addOnId, updatedAddOn),
    successMessage: t('toasts.success.addOnUpdated'),
    invalidateQueries: [
      { queryKey: 'addOn', targetId: addOnId },
      { queryKey: 'addOns' },
      ...(itemId
        ? [
            { queryKey: 'addOns', targetId: itemId },
            { queryKey: 'item', targetId: itemId }
          ]
        : [])
    ],
    undoAction: (_variables, data) => updateAddOn(addOnId, data)
  });
};


