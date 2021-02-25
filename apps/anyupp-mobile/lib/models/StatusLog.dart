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

/** This is an auto generated class representing the StatusLog type in your schema. */
@immutable
class StatusLog extends Model {
  static const classType = const StatusLogType();
  final String id;
  final String userId;
  final String status;
  final int ts;
  final String orderItemStatusLogId;
  final String orderStatusLogId;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const StatusLog._internal(
      {@required this.id,
      this.userId,
      this.status,
      this.ts,
      this.orderItemStatusLogId,
      this.orderStatusLogId});

  factory StatusLog(
      {String id,
      String userId,
      String status,
      int ts,
      String orderItemStatusLogId,
      String orderStatusLogId}) {
    return StatusLog._internal(
        id: id == null ? UUID.getUUID() : id,
        userId: userId,
        status: status,
        ts: ts,
        orderItemStatusLogId: orderItemStatusLogId,
        orderStatusLogId: orderStatusLogId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StatusLog &&
        id == other.id &&
        userId == other.userId &&
        status == other.status &&
        ts == other.ts &&
        orderItemStatusLogId == other.orderItemStatusLogId &&
        orderStatusLogId == other.orderStatusLogId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("StatusLog {");
    buffer.write("id=" + id + ", ");
    buffer.write("userId=" + userId + ", ");
    buffer.write("status=" + status + ", ");
    buffer.write("ts=" + (ts != null ? ts.toString() : "null") + ", ");
    buffer.write("orderItemStatusLogId=" + orderItemStatusLogId + ", ");
    buffer.write("orderStatusLogId=" + orderStatusLogId);
    buffer.write("}");

    return buffer.toString();
  }

  StatusLog copyWith(
      {String id,
      String userId,
      String status,
      int ts,
      String orderItemStatusLogId,
      String orderStatusLogId}) {
    return StatusLog(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        status: status ?? this.status,
        ts: ts ?? this.ts,
        orderItemStatusLogId: orderItemStatusLogId ?? this.orderItemStatusLogId,
        orderStatusLogId: orderStatusLogId ?? this.orderStatusLogId);
  }

  StatusLog.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        userId = json['userId'],
        status = json['status'],
        ts = json['ts'],
        orderItemStatusLogId = json['orderItemStatusLogId'],
        orderStatusLogId = json['orderStatusLogId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'status': status,
        'ts': ts,
        'orderItemStatusLogId': orderItemStatusLogId,
        'orderStatusLogId': orderStatusLogId
      };

  static final QueryField ID = QueryField(fieldName: "statusLog.id");
  static final QueryField USERID = QueryField(fieldName: "userId");
  static final QueryField STATUS = QueryField(fieldName: "status");
  static final QueryField TS = QueryField(fieldName: "ts");
  static final QueryField ORDERITEMSTATUSLOGID =
      QueryField(fieldName: "orderItemStatusLogId");
  static final QueryField ORDERSTATUSLOGID =
      QueryField(fieldName: "orderStatusLogId");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "StatusLog";
    modelSchemaDefinition.pluralName = "StatusLogs";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StatusLog.USERID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StatusLog.STATUS,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StatusLog.TS,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StatusLog.ORDERITEMSTATUSLOGID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StatusLog.ORDERSTATUSLOGID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class StatusLogType extends ModelType<StatusLog> {
  const StatusLogType();

  @override
  StatusLog fromJson(Map<String, dynamic> jsonData) {
    return StatusLog.fromJson(jsonData);
  }
}
