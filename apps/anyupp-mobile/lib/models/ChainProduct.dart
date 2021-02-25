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

/** This is an auto generated class representing the ChainProduct type in your schema. */
@immutable
class ChainProduct extends Model {
  static const classType = const ChainProductType();
  final String id;
  final LocalizedItem description;
  final String extending;
  final String image;
  final bool isVisible;
  final int tax;
  final LocalizedItem name;
  final String position;
  final String productCategoryId;
  final String laneId;
  final String productType;
  final List<ProductVariant> variants;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const ChainProduct._internal(
      {@required this.id,
      this.description,
      this.extending,
      this.image,
      this.isVisible,
      this.tax,
      this.name,
      this.position,
      this.productCategoryId,
      this.laneId,
      this.productType,
      this.variants});

  factory ChainProduct(
      {String id,
      LocalizedItem description,
      String extending,
      String image,
      bool isVisible,
      int tax,
      LocalizedItem name,
      String position,
      String productCategoryId,
      String laneId,
      String productType,
      List<ProductVariant> variants}) {
    return ChainProduct._internal(
        id: id == null ? UUID.getUUID() : id,
        description: description,
        extending: extending,
        image: image,
        isVisible: isVisible,
        tax: tax,
        name: name,
        position: position,
        productCategoryId: productCategoryId,
        laneId: laneId,
        productType: productType,
        variants: variants != null ? List.unmodifiable(variants) : variants);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ChainProduct &&
        id == other.id &&
        description == other.description &&
        extending == other.extending &&
        image == other.image &&
        isVisible == other.isVisible &&
        tax == other.tax &&
        name == other.name &&
        position == other.position &&
        productCategoryId == other.productCategoryId &&
        laneId == other.laneId &&
        productType == other.productType &&
        DeepCollectionEquality().equals(variants, other.variants);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("ChainProduct {");
    buffer.write("id=" + id + ", ");
    buffer.write("description=" +
        (description != null ? description.toString() : "null") +
        ", ");
    buffer.write("extending=" + extending + ", ");
    buffer.write("image=" + image + ", ");
    buffer.write("isVisible=" +
        (isVisible != null ? isVisible.toString() : "null") +
        ", ");
    buffer.write("tax=" + (tax != null ? tax.toString() : "null") + ", ");
    buffer.write("name=" + (name != null ? name.toString() : "null") + ", ");
    buffer.write("position=" + position + ", ");
    buffer.write("productCategoryId=" + productCategoryId + ", ");
    buffer.write("laneId=" + laneId + ", ");
    buffer.write("productType=" + productType);
    buffer.write("}");

    return buffer.toString();
  }

  ChainProduct copyWith(
      {String id,
      LocalizedItem description,
      String extending,
      String image,
      bool isVisible,
      int tax,
      LocalizedItem name,
      String position,
      String productCategoryId,
      String laneId,
      String productType,
      List<ProductVariant> variants}) {
    return ChainProduct(
        id: id ?? this.id,
        description: description ?? this.description,
        extending: extending ?? this.extending,
        image: image ?? this.image,
        isVisible: isVisible ?? this.isVisible,
        tax: tax ?? this.tax,
        name: name ?? this.name,
        position: position ?? this.position,
        productCategoryId: productCategoryId ?? this.productCategoryId,
        laneId: laneId ?? this.laneId,
        productType: productType ?? this.productType,
        variants: variants ?? this.variants);
  }

  ChainProduct.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        description = json['description'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['description']))
            : null,
        extending = json['extending'],
        image = json['image'],
        isVisible = json['isVisible'],
        tax = json['tax'],
        name = json['name'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['name']))
            : null,
        position = json['position'],
        productCategoryId = json['productCategoryId'],
        laneId = json['laneId'],
        productType = json['productType'],
        variants = json['variants'] is List
            ? (json['variants'] as List)
                .map((e) =>
                    ProductVariant.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'description': description?.toJson(),
        'extending': extending,
        'image': image,
        'isVisible': isVisible,
        'tax': tax,
        'name': name?.toJson(),
        'position': position,
        'productCategoryId': productCategoryId,
        'laneId': laneId,
        'productType': productType,
        'variants': variants?.map((e) => e?.toJson()).toList()
      };

  static final QueryField ID = QueryField(fieldName: "chainProduct.id");
  static final QueryField DESCRIPTION = QueryField(
      fieldName: "description",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField EXTENDING = QueryField(fieldName: "extending");
  static final QueryField IMAGE = QueryField(fieldName: "image");
  static final QueryField ISVISIBLE = QueryField(fieldName: "isVisible");
  static final QueryField TAX = QueryField(fieldName: "tax");
  static final QueryField NAME = QueryField(
      fieldName: "name",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField POSITION = QueryField(fieldName: "position");
  static final QueryField PRODUCTCATEGORYID =
      QueryField(fieldName: "productCategoryId");
  static final QueryField LANEID = QueryField(fieldName: "laneId");
  static final QueryField PRODUCTTYPE = QueryField(fieldName: "productType");
  static final QueryField VARIANTS = QueryField(
      fieldName: "variants",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ProductVariant).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "ChainProduct";
    modelSchemaDefinition.pluralName = "ChainProducts";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: ChainProduct.DESCRIPTION,
        isRequired: false,
        targetName: "chainProductDescriptionId",
        ofModelName: (LocalizedItem).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainProduct.EXTENDING,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainProduct.IMAGE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainProduct.ISVISIBLE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainProduct.TAX,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: ChainProduct.NAME,
        isRequired: false,
        targetName: "chainProductNameId",
        ofModelName: (LocalizedItem).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainProduct.POSITION,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainProduct.PRODUCTCATEGORYID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainProduct.LANEID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainProduct.PRODUCTTYPE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: ChainProduct.VARIANTS,
        isRequired: false,
        ofModelName: (ProductVariant).toString(),
        associatedKey: ProductVariant.CHAINPRODUCTVARIANTSID));
  });
}

class ChainProductType extends ModelType<ChainProduct> {
  const ChainProductType();

  @override
  ChainProduct fromJson(Map<String, dynamic> jsonData) {
    return ChainProduct.fromJson(jsonData);
  }
}
