import { AddOn } from 'src/types/index';
import { AddOnCard } from './AddOnCard';
import './styles/_addons-list.scss';

interface AddOnsListProps {
  addOns: AddOn[];
  onEdit?: (addOn: AddOn) => void;
  onDelete?: (addOnId: string) => void;
  isLoading?: boolean;
}

export const AddOnsList = ({ addOns, onEdit, onDelete, isLoading }: AddOnsListProps) => {
  if (isLoading) {
    return <div className="addons-list-loading">Loading add-ons...</div>;
  }

  if (!addOns || addOns.length === 0) {
    return <div className="addons-list-empty">No add-ons available</div>;
  }

  return (
    <div className="addons-list">
      {addOns.map((addOn) => (
        <AddOnCard key={addOn._id} addOn={addOn} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

