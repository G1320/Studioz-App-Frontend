import React from 'react';
import ItemsList from '../../entities/items/itemsList';
import Hero from '../../layout/hero/hero';

const Store = ({ items = null }) => {
  return (
    <section className="store-page">
      <Hero></Hero>
      <ItemsList items={items} />
    </section>
  );
};

export default Store;
