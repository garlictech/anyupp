import { appPreviewSVG } from './svg-preview';

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const isDark = (secondaryColor: string) => {
  const rgb = hexToRgb(secondaryColor);
  const brightness = rgb ? (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 : 0;

  return brightness < 128.0;
};

export const mixWithOpacity = (hexColor: string, opacity: number) => {
  const RGB = hexToRgb(hexColor);
  const opacityMultiplier = isDark(hexColor) ? 255 : 0;

  if (RGB) {
    const r = Math.floor(RGB.r * opacity + opacityMultiplier * (1 - opacity));
    const g = Math.floor(RGB.g * opacity + opacityMultiplier * (1 - opacity));
    const b = Math.floor(RGB.b * opacity + opacityMultiplier * (1 - opacity));
    const hex = ((r << 16) | (g << 8) | b).toString(16);

    return '#' + (hex === '0' ? '000' : hex);
  }

  return '';
};

export const getPreviewSVG = (primaryColor: string, secondaryColor: string) =>
  appPreviewSVG
    .replace(new RegExp('__primary__', 'g'), primaryColor || '')
    .replace(new RegExp('__secondary__', 'g'), secondaryColor || '')
    .replace(
      new RegExp('__secondary64__', 'g'),
      mixWithOpacity(secondaryColor || '', 0.64),
    )
    .replace(
      new RegExp('__secondary40__', 'g'),
      mixWithOpacity(secondaryColor || '', 0.4),
    )
    .replace(
      new RegExp('__secondary16__', 'g'),
      mixWithOpacity(secondaryColor || '', 0.16),
    )
    .replace(
      new RegExp('__secondary08__', 'g'),
      mixWithOpacity(secondaryColor || '', 0.08),
    )
    .replace(
      new RegExp('__secondary0__', 'g'),
      mixWithOpacity(secondaryColor || '', 0),
    );
