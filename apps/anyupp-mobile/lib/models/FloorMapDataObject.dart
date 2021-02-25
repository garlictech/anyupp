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

/** This is an auto generated class representing the FloorMapDataObject type in your schema. */
@immutable
class FloorMapDataObject extends Model {
  static const classType = const FloorMapDataObjectType();
  final String id;
  final String t;
  final String c;
  final int w;
  final int h;
  final int r;
  final int a;
  final int x;
  final int y;
  final String tID;
  final String sID;
  final String floorMapDataObjectsId;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const FloorMapDataObject._internal(
      {@required this.id,
      @required this.t,
      this.c,
      this.w,
      this.h,
      this.r,
      this.a,
      @required this.x,
      @required this.y,
      this.tID,
      this.sID,
      this.floorMapDataObjectsId});

  factory FloorMapDataObject(
      {String id,
      @required String t,
      String c,
      int w,
      int h,
      int r,
      int a,
      @required int x,
      @required int y,
      String tID,
      String sID,
      String floorMapDataObjectsId}) {
    return FloorMapDataObject._internal(
        id: id == null ? UUID.getUUID() : id,
        t: t,
        c: c,
        w: w,
        h: h,
        r: r,
        a: a,
        x: x,
        y: y,
        tID: tID,
        sID: sID,
        floorMapDataObjectsId: floorMapDataObjectsId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FloorMapDataObject &&
        id == other.id &&
        t == other.t &&
        c == other.c &&
        w == other.w &&
        h == other.h &&
        r == other.r &&
        a == other.a &&
        x == other.x &&
        y == other.y &&
        tID == other.tID &&
        sID == other.sID &&
        floorMapDataObjectsId == other.floorMapDataObjectsId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("FloorMapDataObject {");
    buffer.write("id=" + id + ", ");
    buffer.write("t=" + t + ", ");
    buffer.write("c=" + c + ", ");
    buffer.write("w=" + (w != null ? w.toString() : "null") + ", ");
    buffer.write("h=" + (h != null ? h.toString() : "null") + ", ");
    buffer.write("r=" + (r != null ? r.toString() : "null") + ", ");
    buffer.write("a=" + (a != null ? a.toString() : "null") + ", ");
    buffer.write("x=" + (x != null ? x.toString() : "null") + ", ");
    buffer.write("y=" + (y != null ? y.toString() : "null") + ", ");
    buffer.write("tID=" + tID + ", ");
    buffer.write("sID=" + sID + ", ");
    buffer.write("floorMapDataObjectsId=" + floorMapDataObjectsId);
    buffer.write("}");

    return buffer.toString();
  }

  FloorMapDataObject copyWith(
      {String id,
      String t,
      String c,
      int w,
      int h,
      int r,
      int a,
      int x,
      int y,
      String tID,
      String sID,
      String floorMapDataObjectsId}) {
    return FloorMapDataObject(
        id: id ?? this.id,
        t: t ?? this.t,
        c: c ?? this.c,
        w: w ?? this.w,
        h: h ?? this.h,
        r: r ?? this.r,
        a: a ?? this.a,
        x: x ?? this.x,
        y: y ?? this.y,
        tID: tID ?? this.tID,
        sID: sID ?? this.sID,
        floorMapDataObjectsId:
            floorMapDataObjectsId ?? this.floorMapDataObjectsId);
  }

  FloorMapDataObject.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        t = json['t'],
        c = json['c'],
        w = json['w'],
        h = json['h'],
        r = json['r'],
        a = json['a'],
        x = json['x'],
        y = json['y'],
        tID = json['tID'],
        sID = json['sID'],
        floorMapDataObjectsId = json['floorMapDataObjectsId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        't': t,
        'c': c,
        'w': w,
        'h': h,
        'r': r,
        'a': a,
        'x': x,
        'y': y,
        'tID': tID,
        'sID': sID,
        'floorMapDataObjectsId': floorMapDataObjectsId
      };

  static final QueryField ID = QueryField(fieldName: "floorMapDataObject.id");
  static final QueryField T = QueryField(fieldName: "t");
  static final QueryField C = QueryField(fieldName: "c");
  static final QueryField W = QueryField(fieldName: "w");
  static final QueryField H = QueryField(fieldName: "h");
  static final QueryField R = QueryField(fieldName: "r");
  static final QueryField A = QueryField(fieldName: "a");
  static final QueryField X = QueryField(fieldName: "x");
  static final QueryField Y = QueryField(fieldName: "y");
  static final QueryField TID = QueryField(fieldName: "tID");
  static final QueryField SID = QueryField(fieldName: "sID");
  static final QueryField FLOORMAPDATAOBJECTSID =
      QueryField(fieldName: "floorMapDataObjectsId");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "FloorMapDataObject";
    modelSchemaDefinition.pluralName = "FloorMapDataObjects";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapDataObject.T,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapDataObject.C,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapDataObject.W,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapDataObject.H,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapDataObject.R,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapDataObject.A,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapDataObject.X,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapDataObject.Y,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapDataObject.TID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapDataObject.SID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FloorMapDataObject.FLOORMAPDATAOBJECTSID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class FloorMapDataObjectType extends ModelType<FloorMapDataObject> {
  const FloorMapDataObjectType();

  @override
  FloorMapDataObject fromJson(Map<String, dynamic> jsonData) {
    return FloorMapDataObject.fromJson(jsonData);
  }
}
