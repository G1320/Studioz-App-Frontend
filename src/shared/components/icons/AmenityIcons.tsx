import React from 'react';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import KitchenIcon from '@mui/icons-material/Kitchen';
import CoffeeIcon from '@mui/icons-material/Coffee';
import SpeakerIcon from '@mui/icons-material/Speaker';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import VideocamIcon from '@mui/icons-material/Videocam';
import WeekendIcon from '@mui/icons-material/Weekend';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TvIcon from '@mui/icons-material/Tv';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import AccessibleIcon from '@mui/icons-material/Accessible';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

// Map amenity keys to icons
export const AMENITY_ICONS: Record<string, React.ElementType> = {
  air_conditioning: AcUnitIcon,
  wifi: WifiIcon,
  kitchen: KitchenIcon,
  kitchenette: KitchenIcon,
  espresso_machine: CoffeeIcon,
  live_room: SpeakerIcon,
  vocal_booth: RecordVoiceOverIcon,
  green_screen: VideocamIcon,
  video_production: VideocamIcon,
  lounge_area: WeekendIcon,
  waiting_area: WeekendIcon,
  natural_light: WbSunnyIcon,
  acoustic_treatment: GraphicEqIcon,
  '24_7_access': AccessTimeIcon,
  '247': AccessTimeIcon, // Handle alternative key
  tv_monitor: TvIcon,
  changing_room: CheckroomIcon,
  smoking_allowed: SmokingRoomsIcon,
  wheelchair_accessible: AccessibleIcon,
  accessible: AccessibleIcon, // Handle alternative key
  parking: LocalParkingIcon,
  private_parking: LocalParkingIcon
};

export const getAmenityIcon = (key: string): React.ElementType => {
  const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
  return AMENITY_ICONS[normalizedKey] || WeekendIcon;
};
