interface Entry {
  _id: string;
  name: string;
}

interface GenericMultiDropdownEntryPreviewProps {
  entry: Entry;
}

export const GenericMultiDropdownEntryPreview: React.FC<GenericMultiDropdownEntryPreviewProps> = ({ entry }) => {
  return (
    <>
      <input id={`input-${entry._id}`} type="checkbox" />
      <label htmlFor={`input-${entry._id}`}>{entry.name}</label>
    </>
  );
};

