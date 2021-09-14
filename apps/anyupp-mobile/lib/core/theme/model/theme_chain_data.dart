import 'package:flutter/material.dart';
import 'package:fa_prev/models.dart';

@immutable
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
  final ChainStyleImages? images;

  ThemeChainData({
    required this.background,
    required this.background2,
    required this.text,
    required this.text2,
    required this.indicator,
    required this.highlight,
    required this.disabled,
    required this.border,
    required this.border2,
    this.images,
  });

  final Map<int, Color> color = {
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
        hoverColor: Color(0xFFFFDB87),
        highlightColor: Colors.white,
        primaryColorLight: Color(0xFFFFDB87),
        backgroundColor: Color(0xFFFFDB87),
        bottomAppBarColor: Color(0xFF176E49));
  }

  ThemeChainData copyWith({
    Color? background,
    Color? background2,
    Color? text,
    Color? text2,
    Color? indicator,
    Color? highlight,
    Color? disabled,
    Color? border,
    Color? border2,
    ChainStyleImages? images,
  }) {
    return ThemeChainData(
      background: background ?? this.background,
      background2: background2 ?? this.background2,
      text: text ?? this.text,
      text2: text2 ?? this.text2,
      indicator: indicator ?? this.indicator,
      highlight: highlight ?? this.highlight,
      disabled: disabled ?? this.disabled,
      border: border ?? this.border,
      border2: border2 ?? this.border2,
      images: images ?? this.images,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'background': background.value,
      'background2': background2.value,
      'text': text.value,
      'text2': text2.value,
      'indicator': indicator.value,
      'highlight': highlight.value,
      'disabled': disabled.value,
      'border': border.value,
      'border2': border2.value,
      'images': images?.toJson(),
    };
  }

  factory ThemeChainData.fromJson(Map<String, dynamic> map) {
    return ThemeChainData(
      background: Color(map['background']),
      background2: Color(map['background2']),
      text: Color(map['text']),
      text2: Color(map['text2']),
      indicator: Color(map['indicator']),
      highlight: Color(map['highlight']),
      disabled: Color(map['disabled']),
      border: Color(map['border']),
      border2: Color(map['border2']),
      images: ChainStyleImages.fromJson(map['images']),
    );
  }

  @override
  String toString() {
    return 'ThemeChainData(background: $background, background2: $background2, text: $text, text2: $text2, indicator: $indicator, highlight: $highlight, disabled: $disabled, border: $border, border2: $border2, images: $images)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ThemeChainData &&
        other.background == background &&
        other.background2 == background2 &&
        other.text == text &&
        other.text2 == text2 &&
        other.indicator == indicator &&
        other.highlight == highlight &&
        other.disabled == disabled &&
        other.border == border &&
        other.border2 == border2 &&
        other.images == images;
  }

  @override
  int get hashCode {
    return background.hashCode ^
        background2.hashCode ^
        text.hashCode ^
        text2.hashCode ^
        indicator.hashCode ^
        highlight.hashCode ^
        disabled.hashCode ^
        border.hashCode ^
        border2.hashCode ^
        images.hashCode;
  }
}
