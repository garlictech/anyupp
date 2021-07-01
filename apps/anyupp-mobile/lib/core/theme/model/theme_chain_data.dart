import 'package:flutter/material.dart';

import 'package:fa_prev/models.dart';

class ThemeChainData {
  final Color background;
  final Color background2;
  final Color text;
  final Color text2;
  final Color indicator;
  final Color highlight;
  final Color disabled;
  final Color border;
  final Color border2;
  final ChainStyleImages images;

  ThemeChainData({
    this.background,
    this.background2,
    this.text,
    this.text2,
    this.indicator,
    this.highlight,
    this.disabled,
    this.border,
    this.border2,
    this.images,
  });

  @override
  String toString() {
    return 'ThemeChainData(background: $background, background2: $background2, text: $text, text2: $text2, indicator: $indicator, highlight: $highlight, disabled: $disabled, border: $border, border2: $border2, images: $images)';
  }

  Map<int, Color> color = {
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

  ThemeData getThemeData() {
    return ThemeData(
        visualDensity: VisualDensity.adaptivePlatformDensity,
        indicatorColor: MaterialColor(indicator.value, color),
        primarySwatch: MaterialColor(highlight.value, color),
        primaryColor: Colors.black,
        accentColor: Colors.white,
        buttonColor: Colors.black,
        hoverColor: Color(0xFFFFDB87),
        highlightColor: Colors.white,
        primaryColorLight: Color(0xFFFFDB87),
        backgroundColor: Color(0xFFFFDB87),
        bottomAppBarColor: Color(0xFF176E49));
  }
}
