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
import 'package:collection/collection.dart';
import 'package:flutter/foundation.dart';

/** This is an auto generated class representing the FloorMapData type in your schema. */
@immutable
class FloorMapData extends Model {
  static const classType = const FloorMapDataType();
  final String id;
  final int w;
  final int h;
  final List<FloorMapDataObject> objects;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const FloorMapData._internal(
      {@required this.id, this.w, this.h, this.objects});

  factory FloorMapData(
      {String id, int w, int h, List<FloorMapDataObject> objects}) {
    return FloorMapData._internal(
        id: id == null ? UUID.getUUID() : id,
        w: w,
        h: h,
        objects: objects != null ? List.unmodifiable(objects) : objects);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FloorMapData &&
        id == other.id &&
        w == other.w &&
        h == other.h &&
        DeepCollectionEquality().equals(objects, other.objects);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("FloorMapData {");
    buffer.write("id=" + id + ", ");
    buffer.write("w=" + (w != null ? w.toString() : "null") + ", ");
    buffer.write("h=" + (h != null ? h.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  FloorMapData copyWith(
      {String id, int w, int h, List<FloorMapDataObject> objects}) {
    return FloorMapData(
        id: id ?? this.id,
        w: w ?? this.w,
        h: h ?? this.h,
        objects: objects ?? this.objects);
  }

  FloorMapData.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        w = json['w'],
        h = json['h'],
        objects = json['objects'] is List
            ? (json['objects'] as List)
                .map((e) => FloorMapDataObject.fromJson(
                    new Map<String, dynamic>.from(e)))
                .toList()
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'w': w,
        'h': h,
        'objects': objects?.map((e) => e?.toJson()).toList()
      };

  static final QueryField ID = QueryField(fieldName: "floorMapData.id");
  static final QueryField W = QueryField(fieldName: "w");
  static final QueryField H = QueryField(fieldName: "h");
  static final QueryField OBJECTS = QueryField(
      fieldName: "objects",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (FloorMapDataObject).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "FloorMapData";
    modelSchemaDefinition.pluralName = "FloorMapData";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapData.W,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapData.H,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: FloorMapData.OBJECTS,
        isRequired: false,
        ofModelName: (FloorMapDataObject).toString(),
        associatedKey: FloorMapDataObject.FLOORMAPDATAOBJECTSID));
  });
}

class FloorMapDataType extends ModelType<FloorMapData> {
  const FloorMapDataType();

  @override
  FloorMapData fromJson(Map<String, dynamic> jsonData) {
    return FloorMapData.fromJson(jsonData);
  }
}
