import 'package:flutter/material.dart';

import '/models.dart';

@immutable
class ThemeChainData {
  final Color secondary0;
  final Color secondary12;
  final Color secondary;
  final Color primary;
  final Color secondary64;
  final Color secondary16;
  final Color secondary40;
  final Color button;
  final Color buttonText;
  final Color icon;
  final Color highlight;
  final bool light;
  final ChainStyleImages? images;
  ThemeChainData({
    required this.secondary0,
    required this.secondary12,
    required this.secondary,
    required this.primary,
    required this.secondary64,
    required this.secondary16,
    required this.secondary40,
    required this.button,
    required this.buttonText,
    required this.icon,
    required this.highlight,
    required this.light,
    this.images,
  });
  

  ThemeChainData copyWith({
    Color? secondary0,
    Color? secondary12,
    Color? secondary,
    Color? primary,
    Color? secondary64,
    Color? secondary16,
    Color? secondary40,
    Color? button,
    Color? buttonText,
    Color? icon,
    Color? highlight,
    bool? light,
    ChainStyleImages? images,
  }) {
    return ThemeChainData(
      secondary0: secondary0 ?? this.secondary0,
      secondary12: secondary12 ?? this.secondary12,
      secondary: secondary ?? this.secondary,
      primary: primary ?? this.primary,
      secondary64: secondary64 ?? this.secondary64,
      secondary16: secondary16 ?? this.secondary16,
      secondary40: secondary40 ?? this.secondary40,
      button: button ?? this.button,
      buttonText: buttonText ?? this.buttonText,
      icon: icon ?? this.icon,
      highlight: highlight ?? this.highlight,
      light: light ?? this.light,
      images: images ?? this.images,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'secondary0': secondary0.value,
      'secondary12': secondary12.value,
      'secondary': secondary.value,
      'primary': primary.value,
      'secondary64': secondary64.value,
      'secondary16': secondary16.value,
      'secondary40': secondary40.value,
      'button': button.value,
      'buttonText': buttonText.value,
      'icon': icon.value,
      'highlight': highlight.value,
      'light': light,
      'images': images?.toJson(),
    };
  }

  factory ThemeChainData.fromJson(Map<String, dynamic> map) {
    return ThemeChainData(
      secondary0: Color(map['secondary0']),
      secondary12: Color(map['secondary12']),
      secondary: Color(map['secondary']),
      primary: Color(map['primary']),
      secondary64: Color(map['secondary64']),
      secondary16: Color(map['secondary16']),
      secondary40: Color(map['secondary40']),
      button: Color(map['button']),
      buttonText: Color(map['buttonText']),
      icon: Color(map['icon']),
      highlight: Color(map['highlight']),
      light: map['light'] ?? false,
      images: map['images'] != null ? ChainStyleImages.fromJson(map['images']) : null,
    );
  }

  @override
  String toString() {
    return 'ThemeChainData(secondary0: $secondary0, secondary12: $secondary12, secondary: $secondary, primary: $primary, secondary64: $secondary64, secondary16: $secondary16, secondary40: $secondary40, button: $button, buttonText: $buttonText, icon: $icon, highlight: $highlight, light: $light, images: $images)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
  
    return other is ThemeChainData &&
      other.secondary0 == secondary0 &&
      other.secondary12 == secondary12 &&
      other.secondary == secondary &&
      other.primary == primary &&
      other.secondary64 == secondary64 &&
      other.secondary16 == secondary16 &&
      other.secondary40 == secondary40 &&
      other.button == button &&
      other.buttonText == buttonText &&
      other.icon == icon &&
      other.highlight == highlight &&
      other.light == light &&
      other.images == images;
  }

  @override
  int get hashCode {
    return secondary0.hashCode ^
      secondary12.hashCode ^
      secondary.hashCode ^
      primary.hashCode ^
      secondary64.hashCode ^
      secondary16.hashCode ^
      secondary40.hashCode ^
      button.hashCode ^
      buttonText.hashCode ^
      icon.hashCode ^
      highlight.hashCode ^
      light.hashCode ^
      images.hashCode;
  }
}
