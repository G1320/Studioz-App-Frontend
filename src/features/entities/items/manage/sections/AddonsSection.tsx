import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateAddOnForm, PendingAddOn } from '@features/entities/addOns/forms';
import { useAddOns, useDeleteAddOnMutation } from '@shared/hooks';
import { createAddOnsBatch, updateAddOn } from '@shared/services';
import { Item } from 'src/types/index';

interface AddonsSectionProps {
  item: Item;
}

export const AddonsSection = ({ item }: AddonsSectionProps) => {
  const { t } = useTranslation(['forms', 'common']);
  const queryClient = useQueryClient();
  const { data: existingAddOns = [] } = useAddOns(item._id);
  const deleteAddOnMutation = useDeleteAddOnMutation();
  const hasPopulated = useRef(false);
  const [pendingAddOns, setPendingAddOns] = useState<PendingAddOn[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    hasPopulated.current = false;
  }, [item._id]);

  useEffect(() => {
    if (existingAddOns.length > 0 && !hasPopulated.current) {
      setPendingAddOns(existingAddOns.map((a) => ({ ...a, _id: a._id })));
      hasPopulated.current = true;
    }
  }, [existingAddOns]);

  const handleAdd = useCallback((addOn: PendingAddOn) => {
    setPendingAddOns((prev) => [...prev, addOn]);
  }, []);

  const handleRemove = useCallback(
    (index: number) => {
      const target = pendingAddOns[index];
      if (target._id) {
        deleteAddOnMutation.mutate(target._id, {
          onSuccess: () => {
            setPendingAddOns((prev) => prev.filter((_, i) => i !== index));
            toast.success(t('common:toasts.success.addOnDeleted'));
          }
        });
      } else {
        setPendingAddOns((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [pendingAddOns, deleteAddOnMutation, t]
  );

  const handleUpdate = useCallback(
    async (index: number, updated: PendingAddOn) => {
      const existing = pendingAddOns[index];
      if (existing._id && updated._id) {
        try {
          await updateAddOn(existing._id, updated as never);
          setPendingAddOns((prev) => prev.map((a, i) => (i === index ? updated : a)));
          await queryClient.invalidateQueries({ queryKey: ['addOns'] });
          toast.success(t('common:toasts.success.addOnUpdated'));
        } catch {
          toast.error(t('common:toasts.error.addOnUpdateFailed'));
        }
      } else {
        setPendingAddOns((prev) => prev.map((a, i) => (i === index ? updated : a)));
      }
    },
    [pendingAddOns, queryClient, t]
  );

  const handleSaveNew = async () => {
    const newOnes = pendingAddOns.filter((a) => !a._id);
    if (!newOnes.length) return;
    setIsSaving(true);
    try {
      await createAddOnsBatch(item._id, newOnes);
      setPendingAddOns((prev) => prev.filter((a) => a._id));
      await queryClient.invalidateQueries({ queryKey: ['addOns', 'item', item._id] });
      toast.success(t('common:toasts.success.itemUpdated'));
    } catch {
      toast.error(t('common:toasts.error.itemUpdatedAddOnsFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsavedNew = pendingAddOns.some((a) => !a._id);

  return (
    <div className="studio-manage-section studio-manage-section--wide">
      <header className="studio-manage-section__header">
        <div>
          <h2 className="studio-manage-section__title">
            {t('manage.item.sections.addons', 'Add-ons')}
          </h2>
          <p className="studio-manage-section__subtitle">
            {t('manage.item.addons.subtitle', 'Optional extras clients can book with this service.')}
          </p>
        </div>
        {hasUnsavedNew && (
          <div className="studio-manage-section__actions">
            <button
              type="button"
              className="studio-manage-btn studio-manage-btn--primary studio-manage-btn--compact"
              onClick={handleSaveNew}
              disabled={isSaving}
            >
              {isSaving
                ? t('common:buttons.saving', 'Saving…')
                : t('manage.item.addons.saveNew', 'Save new add-ons')}
            </button>
          </div>
        )}
      </header>

      <div className="studio-manage-panel">
        <div className="studio-manage-panel__body studio-manage-panel__body--embed">
          <CreateAddOnForm
            mode="local"
            onAdd={handleAdd}
            onRemove={handleRemove}
            onUpdate={handleUpdate}
            pendingAddOns={pendingAddOns}
          />
        </div>
      </div>
    </div>
  );
};
