import 'dart:io';

import 'package:catcher/catcher.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
  print('***** getThemeData.light=${theme.secondary0.isLight}');
  return ThemeData(
    fontFamily: 'Satoshi',
    visualDensity: VisualDensity.adaptivePlatformDensity,
    // indicatorColor: MaterialColor(theme.primary.value, _color),
    primarySwatch: MaterialColor(theme.primary.value, _color),
    primaryColor: theme.primary,
    // hoverColor: Color(0xFFFFDB87),
    // highlightColor: Colors.white,
    // primaryColorLight: Color(0xFFFFDB87),
    // backgroundColor: Color(0xFFFFDB87),
    // bottomAppBarColor: Color(0xFF176E49),
    // buttonTheme: ButtonThemeData(
    //   buttonColor: theme.primary,
    //   disabledColor: Colors.transparent,
    //   splashColor: theme.secondary,
    // ),
    brightness: Brightness
        .light, //theme.secondary0.isLight ? Brightness.dark : Brightness.light,
    // scaffoldBackgroundColor: theme.secondary12,
    // appBarTheme: Theme.of(context).appBarTheme.copyWith(
    //       // color: theme.secondary,
    //       systemOverlayStyle: SystemUiOverlayStyle(
    //         statusBarBrightness: Brightness.dark,
    //         statusBarIconBrightness: Brightness.dark,
    //         statusBarColor: theme.secondary,
    //       ),
    //     ),
    // appBarTheme: AppBarTheme(
    //   color: theme.secondary0,
    //   systemOverlayStyle: theme.secondary0.isLight ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
    // ),
  );
}

ThemeChainData unitThemeToThemeChainData(GeoUnit unit) {
  print('***** unitThemeToThemeChainData().unit=${unit.id}');
  try {
    var primary = TinyColor.fromString(unit.style.colors.indicator).color;
    var secondary = TinyColor.fromString(unit.style.colors.textDark).color;

    var secondary64 = _col(secondary, 64);
    var secondary40 = _col(secondary, 40);
    var secondary16 = _col(secondary, 16);
    var secondary12 = _col(secondary, 7);
    var secondary0 = _col(secondary, 0);
    // print('**** COLORS:');
    print('\tfinal primary = $primary;');
    print('\tfinal secondary=$secondary;');
    print('\tfinal secondary64=$secondary64;');
    print('\tfinal secondary40=$secondary40;');
    print('\tfinal secondary16=$secondary16;');
    print('\tfinal secondary12=$secondary12;');
    print('\tfinal secondary0=$secondary0;');

    // print('\t[secondary4]=${_col(secondary, 4)};');
    // print('\t[secondary5]=${_col(secondary, 5)};');
    // print('\t[secondary6]=${_col(secondary, 6)};');
    // print('\t[secondary7]=${_col(secondary, 7)};');
    // print('\t[secondary8]=${_col(secondary, 8)};');
    // print('\t[secondary9]=${_col(secondary, 9)};');
    // print('\t[secondary10]=${_col(secondary, 10)};');
    // print('\t[secondary11]=${_col(secondary, 11)};');

    return ThemeChainData(
      light: secondary0.isLight,
      secondary0: secondary0,
      secondary12: secondary12,
      secondary: secondary,
      // text2: secondary0,
      primary: primary,
      // highlight: primary,
      secondary64: secondary64,
      secondary16: secondary16,
      secondary40: secondary40,
      images: unit.style.images,
    );
    // return ThemeChainData(
    //   background: HexColor.fromHex(unit.style.colors.backgroundLight),
    //   background2: HexColor.fromHex(unit.style.colors.backgroundDark),
    //   text: HexColor.fromHex(unit.style.colors.textDark),
    //   text2: HexColor.fromHex(unit.style.colors.textLight),
    //   indicator: HexColor.fromHex(unit.style.colors.indicator),
    //   highlight: HexColor.fromHex(unit.style.colors.highlight),
    //   disabled: HexColor.fromHex(unit.style.colors.disabled),
    //   border: HexColor.fromHex(unit.style.colors.borderDark),
    //   border2: HexColor.fromHex(unit.style.colors.borderLight),
    //   images: unit.style.images,
    // );
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
  print('setToolbarThemeV1()');
  setToolbarColor(
    statusBarColor: theme.secondary0,
    systemNavigationBarColor: theme.secondary0,
    systemNavigationBarDividerColor: theme.secondary12,
  );
}

void setToolbarThemeV2(ThemeChainData theme) {
  print('setToolbarThemeV2()');
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
  if (Platform.isAndroid) {
    bool isLight = statusBarColor.isLight;
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: statusBarColor,
      statusBarIconBrightness: isLight ? Brightness.dark : Brightness.light,
      systemNavigationBarColor: systemNavigationBarColor,
      systemNavigationBarDividerColor: systemNavigationBarDividerColor,
      systemNavigationBarIconBrightness:
          isLight ? Brightness.dark : Brightness.light,
      // systemNavigationBarContrastEnforced: false,
    ));
  }
}
