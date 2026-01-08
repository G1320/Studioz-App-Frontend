import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

const DefaultIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  children,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

// Music Production - Music
export const MusicProductionIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </DefaultIcon>
);

// Podcast Recording - Mic
export const PodcastRecordingIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </DefaultIcon>
);

// Vocal & Instrument Recording - Mic2
export const VocalInstrumentIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
    <circle cx="17" cy="7" r="5" />
  </DefaultIcon>
);

// Film & Post Production - Film
export const FilmProductionIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 3v18" />
    <path d="M3 7.5h4" />
    <path d="M3 12h18" />
    <path d="M3 16.5h4" />
    <path d="M17 3v18" />
    <path d="M17 7.5h4" />
    <path d="M17 16.5h4" />
  </DefaultIcon>
);

// Voiceover & Dubbing - Mic with speech
export const VoiceoverDubbingIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </DefaultIcon>
);

// Mixing - Sliders
export const MixingIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <line x1="4" x2="4" y1="21" y2="14" />
    <line x1="4" x2="4" y1="10" y2="3" />
    <line x1="12" x2="12" y1="21" y2="12" />
    <line x1="12" x2="12" y1="8" y2="3" />
    <line x1="20" x2="20" y1="21" y2="16" />
    <line x1="20" x2="20" y1="12" y2="3" />
    <line x1="2" x2="6" y1="14" y2="14" />
    <line x1="10" x2="14" y1="8" y2="8" />
    <line x1="18" x2="22" y1="16" y2="16" />
  </DefaultIcon>
);

// Mastering - Disc
export const MasteringIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
  </DefaultIcon>
);

// Sound Design - Speaker
export const SoundDesignIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <circle cx="12" cy="14" r="4" />
    <line x1="12" x2="12.01" y1="6" y2="6" />
  </DefaultIcon>
);

// Band Rehearsal - Drum
export const BandRehearsalIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M12 2c5 0 9 1.8 9 4s-4 4-9 4-9-1.8-9-4 4-4 9-4z"/>
    <path d="M21 6v12c0 2.2-4 4-9 4s-9-1.8-9-4V6"/>
    <path d="M3 14v2c0 2.2 4 4 9 4s9-1.8 9-4v-2"/>
  </DefaultIcon>
);

// Studio Rental - Building/Home
export const StudioRentalIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </DefaultIcon>
);

// Foley & Sound Effects - Sparkles
export const FoleyIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M9 5h4" />
    <path d="M15 19v4" />
    <path d="M19 21h4" />
  </DefaultIcon>
);

// Workshops & Classes - GraduationCap
export const WorkshopsIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </DefaultIcon>
);

// Remote Production Services - Globe
export const RemoteProductionIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </DefaultIcon>
);

// Restoration & Archiving - Archive
export const RestorationIcon: React.FC<IconProps> = (props) => (
  <DefaultIcon {...props}>
    <rect width="20" height="5" x="2" y="3" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </DefaultIcon>
);

// ==========================================
// CENTRALIZED SUBCATEGORY ICON MAPPING
// Use this mapping across the app for consistent icons
// ==========================================

export const SUBCATEGORY_ICONS: Record<string, React.FC<IconProps>> = {
  // Music Production subcategories
  'Music Production': MusicProductionIcon,
  'Podcast Recording': PodcastRecordingIcon,
  'Vocal & Instrument Recording': VocalInstrumentIcon,
  'Mixing': MixingIcon,
  'Mastering': MasteringIcon,
  'Band rehearsal': BandRehearsalIcon,
  'Studio Rental': StudioRentalIcon,
  'Remote Production Services': RemoteProductionIcon,
  'Sound Design': SoundDesignIcon,
  'Workshops & Classes': WorkshopsIcon,
  
  // Post Production subcategories
  'Voiceover & Dubbing': VoiceoverDubbingIcon,
  'Foley & Sound Effects': FoleyIcon,
  'Film & Post Production': FilmProductionIcon,
  'Restoration & Archiving': RestorationIcon,
};

/**
 * Get the icon component for a subcategory
 * @param subcategory - The subcategory name (English)
 * @param fallback - Optional fallback icon component (defaults to MusicProductionIcon)
 * @returns The icon component for the subcategory
 * 
 * @example
 * const Icon = getSubcategoryIcon('Mixing');
 * return <Icon size={24} color="#ffd166" />;
 * 
 * @example
 * // With custom fallback
 * const Icon = getSubcategoryIcon(subcategoryName, MasteringIcon);
 */
export const getSubcategoryIcon = (
  subcategory: string,
  fallback: React.FC<IconProps> = MusicProductionIcon
): React.FC<IconProps> => {
  // Try exact match first
  if (SUBCATEGORY_ICONS[subcategory]) {
    return SUBCATEGORY_ICONS[subcategory];
  }
  
  // Try case-insensitive match
  const lowerSubcategory = subcategory.toLowerCase();
  for (const [key, Icon] of Object.entries(SUBCATEGORY_ICONS)) {
    if (key.toLowerCase() === lowerSubcategory) {
      return Icon;
    }
  }
  
  // Try partial match (for encoded URLs like "Vocal%20%26%20Instrument%20Recording")
  const decodedSubcategory = decodeURIComponent(subcategory).toLowerCase();
  for (const [key, Icon] of Object.entries(SUBCATEGORY_ICONS)) {
    if (key.toLowerCase() === decodedSubcategory) {
      return Icon;
    }
  }
  
  return fallback;
};
