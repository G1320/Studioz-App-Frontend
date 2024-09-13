import { useNavigate } from 'react-router-dom';

 export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section onClick={() => navigate('/studios/music')} className="hero">
      <div className="preview">
        <div className="hero-text-wrapper">
          <h1 className="hero-header">With Studioz.co.il, finding the perfect Studio is effortless. </h1>
          <p>
            Browse our curated selection of top-tier studios, book sessions seamlessly, and elevate your
            sound with ease.
          </p>
        </div>
        <img src="https://i.imgur.com/XAYOgy4.png" alt="" />
      </div>
    </section>
  );
};

export default Hero;
