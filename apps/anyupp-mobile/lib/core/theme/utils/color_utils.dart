import 'package:catcher/catcher.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/material.dart';
import 'package:tinycolor2/tinycolor2.dart';

Color lighten(Color c, int percent) {
  assert(1 <= percent && percent <= 100);
  var p = percent / 100;
  return Color.fromARGB(
    c.alpha,
    c.red + ((255 - c.red) * p).round(),
    c.green + ((255 - c.green) * p).round(),
    c.blue + ((255 - c.blue) * p).round(),
  );
}

Color darken(Color c, int percent) {
  assert(1 <= percent && percent <= 100);
  var f = 1 - percent / 100;
  return Color.fromARGB(
    c.alpha,
    (c.red * f).round(),
    (c.green * f).round(),
    (c.blue * f).round(),
  );
}

final Map<int, Color> _color = {
  50: Color.fromRGBO(136, 14, 79, .1),
  100: Color.fromRGBO(136, 14, 79, .2),
  200: Color.fromRGBO(136, 14, 79, .3),
  300: Color.fromRGBO(136, 14, 79, .4),
  400: Color.fromRGBO(136, 14, 79, .5),
  500: Color.fromRGBO(136, 14, 79, .6),
  600: Color.fromRGBO(136, 14, 79, .7),
  700: Color.fromRGBO(136, 14, 79, .8),
  800: Color.fromRGBO(136, 14, 79, .9),
  900: Color.fromRGBO(136, 14, 79, 1),
};

ThemeData getThemeData(BuildContext context, ThemeChainData theme) {
  // print('***** getThemeData.light=${theme.secondary0.isLight}');
  return ThemeData(
    fontFamily: 'Satoshi',
    visualDensity: VisualDensity.adaptivePlatformDensity,
    primarySwatch: MaterialColor(theme.highlight.value, _color),
    primaryColor: theme.highlight,
    brightness: Brightness.light,
  );
}

ThemeChainData unitThemeToThemeChainData(GeoUnit unit) {
  print('***** unitThemeToThemeChainData().unit=${unit.style.colors}');
  try {
    String primaryString =
        unit.style.colors.primary ?? unit.style.colors.indicator ?? '#30BF60';
    String secondaryString =
        unit.style.colors.secondary ?? unit.style.colors.textDark ?? '#373737';
    var primary = TinyColor.fromString(
      primaryString,
    ).color;
    var secondary = TinyColor.fromString(
      secondaryString,
    ).color;

    var button =
        TinyColor.fromString(unit.style.colors.button ?? primaryString)
            .color;
    var buttonText =
        TinyColor.fromString(unit.style.colors.buttonText ?? secondaryString)
            .color;
    var icon =
        TinyColor.fromString(unit.style.colors.icon ?? primaryString).color;
    var highlight =
        TinyColor.fromString(unit.style.colors.highlight ?? primaryString)
            .color;

    var secondary64 = _col(secondary, 64);
    var secondary40 = _col(secondary, 40);
    var secondary16 = _col(secondary, 16);
    var secondary12 = _col(secondary, 7);
    var secondary0 = _col(secondary, 0);

    // print('\tfinal primary = $primary;');
    // print('\tfinal secondary=$secondary;');
    // print('\tfinal secondary64=$secondary64;');
    // print('\tfinal secondary40=$secondary40;');
    // print('\tfinal secondary16=$secondary16;');
    // print('\tfinal secondary12=$secondary12;');
    // print('\tfinal secondary0=$secondary0;');

    return ThemeChainData(
      light: secondary0.isLight,
      secondary0: secondary0,
      secondary12: secondary12,
      secondary: secondary,
      primary: primary,
      secondary64: secondary64,
      secondary16: secondary16,
      secondary40: secondary40,
      button: button,
      buttonText: buttonText,
      icon: icon,
      highlight: highlight,
      images: unit.style.images,
    );
  } catch (error, stackTrace) {
    Catcher.reportCheckedError(error, stackTrace);
    return ThemeAnyUpp();
  }
}

Color _col(Color color, int percent) {
  if (color.isDark) {
    return lighten(color, 100 - percent);
  } else {
    return percent == 0 ? Colors.black : darken(color, 100 - percent);
  }
}

void setToolbarThemeV1(ThemeChainData theme) {
  // print('setToolbarThemeV1()');
  setToolbarColor(
    statusBarColor: theme.secondary0,
    systemNavigationBarColor: theme.secondary0,
    systemNavigationBarDividerColor: theme.secondary12,
  );
}

void setToolbarThemeV2(ThemeChainData theme) {
  // print('setToolbarThemeV2()');
  setToolbarColor(
    statusBarColor: theme.secondary12,
    systemNavigationBarColor: theme.secondary12,
    systemNavigationBarDividerColor: theme.secondary12,
  );
}

void setToolbarTheme(ThemeChainData theme) {
  setToolbarColor(
    statusBarColor: theme.secondary0,
    systemNavigationBarColor: theme.secondary0,
    systemNavigationBarDividerColor: theme.secondary12,
  );
}

void setToolbarColor({
  required Color statusBarColor,
  required Color systemNavigationBarColor,
  required Color systemNavigationBarDividerColor,
}) {
  // if (Platform.isAndroid) {
  //   bool isLight = statusBarColor.isLight;
  //   SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
  //     statusBarColor: statusBarColor,
  //     statusBarIconBrightness: isLight ? Brightness.dark : Brightness.light,
  //     systemNavigationBarColor: systemNavigationBarColor,
  //     systemNavigationBarDividerColor: systemNavigationBarDividerColor,
  //     systemNavigationBarIconBrightness:
  //         isLight ? Brightness.dark : Brightness.light,
  //     // systemNavigationBarContrastEnforced: false,
  //   ));
  // }
}
