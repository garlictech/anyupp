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

/** This is an auto generated class representing the AdminUserSettings type in your schema. */
@immutable
class AdminUserSettings extends Model {
  static const classType = const AdminUserSettingsType();
  final String id;
  final String selectedChainId;
  final String selectedGroupId;
  final String selectedUnitId;
  final String selectedProductCategoryId;
  final String selectedLanguage;
  final int selectedHistoryDate;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const AdminUserSettings._internal(
      {@required this.id,
      this.selectedChainId,
      this.selectedGroupId,
      this.selectedUnitId,
      this.selectedProductCategoryId,
      this.selectedLanguage,
      this.selectedHistoryDate});

  factory AdminUserSettings(
      {String id,
      String selectedChainId,
      String selectedGroupId,
      String selectedUnitId,
      String selectedProductCategoryId,
      String selectedLanguage,
      int selectedHistoryDate}) {
    return AdminUserSettings._internal(
        id: id == null ? UUID.getUUID() : id,
        selectedChainId: selectedChainId,
        selectedGroupId: selectedGroupId,
        selectedUnitId: selectedUnitId,
        selectedProductCategoryId: selectedProductCategoryId,
        selectedLanguage: selectedLanguage,
        selectedHistoryDate: selectedHistoryDate);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AdminUserSettings &&
        id == other.id &&
        selectedChainId == other.selectedChainId &&
        selectedGroupId == other.selectedGroupId &&
        selectedUnitId == other.selectedUnitId &&
        selectedProductCategoryId == other.selectedProductCategoryId &&
        selectedLanguage == other.selectedLanguage &&
        selectedHistoryDate == other.selectedHistoryDate;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("AdminUserSettings {");
    buffer.write("id=" + id + ", ");
    buffer.write("selectedChainId=" + selectedChainId + ", ");
    buffer.write("selectedGroupId=" + selectedGroupId + ", ");
    buffer.write("selectedUnitId=" + selectedUnitId + ", ");
    buffer
        .write("selectedProductCategoryId=" + selectedProductCategoryId + ", ");
    buffer.write("selectedLanguage=" + selectedLanguage + ", ");
    buffer.write("selectedHistoryDate=" +
        (selectedHistoryDate != null
            ? selectedHistoryDate.toString()
            : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  AdminUserSettings copyWith(
      {String id,
      String selectedChainId,
      String selectedGroupId,
      String selectedUnitId,
      String selectedProductCategoryId,
      String selectedLanguage,
      int selectedHistoryDate}) {
    return AdminUserSettings(
        id: id ?? this.id,
        selectedChainId: selectedChainId ?? this.selectedChainId,
        selectedGroupId: selectedGroupId ?? this.selectedGroupId,
        selectedUnitId: selectedUnitId ?? this.selectedUnitId,
        selectedProductCategoryId:
            selectedProductCategoryId ?? this.selectedProductCategoryId,
        selectedLanguage: selectedLanguage ?? this.selectedLanguage,
        selectedHistoryDate: selectedHistoryDate ?? this.selectedHistoryDate);
  }

  AdminUserSettings.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        selectedChainId = json['selectedChainId'],
        selectedGroupId = json['selectedGroupId'],
        selectedUnitId = json['selectedUnitId'],
        selectedProductCategoryId = json['selectedProductCategoryId'],
        selectedLanguage = json['selectedLanguage'],
        selectedHistoryDate = json['selectedHistoryDate'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'selectedChainId': selectedChainId,
        'selectedGroupId': selectedGroupId,
        'selectedUnitId': selectedUnitId,
        'selectedProductCategoryId': selectedProductCategoryId,
        'selectedLanguage': selectedLanguage,
        'selectedHistoryDate': selectedHistoryDate
      };

  static final QueryField ID = QueryField(fieldName: "adminUserSettings.id");
  static final QueryField SELECTEDCHAINID =
      QueryField(fieldName: "selectedChainId");
  static final QueryField SELECTEDGROUPID =
      QueryField(fieldName: "selectedGroupId");
  static final QueryField SELECTEDUNITID =
      QueryField(fieldName: "selectedUnitId");
  static final QueryField SELECTEDPRODUCTCATEGORYID =
      QueryField(fieldName: "selectedProductCategoryId");
  static final QueryField SELECTEDLANGUAGE =
      QueryField(fieldName: "selectedLanguage");
  static final QueryField SELECTEDHISTORYDATE =
      QueryField(fieldName: "selectedHistoryDate");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "AdminUserSettings";
    modelSchemaDefinition.pluralName = "AdminUserSettings";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminUserSettings.SELECTEDCHAINID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminUserSettings.SELECTEDGROUPID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminUserSettings.SELECTEDUNITID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminUserSettings.SELECTEDPRODUCTCATEGORYID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminUserSettings.SELECTEDLANGUAGE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: AdminUserSettings.SELECTEDHISTORYDATE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));
  });
}

class AdminUserSettingsType extends ModelType<AdminUserSettings> {
  const AdminUserSettingsType();

  @override
  AdminUserSettings fromJson(Map<String, dynamic> jsonData) {
    return AdminUserSettings.fromJson(jsonData);
  }
}
