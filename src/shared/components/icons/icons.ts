// ============================================
// Icon Registry
// ============================================
// All icons are re-exported here with semantic naming.
// This allows easy swapping of icon libraries in the future.
//
// NAMING CONVENTION:
// - PascalCase with Icon suffix for named exports
// - Grouped by category in the Icons object
// ============================================

import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { ComponentType } from 'react';

// ===================
// NAVIGATION ICONS
// ===================
export { default as ArrowBackIcon } from '@mui/icons-material/ArrowBack';
export { default as ArrowForwardIcon } from '@mui/icons-material/ArrowForward';
export { default as ArrowUpIcon } from '@mui/icons-material/ArrowUpward';
export { default as ArrowDownIcon } from '@mui/icons-material/ArrowDownward';
export { default as ChevronLeftIcon } from '@mui/icons-material/ChevronLeft';
export { default as ChevronRightIcon } from '@mui/icons-material/ChevronRight';
export { default as ChevronDownIcon } from '@mui/icons-material/KeyboardArrowDown';
export { default as ChevronUpIcon } from '@mui/icons-material/KeyboardArrowUp';
export { default as ExpandMoreIcon } from '@mui/icons-material/ExpandMore';
export { default as ExpandLessIcon } from '@mui/icons-material/ExpandLess';
export { default as HomeIcon } from '@mui/icons-material/Home';
export { default as MenuIcon } from '@mui/icons-material/MoreHoriz';
export { default as MenuVertIcon } from '@mui/icons-material/MoreVert';

// ===================
// ACTION ICONS
// ===================
export { default as AddIcon } from '@mui/icons-material/Add';
export { default as AddCircleIcon } from '@mui/icons-material/AddCircleOutline';
export { default as RemoveIcon } from '@mui/icons-material/Remove';
export { default as RemoveCircleIcon } from '@mui/icons-material/RemoveCircleOutline';
export { default as DeleteIcon } from '@mui/icons-material/Delete';
export { default as EditIcon } from '@mui/icons-material/Edit';
export { default as EditNoteIcon } from '@mui/icons-material/EditNote';
export { default as SaveIcon } from '@mui/icons-material/Save';
export { default as CloseIcon } from '@mui/icons-material/Close';
export { default as ClearIcon } from '@mui/icons-material/Clear';
export { default as CancelIcon } from '@mui/icons-material/Cancel';
export { default as CheckIcon } from '@mui/icons-material/Check';
export { default as CheckCircleIcon } from '@mui/icons-material/CheckCircle';
export { default as CopyIcon } from '@mui/icons-material/ContentCopy';
export { default as ShareIcon } from '@mui/icons-material/Share';
export { default as DownloadIcon } from '@mui/icons-material/FileDownload';
export { default as UploadIcon } from '@mui/icons-material/UploadFile';
export { default as SearchIcon } from '@mui/icons-material/Search';
export { default as FilterIcon } from '@mui/icons-material/FilterList';
export { default as TuneIcon } from '@mui/icons-material/Tune';
export { default as RefreshIcon } from '@mui/icons-material/RestartAlt';
export { default as SyncIcon } from '@mui/icons-material/Sync';
export { default as SyncDisabledIcon } from '@mui/icons-material/SyncDisabled';
export { default as SendIcon } from '@mui/icons-material/Send';
export { default as PlayIcon } from '@mui/icons-material/PlayArrow';
export { default as PlayCircleIcon } from '@mui/icons-material/PlayCircleOutline';
export { default as OpenNewIcon } from '@mui/icons-material/OpenInNew';
export { default as LinkIcon } from '@mui/icons-material/Link';

// ===================
// STATUS ICONS
// ===================
export { default as InfoIcon } from '@mui/icons-material/Info';
export { default as InfoOutlinedIcon } from '@mui/icons-material/InfoOutlined';
export { default as ErrorIcon } from '@mui/icons-material/ErrorOutline';
export { default as NewReleasesIcon } from '@mui/icons-material/NewReleases';
export { default as HourglassIcon } from '@mui/icons-material/HourglassEmpty';
export { default as BlockIcon } from '@mui/icons-material/Block';
export { default as LockIcon } from '@mui/icons-material/Lock';
export { default as LockClockIcon } from '@mui/icons-material/LockClock';
export { default as SecurityIcon } from '@mui/icons-material/Security';
export { default as ShieldIcon } from '@mui/icons-material/Shield';

// ===================
// USER & SOCIAL ICONS
// ===================
export { default as PersonIcon } from '@mui/icons-material/Person';
export { default as PersonOutlineIcon } from '@mui/icons-material/PersonOutline';
export { default as PeopleIcon } from '@mui/icons-material/People';
export { default as PeopleOutlineIcon } from '@mui/icons-material/PeopleOutline';
export { default as GroupsIcon } from '@mui/icons-material/Groups';
export { default as LogoutIcon } from '@mui/icons-material/Logout';
export { default as SettingsIcon } from '@mui/icons-material/Settings';
export { default as NotificationsIcon } from '@mui/icons-material/Notifications';
export { default as NotificationsNoneIcon } from '@mui/icons-material/NotificationsNone';
export { default as EmailIcon } from '@mui/icons-material/Email';
export { default as EmailOutlinedIcon } from '@mui/icons-material/EmailOutlined';
export { default as SmsIcon } from '@mui/icons-material/SmsOutlined';
export { default as PhoneIcon } from '@mui/icons-material/Phone';
export { default as InstagramIcon } from '@mui/icons-material/Instagram';
export { default as YouTubeIcon } from '@mui/icons-material/YouTube';

// ===================
// TIME & CALENDAR ICONS
// ===================
export { default as CalendarIcon } from '@mui/icons-material/CalendarMonth';
export { default as CalendarTodayIcon } from '@mui/icons-material/CalendarToday';
export { default as EventIcon } from '@mui/icons-material/EventNote';
export { default as EventAvailableIcon } from '@mui/icons-material/EventAvailable';
export { default as ClockIcon } from '@mui/icons-material/AccessTime';
export { default as ScheduleIcon } from '@mui/icons-material/Schedule';

// ===================
// LOCATION ICONS
// ===================
export { default as LocationIcon } from '@mui/icons-material/LocationOn';
export { default as MapIcon } from '@mui/icons-material/Map';
export { default as NearMeIcon } from '@mui/icons-material/NearMe';
export { default as PublicIcon } from '@mui/icons-material/Public';
export { default as LanguageIcon } from '@mui/icons-material/Language';

// ===================
// COMMERCE & PAYMENT ICONS
// ===================
export { default as CartIcon } from '@mui/icons-material/ShoppingCart';
export { default as CreditCardIcon } from '@mui/icons-material/CreditCard';
export { default as MoneyIcon } from '@mui/icons-material/AttachMoney';
export { default as WalletIcon } from '@mui/icons-material/AccountBalanceWallet';
export { default as BankIcon } from '@mui/icons-material/AccountBalance';
export { default as OfferIcon } from '@mui/icons-material/LocalOffer';
export { default as MembershipIcon } from '@mui/icons-material/CardMembership';
export { default as InventoryIcon } from '@mui/icons-material/Inventory';

// ===================
// RATING & FAVORITES ICONS
// ===================
export { default as StarIcon } from '@mui/icons-material/Star';
export { default as StarBorderIcon } from '@mui/icons-material/StarBorder';
export { default as StarHalfIcon } from '@mui/icons-material/StarHalf';
export { default as FavoriteIcon } from '@mui/icons-material/Favorite';
export { default as FavoriteBorderIcon } from '@mui/icons-material/FavoriteBorder';

// ===================
// STUDIO & MUSIC ICONS
// ===================
export { default as MicIcon } from '@mui/icons-material/Mic';
export { default as HeadphonesIcon } from '@mui/icons-material/Headphones';
export { default as SpeakerIcon } from '@mui/icons-material/Speaker';
export { default as MusicNoteIcon } from '@mui/icons-material/MusicNote';
export { default as LibraryMusicIcon } from '@mui/icons-material/LibraryMusic';
export { default as AlbumIcon } from '@mui/icons-material/Album';
export { default as PianoIcon } from '@mui/icons-material/Piano';
export { default as GraphicEqIcon } from '@mui/icons-material/GraphicEq';
export { default as VoiceIcon } from '@mui/icons-material/RecordVoiceOver';
export { default as VideocamIcon } from '@mui/icons-material/Videocam';
export { default as CameraIcon } from '@mui/icons-material/CameraAlt';
export { default as PhotoLibraryIcon } from '@mui/icons-material/PhotoLibrary';

// ===================
// AMENITY ICONS
// ===================
export { default as WifiIcon } from '@mui/icons-material/Wifi';
export { default as ParkingIcon } from '@mui/icons-material/LocalParking';
export { default as ParkingOutlinedIcon } from '@mui/icons-material/LocalParkingOutlined';
export { default as AcIcon } from '@mui/icons-material/AcUnit';
export { default as SunnyIcon } from '@mui/icons-material/WbSunny';
export { default as ChairIcon } from '@mui/icons-material/Chair';
export { default as WeekendIcon } from '@mui/icons-material/Weekend';
export { default as KitchenIcon } from '@mui/icons-material/Kitchen';
export { default as CoffeeIcon } from '@mui/icons-material/Coffee';
export { default as SmokingIcon } from '@mui/icons-material/SmokingRooms';
export { default as CheckroomIcon } from '@mui/icons-material/Checkroom';
export { default as AccessibleIcon } from '@mui/icons-material/Accessible';
export { default as CarIcon } from '@mui/icons-material/DirectionsCar';
export { default as TvIcon } from '@mui/icons-material/Tv';
export { default as ComputerIcon } from '@mui/icons-material/Computer';

// ===================
// BUSINESS ICONS
// ===================
export { default as BusinessIcon } from '@mui/icons-material/Business';
export { default as AddBusinessIcon } from '@mui/icons-material/AddBusiness';
export { default as DashboardIcon } from '@mui/icons-material/Dashboard';
export { default as ChartIcon } from '@mui/icons-material/BarChart';
export { default as TrendingUpIcon } from '@mui/icons-material/TrendingUp';
export { default as WorkIcon } from '@mui/icons-material/Work';
export { default as CategoryIcon } from '@mui/icons-material/Category';
export { default as DescriptionIcon } from '@mui/icons-material/Description';
export { default as NotesIcon } from '@mui/icons-material/Notes';
export { default as TextFieldsIcon } from '@mui/icons-material/TextFields';

// ===================
// VIEW & LAYOUT ICONS
// ===================
export { default as GridViewIcon } from '@mui/icons-material/GridView';
export { default as ListViewIcon } from '@mui/icons-material/ViewList';
export { default as ListIcon } from '@mui/icons-material/List';
export { default as CompressIcon } from '@mui/icons-material/Compress';
export { default as AreaIcon } from '@mui/icons-material/SquareFoot';

// ===================
// MISC ICONS
// ===================
export { default as LightbulbIcon } from '@mui/icons-material/Lightbulb';
export { default as BoltIcon } from '@mui/icons-material/Bolt';
export { default as FlashIcon } from '@mui/icons-material/FlashOn';
export { default as AutoAwesomeIcon } from '@mui/icons-material/AutoAwesome';
export { default as CampaignIcon } from '@mui/icons-material/Campaign';
export { default as BuildIcon } from '@mui/icons-material/Build';
export { default as BugIcon } from '@mui/icons-material/BugReport';
export { default as LibraryAddIcon } from '@mui/icons-material/LibraryAdd';
export { default as DropdownIcon } from '@mui/icons-material/ArrowDropDownCircle';

// ===================
// ICON TYPE
// ===================
export type IconComponent = ComponentType<SvgIconProps>;

// ===================
// ICONS OBJECT (Grouped)
// ===================
// For convenient access: Icons.Calendar, Icons.Location, etc.
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Home from '@mui/icons-material/Home';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import MoreVert from '@mui/icons-material/MoreVert';
import Add from '@mui/icons-material/Add';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import Remove from '@mui/icons-material/Remove';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import EditNote from '@mui/icons-material/EditNote';
import Save from '@mui/icons-material/Save';
import Close from '@mui/icons-material/Close';
import Clear from '@mui/icons-material/Clear';
import Cancel from '@mui/icons-material/Cancel';
import Check from '@mui/icons-material/Check';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Share from '@mui/icons-material/Share';
import FileDownload from '@mui/icons-material/FileDownload';
import UploadFile from '@mui/icons-material/UploadFile';
import Search from '@mui/icons-material/Search';
import FilterList from '@mui/icons-material/FilterList';
import Tune from '@mui/icons-material/Tune';
import RestartAlt from '@mui/icons-material/RestartAlt';
import Sync from '@mui/icons-material/Sync';
import SyncDisabled from '@mui/icons-material/SyncDisabled';
import Send from '@mui/icons-material/Send';
import PlayArrow from '@mui/icons-material/PlayArrow';
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Link from '@mui/icons-material/Link';
import Info from '@mui/icons-material/Info';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import NewReleases from '@mui/icons-material/NewReleases';
import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import Block from '@mui/icons-material/Block';
import Lock from '@mui/icons-material/Lock';
import LockClock from '@mui/icons-material/LockClock';
import Security from '@mui/icons-material/Security';
import Shield from '@mui/icons-material/Shield';
import Person from '@mui/icons-material/Person';
import PersonOutline from '@mui/icons-material/PersonOutline';
import People from '@mui/icons-material/People';
import PeopleOutline from '@mui/icons-material/PeopleOutline';
import Groups from '@mui/icons-material/Groups';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Notifications from '@mui/icons-material/Notifications';
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import Email from '@mui/icons-material/Email';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import SmsOutlined from '@mui/icons-material/SmsOutlined';
import Phone from '@mui/icons-material/Phone';
import Instagram from '@mui/icons-material/Instagram';
import YouTube from '@mui/icons-material/YouTube';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import CalendarToday from '@mui/icons-material/CalendarToday';
import EventNote from '@mui/icons-material/EventNote';
import EventAvailable from '@mui/icons-material/EventAvailable';
import AccessTime from '@mui/icons-material/AccessTime';
import Schedule from '@mui/icons-material/Schedule';
import LocationOn from '@mui/icons-material/LocationOn';
import Map from '@mui/icons-material/Map';
import NearMe from '@mui/icons-material/NearMe';
import Public from '@mui/icons-material/Public';
import Language from '@mui/icons-material/Language';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import CreditCard from '@mui/icons-material/CreditCard';
import AttachMoney from '@mui/icons-material/AttachMoney';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import AccountBalance from '@mui/icons-material/AccountBalance';
import LocalOffer from '@mui/icons-material/LocalOffer';
import CardMembership from '@mui/icons-material/CardMembership';
import Inventory from '@mui/icons-material/Inventory';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import StarHalf from '@mui/icons-material/StarHalf';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Mic from '@mui/icons-material/Mic';
import Headphones from '@mui/icons-material/Headphones';
import Speaker from '@mui/icons-material/Speaker';
import MusicNote from '@mui/icons-material/MusicNote';
import LibraryMusic from '@mui/icons-material/LibraryMusic';
import Album from '@mui/icons-material/Album';
import Piano from '@mui/icons-material/Piano';
import GraphicEq from '@mui/icons-material/GraphicEq';
import RecordVoiceOver from '@mui/icons-material/RecordVoiceOver';
import Videocam from '@mui/icons-material/Videocam';
import CameraAlt from '@mui/icons-material/CameraAlt';
import PhotoLibrary from '@mui/icons-material/PhotoLibrary';
import Wifi from '@mui/icons-material/Wifi';
import LocalParking from '@mui/icons-material/LocalParking';
import LocalParkingOutlined from '@mui/icons-material/LocalParkingOutlined';
import AcUnit from '@mui/icons-material/AcUnit';
import WbSunny from '@mui/icons-material/WbSunny';
import Chair from '@mui/icons-material/Chair';
import Weekend from '@mui/icons-material/Weekend';
import Kitchen from '@mui/icons-material/Kitchen';
import Coffee from '@mui/icons-material/Coffee';
import SmokingRooms from '@mui/icons-material/SmokingRooms';
import Checkroom from '@mui/icons-material/Checkroom';
import Accessible from '@mui/icons-material/Accessible';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import Tv from '@mui/icons-material/Tv';
import Computer from '@mui/icons-material/Computer';
import Business from '@mui/icons-material/Business';
import AddBusiness from '@mui/icons-material/AddBusiness';
import Dashboard from '@mui/icons-material/Dashboard';
import BarChart from '@mui/icons-material/BarChart';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Work from '@mui/icons-material/Work';
import Category from '@mui/icons-material/Category';
import Description from '@mui/icons-material/Description';
import Notes from '@mui/icons-material/Notes';
import TextFields from '@mui/icons-material/TextFields';
import GridView from '@mui/icons-material/GridView';
import ViewList from '@mui/icons-material/ViewList';
import List from '@mui/icons-material/List';
import Compress from '@mui/icons-material/Compress';
import SquareFoot from '@mui/icons-material/SquareFoot';
import Lightbulb from '@mui/icons-material/Lightbulb';
import Bolt from '@mui/icons-material/Bolt';
import FlashOn from '@mui/icons-material/FlashOn';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import Campaign from '@mui/icons-material/Campaign';
import Build from '@mui/icons-material/Build';
import BugReport from '@mui/icons-material/BugReport';
import LibraryAdd from '@mui/icons-material/LibraryAdd';
import ArrowDropDownCircle from '@mui/icons-material/ArrowDropDownCircle';

export const Icons = {
  // Navigation
  ArrowBack,
  ArrowForward,
  ArrowUp: ArrowUpward,
  ArrowDown: ArrowDownward,
  ChevronLeft,
  ChevronRight,
  ChevronDown: KeyboardArrowDown,
  ChevronUp: KeyboardArrowUp,
  ExpandMore,
  ExpandLess,
  Home,
  Menu: MoreHoriz,
  MenuVert: MoreVert,

  // Actions
  Add,
  AddCircle: AddCircleOutline,
  Remove,
  RemoveCircle: RemoveCircleOutline,
  Delete,
  Edit,
  EditNote,
  Save,
  Close,
  Clear,
  Cancel,
  Check,
  CheckCircle,
  Copy: ContentCopy,
  Share,
  Download: FileDownload,
  Upload: UploadFile,
  Search,
  Filter: FilterList,
  Tune,
  Refresh: RestartAlt,
  Sync,
  SyncDisabled,
  Send,
  Play: PlayArrow,
  PlayCircle: PlayCircleOutline,
  OpenNew: OpenInNew,
  Link,

  // Status
  Info,
  InfoOutlined,
  Error: ErrorOutline,
  NewReleases,
  Hourglass: HourglassEmpty,
  Block,
  Lock,
  LockClock,
  Security,
  Shield,

  // User & Social
  Person,
  PersonOutline,
  People,
  PeopleOutline,
  Groups,
  Logout,
  Settings,
  Notifications,
  NotificationsNone,
  Email,
  EmailOutlined,
  Sms: SmsOutlined,
  Phone,
  Instagram,
  YouTube,

  // Time & Calendar
  Calendar: CalendarMonth,
  CalendarToday,
  Event: EventNote,
  EventAvailable,
  Clock: AccessTime,
  Schedule,

  // Location
  Location: LocationOn,
  Map,
  NearMe,
  Public,
  Language,

  // Commerce & Payment
  Cart: ShoppingCart,
  CreditCard,
  Money: AttachMoney,
  Wallet: AccountBalanceWallet,
  Bank: AccountBalance,
  Offer: LocalOffer,
  Membership: CardMembership,
  Inventory,

  // Rating & Favorites
  Star,
  StarBorder,
  StarHalf,
  Favorite,
  FavoriteBorder,

  // Studio & Music
  Mic,
  Headphones,
  Speaker,
  MusicNote,
  LibraryMusic,
  Album,
  Piano,
  GraphicEq,
  Voice: RecordVoiceOver,
  Videocam,
  Camera: CameraAlt,
  PhotoLibrary,

  // Amenities
  Wifi,
  Parking: LocalParking,
  ParkingOutlined: LocalParkingOutlined,
  Ac: AcUnit,
  Sunny: WbSunny,
  Chair,
  Weekend,
  Kitchen,
  Coffee,
  Smoking: SmokingRooms,
  Checkroom,
  Accessible,
  Car: DirectionsCar,
  Tv,
  Computer,

  // Business
  Business,
  AddBusiness,
  Dashboard,
  Chart: BarChart,
  TrendingUp,
  Work,
  Category,
  Description,
  Notes,
  TextFields,

  // View & Layout
  GridView,
  ListView: ViewList,
  List,
  Compress,
  Area: SquareFoot,

  // Misc
  Lightbulb,
  Bolt,
  Flash: FlashOn,
  AutoAwesome,
  Campaign,
  Build,
  Bug: BugReport,
  LibraryAdd,
  Dropdown: ArrowDropDownCircle,
} as const;

// Type for icon names (for string-based lookups)
export type IconName = keyof typeof Icons;
