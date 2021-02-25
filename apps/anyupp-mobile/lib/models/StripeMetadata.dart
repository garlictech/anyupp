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

/** This is an auto generated class representing the StripeMetadata type in your schema. */
@immutable
class StripeMetadata extends Model {
  static const classType = const StripeMetadataType();
  final String id;
  final String key;
  final String value;
  final String stripeCardMetadataId;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const StripeMetadata._internal(
      {@required this.id,
      @required this.key,
      @required this.value,
      this.stripeCardMetadataId});

  factory StripeMetadata(
      {String id,
      @required String key,
      @required String value,
      String stripeCardMetadataId}) {
    return StripeMetadata._internal(
        id: id == null ? UUID.getUUID() : id,
        key: key,
        value: value,
        stripeCardMetadataId: stripeCardMetadataId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StripeMetadata &&
        id == other.id &&
        key == other.key &&
        value == other.value &&
        stripeCardMetadataId == other.stripeCardMetadataId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("StripeMetadata {");
    buffer.write("id=" + id + ", ");
    buffer.write("key=" + key + ", ");
    buffer.write("value=" + value + ", ");
    buffer.write("stripeCardMetadataId=" + stripeCardMetadataId);
    buffer.write("}");

    return buffer.toString();
  }

  StripeMetadata copyWith(
      {String id, String key, String value, String stripeCardMetadataId}) {
    return StripeMetadata(
        id: id ?? this.id,
        key: key ?? this.key,
        value: value ?? this.value,
        stripeCardMetadataId:
            stripeCardMetadataId ?? this.stripeCardMetadataId);
  }

  StripeMetadata.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        key = json['key'],
        value = json['value'],
        stripeCardMetadataId = json['stripeCardMetadataId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'key': key,
        'value': value,
        'stripeCardMetadataId': stripeCardMetadataId
      };

  static final QueryField ID = QueryField(fieldName: "stripeMetadata.id");
  static final QueryField KEY = QueryField(fieldName: "key");
  static final QueryField VALUE = QueryField(fieldName: "value");
  static final QueryField STRIPECARDMETADATAID =
      QueryField(fieldName: "stripeCardMetadataId");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "StripeMetadata";
    modelSchemaDefinition.pluralName = "StripeMetadata";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeMetadata.KEY,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeMetadata.VALUE,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeMetadata.STRIPECARDMETADATAID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class StripeMetadataType extends ModelType<StripeMetadata> {
  const StripeMetadataType();

  @override
  StripeMetadata fromJson(Map<String, dynamic> jsonData) {
    return StripeMetadata.fromJson(jsonData);
  }
}
