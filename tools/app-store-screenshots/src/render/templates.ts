import type { TemplateId } from '../config/types.js';

export interface TemplateLayout {
  id: TemplateId;
  textTop: number;
  textWidth: number;
  titleSize: number;
  subtitleSize: number;
  deviceTop: number;
}

export const TEMPLATE_LAYOUTS: Record<TemplateId, TemplateLayout> = {
  hero: {
    id: 'hero',
    textTop: 0.075,
    textWidth: 0.84,
    titleSize: 0.073,
    subtitleSize: 0.031,
    deviceTop: 0.34
  },
  feature: {
    id: 'feature',
    textTop: 0.085,
    textWidth: 0.78,
    titleSize: 0.071,
    subtitleSize: 0.03,
    deviceTop: 0.31
  },
  dual: {
    id: 'dual',
    textTop: 0.065,
    textWidth: 0.86,
    titleSize: 0.067,
    subtitleSize: 0.029,
    deviceTop: 0.31
  },
  'full-bleed': {
    id: 'full-bleed',
    textTop: 0.07,
    textWidth: 0.86,
    titleSize: 0.067,
    subtitleSize: 0.029,
    deviceTop: 0.29
  },
  minimal: {
    id: 'minimal',
    textTop: 0.055,
    textWidth: 0.88,
    titleSize: 0.062,
    subtitleSize: 0.026,
    deviceTop: 0.25
  },
  product: {
    id: 'product',
    textTop: 0,
    textWidth: 1,
    titleSize: 0.01,
    subtitleSize: 0.01,
    deviceTop: 0.5
  }
};

export function getTemplateLayout(template: TemplateId): TemplateLayout {
  const layout = TEMPLATE_LAYOUTS[template];
  if (!layout) throw new Error(`Unsupported screenshot template: ${template}`);
  return layout;
}
