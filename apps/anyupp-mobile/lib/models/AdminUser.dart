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

/** This is an auto generated class representing the AdminUser type in your schema. */
@immutable
class AdminUser extends Model {
  static const classType = const AdminUserType();
  final String id;
  final String name;
  final String profileImage;
  final AdminUserRole roles;
  final AdminUserSettings settings;
  final String email;
  final String phone;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const AdminUser._internal(
      {@required this.id,
      this.name,
      this.profileImage,
      @required this.roles,
      this.settings,
      this.email,
      this.phone});

  factory AdminUser(
      {String id,
      String name,
      String profileImage,
      @required AdminUserRole roles,
      AdminUserSettings settings,
      String email,
      String phone}) {
    return AdminUser._internal(
        id: id == null ? UUID.getUUID() : id,
        name: name,
        profileImage: profileImage,
        roles: roles,
        settings: settings,
        email: email,
        phone: phone);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AdminUser &&
        id == other.id &&
        name == other.name &&
        profileImage == other.profileImage &&
        roles == other.roles &&
        settings == other.settings &&
        email == other.email &&
        phone == other.phone;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("AdminUser {");
    buffer.write("id=" + id + ", ");
    buffer.write("name=" + name + ", ");
    buffer.write("profileImage=" + profileImage + ", ");
    buffer.write("roles=" + (roles != null ? roles.toString() : "null") + ", ");
    buffer.write(
        "settings=" + (settings != null ? settings.toString() : "null") + ", ");
    buffer.write("email=" + email + ", ");
    buffer.write("phone=" + phone);
    buffer.write("}");

    return buffer.toString();
  }

  AdminUser copyWith(
      {String id,
      String name,
      String profileImage,
      AdminUserRole roles,
      AdminUserSettings settings,
      String email,
      String phone}) {
    return AdminUser(
        id: id ?? this.id,
        name: name ?? this.name,
        profileImage: profileImage ?? this.profileImage,
        roles: roles ?? this.roles,
        settings: settings ?? this.settings,
        email: email ?? this.email,
        phone: phone ?? this.phone);
  }

  AdminUser.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        profileImage = json['profileImage'],
        roles = json['roles'] != null
            ? AdminUserRole.fromJson(
                new Map<String, dynamic>.from(json['roles']))
            : null,
        settings = json['settings'] != null
            ? AdminUserSettings.fromJson(
                new Map<String, dynamic>.from(json['settings']))
            : null,
        email = json['email'],
        phone = json['phone'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'profileImage': profileImage,
        'roles': roles?.toJson(),
        'settings': settings?.toJson(),
        'email': email,
        'phone': phone
      };

  static final QueryField ID = QueryField(fieldName: "adminUser.id");
  static final QueryField NAME = QueryField(fieldName: "name");
  static final QueryField PROFILEIMAGE = QueryField(fieldName: "profileImage");
  static final QueryField ROLES = QueryField(
      fieldName: "roles",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (AdminUserRole).toString()));
  static final QueryField SETTINGS = QueryField(
      fieldName: "settings",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (AdminUserSettings).toString()));
  static final QueryField EMAIL = QueryField(fieldName: "email");
  static final QueryField PHONE = QueryField(fieldName: "phone");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "AdminUser";
    modelSchemaDefinition.pluralName = "AdminUsers";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminUser.NAME,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminUser.PROFILEIMAGE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: AdminUser.ROLES,
        isRequired: true,
        targetName: "adminUserRolesId",
        ofModelName: (AdminUserRole).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: AdminUser.SETTINGS,
        isRequired: false,
        targetName: "adminUserSettingsId",
        ofModelName: (AdminUserSettings).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminUser.EMAIL,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminUser.PHONE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class AdminUserType extends ModelType<AdminUser> {
  const AdminUserType();

  @override
  AdminUser fromJson(Map<String, dynamic> jsonData) {
    return AdminUser.fromJson(jsonData);
  }
}
