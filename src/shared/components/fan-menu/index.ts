export { FanMenu } from './FanMenu';

export interface FanMenuButton {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  className?: string;
}

export interface FanMenuProps {
  buttons: FanMenuButton[];
  className?: string;
}

