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

import 'ModelProvider.dart';
import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';
import 'package:flutter/foundation.dart';

/** This is an auto generated class representing the ChainStyle type in your schema. */
@immutable
class ChainStyle extends Model {
  static const classType = const ChainStyleType();
  final String id;
  final ChainStyleColors colors;
  final ChainStyleImages images;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const ChainStyle._internal({@required this.id, this.colors, this.images});

  factory ChainStyle(
      {String id, ChainStyleColors colors, ChainStyleImages images}) {
    return ChainStyle._internal(
        id: id == null ? UUID.getUUID() : id, colors: colors, images: images);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ChainStyle &&
        id == other.id &&
        colors == other.colors &&
        images == other.images;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("ChainStyle {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write(
        "colors=" + (colors != null ? colors.toString() : "null") + ", ");
    buffer.write("images=" + (images != null ? images.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  ChainStyle copyWith(
      {String id, ChainStyleColors colors, ChainStyleImages images}) {
    return ChainStyle(
        id: id ?? this.id,
        colors: colors ?? this.colors,
        images: images ?? this.images);
  }

  ChainStyle.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        colors = json['colors'] != null
            ? ChainStyleColors.fromJson(
                new Map<String, dynamic>.from(json['colors']))
            : null,
        images = json['images'] != null
            ? ChainStyleImages.fromJson(
                new Map<String, dynamic>.from(json['images']))
            : null;

  Map<String, dynamic> toJson() =>
      {'id': id, 'colors': colors?.toJson(), 'images': images?.toJson()};

  static final QueryField ID = QueryField(fieldName: "chainStyle.id");
  static final QueryField COLORS = QueryField(
      fieldName: "colors",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ChainStyleColors).toString()));
  static final QueryField IMAGES = QueryField(
      fieldName: "images",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ChainStyleImages).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "ChainStyle";
    modelSchemaDefinition.pluralName = "ChainStyles";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: ChainStyle.COLORS,
        isRequired: false,
        targetName: "chainStyleColorsId",
        ofModelName: (ChainStyleColors).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: ChainStyle.IMAGES,
        isRequired: false,
        targetName: "chainStyleImagesId",
        ofModelName: (ChainStyleImages).toString()));
  });
}

class ChainStyleType extends ModelType<ChainStyle> {
  const ChainStyleType();

  @override
  ChainStyle fromJson(Map<String, dynamic> jsonData) {
    return ChainStyle.fromJson(jsonData);
  }
}
