/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  getPreviewSVG,
  hexToRgb,
  isDark,
  mixWithOpacity,
} from '@bgap/admin/refactor';

describe('Chain pure functions', () => {
  it('hexToRgb should calculate rgb values from a hex value', () => {
    expect(hexToRgb('#ffffff')).toMatchInlineSnapshot(`
      Object {
        "b": 255,
        "g": 255,
        "r": 255,
      }
    `);
    expect(hexToRgb('#aabbcc')).toMatchInlineSnapshot(`
      Object {
        "b": 204,
        "g": 187,
        "r": 170,
      }
    `);
    expect(hexToRgb('#336699')).toMatchInlineSnapshot(`
      Object {
        "b": 153,
        "g": 102,
        "r": 51,
      }
    `);
    expect(hexToRgb('#000000')).toMatchInlineSnapshot(`
      Object {
        "b": 0,
        "g": 0,
        "r": 0,
      }
    `);
    expect(hexToRgb('#3F92DF')).toMatchInlineSnapshot(`
      Object {
        "b": 223,
        "g": 146,
        "r": 63,
      }
    `);
  });

  it('mixWithOpacity should calculate color', () => {
    expect(mixWithOpacity('#30bf60', 0.5)).toMatchInlineSnapshot(`"#185f30"`);
    expect(mixWithOpacity('#303030', 0.8)).toMatchInlineSnapshot(`"#595959"`);
    expect(mixWithOpacity('#303030', 0.3)).toMatchInlineSnapshot(`"#c0c0c0"`);
  });

  it('isDark should calculate isDark value', () => {
    expect(isDark('#ffffff')).toMatchInlineSnapshot(`false`);
    expect(isDark('#000000')).toMatchInlineSnapshot(`true`);
  });

  it('getPreviewSVG should create SVG preview with replaced colors', () => {
    expect(
      getPreviewSVG({
        button: '#ffffff',
        buttonText: '#000000',
        icon: '#fffffa',
        highlight: '#00000b',
      }),
    ).toMatchSnapshot();
  });
});
