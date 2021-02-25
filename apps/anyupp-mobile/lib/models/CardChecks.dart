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

/** This is an auto generated class representing the CardChecks type in your schema. */
@immutable
class CardChecks extends Model {
  static const classType = const CardChecksType();
  final String id;
  final String address_line1_check;
  final String address_postal_code_check;
  final String cvc_check;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const CardChecks._internal(
      {@required this.id,
      this.address_line1_check,
      this.address_postal_code_check,
      this.cvc_check});

  factory CardChecks(
      {String id,
      String address_line1_check,
      String address_postal_code_check,
      String cvc_check}) {
    return CardChecks._internal(
        id: id == null ? UUID.getUUID() : id,
        address_line1_check: address_line1_check,
        address_postal_code_check: address_postal_code_check,
        cvc_check: cvc_check);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CardChecks &&
        id == other.id &&
        address_line1_check == other.address_line1_check &&
        address_postal_code_check == other.address_postal_code_check &&
        cvc_check == other.cvc_check;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("CardChecks {");
    buffer.write("id=" + id + ", ");
    buffer.write("address_line1_check=" + address_line1_check + ", ");
    buffer
        .write("address_postal_code_check=" + address_postal_code_check + ", ");
    buffer.write("cvc_check=" + cvc_check);
    buffer.write("}");

    return buffer.toString();
  }

  CardChecks copyWith(
      {String id,
      String address_line1_check,
      String address_postal_code_check,
      String cvc_check}) {
    return CardChecks(
        id: id ?? this.id,
        address_line1_check: address_line1_check ?? this.address_line1_check,
        address_postal_code_check:
            address_postal_code_check ?? this.address_postal_code_check,
        cvc_check: cvc_check ?? this.cvc_check);
  }

  CardChecks.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        address_line1_check = json['address_line1_check'],
        address_postal_code_check = json['address_postal_code_check'],
        cvc_check = json['cvc_check'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'address_line1_check': address_line1_check,
        'address_postal_code_check': address_postal_code_check,
        'cvc_check': cvc_check
      };

  static final QueryField ID = QueryField(fieldName: "cardChecks.id");
  static final QueryField ADDRESS_LINE1_CHECK =
      QueryField(fieldName: "address_line1_check");
  static final QueryField ADDRESS_POSTAL_CODE_CHECK =
      QueryField(fieldName: "address_postal_code_check");
  static final QueryField CVC_CHECK = QueryField(fieldName: "cvc_check");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "CardChecks";
    modelSchemaDefinition.pluralName = "CardChecks";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: CardChecks.ADDRESS_LINE1_CHECK,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: CardChecks.ADDRESS_POSTAL_CODE_CHECK,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: CardChecks.CVC_CHECK,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class CardChecksType extends ModelType<CardChecks> {
  const CardChecksType();

  @override
  CardChecks fromJson(Map<String, dynamic> jsonData) {
    return CardChecks.fromJson(jsonData);
  }
}
