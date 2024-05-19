import React from 'react';

const GenericMultiDropdownEntryPreview = ({ entry }) => {
  return (
    <>
      <input id={`input ${entry._id}`} type="checkbox" />
      <label htmlFor={`input ${entry._id}`}> {entry.name}</label>
    </>
  );
};

export default GenericMultiDropdownEntryPreview;
