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

/** This is an auto generated class representing the PriceShown type in your schema. */
@immutable
class PriceShown extends Model {
  static const classType = const PriceShownType();
  final String id;
  final String currency;
  final double pricePerUnit;
  final double priceSum;
  final int tax;
  final double taxSum;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const PriceShown._internal(
      {@required this.id,
      this.currency,
      this.pricePerUnit,
      this.priceSum,
      this.tax,
      this.taxSum});

  factory PriceShown(
      {String id,
      String currency,
      double pricePerUnit,
      double priceSum,
      int tax,
      double taxSum}) {
    return PriceShown._internal(
        id: id == null ? UUID.getUUID() : id,
        currency: currency,
        pricePerUnit: pricePerUnit,
        priceSum: priceSum,
        tax: tax,
        taxSum: taxSum);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PriceShown &&
        id == other.id &&
        currency == other.currency &&
        pricePerUnit == other.pricePerUnit &&
        priceSum == other.priceSum &&
        tax == other.tax &&
        taxSum == other.taxSum;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("PriceShown {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("currency=" + "$currency" + ", ");
    buffer.write("pricePerUnit=" +
        (pricePerUnit != null ? pricePerUnit.toString() : "null") +
        ", ");
    buffer.write(
        "priceSum=" + (priceSum != null ? priceSum.toString() : "null") + ", ");
    buffer.write("tax=" + (tax != null ? tax.toString() : "null") + ", ");
    buffer.write("taxSum=" + (taxSum != null ? taxSum.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  PriceShown copyWith(
      {String id,
      String currency,
      double pricePerUnit,
      double priceSum,
      int tax,
      double taxSum}) {
    return PriceShown(
        id: id ?? this.id,
        currency: currency ?? this.currency,
        pricePerUnit: pricePerUnit ?? this.pricePerUnit,
        priceSum: priceSum ?? this.priceSum,
        tax: tax ?? this.tax,
        taxSum: taxSum ?? this.taxSum);
  }

  PriceShown.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        currency = json['currency'],
        pricePerUnit = json['pricePerUnit'],
        priceSum = json['priceSum'],
        tax = json['tax'],
        taxSum = json['taxSum'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'currency': currency,
        'pricePerUnit': pricePerUnit,
        'priceSum': priceSum,
        'tax': tax,
        'taxSum': taxSum
      };

  static final QueryField ID = QueryField(fieldName: "priceShown.id");
  static final QueryField CURRENCY = QueryField(fieldName: "currency");
  static final QueryField PRICEPERUNIT = QueryField(fieldName: "pricePerUnit");
  static final QueryField PRICESUM = QueryField(fieldName: "priceSum");
  static final QueryField TAX = QueryField(fieldName: "tax");
  static final QueryField TAXSUM = QueryField(fieldName: "taxSum");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "PriceShown";
    modelSchemaDefinition.pluralName = "PriceShowns";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: PriceShown.CURRENCY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: PriceShown.PRICEPERUNIT,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.double)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: PriceShown.PRICESUM,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.double)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: PriceShown.TAX,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: PriceShown.TAXSUM,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.double)));
  });
}

class PriceShownType extends ModelType<PriceShown> {
  const PriceShownType();

  @override
  PriceShown fromJson(Map<String, dynamic> jsonData) {
    return PriceShown.fromJson(jsonData);
  }
}
