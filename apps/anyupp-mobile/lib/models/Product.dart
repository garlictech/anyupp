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

/** This is an auto generated class representing the Product type in your schema. */
@immutable
class Product extends Model {
  static const classType = const ProductType();
  final String id;
  final String unitId;
  final String nameId;
  final LocalizedItem name;
  final String descriptionId;
  final LocalizedItem description;
  final String productCategoryId;
  final ProductCategory productCategory;
  final String productType;
  final int tax;
  final int position;
  final String image;
  final String extending;
  final bool isVisible;
  final List<ProductVariant> variants;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Product._internal(
      {@required this.id,
      @required this.unitId,
      @required this.nameId,
      this.name,
      this.descriptionId,
      this.description,
      @required this.productCategoryId,
      this.productCategory,
      this.productType,
      this.tax,
      this.position,
      this.image,
      this.extending,
      this.isVisible,
      this.variants});

  factory Product(
      {String id,
      @required String unitId,
      @required String nameId,
      LocalizedItem name,
      String descriptionId,
      LocalizedItem description,
      @required String productCategoryId,
      ProductCategory productCategory,
      String productType,
      int tax,
      int position,
      String image,
      String extending,
      bool isVisible,
      List<ProductVariant> variants}) {
    return Product._internal(
        id: id == null ? UUID.getUUID() : id,
        unitId: unitId,
        nameId: nameId,
        name: name,
        descriptionId: descriptionId,
        description: description,
        productCategoryId: productCategoryId,
        productCategory: productCategory,
        productType: productType,
        tax: tax,
        position: position,
        image: image,
        extending: extending,
        isVisible: isVisible,
        variants: variants != null ? List.unmodifiable(variants) : variants);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Product &&
        id == other.id &&
        unitId == other.unitId &&
        nameId == other.nameId &&
        name == other.name &&
        descriptionId == other.descriptionId &&
        description == other.description &&
        productCategoryId == other.productCategoryId &&
        productCategory == other.productCategory &&
        productType == other.productType &&
        tax == other.tax &&
        position == other.position &&
        image == other.image &&
        extending == other.extending &&
        isVisible == other.isVisible &&
        DeepCollectionEquality().equals(variants, other.variants);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Product {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("unitId=" + "$unitId" + ", ");
    buffer.write("nameId=" + "$nameId" + ", ");
    buffer.write("descriptionId=" + "$descriptionId" + ", ");
    buffer.write("productCategoryId=" + "$productCategoryId" + ", ");
    buffer.write("productType=" + "$productType" + ", ");
    buffer.write("tax=" + (tax != null ? tax.toString() : "null") + ", ");
    buffer.write(
        "position=" + (position != null ? position.toString() : "null") + ", ");
    buffer.write("image=" + "$image" + ", ");
    buffer.write("extending=" + "$extending" + ", ");
    buffer.write(
        "isVisible=" + (isVisible != null ? isVisible.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Product copyWith(
      {String id,
      String unitId,
      String nameId,
      LocalizedItem name,
      String descriptionId,
      LocalizedItem description,
      String productCategoryId,
      ProductCategory productCategory,
      String productType,
      int tax,
      int position,
      String image,
      String extending,
      bool isVisible,
      List<ProductVariant> variants}) {
    return Product(
        id: id ?? this.id,
        unitId: unitId ?? this.unitId,
        nameId: nameId ?? this.nameId,
        name: name ?? this.name,
        descriptionId: descriptionId ?? this.descriptionId,
        description: description ?? this.description,
        productCategoryId: productCategoryId ?? this.productCategoryId,
        productCategory: productCategory ?? this.productCategory,
        productType: productType ?? this.productType,
        tax: tax ?? this.tax,
        position: position ?? this.position,
        image: image ?? this.image,
        extending: extending ?? this.extending,
        isVisible: isVisible ?? this.isVisible,
        variants: variants ?? this.variants);
  }

  Product.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        unitId = json['unitId'],
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
        productCategoryId = json['productCategoryId'],
        productCategory = json['productCategory'] != null
            ? ProductCategory.fromJson(
                new Map<String, dynamic>.from(json['productCategory']))
            : null,
        productType = json['productType'],
        tax = json['tax'],
        position = json['position'],
        image = json['image'],
        extending = json['extending'],
        isVisible = json['isVisible'],
        variants = json['variants'] is List
            ? (json['variants'] as List)
                .map((e) =>
                    ProductVariant.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'unitId': unitId,
        'nameId': nameId,
        'name': name?.toJson(),
        'descriptionId': descriptionId,
        'description': description?.toJson(),
        'productCategoryId': productCategoryId,
        'productCategory': productCategory?.toJson(),
        'productType': productType,
        'tax': tax,
        'position': position,
        'image': image,
        'extending': extending,
        'isVisible': isVisible,
        'variants': variants?.map((e) => e?.toJson())?.toList()
      };

  static final QueryField ID = QueryField(fieldName: "product.id");
  static final QueryField UNITID = QueryField(fieldName: "unitId");
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
  static final QueryField PRODUCTCATEGORYID =
      QueryField(fieldName: "productCategoryId");
  static final QueryField PRODUCTCATEGORY = QueryField(
      fieldName: "productCategory",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ProductCategory).toString()));
  static final QueryField PRODUCTTYPE = QueryField(fieldName: "productType");
  static final QueryField TAX = QueryField(fieldName: "tax");
  static final QueryField POSITION = QueryField(fieldName: "position");
  static final QueryField IMAGE = QueryField(fieldName: "image");
  static final QueryField EXTENDING = QueryField(fieldName: "extending");
  static final QueryField ISVISIBLE = QueryField(fieldName: "isVisible");
  static final QueryField VARIANTS = QueryField(
      fieldName: "variants",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ProductVariant).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Product";
    modelSchemaDefinition.pluralName = "Products";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Product.UNITID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Product.NAMEID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: Product.NAME,
        isRequired: false,
        ofModelName: (LocalizedItem).toString(),
        associatedKey: LocalizedItem.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Product.DESCRIPTIONID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: Product.DESCRIPTION,
        isRequired: false,
        ofModelName: (LocalizedItem).toString(),
        associatedKey: LocalizedItem.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Product.PRODUCTCATEGORYID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: Product.PRODUCTCATEGORY,
        isRequired: false,
        ofModelName: (ProductCategory).toString(),
        associatedKey: ProductCategory.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Product.PRODUCTTYPE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Product.TAX,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Product.POSITION,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Product.IMAGE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Product.EXTENDING,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Product.ISVISIBLE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: Product.VARIANTS,
        isRequired: true,
        ofModelName: (ProductVariant).toString(),
        associatedKey: ProductVariant.PRODUCTID));
  });
}

class ProductType extends ModelType<Product> {
  const ProductType();

  @override
  Product fromJson(Map<String, dynamic> jsonData) {
    return Product.fromJson(jsonData);
  }
}
