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

/** This is an auto generated class representing the Address type in your schema. */
@immutable
class Address extends Model {
  static const classType = const AddressType();
  final String id;
  final String address;
  final String city;
  final String country;
  final String title;
  final String postalCode;
  final Location location;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Address._internal(
      {@required this.id,
      this.address,
      this.city,
      this.country,
      this.title,
      this.postalCode,
      this.location});

  factory Address(
      {String id,
      String address,
      String city,
      String country,
      String title,
      String postalCode,
      Location location}) {
    return Address._internal(
        id: id == null ? UUID.getUUID() : id,
        address: address,
        city: city,
        country: country,
        title: title,
        postalCode: postalCode,
        location: location);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Address &&
        id == other.id &&
        address == other.address &&
        city == other.city &&
        country == other.country &&
        title == other.title &&
        postalCode == other.postalCode &&
        location == other.location;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Address {");
    buffer.write("id=" + id + ", ");
    buffer.write("address=" + address + ", ");
    buffer.write("city=" + city + ", ");
    buffer.write("country=" + country + ", ");
    buffer.write("title=" + title + ", ");
    buffer.write("postalCode=" + postalCode + ", ");
    buffer
        .write("location=" + (location != null ? location.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Address copyWith(
      {String id,
      String address,
      String city,
      String country,
      String title,
      String postalCode,
      Location location}) {
    return Address(
        id: id ?? this.id,
        address: address ?? this.address,
        city: city ?? this.city,
        country: country ?? this.country,
        title: title ?? this.title,
        postalCode: postalCode ?? this.postalCode,
        location: location ?? this.location);
  }

  Address.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        address = json['address'],
        city = json['city'],
        country = json['country'],
        title = json['title'],
        postalCode = json['postalCode'],
        location = json['location'] != null
            ? Location.fromJson(new Map<String, dynamic>.from(json['location']))
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'address': address,
        'city': city,
        'country': country,
        'title': title,
        'postalCode': postalCode,
        'location': location?.toJson()
      };

  static final QueryField ID = QueryField(fieldName: "address.id");
  static final QueryField ADDRESS = QueryField(fieldName: "address");
  static final QueryField CITY = QueryField(fieldName: "city");
  static final QueryField COUNTRY = QueryField(fieldName: "country");
  static final QueryField TITLE = QueryField(fieldName: "title");
  static final QueryField POSTALCODE = QueryField(fieldName: "postalCode");
  static final QueryField LOCATION = QueryField(
      fieldName: "location",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Location).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Address";
    modelSchemaDefinition.pluralName = "Addresses";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Address.ADDRESS,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Address.CITY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Address.COUNTRY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Address.TITLE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Address.POSTALCODE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Address.LOCATION,
        isRequired: false,
        targetName: "addressLocationId",
        ofModelName: (Location).toString()));
  });
}

class AddressType extends ModelType<Address> {
  const AddressType();

  @override
  Address fromJson(Map<String, dynamic> jsonData) {
    return Address.fromJson(jsonData);
  }
}
