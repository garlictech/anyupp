import 'dart:ui';

import 'package:fa_prev/core/theme/theme.dart';
import 'package:flutter/material.dart';

abstract class FontHandler {
  TextStyle getFont({
    Color? color,
    Color? backgroundColor,
    double? fontSize,
    FontWeight? fontWeight,
    FontStyle? fontStyle,
    double? letterSpacing,
    double? wordSpacing,
    TextBaseline? textBaseline,
    double? height,
    Locale? locale,
    Paint? foreground,
    Paint? background,
    List<Shadow>? shadows,
    List<FontFeature>? fontFeatures,
    TextDecoration? decoration,
    Color? decorationColor,
    TextDecorationStyle? decorationStyle,
    double? decorationThickness,
  });
}

class Fonts {
  static final SatoshiFont _satoshi = SatoshiFont();

  static TextStyle satoshi({
    Color? color,
    Color? backgroundColor,
    double? fontSize,
    FontWeight? fontWeight,
    FontStyle? fontStyle,
    double? letterSpacing,
    double? wordSpacing,
    TextBaseline? textBaseline,
    double? height,
    Locale? locale,
    Paint? foreground,
    Paint? background,
    List<Shadow>? shadows,
    List<FontFeature>? fontFeatures,
    TextDecoration? decoration,
    Color? decorationColor,
    TextDecorationStyle? decorationStyle,
    double? decorationThickness,
  }) {
    return _satoshi.getFont(
        color: color,
        backgroundColor: backgroundColor,
        fontSize: fontSize,
        fontWeight: fontWeight,
        fontStyle: fontStyle,
        letterSpacing: letterSpacing,
        wordSpacing: wordSpacing,
        textBaseline: textBaseline,
        height: height,
        locale: locale,
        foreground: foreground,
        background: background,
        shadows: shadows,
        fontFeatures: fontFeatures,
        decoration: decoration,
        decorationColor: decorationColor,
        decorationStyle: decorationStyle,
        decorationThickness: decorationThickness);
  }

  static TextStyle hH1({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w700,
      fontStyle: FontStyle.normal,
      fontSize: 24.0,
      fontFeatures: [
        FontFeature('wght', 700),
      ],
      color: color);

  static TextStyle hH2({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w900,
      fontStyle: FontStyle.normal,
      fontSize: 21.0,
      color: color);

  static TextStyle hH3({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w700,
      fontStyle: FontStyle.normal,
      fontSize: 19.0,
      color: color);

  static TextStyle hH4Bigcap({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w700,
      fontStyle: FontStyle.normal,
      fontSize: 17.0,
      color: color);

  static TextStyle hH4({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w700,
      fontStyle: FontStyle.normal,
      fontSize: 17.0,
      color: color);

  static TextStyle pP1Bold({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w700,
      fontStyle: FontStyle.normal,
      fontSize: 15.0,
      color: color);

  static TextStyle hH5({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w500,
      fontStyle: FontStyle.normal,
      fontSize: 15.0,
      color: color);

  static TextStyle pP1({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w400,
      fontStyle: FontStyle.normal,
      fontSize: 15.0,
      color: color);

  static TextStyle pP2({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w400,
      fontStyle: FontStyle.normal,
      fontSize: 13.0,
      letterSpacing: 0.2,
      color: color);

  static TextStyle pP2Bold({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w700,
      fontStyle: FontStyle.normal,
      fontSize: 13.0,
      color: color);

  static TextStyle pP2Regular({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w500,
      fontStyle: FontStyle.normal,
      fontSize: 13.0,
      letterSpacing: 0.2,
      color: color);

  static TextStyle hH6({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w500,
      fontStyle: FontStyle.normal,
      fontSize: 13.0,
      color: color);

  static TextStyle pP3({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w400,
      fontStyle: FontStyle.normal,
      fontSize: 13.0,
      letterSpacing: 0.2,
      color: color);

  static TextStyle pP3Bold({Color? color}) => _satoshi.getFont(
      fontWeight: FontWeight.w700,
      fontStyle: FontStyle.normal,
      fontSize: 13.0,
      letterSpacing: 0.2,
      color: color);
}
