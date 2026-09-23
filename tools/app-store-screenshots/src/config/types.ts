export type LocaleId = 'en-US' | 'he';
export type TextDirection = 'ltr' | 'rtl';
export type ThemeId = 'dark' | 'light';
export type TemplateId = 'hero' | 'feature' | 'dual' | 'full-bleed' | 'minimal' | 'product';
export type DeviceId = 'iphone-6.9' | 'iphone-6.7' | 'iphone-6.5' | 'ipad-13' | 'desktop-1440';
export type Orientation = 'portrait' | 'landscape';
export type AuthState = 'guest' | 'vendor' | 'customer';

export interface Dimensions {
  width: number;
  height: number;
}

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type BackgroundConfig =
  | { type: 'solid'; value: string }
  | { type: 'gradient'; from: string; to: string; angle?: number }
  | { type: 'radial'; inner: string; outer: string; origin?: string };

export interface TypographyOverride {
  fontFamily?: 'display' | 'body' | 'hebrew';
  fontSize?: number;
  minFontSize?: number;
  lineHeight?: number;
  weight?: number;
  color?: string;
  maxWidth?: number;
}

export interface DeviceTransform {
  scale?: number;
  x?: number;
  y?: number;
  rotation?: number;
  perspective?: number;
  shadow?: boolean;
}

export interface ScreenshotCrop {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  objectPosition?: string;
}

export interface ScreenTreatment {
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

export interface PublishedAsset {
  path: string;
  dimensions?: Dimensions;
  quality?: number;
}

export type NavigationAction =
  | { type: 'click'; selector: string }
  | { type: 'fill'; selector: string; value: string }
  | { type: 'press'; key: string }
  | { type: 'scroll'; selector?: string; x?: number; y?: number };

export interface CaptureScenario {
  id: string;
  route: string;
  readySelector: string;
  fixture: 'public' | 'studio' | 'vendor-dashboard' | 'projects';
  auth: AuthState;
  theme: ThemeId;
  locale: LocaleId;
  viewportDevice: DeviceId;
  viewport?: Dimensions;
  actions?: NavigationAction[];
  fullPage?: boolean;
}

interface ScreenshotBase {
  id: string;
  order: number;
  title: string;
  subtitle?: string;
  template: TemplateId;
  device: DeviceId;
  orientation?: Orientation;
  locale: LocaleId;
  theme: ThemeId;
  background: BackgroundConfig;
  textAlign?: 'start' | 'center' | 'end';
  titleTypography?: TypographyOverride;
  subtitleTypography?: TypographyOverride;
  safeArea?: Partial<Insets>;
  deviceTransform?: DeviceTransform;
  screenTreatment?: ScreenTreatment;
  crop?: ScreenshotCrop;
  outputFilename?: string;
  outputDimensions?: Dimensions;
  publish?: PublishedAsset;
}

export interface SingleScreenshotDefinition extends ScreenshotBase {
  template: Exclude<TemplateId, 'dual'>;
  source: string;
}

export interface DualScreenshotDefinition extends ScreenshotBase {
  template: 'dual';
  sources: [string, string];
  secondaryDevice: DeviceId;
  secondaryDeviceTransform?: DeviceTransform;
}

export type ScreenshotDefinition = SingleScreenshotDefinition | DualScreenshotDefinition;

export interface ScreenshotGeneratorConfig {
  version: 1;
  captures: CaptureScenario[];
  screenshots: ScreenshotDefinition[];
}

export interface CliFilters {
  only: Set<string>;
  locale?: LocaleId;
  theme?: ThemeId;
  device?: DeviceId;
  template?: TemplateId;
  scenario?: string;
}

export interface RunOptions {
  command: 'generate' | 'validate';
  preview: boolean;
  skipCapture: boolean;
  filters: CliFilters;
}

export interface RenderDiagnostics {
  outputPath: string;
  titleOverflow: boolean;
  subtitleOverflow: boolean;
  titleFontSize: number;
  subtitleFontSize: number;
}
