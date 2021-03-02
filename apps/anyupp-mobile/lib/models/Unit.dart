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
  final String addressId;
  final Address address;
  final List<PaymentMode> paymentModes;
  final bool isActive;
  final bool isAcceptingOrders;
  final String email;
  final String phone;
  final String openId;
  final DailySchedule open;
  final List<WeeklySchedule> openingHours;

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
      this.addressId,
      this.address,
      this.paymentModes,
      this.isActive,
      this.isAcceptingOrders,
      this.email,
      this.phone,
      this.openId,
      this.open,
      this.openingHours});

  factory Unit(
      {String id,
      @required String groupId,
      Group group,
      @required String chainId,
      Chain chain,
      String name,
      String descriptionId,
      LocalizedItem description,
      String addressId,
      Address address,
      List<PaymentMode> paymentModes,
      bool isActive,
      bool isAcceptingOrders,
      String email,
      String phone,
      String openId,
      DailySchedule open,
      List<WeeklySchedule> openingHours}) {
    return Unit._internal(
        id: id == null ? UUID.getUUID() : id,
        groupId: groupId,
        group: group,
        chainId: chainId,
        chain: chain,
        name: name,
        descriptionId: descriptionId,
        description: description,
        addressId: addressId,
        address: address,
        paymentModes: paymentModes != null
            ? List.unmodifiable(paymentModes)
            : paymentModes,
        isActive: isActive,
        isAcceptingOrders: isAcceptingOrders,
        email: email,
        phone: phone,
        openId: openId,
        open: open,
        openingHours: openingHours != null
            ? List.unmodifiable(openingHours)
            : openingHours);
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
        addressId == other.addressId &&
        address == other.address &&
        DeepCollectionEquality().equals(paymentModes, other.paymentModes) &&
        isActive == other.isActive &&
        isAcceptingOrders == other.isAcceptingOrders &&
        email == other.email &&
        phone == other.phone &&
        openId == other.openId &&
        open == other.open &&
        DeepCollectionEquality().equals(openingHours, other.openingHours);
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
    buffer.write("addressId=" + "$addressId" + ", ");
    buffer.write(
        "isActive=" + (isActive != null ? isActive.toString() : "null") + ", ");
    buffer.write("isAcceptingOrders=" +
        (isAcceptingOrders != null ? isAcceptingOrders.toString() : "null") +
        ", ");
    buffer.write("email=" + "$email" + ", ");
    buffer.write("phone=" + "$phone" + ", ");
    buffer.write("openId=" + "$openId");
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
      String addressId,
      Address address,
      List<PaymentMode> paymentModes,
      bool isActive,
      bool isAcceptingOrders,
      String email,
      String phone,
      String openId,
      DailySchedule open,
      List<WeeklySchedule> openingHours}) {
    return Unit(
        id: id ?? this.id,
        groupId: groupId ?? this.groupId,
        group: group ?? this.group,
        chainId: chainId ?? this.chainId,
        chain: chain ?? this.chain,
        name: name ?? this.name,
        descriptionId: descriptionId ?? this.descriptionId,
        description: description ?? this.description,
        addressId: addressId ?? this.addressId,
        address: address ?? this.address,
        paymentModes: paymentModes ?? this.paymentModes,
        isActive: isActive ?? this.isActive,
        isAcceptingOrders: isAcceptingOrders ?? this.isAcceptingOrders,
        email: email ?? this.email,
        phone: phone ?? this.phone,
        openId: openId ?? this.openId,
        open: open ?? this.open,
        openingHours: openingHours ?? this.openingHours);
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
        addressId = json['addressId'],
        address = json['address'] != null
            ? Address.fromJson(new Map<String, dynamic>.from(json['address']))
            : null,
        paymentModes = json['paymentModes'] is List
            ? (json['paymentModes'] as List)
                .map((e) =>
                    PaymentMode.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null,
        isActive = json['isActive'],
        isAcceptingOrders = json['isAcceptingOrders'],
        email = json['email'],
        phone = json['phone'],
        openId = json['openId'],
        open = json['open'] != null
            ? DailySchedule.fromJson(
                new Map<String, dynamic>.from(json['open']))
            : null,
        openingHours = json['openingHours'] is List
            ? (json['openingHours'] as List)
                .map((e) =>
                    WeeklySchedule.fromJson(new Map<String, dynamic>.from(e)))
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
        'addressId': addressId,
        'address': address?.toJson(),
        'paymentModes': paymentModes?.map((e) => e?.toJson())?.toList(),
        'isActive': isActive,
        'isAcceptingOrders': isAcceptingOrders,
        'email': email,
        'phone': phone,
        'openId': openId,
        'open': open?.toJson(),
        'openingHours': openingHours?.map((e) => e?.toJson())?.toList()
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
  static final QueryField ADDRESSID = QueryField(fieldName: "addressId");
  static final QueryField ADDRESS = QueryField(
      fieldName: "address",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Address).toString()));
  static final QueryField PAYMENTMODES = QueryField(
      fieldName: "paymentModes",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (PaymentMode).toString()));
  static final QueryField ISACTIVE = QueryField(fieldName: "isActive");
  static final QueryField ISACCEPTINGORDERS =
      QueryField(fieldName: "isAcceptingOrders");
  static final QueryField EMAIL = QueryField(fieldName: "email");
  static final QueryField PHONE = QueryField(fieldName: "phone");
  static final QueryField OPENID = QueryField(fieldName: "openId");
  static final QueryField OPEN = QueryField(
      fieldName: "open",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (DailySchedule).toString()));
  static final QueryField OPENINGHOURS = QueryField(
      fieldName: "openingHours",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (WeeklySchedule).toString()));
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
        key: Unit.ADDRESSID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: Unit.ADDRESS,
        isRequired: false,
        ofModelName: (Address).toString(),
        associatedKey: Address.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: Unit.PAYMENTMODES,
        isRequired: true,
        ofModelName: (PaymentMode).toString(),
        associatedKey: PaymentMode.UNITID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.ISACTIVE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.ISACCEPTINGORDERS,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.EMAIL,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.PHONE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Unit.OPENID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: Unit.OPEN,
        isRequired: false,
        ofModelName: (DailySchedule).toString(),
        associatedKey: DailySchedule.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: Unit.OPENINGHOURS,
        isRequired: true,
        ofModelName: (WeeklySchedule).toString(),
        associatedKey: WeeklySchedule.UNITID));
  });
}

class UnitType extends ModelType<Unit> {
  const UnitType();

  @override
  Unit fromJson(Map<String, dynamic> jsonData) {
    return Unit.fromJson(jsonData);
  }
}
