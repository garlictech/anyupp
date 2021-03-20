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

/** This is an auto generated class representing the CartItem type in your schema. */
@immutable
class CartItem extends Model {
  static const classType = const CartItemType();
  final String id;
  final GeneratedProduct product;
  final ProductVariant variant;
  final int quantity;
  final String cartItemsId;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const CartItem._internal(
      {@required this.id,
      @required this.product,
      @required this.variant,
      @required this.quantity,
      this.cartItemsId});

  factory CartItem(
      {String id,
      @required GeneratedProduct product,
      @required ProductVariant variant,
      @required int quantity,
      String cartItemsId}) {
    return CartItem._internal(
        id: id == null ? UUID.getUUID() : id,
        product: product,
        variant: variant,
        quantity: quantity,
        cartItemsId: cartItemsId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CartItem &&
        id == other.id &&
        product == other.product &&
        variant == other.variant &&
        quantity == other.quantity &&
        cartItemsId == other.cartItemsId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("CartItem {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write(
        "product=" + (product != null ? product.toString() : "null") + ", ");
    buffer.write(
        "variant=" + (variant != null ? variant.toString() : "null") + ", ");
    buffer.write(
        "quantity=" + (quantity != null ? quantity.toString() : "null") + ", ");
    buffer.write("cartItemsId=" + "$cartItemsId");
    buffer.write("}");

    return buffer.toString();
  }

  CartItem copyWith(
      {String id,
      GeneratedProduct product,
      ProductVariant variant,
      int quantity,
      String cartItemsId}) {
    return CartItem(
        id: id ?? this.id,
        product: product ?? this.product,
        variant: variant ?? this.variant,
        quantity: quantity ?? this.quantity,
        cartItemsId: cartItemsId ?? this.cartItemsId);
  }

  CartItem.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        product = json['product'] != null
            ? GeneratedProduct.fromJson(
                new Map<String, dynamic>.from(json['product']))
            : null,
        variant = json['variant'] != null
            ? ProductVariant.fromJson(
                new Map<String, dynamic>.from(json['variant']))
            : null,
        quantity = json['quantity'],
        cartItemsId = json['cartItemsId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'product': product?.toJson(),
        'variant': variant?.toJson(),
        'quantity': quantity,
        'cartItemsId': cartItemsId
      };

  static final QueryField ID = QueryField(fieldName: "cartItem.id");
  static final QueryField PRODUCT = QueryField(
      fieldName: "product",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (GeneratedProduct).toString()));
  static final QueryField VARIANT = QueryField(
      fieldName: "variant",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ProductVariant).toString()));
  static final QueryField QUANTITY = QueryField(fieldName: "quantity");
  static final QueryField CARTITEMSID = QueryField(fieldName: "cartItemsId");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "CartItem";
    modelSchemaDefinition.pluralName = "CartItems";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: CartItem.PRODUCT,
        isRequired: true,
        targetName: "cartItemProductId",
        ofModelName: (GeneratedProduct).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: CartItem.VARIANT,
        isRequired: true,
        targetName: "cartItemVariantId",
        ofModelName: (ProductVariant).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: CartItem.QUANTITY,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: CartItem.CARTITEMSID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class CartItemType extends ModelType<CartItem> {
  const CartItemType();

  @override
  CartItem fromJson(Map<String, dynamic> jsonData) {
    return CartItem.fromJson(jsonData);
  }
}
