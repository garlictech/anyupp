import 'package:catcher/catcher.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/material.dart';
import 'package:tinycolor2/tinycolor2.dart';

Color errorColor = Color(0xFFE74C3C);
Color successColor = Color(0xFF30BF60);

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
  // log.d('***** getThemeData.light=${theme.secondary0.isLight}');
  return ThemeData(
    fontFamily: 'Satoshi',
    visualDensity: VisualDensity.adaptivePlatformDensity,
    primarySwatch: MaterialColor(theme.highlight.value, _color),
    primaryColor: theme.highlight,
    brightness: Brightness.light,
  );
}

ThemeChainData defaultTheme() =>
    generateTheme(Color(0xFF309791), Color(0xFF373737));

ThemeChainData generateTheme(Color primary, Color secondary) {
  var secondary64 = _col(secondary, 64);
  var secondary40 = _col(secondary, 40);
  var secondary16 = _col(secondary, 16);
  var secondary12 = _col(secondary, 7);
  var secondary0 = _col(secondary, 0);
  return ThemeChainData(
    secondary0: secondary0,
    secondary12: secondary12,
    secondary: secondary,
    primary: primary,
    secondary64: secondary64,
    secondary16: secondary16,
    secondary40: secondary40,
    button: primary,
    buttonText: secondary0,
    icon: primary,
    highlight: primary,
    light: secondary0.isLight,
  );
}

ThemeChainData unitThemeToThemeChainData(GeoUnit unit) {
  log.d('***** unitThemeToThemeChainData().unit=${unit.style.colors}');
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
        TinyColor.fromString(unit.style.colors.button ?? primaryString).color;
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

    // log.d('\tfinal primary = $primary;');
    // log.d('\tfinal secondary=$secondary;');
    // log.d('\tfinal secondary64=$secondary64;');
    // log.d('\tfinal secondary40=$secondary40;');
    // log.d('\tfinal secondary16=$secondary16;');
    // log.d('\tfinal secondary12=$secondary12;');
    // log.d('\tfinal secondary0=$secondary0;');

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
  // log.d('setToolbarThemeV1()');
  setToolbarColor(
    statusBarColor: theme.secondary0,
    systemNavigationBarColor: theme.secondary0,
    systemNavigationBarDividerColor: theme.secondary12,
  );
}

void setToolbarThemeV2(ThemeChainData theme) {
  // log.d('setToolbarThemeV2()');
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
