import { useInvalidateQueries, useMutationHandler } from '@shared/hooks';
import { createAddOn, deleteAddOn, updateAddOn } from '@shared/services';
import { AddOn } from 'src/types/index';

export const useCreateAddOnMutation = (itemId: string) => {
  return useMutationHandler<AddOn, AddOn>({
    mutationFn: (newAddOn) => createAddOn(newAddOn),
    successMessage: 'Add-on created',
    invalidateQueries: [
      { queryKey: 'addOns' },
      { queryKey: 'addOns', targetId: itemId },
      { queryKey: 'item', targetId: itemId }
    ],
    undoAction: (_variables, data) => deleteAddOn(data._id),
    onSuccess: () => {
      // Optionally navigate or handle success
    }
  });
};

export const useDeleteAddOnMutation = () => {
  const invalidateQueries = useInvalidateQueries<AddOn>((addOn) => [
    { queryKey: 'addOns' },
    { queryKey: 'addOns', targetId: addOn?.itemId },
    { queryKey: 'item', targetId: addOn?.itemId }
  ]);

  return useMutationHandler<AddOn, string>({
    mutationFn: (addOnId) => deleteAddOn(addOnId),
    successMessage: 'Add-on deleted',
    invalidateQueries: [],
    undoAction: (_variables, data) => createAddOn(data),
    onSuccess: (data) => {
      invalidateQueries(data);
    }
  });
};

export const useUpdateAddOnMutation = (addOnId: string, itemId?: string) => {
  return useMutationHandler<AddOn, AddOn>({
    mutationFn: (updatedAddOn) => updateAddOn(addOnId, updatedAddOn),
    successMessage: 'Add-on updated',
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
