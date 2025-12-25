import { AddOn } from 'src/types/index';
import { AddOnCard } from './AddOnCard';
import './styles/_addons-list.scss';

interface AddOnsListProps {
  addOns: AddOn[];
  onEdit?: (addOn: AddOn) => void;
  onDelete?: (addOnId: string) => void;
  onAdd?: (addOn: AddOn) => void;
  showAddButton?: boolean;
  isLoading?: boolean;
  selectedAddOnIds?: string[];
}

export const AddOnsList = ({
  addOns,
  onEdit,
  onDelete,
  onAdd,
  showAddButton,
  selectedAddOnIds = []
}: AddOnsListProps) => {
  if (!addOns || addOns.length === 0) {
    return null;
  }

  return (
    <div className="addons-list">
      {addOns.map((addOn) => (
        <AddOnCard
          key={addOn._id}
          addOn={addOn}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
          showAddButton={showAddButton}
          isSelected={selectedAddOnIds.includes(addOn._id)}
        />
      ))}
    </div>
  );
};


