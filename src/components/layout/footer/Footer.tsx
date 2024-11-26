import { useEffect, useState } from 'react';
import { MobileFooter } from './MobileFooter'; // Import your mobile footer
import { DesktopFooter } from './DesktopFooter'; // Import your desktop footer

export const ResponsiveFooter = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <MobileFooter /> : <DesktopFooter />;
};
