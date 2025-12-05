interface Entry {
  _id: string;
  name: string;
}

interface GenericMultiDropdownEntryCardProps {
  entry: Entry;
}

export const GenericMultiDropdownEntryCard: React.FC<GenericMultiDropdownEntryCardProps> = ({ entry }) => {
  return (
    <>
      <input id={`input-${entry._id}`} type="checkbox" />
      <label htmlFor={`input-${entry._id}`}>{entry.name}</label>
    </>
  );
};

