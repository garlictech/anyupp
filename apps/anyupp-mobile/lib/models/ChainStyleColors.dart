import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class ChainStyleColors extends Model {
  final String id;
  final String backgroundLight;
  final String backgroundDark;
  final String borderLight;
  final String borderDark;
  final String disabled;
  final String highlight;
  final String indicator;
  final String textLight;
  final String textDark;

  @override
  String getId() {
    return id;
  }

  const ChainStyleColors._internal(
      {@required this.id,
      this.backgroundLight,
      this.backgroundDark,
      this.borderLight,
      this.borderDark,
      this.disabled,
      this.highlight,
      this.indicator,
      this.textLight,
      this.textDark});

  factory ChainStyleColors(
      {String id,
      String backgroundLight,
      String backgroundDark,
      String borderLight,
      String borderDark,
      String disabled,
      String highlight,
      String indicator,
      String textLight,
      String textDark}) {
    return ChainStyleColors._internal(
        id: id == null ? UUID.getUUID() : id,
        backgroundLight: backgroundLight,
        backgroundDark: backgroundDark,
        borderLight: borderLight,
        borderDark: borderDark,
        disabled: disabled,
        highlight: highlight,
        indicator: indicator,
        textLight: textLight,
        textDark: textDark);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ChainStyleColors &&
        id == other.id &&
        backgroundLight == other.backgroundLight &&
        backgroundDark == other.backgroundDark &&
        borderLight == other.borderLight &&
        borderDark == other.borderDark &&
        disabled == other.disabled &&
        highlight == other.highlight &&
        indicator == other.indicator &&
        textLight == other.textLight &&
        textDark == other.textDark;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("ChainStyleColors {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("backgroundLight=" + "$backgroundLight" + ", ");
    buffer.write("backgroundDark=" + "$backgroundDark" + ", ");
    buffer.write("borderLight=" + "$borderLight" + ", ");
    buffer.write("borderDark=" + "$borderDark" + ", ");
    buffer.write("disabled=" + "$disabled" + ", ");
    buffer.write("highlight=" + "$highlight" + ", ");
    buffer.write("indicator=" + "$indicator" + ", ");
    buffer.write("textLight=" + "$textLight" + ", ");
    buffer.write("textDark=" + "$textDark");
    buffer.write("}");

    return buffer.toString();
  }

  ChainStyleColors copyWith(
      {String id,
      String backgroundLight,
      String backgroundDark,
      String borderLight,
      String borderDark,
      String disabled,
      String highlight,
      String indicator,
      String textLight,
      String textDark}) {
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
        textDark: textDark ?? this.textDark);
  }

  ChainStyleColors.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        backgroundLight = json['backgroundLight'],
        backgroundDark = json['backgroundDark'],
        borderLight = json['borderLight'],
        borderDark = json['borderDark'],
        disabled = json['disabled'],
        highlight = json['highlight'],
        indicator = json['indicator'],
        textLight = json['textLight'],
        textDark = json['textDark'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'backgroundLight': backgroundLight,
        'backgroundDark': backgroundDark,
        'borderLight': borderLight,
        'borderDark': borderDark,
        'disabled': disabled,
        'highlight': highlight,
        'indicator': indicator,
        'textLight': textLight,
        'textDark': textDark
      };
}
