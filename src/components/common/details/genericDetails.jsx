import React from 'react';

const GenericDetail = ({ data, className }) => {
  if (!data) return null;

  return (
    <div className={`generic-details ${className}`}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))}
    </div>
  );
};

export default GenericDetail;
