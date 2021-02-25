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
import 'package:collection/collection.dart';
import 'package:flutter/foundation.dart';

/** This is an auto generated class representing the WeeklySchedule type in your schema. */
@immutable
class WeeklySchedule extends Model {
  static const classType = const WeeklyScheduleType();
  final String id;
  final DailySchedule mon;
  final DailySchedule tue;
  final DailySchedule wed;
  final DailySchedule thu;
  final DailySchedule fri;
  final DailySchedule sat;
  final DailySchedule sun;
  final List<CustomDailySchedule> overrides;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const WeeklySchedule._internal(
      {@required this.id,
      this.mon,
      this.tue,
      this.wed,
      this.thu,
      this.fri,
      this.sat,
      this.sun,
      this.overrides});

  factory WeeklySchedule(
      {String id,
      DailySchedule mon,
      DailySchedule tue,
      DailySchedule wed,
      DailySchedule thu,
      DailySchedule fri,
      DailySchedule sat,
      DailySchedule sun,
      List<CustomDailySchedule> overrides}) {
    return WeeklySchedule._internal(
        id: id == null ? UUID.getUUID() : id,
        mon: mon,
        tue: tue,
        wed: wed,
        thu: thu,
        fri: fri,
        sat: sat,
        sun: sun,
        overrides:
            overrides != null ? List.unmodifiable(overrides) : overrides);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is WeeklySchedule &&
        id == other.id &&
        mon == other.mon &&
        tue == other.tue &&
        wed == other.wed &&
        thu == other.thu &&
        fri == other.fri &&
        sat == other.sat &&
        sun == other.sun &&
        DeepCollectionEquality().equals(overrides, other.overrides);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("WeeklySchedule {");
    buffer.write("id=" + id + ", ");
    buffer.write("mon=" + (mon != null ? mon.toString() : "null") + ", ");
    buffer.write("tue=" + (tue != null ? tue.toString() : "null") + ", ");
    buffer.write("wed=" + (wed != null ? wed.toString() : "null") + ", ");
    buffer.write("thu=" + (thu != null ? thu.toString() : "null") + ", ");
    buffer.write("fri=" + (fri != null ? fri.toString() : "null") + ", ");
    buffer.write("sat=" + (sat != null ? sat.toString() : "null") + ", ");
    buffer.write("sun=" + (sun != null ? sun.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  WeeklySchedule copyWith(
      {String id,
      DailySchedule mon,
      DailySchedule tue,
      DailySchedule wed,
      DailySchedule thu,
      DailySchedule fri,
      DailySchedule sat,
      DailySchedule sun,
      List<CustomDailySchedule> overrides}) {
    return WeeklySchedule(
        id: id ?? this.id,
        mon: mon ?? this.mon,
        tue: tue ?? this.tue,
        wed: wed ?? this.wed,
        thu: thu ?? this.thu,
        fri: fri ?? this.fri,
        sat: sat ?? this.sat,
        sun: sun ?? this.sun,
        overrides: overrides ?? this.overrides);
  }

  WeeklySchedule.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        mon = json['mon'] != null
            ? DailySchedule.fromJson(new Map<String, dynamic>.from(json['mon']))
            : null,
        tue = json['tue'] != null
            ? DailySchedule.fromJson(new Map<String, dynamic>.from(json['tue']))
            : null,
        wed = json['wed'] != null
            ? DailySchedule.fromJson(new Map<String, dynamic>.from(json['wed']))
            : null,
        thu = json['thu'] != null
            ? DailySchedule.fromJson(new Map<String, dynamic>.from(json['thu']))
            : null,
        fri = json['fri'] != null
            ? DailySchedule.fromJson(new Map<String, dynamic>.from(json['fri']))
            : null,
        sat = json['sat'] != null
            ? DailySchedule.fromJson(new Map<String, dynamic>.from(json['sat']))
            : null,
        sun = json['sun'] != null
            ? DailySchedule.fromJson(new Map<String, dynamic>.from(json['sun']))
            : null,
        overrides = json['overrides'] is List
            ? (json['overrides'] as List)
                .map((e) => CustomDailySchedule.fromJson(
                    new Map<String, dynamic>.from(e)))
                .toList()
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'mon': mon?.toJson(),
        'tue': tue?.toJson(),
        'wed': wed?.toJson(),
        'thu': thu?.toJson(),
        'fri': fri?.toJson(),
        'sat': sat?.toJson(),
        'sun': sun?.toJson(),
        'overrides': overrides?.map((e) => e?.toJson()).toList()
      };

  static final QueryField ID = QueryField(fieldName: "weeklySchedule.id");
  static final QueryField MON = QueryField(
      fieldName: "mon",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (DailySchedule).toString()));
  static final QueryField TUE = QueryField(
      fieldName: "tue",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (DailySchedule).toString()));
  static final QueryField WED = QueryField(
      fieldName: "wed",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (DailySchedule).toString()));
  static final QueryField THU = QueryField(
      fieldName: "thu",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (DailySchedule).toString()));
  static final QueryField FRI = QueryField(
      fieldName: "fri",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (DailySchedule).toString()));
  static final QueryField SAT = QueryField(
      fieldName: "sat",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (DailySchedule).toString()));
  static final QueryField SUN = QueryField(
      fieldName: "sun",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (DailySchedule).toString()));
  static final QueryField OVERRIDES = QueryField(
      fieldName: "overrides",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (CustomDailySchedule).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "WeeklySchedule";
    modelSchemaDefinition.pluralName = "WeeklySchedules";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: WeeklySchedule.MON,
        isRequired: false,
        targetName: "weeklyScheduleMonId",
        ofModelName: (DailySchedule).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: WeeklySchedule.TUE,
        isRequired: false,
        targetName: "weeklyScheduleTueId",
        ofModelName: (DailySchedule).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: WeeklySchedule.WED,
        isRequired: false,
        targetName: "weeklyScheduleWedId",
        ofModelName: (DailySchedule).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: WeeklySchedule.THU,
        isRequired: false,
        targetName: "weeklyScheduleThuId",
        ofModelName: (DailySchedule).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: WeeklySchedule.FRI,
        isRequired: false,
        targetName: "weeklyScheduleFriId",
        ofModelName: (DailySchedule).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: WeeklySchedule.SAT,
        isRequired: false,
        targetName: "weeklyScheduleSatId",
        ofModelName: (DailySchedule).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: WeeklySchedule.SUN,
        isRequired: false,
        targetName: "weeklyScheduleSunId",
        ofModelName: (DailySchedule).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: WeeklySchedule.OVERRIDES,
        isRequired: false,
        ofModelName: (CustomDailySchedule).toString(),
        associatedKey: CustomDailySchedule.WEEKLYSCHEDULEOVERRIDESID));
  });
}

class WeeklyScheduleType extends ModelType<WeeklySchedule> {
  const WeeklyScheduleType();

  @override
  WeeklySchedule fromJson(Map<String, dynamic> jsonData) {
    return WeeklySchedule.fromJson(jsonData);
  }
}
