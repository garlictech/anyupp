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
  final String? button;
  final String? buttonText;
  final String? icon;
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
    this.button,
    this.buttonText,
    this.icon,
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
    String? button,
    String? buttonText,
    String? icon,
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
      button: button ?? this.button,
      buttonText: buttonText ?? this.buttonText,
      icon: icon ?? this.icon,
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
      'button': button,
      'buttonText': buttonText,
      'icon': icon,
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
      button: map['button'],
      buttonText: map['buttonText'],
      icon: map['icon'],
    );
  }

  @override
  String toString() {
    return 'ChainStyleColors(id: $id, backgroundLight: $backgroundLight, backgroundDark: $backgroundDark, borderLight: $borderLight, borderDark: $borderDark, disabled: $disabled, highlight: $highlight, indicator: $indicator, textLight: $textLight, textDark: $textDark, primary: $primary, secondary: $secondary, button: $button, buttonText: $buttonText, icon: $icon)';
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
      other.secondary == secondary &&
      other.button == button &&
      other.buttonText == buttonText &&
      other.icon == icon;
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
      secondary.hashCode ^
      button.hashCode ^
      buttonText.hashCode ^
      icon.hashCode;
  }
}
