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

/** This is an auto generated class representing the GeoUnit type in your schema. */
@immutable
class GeoUnit extends Model {
  static const classType = const GeoUnitType();
  final String id;
  final String groupId;
  final String chainId;
  final String name;
  final Address address;
  final ChainStyle style;
  final List<PaymentMode> paymentModes;
  final int distance;
  final String openingHours;
  final String currency;
  final Place place;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const GeoUnit._internal(
      {@required this.id,
      @required this.groupId,
      @required this.chainId,
      this.name,
      this.address,
      this.style,
      this.paymentModes,
      this.distance,
      this.openingHours,
      this.currency,
      this.place});

  factory GeoUnit(
      {String id,
      @required String groupId,
      @required String chainId,
      String name,
      Address address,
      ChainStyle style,
      List<PaymentMode> paymentModes,
      int distance,
      String openingHours,
      String currency,
      Place place}) {
    return GeoUnit._internal(
        id: id == null ? UUID.getUUID() : id,
        groupId: groupId,
        chainId: chainId,
        name: name,
        address: address,
        style: style,
        paymentModes: paymentModes != null
            ? List.unmodifiable(paymentModes)
            : paymentModes,
        distance: distance,
        openingHours: openingHours,
        currency: currency,
        place: place);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GeoUnit &&
        id == other.id &&
        groupId == other.groupId &&
        chainId == other.chainId &&
        name == other.name &&
        address == other.address &&
        style == other.style &&
        DeepCollectionEquality().equals(paymentModes, other.paymentModes) &&
        distance == other.distance &&
        openingHours == other.openingHours &&
        currency == other.currency &&
        place == other.place;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("GeoUnit {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("groupId=" + "$groupId" + ", ");
    buffer.write("chainId=" + "$chainId" + ", ");
    buffer.write("name=" + "$name" + ", ");
    buffer.write(
        "address=" + (address != null ? address.toString() : "null") + ", ");
    buffer.write("style=" + (style != null ? style.toString() : "null") + ", ");
    buffer.write(
        "distance=" + (distance != null ? distance.toString() : "null") + ", ");
    buffer.write("openingHours=" + "$openingHours" + ", ");
    buffer.write("currency=" + "$currency" + ", ");
    buffer.write("place=" + (place != null ? place.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  GeoUnit copyWith(
      {String id,
      String groupId,
      String chainId,
      String name,
      Address address,
      ChainStyle style,
      List<PaymentMode> paymentModes,
      int distance,
      String openingHours,
      String currency,
      Place place}) {
    return GeoUnit(
        id: id ?? this.id,
        groupId: groupId ?? this.groupId,
        chainId: chainId ?? this.chainId,
        name: name ?? this.name,
        address: address ?? this.address,
        style: style ?? this.style,
        paymentModes: paymentModes ?? this.paymentModes,
        distance: distance ?? this.distance,
        openingHours: openingHours ?? this.openingHours,
        currency: currency ?? this.currency,
        place: place ?? this.place);
  }

  GeoUnit.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        groupId = json['groupId'],
        chainId = json['chainId'],
        name = json['name'],
        address = json['address'] != null
            ? Address.fromJson(new Map<String, dynamic>.from(json['address']))
            : null,
        style = json['style'] != null
            ? ChainStyle.fromJson(new Map<String, dynamic>.from(json['style']))
            : null,
        paymentModes = json['paymentModes'] is List
            ? (json['paymentModes'] as List)
                .map((e) =>
                    PaymentMode.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null,
        distance = json['distance'],
        openingHours = json['openingHours'],
        currency = json['currency'],
        place = json['place'] != null
            ? Place.fromJson(new Map<String, dynamic>.from(json['place']))
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'groupId': groupId,
        'chainId': chainId,
        'name': name,
        'address': address?.toJson(),
        'style': style?.toJson(),
        'paymentModes': paymentModes?.map((e) => e?.toJson())?.toList(),
        'distance': distance,
        'openingHours': openingHours,
        'currency': currency,
        'place': place?.toJson()
      };

  static final QueryField ID = QueryField(fieldName: "geoUnit.id");
  static final QueryField GROUPID = QueryField(fieldName: "groupId");
  static final QueryField CHAINID = QueryField(fieldName: "chainId");
  static final QueryField NAME = QueryField(fieldName: "name");
  static final QueryField ADDRESS = QueryField(
      fieldName: "address",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Address).toString()));
  static final QueryField STYLE = QueryField(
      fieldName: "style",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ChainStyle).toString()));
  static final QueryField PAYMENTMODES = QueryField(
      fieldName: "paymentModes",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (PaymentMode).toString()));
  static final QueryField DISTANCE = QueryField(fieldName: "distance");
  static final QueryField OPENINGHOURS = QueryField(fieldName: "openingHours");
  static final QueryField CURRENCY = QueryField(fieldName: "currency");
  static final QueryField PLACE = QueryField(
      fieldName: "place",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Place).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "GeoUnit";
    modelSchemaDefinition.pluralName = "GeoUnits";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeoUnit.GROUPID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeoUnit.CHAINID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeoUnit.NAME,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: GeoUnit.ADDRESS,
        isRequired: false,
        targetName: "geoUnitAddressId",
        ofModelName: (Address).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: GeoUnit.STYLE,
        isRequired: false,
        targetName: "geoUnitStyleId",
        ofModelName: (ChainStyle).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: GeoUnit.PAYMENTMODES,
        isRequired: true,
        ofModelName: (PaymentMode).toString(),
        associatedKey: PaymentMode.GEOUNITPAYMENTMODESID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeoUnit.DISTANCE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeoUnit.OPENINGHOURS,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeoUnit.CURRENCY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: GeoUnit.PLACE,
        isRequired: false,
        targetName: "geoUnitPlaceId",
        ofModelName: (Place).toString()));
  });
}

class GeoUnitType extends ModelType<GeoUnit> {
  const GeoUnitType();

  @override
  GeoUnit fromJson(Map<String, dynamic> jsonData) {
    return GeoUnit.fromJson(jsonData);
  }
}
