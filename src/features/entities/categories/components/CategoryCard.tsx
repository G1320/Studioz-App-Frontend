import { useLanguageNavigate } from '@shared/hooks/utils';
import { useCategories } from '@shared/hooks';
import { useParams, useLocation } from 'react-router-dom';
import * as Icons from '@shared/components/icons/CategoryIcons';
import '../styles/_category-card.scss';

// Map subcategories to their respective icons
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  // Music Production
  'Music Production': Icons.MusicProductionIcon,
  'Podcast Recording': Icons.PodcastRecordingIcon,
  'Vocal & Instrument Recording': Icons.VocalInstrumentIcon,
  'Mixing': Icons.MixingIcon,
  'Mastering': Icons.MasteringIcon,
  'Band rehearsal': Icons.BandRehearsalIcon,
  'Studio Rental': Icons.StudioRentalIcon,
  'Remote Production Services': Icons.RemoteProductionIcon,
  'Sound Design': Icons.SoundDesignIcon,
  'Workshops & Classes': Icons.WorkshopsIcon,
  
  // Post Production
  'Voiceover & Dubbing': Icons.VoiceoverDubbingIcon,
  'Foley & Sound Effects': Icons.FoleyIcon,
  'Film & Post Production': Icons.FilmProductionIcon,
  'Restoration & Archiving': Icons.RestorationIcon
};

interface CategoryCardProps {
  pathPrefix?: string;
  category: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, pathPrefix = 'studios' }) => {
  const langNavigate = useLanguageNavigate();
  const { getEnglishByDisplay } = useCategories();
  const params = useParams();
  const location = useLocation();

  const handleClick = () => {
    const categoryKey = getEnglishByDisplay(category);
    const searchParams = new URLSearchParams(location.search);
    const searchString = searchParams.toString();
    const basePath = `/${pathPrefix}/music`;

    if (isSelected) {
      langNavigate(`${basePath}${searchString ? `?${searchString}` : ''}`);
      return;
    }

    langNavigate(`${basePath}/${categoryKey}${searchString ? `?${searchString}` : ''}`);
  };

  // Check if this category is currently selected
  const categoryKey = getEnglishByDisplay(category);
  const subcategoryParam = pathPrefix === 'services' ? params.subCategory : params.subcategory;
  const isSelected = subcategoryParam === categoryKey;
  
  // Get icon component, fallback to MusicProductionIcon if not found
  const getIcon = () => {
    const key = categoryKey.toLowerCase();
    // Try exact match first (case-insensitive)
    for (const [iconKey, Icon] of Object.entries(CATEGORY_ICONS)) {
      if (iconKey.toLowerCase() === key) return Icon;
    }
    // Fallback to partial match
    for (const [iconKey, Icon] of Object.entries(CATEGORY_ICONS)) {
      if (key.includes(iconKey.toLowerCase())) return Icon;
    }
    return Icons.MusicProductionIcon;
  };

  const IconComponent = getIcon();

  return (
    <article className={`category-card ${isSelected ? 'category-card--selected' : ''}`} onClick={handleClick}>
      <div className="category-card__icon">
        <IconComponent />
      </div>
      <span>{category}</span>
    </article>
  );
};

