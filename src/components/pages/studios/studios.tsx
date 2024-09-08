import React from 'react';
import StudiosList from '../../entities/studios/studiosList';
import Hero from '../../layout/hero/hero';
import { useParams } from 'react-router-dom';
import { Studio } from '../../../types/index';

interface StudiosProps {
  studios: Studio[];
}

const Studios: React.FC<StudiosProps> = ({ studios }) => {
  const { category, subcategory } = useParams();

  const filteredStudios: Studio[] = studios?.filter((studio) => {
    if (subcategory === undefined) {
      return studio?.category?.toLowerCase() === category;
    } else {
      return (
        studio?.category?.toLowerCase() === category &&
        studio?.subCategory?.toLowerCase() === subcategory
      );
    }
  });
  return (
    <section className="studios-page">
      <Hero></Hero>
      <h1>Check out our {category} Studios</h1>
      {subcategory && <h2>Specializing: {subcategory}</h2>}
      <StudiosList studios={filteredStudios} />
    </section>
  );
};

export default Studios;
