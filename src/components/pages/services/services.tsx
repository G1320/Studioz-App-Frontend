// import React from 'react';
// import ItemsList from '../../entities/items/itemsList';
// import Hero from '../../layout/hero/hero';
// import { useParams } from 'react-router-dom';

// const Services = ({ items }) => {
//   const { category, subcategory } = useParams();

//   const filteredItems = items?.filter((item) => {
//     if (subcategory === undefined) {
//       return item?.category?.toLowerCase() === category;
//     } else {
//       return (
//         item?.category?.toLowerCase() === category && item?.subcategory?.toLowerCase() === subcategory
//       );
//     }
//   });
//   return (
//     <section className="services-page">
//       <Hero></Hero>
//       <ItemsList items={filteredItems} />
//     </section>
//   );
// };

// export default Services;
import React from 'react';
import ItemsList from '../../entities/items/itemsList';
import Hero from '../../layout/hero/hero';
import { useParams } from 'react-router-dom';
import { Item } from '../../../../../shared/types';

interface ServicesProps {
  items?: Item[];
}

const Services: React.FC<ServicesProps> = ({ items }) => {
  const { category, subcategory } = useParams<{ category?: string; subcategory?: string }>();

  const filteredItems = items?.filter((item) => {
    if (subcategory === undefined) {
      return item?.category?.toLowerCase() === category?.toLowerCase();
    } else {
      return (
        item?.category?.toLowerCase() === category?.toLowerCase() &&
        item?.subcategory?.toLowerCase() === subcategory?.toLowerCase()
      );
    }
  });

  return (
    <section className="services-page">
      <Hero />
      <ItemsList items={filteredItems} />
    </section>
  );
};

export default Services;
