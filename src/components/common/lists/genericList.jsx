import React from 'react';

const GenericList = ({ data, renderItem, className }) => {
  if (!data || !renderItem) return null;

  return (
    <section className={`generic-list ${className}`}>
      {data?.map((entry, index) => (
        <div className="render-item-container" key={entry._id || index}>
          {renderItem(entry)}
        </div>
      ))}
    </section>
  );
};

export default GenericList;
