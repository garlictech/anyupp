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

/** This is an auto generated class representing the Place type in your schema. */
@immutable
class Place extends Model {
  static const classType = const PlaceType();
  final String id;
  final String seat;
  final String table;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Place._internal({@required this.id, this.seat, this.table});

  factory Place({String id, String seat, String table}) {
    return Place._internal(
        id: id == null ? UUID.getUUID() : id, seat: seat, table: table);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Place &&
        id == other.id &&
        seat == other.seat &&
        table == other.table;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Place {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("seat=" + "$seat" + ", ");
    buffer.write("table=" + "$table");
    buffer.write("}");

    return buffer.toString();
  }

  Place copyWith({String id, String seat, String table}) {
    return Place(
        id: id ?? this.id, seat: seat ?? this.seat, table: table ?? this.table);
  }

  Place.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        seat = json['seat'],
        table = json['table'];

  Map<String, dynamic> toJson() => {'id': id, 'seat': seat, 'table': table};

  static final QueryField ID = QueryField(fieldName: "place.id");
  static final QueryField SEAT = QueryField(fieldName: "seat");
  static final QueryField TABLE = QueryField(fieldName: "table");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Place";
    modelSchemaDefinition.pluralName = "Places";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Place.SEAT,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Place.TABLE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class PlaceType extends ModelType<Place> {
  const PlaceType();

  @override
  Place fromJson(Map<String, dynamic> jsonData) {
    return Place.fromJson(jsonData);
  }
}
