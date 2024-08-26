import React from 'react';

interface Entry {
  _id: string;
  name: string;
}

interface GenericMultiDropdownEntryPreviewProps {
  entry: Entry;
}

const GenericMultiDropdownEntryPreview: React.FC<GenericMultiDropdownEntryPreviewProps> = ({ entry }) => {
  return (
    <>
      <input id={`input-${entry._id}`} type="checkbox" />
      <label htmlFor={`input-${entry._id}`}>{entry.name}</label>
    </>
  );
};

export default GenericMultiDropdownEntryPreview;
