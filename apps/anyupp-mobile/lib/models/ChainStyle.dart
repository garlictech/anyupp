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
  final String colorsId;
  final ChainStyleColors colors;
  final String imagesId;
  final ChainStyleImages images;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const ChainStyle._internal(
      {@required this.id,
      this.colorsId,
      this.colors,
      this.imagesId,
      this.images});

  factory ChainStyle(
      {String id,
      String colorsId,
      ChainStyleColors colors,
      String imagesId,
      ChainStyleImages images}) {
    return ChainStyle._internal(
        id: id == null ? UUID.getUUID() : id,
        colorsId: colorsId,
        colors: colors,
        imagesId: imagesId,
        images: images);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ChainStyle &&
        id == other.id &&
        colorsId == other.colorsId &&
        colors == other.colors &&
        imagesId == other.imagesId &&
        images == other.images;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("ChainStyle {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("colorsId=" + "$colorsId" + ", ");
    buffer.write("imagesId=" + "$imagesId");
    buffer.write("}");

    return buffer.toString();
  }

  ChainStyle copyWith(
      {String id,
      String colorsId,
      ChainStyleColors colors,
      String imagesId,
      ChainStyleImages images}) {
    return ChainStyle(
        id: id ?? this.id,
        colorsId: colorsId ?? this.colorsId,
        colors: colors ?? this.colors,
        imagesId: imagesId ?? this.imagesId,
        images: images ?? this.images);
  }

  ChainStyle.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        colorsId = json['colorsId'],
        colors = json['colors'] != null
            ? ChainStyleColors.fromJson(
                new Map<String, dynamic>.from(json['colors']))
            : null,
        imagesId = json['imagesId'],
        images = json['images'] != null
            ? ChainStyleImages.fromJson(
                new Map<String, dynamic>.from(json['images']))
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'colorsId': colorsId,
        'colors': colors?.toJson(),
        'imagesId': imagesId,
        'images': images?.toJson()
      };

  static final QueryField ID = QueryField(fieldName: "chainStyle.id");
  static final QueryField COLORSID = QueryField(fieldName: "colorsId");
  static final QueryField COLORS = QueryField(
      fieldName: "colors",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ChainStyleColors).toString()));
  static final QueryField IMAGESID = QueryField(fieldName: "imagesId");
  static final QueryField IMAGES = QueryField(
      fieldName: "images",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ChainStyleImages).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "ChainStyle";
    modelSchemaDefinition.pluralName = "ChainStyles";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyle.COLORSID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: ChainStyle.COLORS,
        isRequired: false,
        ofModelName: (ChainStyleColors).toString(),
        associatedKey: ChainStyleColors.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyle.IMAGESID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: ChainStyle.IMAGES,
        isRequired: false,
        ofModelName: (ChainStyleImages).toString(),
        associatedKey: ChainStyleImages.ID));
  });
}

class ChainStyleType extends ModelType<ChainStyle> {
  const ChainStyleType();

  @override
  ChainStyle fromJson(Map<String, dynamic> jsonData) {
    return ChainStyle.fromJson(jsonData);
  }
}
