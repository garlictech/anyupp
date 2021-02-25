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

/** This is an auto generated class representing the AdminRoleEntity type in your schema. */
@immutable
class AdminRoleEntity extends Model {
  static const classType = const AdminRoleEntityType();
  final String id;
  final String chainId;
  final String groupId;
  final String unitId;
  final String adminUserRoleEntitiesId;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const AdminRoleEntity._internal(
      {@required this.id,
      this.chainId,
      this.groupId,
      this.unitId,
      this.adminUserRoleEntitiesId});

  factory AdminRoleEntity(
      {String id,
      String chainId,
      String groupId,
      String unitId,
      String adminUserRoleEntitiesId}) {
    return AdminRoleEntity._internal(
        id: id == null ? UUID.getUUID() : id,
        chainId: chainId,
        groupId: groupId,
        unitId: unitId,
        adminUserRoleEntitiesId: adminUserRoleEntitiesId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AdminRoleEntity &&
        id == other.id &&
        chainId == other.chainId &&
        groupId == other.groupId &&
        unitId == other.unitId &&
        adminUserRoleEntitiesId == other.adminUserRoleEntitiesId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("AdminRoleEntity {");
    buffer.write("id=" + id + ", ");
    buffer.write("chainId=" + chainId + ", ");
    buffer.write("groupId=" + groupId + ", ");
    buffer.write("unitId=" + unitId + ", ");
    buffer.write("adminUserRoleEntitiesId=" + adminUserRoleEntitiesId);
    buffer.write("}");

    return buffer.toString();
  }

  AdminRoleEntity copyWith(
      {String id,
      String chainId,
      String groupId,
      String unitId,
      String adminUserRoleEntitiesId}) {
    return AdminRoleEntity(
        id: id ?? this.id,
        chainId: chainId ?? this.chainId,
        groupId: groupId ?? this.groupId,
        unitId: unitId ?? this.unitId,
        adminUserRoleEntitiesId:
            adminUserRoleEntitiesId ?? this.adminUserRoleEntitiesId);
  }

  AdminRoleEntity.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        chainId = json['chainId'],
        groupId = json['groupId'],
        unitId = json['unitId'],
        adminUserRoleEntitiesId = json['adminUserRoleEntitiesId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'chainId': chainId,
        'groupId': groupId,
        'unitId': unitId,
        'adminUserRoleEntitiesId': adminUserRoleEntitiesId
      };

  static final QueryField ID = QueryField(fieldName: "adminRoleEntity.id");
  static final QueryField CHAINID = QueryField(fieldName: "chainId");
  static final QueryField GROUPID = QueryField(fieldName: "groupId");
  static final QueryField UNITID = QueryField(fieldName: "unitId");
  static final QueryField ADMINUSERROLEENTITIESID =
      QueryField(fieldName: "adminUserRoleEntitiesId");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "AdminRoleEntity";
    modelSchemaDefinition.pluralName = "AdminRoleEntities";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminRoleEntity.CHAINID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminRoleEntity.GROUPID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminRoleEntity.UNITID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminRoleEntity.ADMINUSERROLEENTITIESID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class AdminRoleEntityType extends ModelType<AdminRoleEntity> {
  const AdminRoleEntityType();

  @override
  AdminRoleEntity fromJson(Map<String, dynamic> jsonData) {
    return AdminRoleEntity.fromJson(jsonData);
  }
}
