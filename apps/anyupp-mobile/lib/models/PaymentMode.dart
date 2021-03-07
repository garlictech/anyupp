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

/** This is an auto generated class representing the PaymentMode type in your schema. */
@immutable
class PaymentMode extends Model {
  static const classType = const PaymentModeType();
  final String id;
  final String unitId;
  final String name;
  final String caption;
  final String method;
  final String geoUnitPaymentModesId;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const PaymentMode._internal(
      {@required this.id,
      @required this.unitId,
      @required this.name,
      this.caption,
      @required this.method,
      this.geoUnitPaymentModesId});

  factory PaymentMode(
      {String id,
      @required String unitId,
      @required String name,
      String caption,
      @required String method,
      String geoUnitPaymentModesId}) {
    return PaymentMode._internal(
        id: id == null ? UUID.getUUID() : id,
        unitId: unitId,
        name: name,
        caption: caption,
        method: method,
        geoUnitPaymentModesId: geoUnitPaymentModesId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PaymentMode &&
        id == other.id &&
        unitId == other.unitId &&
        name == other.name &&
        caption == other.caption &&
        method == other.method &&
        geoUnitPaymentModesId == other.geoUnitPaymentModesId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("PaymentMode {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("unitId=" + "$unitId" + ", ");
    buffer.write("name=" + "$name" + ", ");
    buffer.write("caption=" + "$caption" + ", ");
    buffer.write("method=" + "$method" + ", ");
    buffer.write("geoUnitPaymentModesId=" + "$geoUnitPaymentModesId");
    buffer.write("}");

    return buffer.toString();
  }

  PaymentMode copyWith(
      {String id,
      String unitId,
      String name,
      String caption,
      String method,
      String geoUnitPaymentModesId}) {
    return PaymentMode(
        id: id ?? this.id,
        unitId: unitId ?? this.unitId,
        name: name ?? this.name,
        caption: caption ?? this.caption,
        method: method ?? this.method,
        geoUnitPaymentModesId:
            geoUnitPaymentModesId ?? this.geoUnitPaymentModesId);
  }

  PaymentMode.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        unitId = json['unitId'],
        name = json['name'],
        caption = json['caption'],
        method = json['method'],
        geoUnitPaymentModesId = json['geoUnitPaymentModesId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'unitId': unitId,
        'name': name,
        'caption': caption,
        'method': method,
        'geoUnitPaymentModesId': geoUnitPaymentModesId
      };

  static final QueryField ID = QueryField(fieldName: "paymentMode.id");
  static final QueryField UNITID = QueryField(fieldName: "unitId");
  static final QueryField NAME = QueryField(fieldName: "name");
  static final QueryField CAPTION = QueryField(fieldName: "caption");
  static final QueryField METHOD = QueryField(fieldName: "method");
  static final QueryField GEOUNITPAYMENTMODESID =
      QueryField(fieldName: "geoUnitPaymentModesId");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "PaymentMode";
    modelSchemaDefinition.pluralName = "PaymentModes";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: PaymentMode.UNITID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: PaymentMode.NAME,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: PaymentMode.CAPTION,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: PaymentMode.METHOD,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: PaymentMode.GEOUNITPAYMENTMODESID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class PaymentModeType extends ModelType<PaymentMode> {
  const PaymentModeType();

  @override
  PaymentMode fromJson(Map<String, dynamic> jsonData) {
    return PaymentMode.fromJson(jsonData);
  }
}
