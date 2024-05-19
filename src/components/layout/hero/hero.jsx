import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section onClick={() => navigate('/studios/music')} className="hero">
      <div className="preview">
        <div className="hero-text-wrapper">
          <h1 className="hero-header">With Studios.com, finding the perfect Studio is effortless. </h1>
          <p>
            Browse a curated selection of top-tier studios, book sessions seamlessly, and elevate your
            sound with ease.
          </p>
        </div>
        <img src="https://i.imgur.com/XAYOgy4.png" alt="" />
      </div>
    </section>
  );
};

export default Hero;
