import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  children: React.ReactNode;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    setTimeout(() => {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 0);
      }
    }, 100); 
  }, [location]);

  return <>{children}</>;
};

export default ScrollToTop;
