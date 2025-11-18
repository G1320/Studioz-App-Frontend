import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGenres } from '@shared/hooks';

interface GenrePreviewProps {
  pathPrefix?: string;
  genre: string;
  isInteractive?: boolean;
}

export const GenrePreview: React.FC<GenrePreviewProps> = ({
  genre,
  pathPrefix = 'studios',
  isInteractive = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const { getEnglishByDisplay } = useGenres();

  const handleClick = () => {
    const currentLang = i18n.language || 'en';
    const genreKey = getEnglishByDisplay(genre);

    // Parse current path to extract category/subcategory
    const pathParts = location.pathname.split('/').filter(Boolean);

    // Find if we're on a category/subcategory page
    // Path structure: /:lang/studios/music/:subcategory or /:lang/services/music/:subCategory
    const pathPrefixIndex = pathParts.findIndex((part) => part === pathPrefix);
    const musicIndex = pathParts.findIndex((part) => part === 'music');

    let newPath = `/${currentLang}/${pathPrefix}`;

    // If we have a subcategory in the path, preserve it
    if (pathPrefixIndex !== -1 && musicIndex !== -1 && pathParts.length > musicIndex + 1) {
      const subcategory = pathParts[musicIndex + 1];
      newPath = `/${currentLang}/${pathPrefix}/music/${subcategory}`;
    } else if (pathPrefixIndex !== -1 && musicIndex !== -1) {
      // Just /music without subcategory
      newPath = `/${currentLang}/${pathPrefix}/music`;
    }

    // Add genre as query parameter
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('genre', genreKey);

    if (isInteractive) {
      navigate(`${newPath}?${searchParams.toString()}`);
    }
  };

  return isInteractive ? (
    <article className="genre-preview" onClick={handleClick}>
      <span>{genre}</span>
    </article>
  ) : (
    <article className="genre-preview genre-preview--static">
      <span>{genre}</span>
    </article>
  );
};
