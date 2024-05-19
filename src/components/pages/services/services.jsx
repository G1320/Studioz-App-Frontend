import React from 'react';
import ItemsList from '../../entities/items/itemsList';
import Hero from '../../layout/hero/hero';
import { useParams } from 'react-router-dom';

const Services = ({ items }) => {
  const { category, subcategory } = useParams();

  console.log('subcategory: ', subcategory);
  const filteredItems = items?.filter((item) => {
    if (subcategory === undefined) {
      return item?.category?.toLowerCase() === category;
    } else {
      return (
        item?.category?.toLowerCase() === category && item?.subcategory?.toLowerCase() === subcategory
      );
    }
  });
  return (
    <section className="items-page">
      <Hero></Hero>
      <ItemsList items={filteredItems} />
    </section>
  );
};

export default Services;
