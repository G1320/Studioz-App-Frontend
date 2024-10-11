import { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { musicSubCategories, videoAndPhotographySubCategories } from '@/config/config';

// Define the type for categories
const categories: { [key: string]: string[] } = {
  Music: musicSubCategories,
  'Video and Photography': videoAndPhotographySubCategories
};

// Define the props type
interface DynamicHamburgerMenuProps {
  filterType: string;
}

// Define the type for open categories state
interface OpenCategoriesState {
  [key: string]: boolean;
}

export const DynamicHamburgerMenu: React.FC<DynamicHamburgerMenuProps> = ({ filterType }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openCategories, setOpenCategories] = useState<OpenCategoriesState>({});

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="hamburger-menu">
      <button onClick={toggleMenu} className="hamburger-button" aria-label="Toggle menu">
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {isOpen && (
        <div className="menu-container">
          {Object.entries(categories).map(([category, subcategories]) => (
            <div key={category} className="category">
              <button onClick={() => toggleCategory(category)} className="category-button">
                {category}
                {openCategories[category] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </button>
              {openCategories[category] && (
                <ul className="subcategory-list">
                  {subcategories.map((subcategory) => (
                    <li key={subcategory}>
                      <Link
                        to={`/${filterType}/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`}
                        className="subcategory-link"
                        onClick={closeMenu}
                      >
                        {subcategory}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicHamburgerMenu;
