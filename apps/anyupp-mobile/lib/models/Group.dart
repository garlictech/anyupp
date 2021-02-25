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

/** This is an auto generated class representing the Group type in your schema. */
@immutable
class Group extends Model {
  static const classType = const GroupType();
  final String id;
  final String chainId;
  final String name;
  final LocalizedItem description;
  final String currency;
  final Address address;
  final String email;
  final String phone;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Group._internal(
      {@required this.id,
      @required this.chainId,
      this.name,
      this.description,
      this.currency,
      this.address,
      this.email,
      this.phone});

  factory Group(
      {String id,
      @required String chainId,
      String name,
      LocalizedItem description,
      String currency,
      Address address,
      String email,
      String phone}) {
    return Group._internal(
        id: id == null ? UUID.getUUID() : id,
        chainId: chainId,
        name: name,
        description: description,
        currency: currency,
        address: address,
        email: email,
        phone: phone);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Group &&
        id == other.id &&
        chainId == other.chainId &&
        name == other.name &&
        description == other.description &&
        currency == other.currency &&
        address == other.address &&
        email == other.email &&
        phone == other.phone;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Group {");
    buffer.write("id=" + id + ", ");
    buffer.write("chainId=" + chainId + ", ");
    buffer.write("name=" + name + ", ");
    buffer.write("description=" +
        (description != null ? description.toString() : "null") +
        ", ");
    buffer.write("currency=" + currency + ", ");
    buffer.write(
        "address=" + (address != null ? address.toString() : "null") + ", ");
    buffer.write("email=" + email + ", ");
    buffer.write("phone=" + phone);
    buffer.write("}");

    return buffer.toString();
  }

  Group copyWith(
      {String id,
      String chainId,
      String name,
      LocalizedItem description,
      String currency,
      Address address,
      String email,
      String phone}) {
    return Group(
        id: id ?? this.id,
        chainId: chainId ?? this.chainId,
        name: name ?? this.name,
        description: description ?? this.description,
        currency: currency ?? this.currency,
        address: address ?? this.address,
        email: email ?? this.email,
        phone: phone ?? this.phone);
  }

  Group.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        chainId = json['chainId'],
        name = json['name'],
        description = json['description'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['description']))
            : null,
        currency = json['currency'],
        address = json['address'] != null
            ? Address.fromJson(new Map<String, dynamic>.from(json['address']))
            : null,
        email = json['email'],
        phone = json['phone'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'chainId': chainId,
        'name': name,
        'description': description?.toJson(),
        'currency': currency,
        'address': address?.toJson(),
        'email': email,
        'phone': phone
      };

  static final QueryField ID = QueryField(fieldName: "group.id");
  static final QueryField CHAINID = QueryField(fieldName: "chainId");
  static final QueryField NAME = QueryField(fieldName: "name");
  static final QueryField DESCRIPTION = QueryField(
      fieldName: "description",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField CURRENCY = QueryField(fieldName: "currency");
  static final QueryField ADDRESS = QueryField(
      fieldName: "address",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Address).toString()));
  static final QueryField EMAIL = QueryField(fieldName: "email");
  static final QueryField PHONE = QueryField(fieldName: "phone");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Group";
    modelSchemaDefinition.pluralName = "Groups";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Group.CHAINID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Group.NAME,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Group.DESCRIPTION,
        isRequired: false,
        targetName: "groupDescriptionId",
        ofModelName: (LocalizedItem).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Group.CURRENCY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Group.ADDRESS,
        isRequired: false,
        targetName: "groupAddressId",
        ofModelName: (Address).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Group.EMAIL,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Group.PHONE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class GroupType extends ModelType<Group> {
  const GroupType();

  @override
  Group fromJson(Map<String, dynamic> jsonData) {
    return Group.fromJson(jsonData);
  }
}
