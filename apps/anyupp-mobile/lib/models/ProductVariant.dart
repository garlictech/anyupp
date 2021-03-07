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

/** This is an auto generated class representing the ProductVariant type in your schema. */
@immutable
class ProductVariant extends Model {
  static const classType = const ProductVariantType();
  final String id;
  final LocalizedItem variantName;
  final ProductVariantPack pack;
  final bool isAvailable;
  final double price;
  final int position;
  final String generatedProductVariantsId;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const ProductVariant._internal(
      {@required this.id,
      this.variantName,
      this.pack,
      this.isAvailable,
      this.price,
      this.position,
      this.generatedProductVariantsId});

  factory ProductVariant(
      {String id,
      LocalizedItem variantName,
      ProductVariantPack pack,
      bool isAvailable,
      double price,
      int position,
      String generatedProductVariantsId}) {
    return ProductVariant._internal(
        id: id == null ? UUID.getUUID() : id,
        variantName: variantName,
        pack: pack,
        isAvailable: isAvailable,
        price: price,
        position: position,
        generatedProductVariantsId: generatedProductVariantsId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProductVariant &&
        id == other.id &&
        variantName == other.variantName &&
        pack == other.pack &&
        isAvailable == other.isAvailable &&
        price == other.price &&
        position == other.position &&
        generatedProductVariantsId == other.generatedProductVariantsId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("ProductVariant {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("variantName=" +
        (variantName != null ? variantName.toString() : "null") +
        ", ");
    buffer.write("pack=" + (pack != null ? pack.toString() : "null") + ", ");
    buffer.write("isAvailable=" +
        (isAvailable != null ? isAvailable.toString() : "null") +
        ", ");
    buffer.write("price=" + (price != null ? price.toString() : "null") + ", ");
    buffer.write(
        "position=" + (position != null ? position.toString() : "null") + ", ");
    buffer.write("generatedProductVariantsId=" + "$generatedProductVariantsId");
    buffer.write("}");

    return buffer.toString();
  }

  ProductVariant copyWith(
      {String id,
      LocalizedItem variantName,
      ProductVariantPack pack,
      bool isAvailable,
      double price,
      int position,
      String generatedProductVariantsId}) {
    return ProductVariant(
        id: id ?? this.id,
        variantName: variantName ?? this.variantName,
        pack: pack ?? this.pack,
        isAvailable: isAvailable ?? this.isAvailable,
        price: price ?? this.price,
        position: position ?? this.position,
        generatedProductVariantsId:
            generatedProductVariantsId ?? this.generatedProductVariantsId);
  }

  ProductVariant.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        variantName = json['variantName'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['variantName']))
            : null,
        pack = json['pack'] != null
            ? ProductVariantPack.fromJson(
                new Map<String, dynamic>.from(json['pack']))
            : null,
        isAvailable = json['isAvailable'],
        price = json['price'],
        position = json['position'],
        generatedProductVariantsId = json['generatedProductVariantsId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'variantName': variantName?.toJson(),
        'pack': pack?.toJson(),
        'isAvailable': isAvailable,
        'price': price,
        'position': position,
        'generatedProductVariantsId': generatedProductVariantsId
      };

  static final QueryField ID = QueryField(fieldName: "productVariant.id");
  static final QueryField VARIANTNAME = QueryField(
      fieldName: "variantName",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField PACK = QueryField(
      fieldName: "pack",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ProductVariantPack).toString()));
  static final QueryField ISAVAILABLE = QueryField(fieldName: "isAvailable");
  static final QueryField PRICE = QueryField(fieldName: "price");
  static final QueryField POSITION = QueryField(fieldName: "position");
  static final QueryField GENERATEDPRODUCTVARIANTSID =
      QueryField(fieldName: "generatedProductVariantsId");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "ProductVariant";
    modelSchemaDefinition.pluralName = "ProductVariants";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: ProductVariant.VARIANTNAME,
        isRequired: false,
        targetName: "productVariantVariantNameId",
        ofModelName: (LocalizedItem).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: ProductVariant.PACK,
        isRequired: false,
        targetName: "productVariantPackId",
        ofModelName: (ProductVariantPack).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductVariant.ISAVAILABLE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductVariant.PRICE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.double)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductVariant.POSITION,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductVariant.GENERATEDPRODUCTVARIANTSID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class ProductVariantType extends ModelType<ProductVariant> {
  const ProductVariantType();

  @override
  ProductVariant fromJson(Map<String, dynamic> jsonData) {
    return ProductVariant.fromJson(jsonData);
  }
}
