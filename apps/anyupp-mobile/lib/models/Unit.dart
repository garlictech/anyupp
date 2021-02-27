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

/** This is an auto generated class representing the Unit type in your schema. */
@immutable
class Unit extends Model {
  static const classType = const UnitType();
  final String id;
  final String groupId;
  final bool isActive;
  final bool isAcceptingOrders;
  final String name;
  final LocalizedItem description;
  final List<PaymentMode> paymentModes;
  final List<Lane> lanes;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Unit._internal(
      {@required this.id,
      @required this.groupId,
      this.isActive,
      this.isAcceptingOrders,
      this.name,
      this.description,
      this.paymentModes,
      this.lanes});

  factory Unit(
      {String id,
      @required String groupId,
      bool isActive,
      bool isAcceptingOrders,
      String name,
      LocalizedItem description,
      List<PaymentMode> paymentModes,
      List<Lane> lanes}) {
    return Unit._internal(
        id: id == null ? UUID.getUUID() : id,
        groupId: groupId,
        isActive: isActive,
        isAcceptingOrders: isAcceptingOrders,
        name: name,
        description: description,
        paymentModes: paymentModes != null
            ? List.unmodifiable(paymentModes)
            : paymentModes,
        lanes: lanes != null ? List.unmodifiable(lanes) : lanes);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Unit &&
        id == other.id &&
        groupId == other.groupId &&
        isActive == other.isActive &&
        isAcceptingOrders == other.isAcceptingOrders &&
        name == other.name &&
        description == other.description &&
        DeepCollectionEquality().equals(paymentModes, other.paymentModes) &&
        DeepCollectionEquality().equals(lanes, other.lanes);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Unit {");
    buffer.write("id=" + id + ", ");
    buffer.write("groupId=" + groupId + ", ");
    buffer.write(
        "isActive=" + (isActive != null ? isActive.toString() : "null") + ", ");
    buffer.write("isAcceptingOrders=" +
        (isAcceptingOrders != null ? isAcceptingOrders.toString() : "null") +
        ", ");
    buffer.write("name=" + name + ", ");
    buffer.write("description=" +
        (description != null ? description.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Unit copyWith(
      {String id,
      String groupId,
      bool isActive,
      bool isAcceptingOrders,
      String name,
      LocalizedItem description,
      List<PaymentMode> paymentModes,
      List<Lane> lanes}) {
    return Unit(
        id: id ?? this.id,
        groupId: groupId ?? this.groupId,
        isActive: isActive ?? this.isActive,
        isAcceptingOrders: isAcceptingOrders ?? this.isAcceptingOrders,
        name: name ?? this.name,
        description: description ?? this.description,
        paymentModes: paymentModes ?? this.paymentModes,
        lanes: lanes ?? this.lanes);
  }

  Unit.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        groupId = json['groupId'],
        isActive = json['isActive'],
        isAcceptingOrders = json['isAcceptingOrders'],
        name = json['name'],
        description = json['description'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['description']))
            : null,
        paymentModes = json['paymentModes'] is List
            ? (json['paymentModes'] as List)
                .map((e) =>
                    PaymentMode.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null,
        lanes = json['lanes'] is List
            ? (json['lanes'] as List)
                .map((e) => Lane.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'groupId': groupId,
        'isActive': isActive,
        'isAcceptingOrders': isAcceptingOrders,
        'name': name,
        'description': description?.toJson(),
        'paymentModes': paymentModes?.map((e) => e?.toJson())?.toList(),
        'lanes': lanes?.map((e) => e?.toJson())?.toList()
      };

  static final QueryField ID = QueryField(fieldName: "unit.id");
  static final QueryField GROUPID = QueryField(fieldName: "groupId");
  static final QueryField ISACTIVE = QueryField(fieldName: "isActive");
  static final QueryField ISACCEPTINGORDERS =
      QueryField(fieldName: "isAcceptingOrders");
  static final QueryField NAME = QueryField(fieldName: "name");
  static final QueryField DESCRIPTION = QueryField(
      fieldName: "description",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField PAYMENTMODES = QueryField(
      fieldName: "paymentModes",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (PaymentMode).toString()));
  static final QueryField LANES = QueryField(
      fieldName: "lanes",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Lane).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Unit";
    modelSchemaDefinition.pluralName = "Units";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.GROUPID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.ISACTIVE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.ISACCEPTINGORDERS,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.NAME,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Unit.DESCRIPTION,
        isRequired: false,
        targetName: "unitDescriptionId",
        ofModelName: (LocalizedItem).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: Unit.PAYMENTMODES,
        isRequired: false,
        ofModelName: (PaymentMode).toString(),
        associatedKey: PaymentMode.UNITPAYMENTMODESID));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: Unit.LANES,
        isRequired: false,
        ofModelName: (Lane).toString(),
        associatedKey: Lane.UNITLANESID));
  });
}

class UnitType extends ModelType<Unit> {
  const UnitType();

  @override
  Unit fromJson(Map<String, dynamic> jsonData) {
    return Unit.fromJson(jsonData);
  }
}
