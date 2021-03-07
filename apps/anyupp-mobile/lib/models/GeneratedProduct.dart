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

/** This is an auto generated class representing the GeneratedProduct type in your schema. */
@immutable
class GeneratedProduct extends Model {
  static const classType = const GeneratedProductType();
  final String id;
  final String unitId;
  final String productCategoryId;
  final LocalizedItem name;
  final LocalizedItem description;
  final String productType;
  final int tax;
  final int position;
  final String image;
  final List<ProductVariant> variants;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const GeneratedProduct._internal(
      {@required this.id,
      @required this.unitId,
      @required this.productCategoryId,
      this.name,
      this.description,
      this.productType,
      this.tax,
      this.position,
      this.image,
      this.variants});

  factory GeneratedProduct(
      {String id,
      @required String unitId,
      @required String productCategoryId,
      LocalizedItem name,
      LocalizedItem description,
      String productType,
      int tax,
      int position,
      String image,
      List<ProductVariant> variants}) {
    return GeneratedProduct._internal(
        id: id == null ? UUID.getUUID() : id,
        unitId: unitId,
        productCategoryId: productCategoryId,
        name: name,
        description: description,
        productType: productType,
        tax: tax,
        position: position,
        image: image,
        variants: variants != null ? List.unmodifiable(variants) : variants);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GeneratedProduct &&
        id == other.id &&
        unitId == other.unitId &&
        productCategoryId == other.productCategoryId &&
        name == other.name &&
        description == other.description &&
        productType == other.productType &&
        tax == other.tax &&
        position == other.position &&
        image == other.image &&
        DeepCollectionEquality().equals(variants, other.variants);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("GeneratedProduct {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("unitId=" + "$unitId" + ", ");
    buffer.write("productCategoryId=" + "$productCategoryId" + ", ");
    buffer.write("name=" + (name != null ? name.toString() : "null") + ", ");
    buffer.write("description=" +
        (description != null ? description.toString() : "null") +
        ", ");
    buffer.write("productType=" + "$productType" + ", ");
    buffer.write("tax=" + (tax != null ? tax.toString() : "null") + ", ");
    buffer.write(
        "position=" + (position != null ? position.toString() : "null") + ", ");
    buffer.write("image=" + "$image");
    buffer.write("}");

    return buffer.toString();
  }

  GeneratedProduct copyWith(
      {String id,
      String unitId,
      String productCategoryId,
      LocalizedItem name,
      LocalizedItem description,
      String productType,
      int tax,
      int position,
      String image,
      List<ProductVariant> variants}) {
    return GeneratedProduct(
        id: id ?? this.id,
        unitId: unitId ?? this.unitId,
        productCategoryId: productCategoryId ?? this.productCategoryId,
        name: name ?? this.name,
        description: description ?? this.description,
        productType: productType ?? this.productType,
        tax: tax ?? this.tax,
        position: position ?? this.position,
        image: image ?? this.image,
        variants: variants ?? this.variants);
  }

  GeneratedProduct.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        unitId = json['unitId'],
        productCategoryId = json['productCategoryId'],
        name = json['name'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['name']))
            : null,
        description = json['description'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['description']))
            : null,
        productType = json['productType'],
        tax = json['tax'],
        position = json['position'],
        image = json['image'],
        variants = json['variants'] is List
            ? (json['variants'] as List)
                .map((e) =>
                    ProductVariant.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'unitId': unitId,
        'productCategoryId': productCategoryId,
        'name': name?.toJson(),
        'description': description?.toJson(),
        'productType': productType,
        'tax': tax,
        'position': position,
        'image': image,
        'variants': variants?.map((e) => e?.toJson())?.toList()
      };

  static final QueryField ID = QueryField(fieldName: "generatedProduct.id");
  static final QueryField UNITID = QueryField(fieldName: "unitId");
  static final QueryField PRODUCTCATEGORYID =
      QueryField(fieldName: "productCategoryId");
  static final QueryField NAME = QueryField(
      fieldName: "name",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField DESCRIPTION = QueryField(
      fieldName: "description",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField PRODUCTTYPE = QueryField(fieldName: "productType");
  static final QueryField TAX = QueryField(fieldName: "tax");
  static final QueryField POSITION = QueryField(fieldName: "position");
  static final QueryField IMAGE = QueryField(fieldName: "image");
  static final QueryField VARIANTS = QueryField(
      fieldName: "variants",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ProductVariant).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "GeneratedProduct";
    modelSchemaDefinition.pluralName = "GeneratedProducts";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeneratedProduct.UNITID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeneratedProduct.PRODUCTCATEGORYID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: GeneratedProduct.NAME,
        isRequired: false,
        targetName: "generatedProductNameId",
        ofModelName: (LocalizedItem).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: GeneratedProduct.DESCRIPTION,
        isRequired: false,
        targetName: "generatedProductDescriptionId",
        ofModelName: (LocalizedItem).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeneratedProduct.PRODUCTTYPE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeneratedProduct.TAX,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeneratedProduct.POSITION,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: GeneratedProduct.IMAGE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: GeneratedProduct.VARIANTS,
        isRequired: true,
        ofModelName: (ProductVariant).toString(),
        associatedKey: ProductVariant.GENERATEDPRODUCTVARIANTSID));
  });
}

class GeneratedProductType extends ModelType<GeneratedProduct> {
  const GeneratedProductType();

  @override
  GeneratedProduct fromJson(Map<String, dynamic> jsonData) {
    return GeneratedProduct.fromJson(jsonData);
  }
}
