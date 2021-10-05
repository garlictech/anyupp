import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:flutter/material.dart';
import 'package:tinycolor2/tinycolor2.dart';
import 'package:fa_prev/core/theme/theme.dart';

extension ThemeStateExtension on State {
  ThemeChainData get theme => getIt<ThemeBloc>().state.theme;
  // ThemeChainData get theme => _unitThemeToThemeChainData();
}

extension TranslateStatelessWidgetExtension on StatelessWidget {
  ThemeChainData get theme => getIt<ThemeBloc>().state.theme;
  // ThemeChainData get theme => _unitThemeToThemeChainData();
}

// extension ThemeChainDataExtension on ThemeChainData {
//   bool get isDark => secondary.isDark;
//   bool get isLight => secondary.isLight;
// }

// ignore: unused_element
ThemeChainData _unitThemeToThemeChainData() {
  // var light = false;

  // Narancs + Kék: világos
  // var primary = Color(0xFFfca311);
  // var secondary = Color(0xFF14213d);

  // Kék + Narancs: sötét
  // var light = false;
  // var primary = Color(0xFF219ebc);
  // var secondary = Color(0xFFfca311);

  // Kék + Kék: világos
  // var light = null;
  // var primary = Color(0xFF003049);
  // var secondary = Color(0xFF0f4c5c);

  // Világoszöld + sárga: sötét
  // var primary = Color(0xFF80ed99);
  // var secondary = Color(0xFFfff3b0);

  // Világokék + halványpiros: sötét
  // var primary = Color(0xFF778da9);
  // var secondary = Color(0xFFf07167);

  // Világokék + halványpiros: sötét
  // var primary = Color(0xFFc44536);
  // var secondary = Color(0xFF99582a);

  // Frei colors : light
  // var primary = Color(0xFFF28D52);
  // var secondary = Color(0xFF401801);

  // Frei colors : light
  var light = true;
  var primary = Color(0xFFBF9673);
  var secondary = Color(0xFF401801);

  // Frei colors : dark
  // var light = false;
  // var primary = Color(0xFFBF9673);
  // var secondary = Color(0xFFF2E1D8);

  var secondary64 = _col(secondary, 64, light);
  var secondary40 = _col(secondary, 40, light);
  var secondary16 = _col(secondary, 16, light);
  var secondary12 = _col(secondary, 12, light);
  var secondary0 = _col(secondary, 0, light);
  // print('**** COLORS:');
  // print('\tfinal primary = $primary;');
  // print('\tfinal secondary=$secondary;');
  // print('\tfinal secondary64=$secondary64;');
  // print('\tfinal secondary40=$secondary40;');
  // print('\tfinal secondary16=$secondary16;');
  // print('\tfinal secondary12=$secondary12;');
  // print('\tfinal secondary0=$secondary0;');

  return ThemeChainData(
    light: light,
    primary: primary,
    secondary: secondary,
    secondary0: secondary0,
    secondary12: secondary12,
    secondary16: secondary16,
    secondary40: secondary40,
    secondary64: secondary64,
    // text2: secondary0,
    // highlight: primary,
  );
}

Color _col(Color color, int percent, [bool? dark]) {
  bool isDark = dark ?? color.isDark;

  if (isDark) {
    return lighten(color, 100 - percent);
  } else {
    return percent == 0 ? Colors.black : darken(color, 100 - percent);
  }
}
