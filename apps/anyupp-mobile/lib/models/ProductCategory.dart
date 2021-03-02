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

/** This is an auto generated class representing the ProductCategory type in your schema. */
@immutable
class ProductCategory extends Model {
  static const classType = const ProductCategoryType();
  final String id;
  final String nameId;
  final LocalizedItem name;
  final String descriptionId;
  final LocalizedItem description;
  final String image;
  final int position;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const ProductCategory._internal(
      {@required this.id,
      @required this.nameId,
      this.name,
      this.descriptionId,
      this.description,
      this.image,
      this.position});

  factory ProductCategory(
      {String id,
      @required String nameId,
      LocalizedItem name,
      String descriptionId,
      LocalizedItem description,
      String image,
      int position}) {
    return ProductCategory._internal(
        id: id == null ? UUID.getUUID() : id,
        nameId: nameId,
        name: name,
        descriptionId: descriptionId,
        description: description,
        image: image,
        position: position);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProductCategory &&
        id == other.id &&
        nameId == other.nameId &&
        name == other.name &&
        descriptionId == other.descriptionId &&
        description == other.description &&
        image == other.image &&
        position == other.position;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("ProductCategory {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("nameId=" + "$nameId" + ", ");
    buffer.write("descriptionId=" + "$descriptionId" + ", ");
    buffer.write("image=" + "$image" + ", ");
    buffer
        .write("position=" + (position != null ? position.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  ProductCategory copyWith(
      {String id,
      String nameId,
      LocalizedItem name,
      String descriptionId,
      LocalizedItem description,
      String image,
      int position}) {
    return ProductCategory(
        id: id ?? this.id,
        nameId: nameId ?? this.nameId,
        name: name ?? this.name,
        descriptionId: descriptionId ?? this.descriptionId,
        description: description ?? this.description,
        image: image ?? this.image,
        position: position ?? this.position);
  }

  ProductCategory.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        nameId = json['nameId'],
        name = json['name'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['name']))
            : null,
        descriptionId = json['descriptionId'],
        description = json['description'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['description']))
            : null,
        image = json['image'],
        position = json['position'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'nameId': nameId,
        'name': name?.toJson(),
        'descriptionId': descriptionId,
        'description': description?.toJson(),
        'image': image,
        'position': position
      };

  static final QueryField ID = QueryField(fieldName: "productCategory.id");
  static final QueryField NAMEID = QueryField(fieldName: "nameId");
  static final QueryField NAME = QueryField(
      fieldName: "name",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField DESCRIPTIONID =
      QueryField(fieldName: "descriptionId");
  static final QueryField DESCRIPTION = QueryField(
      fieldName: "description",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField IMAGE = QueryField(fieldName: "image");
  static final QueryField POSITION = QueryField(fieldName: "position");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "ProductCategory";
    modelSchemaDefinition.pluralName = "ProductCategories";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductCategory.NAMEID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: ProductCategory.NAME,
        isRequired: false,
        ofModelName: (LocalizedItem).toString(),
        associatedKey: LocalizedItem.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductCategory.DESCRIPTIONID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: ProductCategory.DESCRIPTION,
        isRequired: false,
        ofModelName: (LocalizedItem).toString(),
        associatedKey: LocalizedItem.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductCategory.IMAGE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductCategory.POSITION,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));
  });
}

class ProductCategoryType extends ModelType<ProductCategory> {
  const ProductCategoryType();

  @override
  ProductCategory fromJson(Map<String, dynamic> jsonData) {
    return ProductCategory.fromJson(jsonData);
  }
}
