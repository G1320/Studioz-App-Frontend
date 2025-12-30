import { useEffect, useState } from 'react';
import { MobileNavigation } from './MobileNavigation';
import { DesktopFooter } from './DesktopFooter';

export const ResponsiveFooter = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMobile && <MobileNavigation />}
      <DesktopFooter />
    </>
  );
};
