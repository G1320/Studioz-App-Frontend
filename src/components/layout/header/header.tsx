import { Link } from 'react-router-dom';
import { Navbar, CartItemsList, LoginButton, LogoutButton, Profile } from '@/components';
import { Cart, User } from '@/types/index';
interface HeaderProps {
  cart?: Cart ;
  user?: User | null
}

export const Header: React.FC<HeaderProps> = ({ cart, user }) => {


  
  return (
    <header>
      <h1>
        <Link className='logo' to="/">Studioz</Link>
      </h1>
        <>
          <Profile />
          { user ?  <LogoutButton /> : <LoginButton /> }
        </>
      <CartItemsList cart={ cart } isDropdown={true} />
      <Navbar />
    </header>
  );
};

export default Header;
