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

/** This is an auto generated class representing the Lane type in your schema. */
@immutable
class Lane extends Model {
  static const classType = const LaneType();
  final String id;
  final String name;
  final String color;
  final String unitLanesId;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Lane._internal(
      {@required this.id, this.name, this.color, this.unitLanesId});

  factory Lane({String id, String name, String color, String unitLanesId}) {
    return Lane._internal(
        id: id == null ? UUID.getUUID() : id,
        name: name,
        color: color,
        unitLanesId: unitLanesId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Lane &&
        id == other.id &&
        name == other.name &&
        color == other.color &&
        unitLanesId == other.unitLanesId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Lane {");
    buffer.write("id=" + id + ", ");
    buffer.write("name=" + name + ", ");
    buffer.write("color=" + color + ", ");
    buffer.write("unitLanesId=" + unitLanesId);
    buffer.write("}");

    return buffer.toString();
  }

  Lane copyWith({String id, String name, String color, String unitLanesId}) {
    return Lane(
        id: id ?? this.id,
        name: name ?? this.name,
        color: color ?? this.color,
        unitLanesId: unitLanesId ?? this.unitLanesId);
  }

  Lane.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        color = json['color'],
        unitLanesId = json['unitLanesId'];

  Map<String, dynamic> toJson() =>
      {'id': id, 'name': name, 'color': color, 'unitLanesId': unitLanesId};

  static final QueryField ID = QueryField(fieldName: "lane.id");
  static final QueryField NAME = QueryField(fieldName: "name");
  static final QueryField COLOR = QueryField(fieldName: "color");
  static final QueryField UNITLANESID = QueryField(fieldName: "unitLanesId");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Lane";
    modelSchemaDefinition.pluralName = "Lanes";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Lane.NAME,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Lane.COLOR,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Lane.UNITLANESID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class LaneType extends ModelType<Lane> {
  const LaneType();

  @override
  Lane fromJson(Map<String, dynamic> jsonData) {
    return Lane.fromJson(jsonData);
  }
}
