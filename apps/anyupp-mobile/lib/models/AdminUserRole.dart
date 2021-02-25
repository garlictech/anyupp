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

/** This is an auto generated class representing the AdminUserRole type in your schema. */
@immutable
class AdminUserRole extends Model {
  static const classType = const AdminUserRoleType();
  final String id;
  final String role;
  final List<AdminRoleEntity> entities;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const AdminUserRole._internal(
      {@required this.id, @required this.role, this.entities});

  factory AdminUserRole(
      {String id, @required String role, List<AdminRoleEntity> entities}) {
    return AdminUserRole._internal(
        id: id == null ? UUID.getUUID() : id,
        role: role,
        entities: entities != null ? List.unmodifiable(entities) : entities);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AdminUserRole &&
        id == other.id &&
        role == other.role &&
        DeepCollectionEquality().equals(entities, other.entities);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("AdminUserRole {");
    buffer.write("id=" + id + ", ");
    buffer.write("role=" + role);
    buffer.write("}");

    return buffer.toString();
  }

  AdminUserRole copyWith(
      {String id, String role, List<AdminRoleEntity> entities}) {
    return AdminUserRole(
        id: id ?? this.id,
        role: role ?? this.role,
        entities: entities ?? this.entities);
  }

  AdminUserRole.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        role = json['role'],
        entities = json['entities'] is List
            ? (json['entities'] as List)
                .map((e) =>
                    AdminRoleEntity.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'role': role,
        'entities': entities?.map((e) => e?.toJson()).toList()
      };

  static final QueryField ID = QueryField(fieldName: "adminUserRole.id");
  static final QueryField ROLE = QueryField(fieldName: "role");
  static final QueryField ENTITIES = QueryField(
      fieldName: "entities",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (AdminRoleEntity).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "AdminUserRole";
    modelSchemaDefinition.pluralName = "AdminUserRoles";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminUserRole.ROLE,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: AdminUserRole.ENTITIES,
        isRequired: false,
        ofModelName: (AdminRoleEntity).toString(),
        associatedKey: AdminRoleEntity.ADMINUSERROLEENTITIESID));
  });
}

class AdminUserRoleType extends ModelType<AdminUserRole> {
  const AdminUserRoleType();

  @override
  AdminUserRole fromJson(Map<String, dynamic> jsonData) {
    return AdminUserRole.fromJson(jsonData);
  }
}
