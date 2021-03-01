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
  final String name;
  final String descriptionId;
  final LocalizedItem description;
  final String currency;
  final String addressId;
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
      this.name,
      this.descriptionId,
      this.description,
      this.currency,
      this.addressId,
      this.address,
      this.email,
      this.phone});

  factory Group(
      {String id,
      String name,
      String descriptionId,
      LocalizedItem description,
      String currency,
      String addressId,
      Address address,
      String email,
      String phone}) {
    return Group._internal(
        id: id == null ? UUID.getUUID() : id,
        name: name,
        descriptionId: descriptionId,
        description: description,
        currency: currency,
        addressId: addressId,
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
        name == other.name &&
        descriptionId == other.descriptionId &&
        description == other.description &&
        currency == other.currency &&
        addressId == other.addressId &&
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
    buffer.write("id=" + "$id" + ", ");
    buffer.write("name=" + "$name" + ", ");
    buffer.write("descriptionId=" + "$descriptionId" + ", ");
    buffer.write("currency=" + "$currency" + ", ");
    buffer.write("addressId=" + "$addressId" + ", ");
    buffer.write("email=" + "$email" + ", ");
    buffer.write("phone=" + "$phone");
    buffer.write("}");

    return buffer.toString();
  }

  Group copyWith(
      {String id,
      String name,
      String descriptionId,
      LocalizedItem description,
      String currency,
      String addressId,
      Address address,
      String email,
      String phone}) {
    return Group(
        id: id ?? this.id,
        name: name ?? this.name,
        descriptionId: descriptionId ?? this.descriptionId,
        description: description ?? this.description,
        currency: currency ?? this.currency,
        addressId: addressId ?? this.addressId,
        address: address ?? this.address,
        email: email ?? this.email,
        phone: phone ?? this.phone);
  }

  Group.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        descriptionId = json['descriptionId'],
        description = json['description'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['description']))
            : null,
        currency = json['currency'],
        addressId = json['addressId'],
        address = json['address'] != null
            ? Address.fromJson(new Map<String, dynamic>.from(json['address']))
            : null,
        email = json['email'],
        phone = json['phone'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'descriptionId': descriptionId,
        'description': description?.toJson(),
        'currency': currency,
        'addressId': addressId,
        'address': address?.toJson(),
        'email': email,
        'phone': phone
      };

  static final QueryField ID = QueryField(fieldName: "group.id");
  static final QueryField NAME = QueryField(fieldName: "name");
  static final QueryField DESCRIPTIONID =
      QueryField(fieldName: "descriptionId");
  static final QueryField DESCRIPTION = QueryField(
      fieldName: "description",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField CURRENCY = QueryField(fieldName: "currency");
  static final QueryField ADDRESSID = QueryField(fieldName: "addressId");
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
        key: Group.NAME,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Group.DESCRIPTIONID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: Group.DESCRIPTION,
        isRequired: false,
        ofModelName: (LocalizedItem).toString(),
        associatedKey: LocalizedItem.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Group.CURRENCY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Group.ADDRESSID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: Group.ADDRESS,
        isRequired: false,
        ofModelName: (Address).toString(),
        associatedKey: Address.ID));

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
