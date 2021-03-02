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
import 'package:flutter/foundation.dart';

/** This is an auto generated class representing the WeeklySchedule type in your schema. */
@immutable
class WeeklySchedule extends Model {
  static const classType = const WeeklyScheduleType();
  final String id;
  final String unitId;
  final String day;
  final String scheduleId;
  final DailySchedule schedule;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const WeeklySchedule._internal(
      {@required this.id,
      @required this.unitId,
      this.day,
      @required this.scheduleId,
      this.schedule});

  factory WeeklySchedule(
      {String id,
      @required String unitId,
      String day,
      @required String scheduleId,
      DailySchedule schedule}) {
    return WeeklySchedule._internal(
        id: id == null ? UUID.getUUID() : id,
        unitId: unitId,
        day: day,
        scheduleId: scheduleId,
        schedule: schedule);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is WeeklySchedule &&
        id == other.id &&
        unitId == other.unitId &&
        day == other.day &&
        scheduleId == other.scheduleId &&
        schedule == other.schedule;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("WeeklySchedule {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("unitId=" + "$unitId" + ", ");
    buffer.write("day=" + "$day" + ", ");
    buffer.write("scheduleId=" + "$scheduleId");
    buffer.write("}");

    return buffer.toString();
  }

  WeeklySchedule copyWith(
      {String id,
      String unitId,
      String day,
      String scheduleId,
      DailySchedule schedule}) {
    return WeeklySchedule(
        id: id ?? this.id,
        unitId: unitId ?? this.unitId,
        day: day ?? this.day,
        scheduleId: scheduleId ?? this.scheduleId,
        schedule: schedule ?? this.schedule);
  }

  WeeklySchedule.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        unitId = json['unitId'],
        day = json['day'],
        scheduleId = json['scheduleId'],
        schedule = json['schedule'] != null
            ? DailySchedule.fromJson(
                new Map<String, dynamic>.from(json['schedule']))
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'unitId': unitId,
        'day': day,
        'scheduleId': scheduleId,
        'schedule': schedule?.toJson()
      };

  static final QueryField ID = QueryField(fieldName: "weeklySchedule.id");
  static final QueryField UNITID = QueryField(fieldName: "unitId");
  static final QueryField DAY = QueryField(fieldName: "day");
  static final QueryField SCHEDULEID = QueryField(fieldName: "scheduleId");
  static final QueryField SCHEDULE = QueryField(
      fieldName: "schedule",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (DailySchedule).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "WeeklySchedule";
    modelSchemaDefinition.pluralName = "WeeklySchedules";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: WeeklySchedule.UNITID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: WeeklySchedule.DAY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: WeeklySchedule.SCHEDULEID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: WeeklySchedule.SCHEDULE,
        isRequired: false,
        ofModelName: (DailySchedule).toString(),
        associatedKey: DailySchedule.ID));
  });
}

class WeeklyScheduleType extends ModelType<WeeklySchedule> {
  const WeeklyScheduleType();

  @override
  WeeklySchedule fromJson(Map<String, dynamic> jsonData) {
    return WeeklySchedule.fromJson(jsonData);
  }
}
