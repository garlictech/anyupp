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
  final Group group;
  final String chainId;
  final Chain chain;
  final String name;
  final String descriptionId;
  final LocalizedItem description;
  final bool isActive;
  final bool isAcceptingOrders;
  final List<PaymentMode> paymentModes;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Unit._internal(
      {@required this.id,
      @required this.groupId,
      this.group,
      @required this.chainId,
      this.chain,
      this.name,
      this.descriptionId,
      this.description,
      this.isActive,
      this.isAcceptingOrders,
      this.paymentModes});

  factory Unit(
      {String id,
      @required String groupId,
      Group group,
      @required String chainId,
      Chain chain,
      String name,
      String descriptionId,
      LocalizedItem description,
      bool isActive,
      bool isAcceptingOrders,
      List<PaymentMode> paymentModes}) {
    return Unit._internal(
        id: id == null ? UUID.getUUID() : id,
        groupId: groupId,
        group: group,
        chainId: chainId,
        chain: chain,
        name: name,
        descriptionId: descriptionId,
        description: description,
        isActive: isActive,
        isAcceptingOrders: isAcceptingOrders,
        paymentModes: paymentModes != null
            ? List.unmodifiable(paymentModes)
            : paymentModes);
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
        group == other.group &&
        chainId == other.chainId &&
        chain == other.chain &&
        name == other.name &&
        descriptionId == other.descriptionId &&
        description == other.description &&
        isActive == other.isActive &&
        isAcceptingOrders == other.isAcceptingOrders &&
        DeepCollectionEquality().equals(paymentModes, other.paymentModes);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Unit {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("groupId=" + "$groupId" + ", ");
    buffer.write("chainId=" + "$chainId" + ", ");
    buffer.write("name=" + "$name" + ", ");
    buffer.write("descriptionId=" + "$descriptionId" + ", ");
    buffer.write(
        "isActive=" + (isActive != null ? isActive.toString() : "null") + ", ");
    buffer.write("isAcceptingOrders=" +
        (isAcceptingOrders != null ? isAcceptingOrders.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Unit copyWith(
      {String id,
      String groupId,
      Group group,
      String chainId,
      Chain chain,
      String name,
      String descriptionId,
      LocalizedItem description,
      bool isActive,
      bool isAcceptingOrders,
      List<PaymentMode> paymentModes}) {
    return Unit(
        id: id ?? this.id,
        groupId: groupId ?? this.groupId,
        group: group ?? this.group,
        chainId: chainId ?? this.chainId,
        chain: chain ?? this.chain,
        name: name ?? this.name,
        descriptionId: descriptionId ?? this.descriptionId,
        description: description ?? this.description,
        isActive: isActive ?? this.isActive,
        isAcceptingOrders: isAcceptingOrders ?? this.isAcceptingOrders,
        paymentModes: paymentModes ?? this.paymentModes);
  }

  Unit.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        groupId = json['groupId'],
        group = json['group'] != null
            ? Group.fromJson(new Map<String, dynamic>.from(json['group']))
            : null,
        chainId = json['chainId'],
        chain = json['chain'] != null
            ? Chain.fromJson(new Map<String, dynamic>.from(json['chain']))
            : null,
        name = json['name'],
        descriptionId = json['descriptionId'],
        description = json['description'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['description']))
            : null,
        isActive = json['isActive'],
        isAcceptingOrders = json['isAcceptingOrders'],
        paymentModes = json['paymentModes'] is List
            ? (json['paymentModes'] as List)
                .map((e) =>
                    PaymentMode.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'groupId': groupId,
        'group': group?.toJson(),
        'chainId': chainId,
        'chain': chain?.toJson(),
        'name': name,
        'descriptionId': descriptionId,
        'description': description?.toJson(),
        'isActive': isActive,
        'isAcceptingOrders': isAcceptingOrders,
        'paymentModes': paymentModes?.map((e) => e?.toJson())?.toList()
      };

  static final QueryField ID = QueryField(fieldName: "unit.id");
  static final QueryField GROUPID = QueryField(fieldName: "groupId");
  static final QueryField GROUP = QueryField(
      fieldName: "group",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Group).toString()));
  static final QueryField CHAINID = QueryField(fieldName: "chainId");
  static final QueryField CHAIN = QueryField(
      fieldName: "chain",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Chain).toString()));
  static final QueryField NAME = QueryField(fieldName: "name");
  static final QueryField DESCRIPTIONID =
      QueryField(fieldName: "descriptionId");
  static final QueryField DESCRIPTION = QueryField(
      fieldName: "description",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField ISACTIVE = QueryField(fieldName: "isActive");
  static final QueryField ISACCEPTINGORDERS =
      QueryField(fieldName: "isAcceptingOrders");
  static final QueryField PAYMENTMODES = QueryField(
      fieldName: "paymentModes",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (PaymentMode).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Unit";
    modelSchemaDefinition.pluralName = "Units";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.GROUPID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: Unit.GROUP,
        isRequired: false,
        ofModelName: (Group).toString(),
        associatedKey: Group.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.CHAINID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: Unit.CHAIN,
        isRequired: false,
        ofModelName: (Chain).toString(),
        associatedKey: Chain.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.NAME,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.DESCRIPTIONID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: Unit.DESCRIPTION,
        isRequired: false,
        ofModelName: (LocalizedItem).toString(),
        associatedKey: LocalizedItem.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.ISACTIVE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.ISACCEPTINGORDERS,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: Unit.PAYMENTMODES,
        isRequired: true,
        ofModelName: (PaymentMode).toString(),
        associatedKey: PaymentMode.UNITID));
  });
}

class UnitType extends ModelType<Unit> {
  const UnitType();

  @override
  Unit fromJson(Map<String, dynamic> jsonData) {
    return Unit.fromJson(jsonData);
  }
}
