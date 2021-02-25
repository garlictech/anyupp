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

/** This is an auto generated class representing the Location type in your schema. */
@immutable
class Location extends Model {
  static const classType = const LocationType();
  final String id;
  final double lat;
  final double lng;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Location._internal({@required this.id, this.lat, this.lng});

  factory Location({String id, double lat, double lng}) {
    return Location._internal(
        id: id == null ? UUID.getUUID() : id, lat: lat, lng: lng);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Location &&
        id == other.id &&
        lat == other.lat &&
        lng == other.lng;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Location {");
    buffer.write("id=" + id + ", ");
    buffer.write("lat=" + (lat != null ? lat.toString() : "null") + ", ");
    buffer.write("lng=" + (lng != null ? lng.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Location copyWith({String id, double lat, double lng}) {
    return Location(
        id: id ?? this.id, lat: lat ?? this.lat, lng: lng ?? this.lng);
  }

  Location.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        lat = json['lat'],
        lng = json['lng'];

  Map<String, dynamic> toJson() => {'id': id, 'lat': lat, 'lng': lng};

  static final QueryField ID = QueryField(fieldName: "location.id");
  static final QueryField LAT = QueryField(fieldName: "lat");
  static final QueryField LNG = QueryField(fieldName: "lng");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Location";
    modelSchemaDefinition.pluralName = "Locations";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Location.LAT,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.double)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Location.LNG,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.double)));
  });
}

class LocationType extends ModelType<Location> {
  const LocationType();

  @override
  Location fromJson(Map<String, dynamic> jsonData) {
    return Location.fromJson(jsonData);
  }
}
