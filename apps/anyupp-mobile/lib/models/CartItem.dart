import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';

@immutable
class CartItem extends Model {
  final String id;
  final GeneratedProduct product;
  final ProductVariant variant;
  final int quantity;
  final String cartItemsId;

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
    var buffer = StringBuffer();

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
                Map<String, dynamic>.from(json['product']))
            : null,
        variant = json['variant'] != null
            ? ProductVariant.fromJson(
                Map<String, dynamic>.from(json['variant']))
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
}
