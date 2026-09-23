import type {
  AuthState,
  BackgroundConfig,
  CaptureScenario,
  DeviceId,
  DeviceTransform,
  Dimensions,
  LocaleId,
  NavigationAction,
  ScreenshotCrop,
  ScreenshotDefinition,
  ScreenTreatment,
  TemplateId,
  ThemeId,
  TypographyOverride
} from './types.js';

const LOCALES: LocaleId[] = ['en-US', 'he'];
const THEMES: ThemeId[] = ['dark', 'light'];

interface LocalizedCopy {
  title: string;
  subtitle?: string;
}

interface ThemePresentation {
  background?: BackgroundConfig;
  titleTypography?: TypographyOverride;
  subtitleTypography?: TypographyOverride;
}

interface ScenePublishConfig {
  directory: string;
  dimensions?: Dimensions;
  quality?: number;
}

export interface ScreenshotScene {
  id: string;
  order: number;
  path: string;
  readySelector: string;
  fixture: CaptureScenario['fixture'];
  auth: AuthState;
  device: DeviceId;
  template: TemplateId;
  secondaryDevice?: DeviceId;
  copy: Record<LocaleId, LocalizedCopy>;
  textAlign?: 'start' | 'center' | 'end';
  deviceTransform?: DeviceTransform;
  secondaryDeviceTransform?: DeviceTransform;
  screenTreatment?: Partial<Record<ThemeId, ScreenTreatment>>;
  crop?: ScreenshotCrop;
  actions?: NavigationAction[];
  presentation?: Partial<Record<ThemeId, ThemePresentation>>;
  publish?: ScenePublishConfig;
  capturePublish?: ScenePublishConfig;
}

export interface ExpandedScenes {
  captures: CaptureScenario[];
  screenshots: ScreenshotDefinition[];
}

export function expandScenes(scenes: ScreenshotScene[]): ExpandedScenes {
  const captures: CaptureScenario[] = [];
  const screenshots: ScreenshotDefinition[] = [];

  for (const scene of scenes) {
    for (const locale of LOCALES) {
      for (const theme of THEMES) {
        const variantId = `${scene.id}-${locale.toLowerCase()}-${theme}`;
        const presentation = scene.presentation?.[theme];
        const copy = scene.copy[locale];
        const route = `/${locale === 'he' ? 'he' : 'en'}${scene.path}`;

        if (scene.template === 'dual') {
          if (!scene.secondaryDevice) {
            throw new Error(`Dual scene "${scene.id}" requires a secondaryDevice.`);
          }
          const primarySource = `${variantId}-primary`;
          const secondarySource = `${variantId}-secondary`;
          captures.push(
            {
              id: primarySource,
              route,
              readySelector: scene.readySelector,
              fixture: scene.fixture,
              auth: scene.auth,
              theme,
              locale,
              viewportDevice: scene.device,
              actions: scene.actions,
              publish: scene.capturePublish
                ? {
                    path: `${scene.capturePublish.directory}/${locale}/${theme}/${scene.id}-desktop.webp`,
                    dimensions: scene.capturePublish.dimensions,
                    quality: scene.capturePublish.quality
                  }
                : undefined
            },
            {
              id: secondarySource,
              route,
              readySelector: scene.readySelector,
              fixture: scene.fixture,
              auth: scene.auth,
              theme,
              locale,
              viewportDevice: scene.secondaryDevice,
              actions: scene.actions,
              publish: scene.capturePublish
                ? {
                    path: `${scene.capturePublish.directory}/${locale}/${theme}/${scene.id}-mobile.webp`,
                    quality: scene.capturePublish.quality
                  }
                : undefined
            }
          );
          screenshots.push({
            id: variantId,
            order: scene.order,
            title: copy.title,
            subtitle: copy.subtitle,
            sources: [primarySource, secondarySource],
            template: 'dual',
            device: scene.device,
            secondaryDevice: scene.secondaryDevice,
            locale,
            theme,
            background: presentation?.background || defaultBackground(theme),
            textAlign: scene.textAlign,
            titleTypography: presentation?.titleTypography || defaultTitleTypography(theme),
            subtitleTypography: presentation?.subtitleTypography || defaultSubtitleTypography(theme),
            deviceTransform: scene.deviceTransform,
            secondaryDeviceTransform: scene.secondaryDeviceTransform,
            screenTreatment: scene.screenTreatment?.[theme] || defaultScreenTreatment(theme),
            crop: scene.crop,
            publish: scene.publish
              ? {
                  path: `${scene.publish.directory}/${locale}/${theme}/${scene.id}.webp`,
                  dimensions: scene.publish.dimensions,
                  quality: scene.publish.quality
                }
              : undefined,
            outputFilename: `${String(scene.order).padStart(2, '0')}-${scene.id}.png`
          });
          continue;
        }

        captures.push({
          id: variantId,
          route,
          readySelector: scene.readySelector,
          fixture: scene.fixture,
          auth: scene.auth,
          theme,
          locale,
          viewportDevice: scene.device,
          actions: scene.actions,
          publish: scene.capturePublish
            ? {
                path: `${scene.capturePublish.directory}/${locale}/${theme}/${scene.id}.webp`,
                dimensions: scene.capturePublish.dimensions,
                quality: scene.capturePublish.quality
              }
            : undefined
        });

        screenshots.push({
          id: variantId,
          order: scene.order,
          title: copy.title,
          subtitle: copy.subtitle,
          source: variantId,
          template: scene.template,
          device: scene.device,
          locale,
          theme,
          background: presentation?.background || defaultBackground(theme),
          textAlign: scene.textAlign,
          titleTypography: presentation?.titleTypography || defaultTitleTypography(theme),
          subtitleTypography: presentation?.subtitleTypography || defaultSubtitleTypography(theme),
          deviceTransform: scene.deviceTransform,
          screenTreatment: scene.screenTreatment?.[theme] || defaultScreenTreatment(theme),
          crop: scene.crop,
          publish: scene.publish
            ? {
                path: `${scene.publish.directory}/${locale}/${theme}/${scene.id}.webp`,
                dimensions: scene.publish.dimensions,
                quality: scene.publish.quality
              }
            : undefined,
          outputFilename: `${String(scene.order).padStart(2, '0')}-${scene.id}.png`
        });
      }
    }
  }

  return { captures, screenshots };
}

function defaultScreenTreatment(theme: ThemeId): ScreenTreatment {
  return theme === 'dark'
    ? { brightness: 1.18, contrast: 1.08, saturation: 1.06 }
    : { brightness: 0.92, contrast: 1.16, saturation: 1.04 };
}

function defaultBackground(theme: ThemeId): BackgroundConfig {
  return theme === 'dark'
    ? { type: 'radial', inner: '#26313c', outer: '#080c11', origin: '50% 18%' }
    : { type: 'gradient', from: '#f7f4ed', to: '#e4ddd1', angle: 155 };
}

function defaultTitleTypography(theme: ThemeId): TypographyOverride {
  return { color: theme === 'dark' ? '#f7f7f5' : '#17130d' };
}

function defaultSubtitleTypography(theme: ThemeId): TypographyOverride {
  return { color: theme === 'dark' ? '#c9c9c3' : '#5f574d' };
}
