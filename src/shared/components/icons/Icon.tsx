import { forwardRef } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { Icons, type IconName } from './icons';

// ===================
// ICON SIZE PRESETS
// ===================
export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export type IconSize = keyof typeof iconSizes | number;

// ===================
// ICON PROPS
// ===================
export interface IconProps extends Omit<SvgIconProps, 'fontSize' | 'color'> {
  /** Icon name from the registry */
  name: IconName;
  /** Size preset or pixel value */
  size?: IconSize;
  /** Color - MUI color name or CSS color string */
  color?: SvgIconProps['color'] | string;
  /** Additional className */
  className?: string;
  /** Accessible label */
  'aria-label'?: string;
}

// ===================
// ICON COMPONENT
// ===================
/**
 * Unified Icon component with consistent sizing and theming.
 * 
 * @example
 * // Using size preset
 * <Icon name="Calendar" size="lg" />
 * 
 * // Using custom pixel size
 * <Icon name="Location" size={32} />
 * 
 * // With color
 * <Icon name="Star" color="warning" />
 * <Icon name="Check" color="var(--color-success)" />
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 'md', color = 'inherit', className, ...props }, ref) => {
    const IconComponent = Icons[name];
    
    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in registry`);
      return null;
    }

    // Resolve size
    const resolvedSize = typeof size === 'number' ? size : iconSizes[size];

    // Handle custom color strings (CSS variables, hex, etc.)
    const isCustomColor = typeof color === 'string' && 
      (color.startsWith('#') || 
       color.startsWith('rgb') || 
       color.startsWith('var(') ||
       color.startsWith('hsl'));

    const iconProps: SvgIconProps = {
      ...props,
      ref,
      className,
      sx: {
        width: resolvedSize,
        height: resolvedSize,
        fontSize: resolvedSize,
        ...(isCustomColor && { color }),
        ...props.sx,
      },
      ...(isCustomColor ? {} : { color: color as SvgIconProps['color'] }),
    };

    return <IconComponent {...iconProps} />;
  }
);

Icon.displayName = 'Icon';

// ===================
// DIRECT ICON USAGE TYPE
// ===================
/**
 * Type helper for when you need to pass icon components as props.
 * 
 * @example
 * interface ButtonProps {
 *   icon?: IconComponentType;
 * }
 * 
 * <Button icon={Icons.Calendar} />
 */
export type IconComponentType = typeof Icons[IconName];

// ===================
// ICON WITH DEFAULTS FACTORY
// ===================
/**
 * Create an icon component with preset defaults.
 * Useful for creating domain-specific icon sets.
 * 
 * @example
 * const SmallIcon = createIconWithDefaults({ size: 'sm' });
 * <SmallIcon name="Star" />
 */
export function createIconWithDefaults(defaults: Partial<IconProps>) {
  return forwardRef<SVGSVGElement, IconProps>((props, ref) => (
    <Icon ref={ref} {...defaults} {...props} />
  ));
}

export default Icon;
