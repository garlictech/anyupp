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
  final String productId;
  final String variantNameId;
  final LocalizedItem variantName;
  final String packId;
  final ProductVariantPack pack;
  final bool isAvailable;
  final double price;
  final int position;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const ProductVariant._internal(
      {@required this.id,
      @required this.productId,
      this.variantNameId,
      this.variantName,
      this.packId,
      this.pack,
      this.isAvailable,
      this.price,
      this.position});

  factory ProductVariant(
      {String id,
      @required String productId,
      String variantNameId,
      LocalizedItem variantName,
      String packId,
      ProductVariantPack pack,
      bool isAvailable,
      double price,
      int position}) {
    return ProductVariant._internal(
        id: id == null ? UUID.getUUID() : id,
        productId: productId,
        variantNameId: variantNameId,
        variantName: variantName,
        packId: packId,
        pack: pack,
        isAvailable: isAvailable,
        price: price,
        position: position);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProductVariant &&
        id == other.id &&
        productId == other.productId &&
        variantNameId == other.variantNameId &&
        variantName == other.variantName &&
        packId == other.packId &&
        pack == other.pack &&
        isAvailable == other.isAvailable &&
        price == other.price &&
        position == other.position;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("ProductVariant {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("productId=" + "$productId" + ", ");
    buffer.write("variantNameId=" + "$variantNameId" + ", ");
    buffer.write("packId=" + "$packId" + ", ");
    buffer.write("isAvailable=" +
        (isAvailable != null ? isAvailable.toString() : "null") +
        ", ");
    buffer.write("price=" + (price != null ? price.toString() : "null") + ", ");
    buffer
        .write("position=" + (position != null ? position.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  ProductVariant copyWith(
      {String id,
      String productId,
      String variantNameId,
      LocalizedItem variantName,
      String packId,
      ProductVariantPack pack,
      bool isAvailable,
      double price,
      int position}) {
    return ProductVariant(
        id: id ?? this.id,
        productId: productId ?? this.productId,
        variantNameId: variantNameId ?? this.variantNameId,
        variantName: variantName ?? this.variantName,
        packId: packId ?? this.packId,
        pack: pack ?? this.pack,
        isAvailable: isAvailable ?? this.isAvailable,
        price: price ?? this.price,
        position: position ?? this.position);
  }

  ProductVariant.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        productId = json['productId'],
        variantNameId = json['variantNameId'],
        variantName = json['variantName'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['variantName']))
            : null,
        packId = json['packId'],
        pack = json['pack'] != null
            ? ProductVariantPack.fromJson(
                new Map<String, dynamic>.from(json['pack']))
            : null,
        isAvailable = json['isAvailable'],
        price = json['price'],
        position = json['position'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'productId': productId,
        'variantNameId': variantNameId,
        'variantName': variantName?.toJson(),
        'packId': packId,
        'pack': pack?.toJson(),
        'isAvailable': isAvailable,
        'price': price,
        'position': position
      };

  static final QueryField ID = QueryField(fieldName: "productVariant.id");
  static final QueryField PRODUCTID = QueryField(fieldName: "productId");
  static final QueryField VARIANTNAMEID =
      QueryField(fieldName: "variantNameId");
  static final QueryField VARIANTNAME = QueryField(
      fieldName: "variantName",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField PACKID = QueryField(fieldName: "packId");
  static final QueryField PACK = QueryField(
      fieldName: "pack",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ProductVariantPack).toString()));
  static final QueryField ISAVAILABLE = QueryField(fieldName: "isAvailable");
  static final QueryField PRICE = QueryField(fieldName: "price");
  static final QueryField POSITION = QueryField(fieldName: "position");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "ProductVariant";
    modelSchemaDefinition.pluralName = "ProductVariants";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductVariant.PRODUCTID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductVariant.VARIANTNAMEID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: ProductVariant.VARIANTNAME,
        isRequired: false,
        ofModelName: (LocalizedItem).toString(),
        associatedKey: LocalizedItem.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductVariant.PACKID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: ProductVariant.PACK,
        isRequired: false,
        ofModelName: (ProductVariantPack).toString(),
        associatedKey: ProductVariantPack.ID));

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
  });
}

class ProductVariantType extends ModelType<ProductVariant> {
  const ProductVariantType();

  @override
  ProductVariant fromJson(Map<String, dynamic> jsonData) {
    return ProductVariant.fromJson(jsonData);
  }
}
