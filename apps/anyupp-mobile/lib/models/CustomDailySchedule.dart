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

/** This is an auto generated class representing the CustomDailySchedule type in your schema. */
@immutable
class CustomDailySchedule extends Model {
  static const classType = const CustomDailyScheduleType();
  final String id;
  final String date;
  final String from;
  final String to;
  final String weeklyScheduleOverridesId;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const CustomDailySchedule._internal(
      {@required this.id,
      this.date,
      this.from,
      this.to,
      this.weeklyScheduleOverridesId});

  factory CustomDailySchedule(
      {String id,
      String date,
      String from,
      String to,
      String weeklyScheduleOverridesId}) {
    return CustomDailySchedule._internal(
        id: id == null ? UUID.getUUID() : id,
        date: date,
        from: from,
        to: to,
        weeklyScheduleOverridesId: weeklyScheduleOverridesId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CustomDailySchedule &&
        id == other.id &&
        date == other.date &&
        from == other.from &&
        to == other.to &&
        weeklyScheduleOverridesId == other.weeklyScheduleOverridesId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("CustomDailySchedule {");
    buffer.write("id=" + id + ", ");
    buffer.write("date=" + date + ", ");
    buffer.write("from=" + from + ", ");
    buffer.write("to=" + to + ", ");
    buffer.write("weeklyScheduleOverridesId=" + weeklyScheduleOverridesId);
    buffer.write("}");

    return buffer.toString();
  }

  CustomDailySchedule copyWith(
      {String id,
      String date,
      String from,
      String to,
      String weeklyScheduleOverridesId}) {
    return CustomDailySchedule(
        id: id ?? this.id,
        date: date ?? this.date,
        from: from ?? this.from,
        to: to ?? this.to,
        weeklyScheduleOverridesId:
            weeklyScheduleOverridesId ?? this.weeklyScheduleOverridesId);
  }

  CustomDailySchedule.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        date = json['date'],
        from = json['from'],
        to = json['to'],
        weeklyScheduleOverridesId = json['weeklyScheduleOverridesId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'date': date,
        'from': from,
        'to': to,
        'weeklyScheduleOverridesId': weeklyScheduleOverridesId
      };

  static final QueryField ID = QueryField(fieldName: "customDailySchedule.id");
  static final QueryField DATE = QueryField(fieldName: "date");
  static final QueryField FROM = QueryField(fieldName: "from");
  static final QueryField TO = QueryField(fieldName: "to");
  static final QueryField WEEKLYSCHEDULEOVERRIDESID =
      QueryField(fieldName: "weeklyScheduleOverridesId");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "CustomDailySchedule";
    modelSchemaDefinition.pluralName = "CustomDailySchedules";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: CustomDailySchedule.DATE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: CustomDailySchedule.FROM,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: CustomDailySchedule.TO,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: CustomDailySchedule.WEEKLYSCHEDULEOVERRIDESID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class CustomDailyScheduleType extends ModelType<CustomDailySchedule> {
  const CustomDailyScheduleType();

  @override
  CustomDailySchedule fromJson(Map<String, dynamic> jsonData) {
    return CustomDailySchedule.fromJson(jsonData);
  }
}
