import { ChainStyleColors } from '@bgap/domain';

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

const colorMap = {
  __body_background__: '#ECECEC',
  __header_background__: '#ffffff',
  __back_button__: '#2A2A2A',
  __system_battery__: 'black',
  __system_wifi__: 'black',
  __system_network__: 'black',
  __system_time__: 'black',
  __header_icon_border__: '#ECECEC',
  __header_icon_background__: '#ffffff',
  __header_icon_color__: '#2A2A2A',
  __header_button_active__: '__button__',
  __header_button_text_active__: '__button_text__',
  __header_button__: '#ececec',
  __header_button_text__: '#2A2A2A',
  __product_name__: '#2A2A2A',
  __product_description__: '#2A2A2A',
  __product_price__: '__highlight__',
  __footer_border__: '#ECECEC',
  __footer_border_active__: '__icon__',
  __footer_icon_active__: '__icon__',
  __footer_icon_text_active__: '__icon_text__',
  __footer_icon__: '#6C6C6C',
  __footer_icon_text__: '#6C6C6C',
  __footer_background__: '#ffffff',
  __card_background__: '#ffffff',
};

export const getPreviewSVG = (colors: ChainStyleColors) => {
  let preview = appPreviewSVG;

  Object.keys(colorMap).forEach(key => {
    preview = preview.replace(
      new RegExp(key, 'g'),
      colorMap[<keyof typeof colorMap>key],
    );
  });

  return preview
    .replace(new RegExp('__button__', 'g'), colors.button || '')
    .replace(new RegExp('__button_text__', 'g'), colors.buttonText || '')
    .replace(new RegExp('__icon__', 'g'), colors.icon || '')
    .replace(new RegExp('__highlight__', 'g'), colors.highlight || '');
};
