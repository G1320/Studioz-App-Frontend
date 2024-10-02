import { Link } from 'react-router-dom';
import { Navbar, CartItemsList, LoginButton, LogoutButton, Profile } from '@/components';
import { Cart } from '@/types/index';
interface HeaderProps {
  cart?: Cart ;
}

export const Header: React.FC<HeaderProps> = ({ cart  }) => {
  
  return (
    <header>
      <h1>
        <Link className='logo' to="/">Studioz</Link>
      </h1>
        <>
          <Profile />
          <LoginButton />
          <LogoutButton />
        </>
      <CartItemsList cart={ cart } isDropdown={true} />
      <Navbar />
    </header>
  );
};

export default Header;
