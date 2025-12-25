import { useParams } from 'react-router-dom';
import { useAddOns, useDeleteAddOnMutation } from '@shared/hooks';
import { AddOnsList } from '../components/AddOnsList';
import { AddOn } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks';
import './styles/_addons-list-page.scss';

export const AddOnsListPage = () => {
  const { itemId } = useParams();
  const { data: addOns, isLoading } = useAddOns(itemId);
  const deleteAddOnMutation = useDeleteAddOnMutation();
  const languageNavigate = useLanguageNavigate();

  const handleEdit = (addOn: AddOn) => {
    languageNavigate(`/item/${addOn.itemId}/add-on/${addOn._id}/edit`);
  };

  const handleDelete = (addOnId: string) => {
    if (window.confirm('Are you sure you want to delete this add-on?')) {
      deleteAddOnMutation.mutate(addOnId);
    }
  };

  const handleCreate = () => {
    languageNavigate(`/item/${itemId}/add-on/create`);
  };

  return (
    <div className="addons-list-page">
      <div className="addons-list-page-header">
        <h1>Add-Ons</h1>
        <button className="btn-create" onClick={handleCreate}>
          Create Add-On
        </button>
      </div>
      <AddOnsList
        addOns={addOns || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};



