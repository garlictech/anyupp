/*
* Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*/

// ignore_for_file: public_member_api_docs

import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';
import 'package:flutter/foundation.dart';

/** This is an auto generated class representing the ChainStyleColors type in your schema. */
@immutable
class ChainStyleColors extends Model {
  static const classType = const ChainStyleColorsType();
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
  getInstanceType() => classType;

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
    var buffer = new StringBuffer();

    buffer.write("ChainStyleColors {");
    buffer.write("id=" + id + ", ");
    buffer.write("backgroundLight=" + backgroundLight + ", ");
    buffer.write("backgroundDark=" + backgroundDark + ", ");
    buffer.write("borderLight=" + borderLight + ", ");
    buffer.write("borderDark=" + borderDark + ", ");
    buffer.write("disabled=" + disabled + ", ");
    buffer.write("highlight=" + highlight + ", ");
    buffer.write("indicator=" + indicator + ", ");
    buffer.write("textLight=" + textLight + ", ");
    buffer.write("textDark=" + textDark);
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

  static final QueryField ID = QueryField(fieldName: "chainStyleColors.id");
  static final QueryField BACKGROUNDLIGHT =
      QueryField(fieldName: "backgroundLight");
  static final QueryField BACKGROUNDDARK =
      QueryField(fieldName: "backgroundDark");
  static final QueryField BORDERLIGHT = QueryField(fieldName: "borderLight");
  static final QueryField BORDERDARK = QueryField(fieldName: "borderDark");
  static final QueryField DISABLED = QueryField(fieldName: "disabled");
  static final QueryField HIGHLIGHT = QueryField(fieldName: "highlight");
  static final QueryField INDICATOR = QueryField(fieldName: "indicator");
  static final QueryField TEXTLIGHT = QueryField(fieldName: "textLight");
  static final QueryField TEXTDARK = QueryField(fieldName: "textDark");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "ChainStyleColors";
    modelSchemaDefinition.pluralName = "ChainStyleColors";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyleColors.BACKGROUNDLIGHT,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyleColors.BACKGROUNDDARK,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyleColors.BORDERLIGHT,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyleColors.BORDERDARK,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyleColors.DISABLED,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyleColors.HIGHLIGHT,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyleColors.INDICATOR,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyleColors.TEXTLIGHT,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyleColors.TEXTDARK,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class ChainStyleColorsType extends ModelType<ChainStyleColors> {
  const ChainStyleColorsType();

  @override
  ChainStyleColors fromJson(Map<String, dynamic> jsonData) {
    return ChainStyleColors.fromJson(jsonData);
  }
}
