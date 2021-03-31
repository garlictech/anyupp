import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class FavoriteProduct extends Model {
  final String id;
  final String userId;
  final String unitId;
  final GeneratedProduct product;

  @override
  String getId() {
    return id;
  }

  const FavoriteProduct._internal(
      {@required this.id,
      @required this.userId,
      @required this.unitId,
      this.product});

  factory FavoriteProduct(
      {String id,
      @required String userId,
      @required String unitId,
      GeneratedProduct product}) {
    return FavoriteProduct._internal(
        id: id == null ? UUID.getUUID() : id,
        userId: userId,
        unitId: unitId,
        product: product);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FavoriteProduct &&
        id == other.id &&
        userId == other.userId &&
        unitId == other.unitId &&
        product == other.product;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("FavoriteProduct {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("userId=" + "$userId" + ", ");
    buffer.write("unitId=" + "$unitId" + ", ");
    buffer.write("product=" + (product != null ? product.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  FavoriteProduct copyWith(
      {String id, String userId, String unitId, GeneratedProduct product}) {
    return FavoriteProduct(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        unitId: unitId ?? this.unitId,
        product: product ?? this.product);
  }

  FavoriteProduct.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        userId = json['userId'],
        unitId = json['unitId'],
        product = json['product'] != null
            ? GeneratedProduct.fromJson(
                Map<String, dynamic>.from(json['product']))
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'unitId': unitId,
        'product': product?.toJson()
      };
}
