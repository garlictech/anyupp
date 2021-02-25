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

/** This is an auto generated class representing the DailySchedule type in your schema. */
@immutable
class DailySchedule extends Model {
  static const classType = const DailyScheduleType();
  final String id;
  final String from;
  final String to;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const DailySchedule._internal({@required this.id, this.from, this.to});

  factory DailySchedule({String id, String from, String to}) {
    return DailySchedule._internal(
        id: id == null ? UUID.getUUID() : id, from: from, to: to);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DailySchedule &&
        id == other.id &&
        from == other.from &&
        to == other.to;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("DailySchedule {");
    buffer.write("id=" + id + ", ");
    buffer.write("from=" + from + ", ");
    buffer.write("to=" + to);
    buffer.write("}");

    return buffer.toString();
  }

  DailySchedule copyWith({String id, String from, String to}) {
    return DailySchedule(
        id: id ?? this.id, from: from ?? this.from, to: to ?? this.to);
  }

  DailySchedule.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        from = json['from'],
        to = json['to'];

  Map<String, dynamic> toJson() => {'id': id, 'from': from, 'to': to};

  static final QueryField ID = QueryField(fieldName: "dailySchedule.id");
  static final QueryField FROM = QueryField(fieldName: "from");
  static final QueryField TO = QueryField(fieldName: "to");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "DailySchedule";
    modelSchemaDefinition.pluralName = "DailySchedules";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: DailySchedule.FROM,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: DailySchedule.TO,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class DailyScheduleType extends ModelType<DailySchedule> {
  const DailyScheduleType();

  @override
  DailySchedule fromJson(Map<String, dynamic> jsonData) {
    return DailySchedule.fromJson(jsonData);
  }
}
