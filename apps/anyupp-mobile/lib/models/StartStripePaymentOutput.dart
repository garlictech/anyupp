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

/** This is an auto generated class representing the StartStripePaymentOutput type in your schema. */
@immutable
class StartStripePaymentOutput extends Model {
  static const classType = const StartStripePaymentOutputType();
  final String id;
  final String clientSecret;
  final String status;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const StartStripePaymentOutput._internal(
      {@required this.id, @required this.clientSecret, @required this.status});

  factory StartStripePaymentOutput(
      {String id, @required String clientSecret, @required String status}) {
    return StartStripePaymentOutput._internal(
        id: id == null ? UUID.getUUID() : id,
        clientSecret: clientSecret,
        status: status);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StartStripePaymentOutput &&
        id == other.id &&
        clientSecret == other.clientSecret &&
        status == other.status;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("StartStripePaymentOutput {");
    buffer.write("id=" + id + ", ");
    buffer.write("clientSecret=" + clientSecret + ", ");
    buffer.write("status=" + status);
    buffer.write("}");

    return buffer.toString();
  }

  StartStripePaymentOutput copyWith(
      {String id, String clientSecret, String status}) {
    return StartStripePaymentOutput(
        id: id ?? this.id,
        clientSecret: clientSecret ?? this.clientSecret,
        status: status ?? this.status);
  }

  StartStripePaymentOutput.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        clientSecret = json['clientSecret'],
        status = json['status'];

  Map<String, dynamic> toJson() =>
      {'id': id, 'clientSecret': clientSecret, 'status': status};

  static final QueryField ID =
      QueryField(fieldName: "startStripePaymentOutput.id");
  static final QueryField CLIENTSECRET = QueryField(fieldName: "clientSecret");
  static final QueryField STATUS = QueryField(fieldName: "status");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "StartStripePaymentOutput";
    modelSchemaDefinition.pluralName = "StartStripePaymentOutputs";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StartStripePaymentOutput.CLIENTSECRET,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StartStripePaymentOutput.STATUS,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class StartStripePaymentOutputType extends ModelType<StartStripePaymentOutput> {
  const StartStripePaymentOutputType();

  @override
  StartStripePaymentOutput fromJson(Map<String, dynamic> jsonData) {
    return StartStripePaymentOutput.fromJson(jsonData);
  }
}
