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

/** This is an auto generated class representing the Availability type in your schema. */
@immutable
class Availability extends Model {
  static const classType = const AvailabilityType();
  final String id;
  final String type;
  final String dayFrom;
  final String dayTo;
  final String timeFrom;
  final String timeTo;
  final double price;
  final String productVariantAvailabilitiesId;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Availability._internal(
      {@required this.id,
      this.type,
      this.dayFrom,
      this.dayTo,
      this.timeFrom,
      this.timeTo,
      this.price,
      this.productVariantAvailabilitiesId});

  factory Availability(
      {String id,
      String type,
      String dayFrom,
      String dayTo,
      String timeFrom,
      String timeTo,
      double price,
      String productVariantAvailabilitiesId}) {
    return Availability._internal(
        id: id == null ? UUID.getUUID() : id,
        type: type,
        dayFrom: dayFrom,
        dayTo: dayTo,
        timeFrom: timeFrom,
        timeTo: timeTo,
        price: price,
        productVariantAvailabilitiesId: productVariantAvailabilitiesId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Availability &&
        id == other.id &&
        type == other.type &&
        dayFrom == other.dayFrom &&
        dayTo == other.dayTo &&
        timeFrom == other.timeFrom &&
        timeTo == other.timeTo &&
        price == other.price &&
        productVariantAvailabilitiesId == other.productVariantAvailabilitiesId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Availability {");
    buffer.write("id=" + id + ", ");
    buffer.write("type=" + type + ", ");
    buffer.write("dayFrom=" + dayFrom + ", ");
    buffer.write("dayTo=" + dayTo + ", ");
    buffer.write("timeFrom=" + timeFrom + ", ");
    buffer.write("timeTo=" + timeTo + ", ");
    buffer.write("price=" + (price != null ? price.toString() : "null") + ", ");
    buffer.write(
        "productVariantAvailabilitiesId=" + productVariantAvailabilitiesId);
    buffer.write("}");

    return buffer.toString();
  }

  Availability copyWith(
      {String id,
      String type,
      String dayFrom,
      String dayTo,
      String timeFrom,
      String timeTo,
      double price,
      String productVariantAvailabilitiesId}) {
    return Availability(
        id: id ?? this.id,
        type: type ?? this.type,
        dayFrom: dayFrom ?? this.dayFrom,
        dayTo: dayTo ?? this.dayTo,
        timeFrom: timeFrom ?? this.timeFrom,
        timeTo: timeTo ?? this.timeTo,
        price: price ?? this.price,
        productVariantAvailabilitiesId: productVariantAvailabilitiesId ??
            this.productVariantAvailabilitiesId);
  }

  Availability.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        type = json['type'],
        dayFrom = json['dayFrom'],
        dayTo = json['dayTo'],
        timeFrom = json['timeFrom'],
        timeTo = json['timeTo'],
        price = json['price'],
        productVariantAvailabilitiesId = json['productVariantAvailabilitiesId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type,
        'dayFrom': dayFrom,
        'dayTo': dayTo,
        'timeFrom': timeFrom,
        'timeTo': timeTo,
        'price': price,
        'productVariantAvailabilitiesId': productVariantAvailabilitiesId
      };

  static final QueryField ID = QueryField(fieldName: "availability.id");
  static final QueryField TYPE = QueryField(fieldName: "type");
  static final QueryField DAYFROM = QueryField(fieldName: "dayFrom");
  static final QueryField DAYTO = QueryField(fieldName: "dayTo");
  static final QueryField TIMEFROM = QueryField(fieldName: "timeFrom");
  static final QueryField TIMETO = QueryField(fieldName: "timeTo");
  static final QueryField PRICE = QueryField(fieldName: "price");
  static final QueryField PRODUCTVARIANTAVAILABILITIESID =
      QueryField(fieldName: "productVariantAvailabilitiesId");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Availability";
    modelSchemaDefinition.pluralName = "Availabilities";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Availability.TYPE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Availability.DAYFROM,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Availability.DAYTO,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Availability.TIMEFROM,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Availability.TIMETO,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Availability.PRICE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.double)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Availability.PRODUCTVARIANTAVAILABILITIESID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class AvailabilityType extends ModelType<Availability> {
  const AvailabilityType();

  @override
  Availability fromJson(Map<String, dynamic> jsonData) {
    return Availability.fromJson(jsonData);
  }
}
