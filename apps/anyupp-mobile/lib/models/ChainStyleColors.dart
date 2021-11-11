import 'package:flutter/foundation.dart';

@immutable
class ChainStyleColors {
  final String? id;
  final String? backgroundLight;
  final String? backgroundDark;
  final String? borderLight;
  final String? borderDark;
  final String? disabled;
  final String? highlight;
  final String? indicator;
  final String? textLight;
  final String? textDark;
  final String? primary;
  final String? secondary;

  ChainStyleColors({
    this.id,
    this.backgroundLight,
    this.backgroundDark,
    this.borderLight,
    this.borderDark,
    this.disabled,
    this.highlight,
    this.indicator,
    this.textLight,
    this.textDark,
    this.primary,
    this.secondary,
  });

  ChainStyleColors copyWith({
    String? id,
    String? backgroundLight,
    String? backgroundDark,
    String? borderLight,
    String? borderDark,
    String? disabled,
    String? highlight,
    String? indicator,
    String? textLight,
    String? textDark,
    String? primary,
    String? secondary,
  }) {
    return ChainStyleColors(
      id: id ?? this.id,
      backgroundLight: backgroundLight ?? this.backgroundLight,
      backgroundDark: backgroundDark ?? this.backgroundDark,
      borderLight: borderLight ?? this.borderLight,
      borderDark: borderDark ?? this.borderDark,
      disabled: disabled ?? this.disabled,
      highlight: highlight ?? this.highlight,
      indicator: indicator ?? this.indicator,
      textLight: textLight ?? this.textLight,
      textDark: textDark ?? this.textDark,
      primary: primary ?? this.primary,
      secondary: secondary ?? this.secondary,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'backgroundLight': backgroundLight,
      'backgroundDark': backgroundDark,
      'borderLight': borderLight,
      'borderDark': borderDark,
      'disabled': disabled,
      'highlight': highlight,
      'indicator': indicator,
      'textLight': textLight,
      'textDark': textDark,
      'primary': primary,
      'secondary': secondary,
    };
  }

  factory ChainStyleColors.fromJson(Map<String, dynamic> map) {
    return ChainStyleColors(
      id: map['id'],
      backgroundLight: map['backgroundLight'],
      backgroundDark: map['backgroundDark'],
      borderLight: map['borderLight'],
      borderDark: map['borderDark'],
      disabled: map['disabled'],
      highlight: map['highlight'],
      indicator: map['indicator'],
      textLight: map['textLight'],
      textDark: map['textDark'],
      primary: map['primary'],
      secondary: map['secondary'],
    );
  }

  @override
  String toString() {
    return 'ChainStyleColors(id: $id, primary: $primary, secondary: $secondary, backgroundLight: $backgroundLight, backgroundDark: $backgroundDark, borderLight: $borderLight, borderDark: $borderDark, disabled: $disabled, highlight: $highlight, indicator: $indicator, textLight: $textLight, textDark: $textDark)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ChainStyleColors &&
        other.id == id &&
        other.backgroundLight == backgroundLight &&
        other.backgroundDark == backgroundDark &&
        other.borderLight == borderLight &&
        other.borderDark == borderDark &&
        other.disabled == disabled &&
        other.highlight == highlight &&
        other.indicator == indicator &&
        other.textLight == textLight &&
        other.textDark == textDark &&
        other.primary == primary &&
        other.secondary == secondary;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        backgroundLight.hashCode ^
        backgroundDark.hashCode ^
        borderLight.hashCode ^
        borderDark.hashCode ^
        disabled.hashCode ^
        highlight.hashCode ^
        indicator.hashCode ^
        textLight.hashCode ^
        textDark.hashCode ^
        primary.hashCode ^
        secondary.hashCode;
  }
}
