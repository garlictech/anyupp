import '/models.dart';

import 'package:flutter/foundation.dart';

@immutable
class FavoriteProduct {
  final String? id;
  final String userId;
  final String unitId;
  final GeneratedProduct product;
  FavoriteProduct({
    this.id,
    required this.userId,
    required this.unitId,
    required this.product,
  });

  FavoriteProduct copyWith({
    String? id,
    String? userId,
    String? unitId,
    GeneratedProduct? product,
  }) {
    return FavoriteProduct(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      unitId: unitId ?? this.unitId,
      product: product ?? this.product,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'unitId': unitId,
      'product': product.toJson(),
    };
  }

  factory FavoriteProduct.fromJson(Map<String, dynamic> map) {
    return FavoriteProduct(
      id: map['id'],
      userId: map['userId'],
      unitId: map['unitId'],
      product: GeneratedProduct.fromJson(map['product']),
    );
  }

  @override
  String toString() {
    return 'FavoriteProduct(id: $id, userId: $userId, unitId: $unitId, product: $product)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is FavoriteProduct &&
        other.id == id &&
        other.userId == userId &&
        other.unitId == unitId &&
        other.product == product;
  }

  @override
  int get hashCode {
    return id.hashCode ^ userId.hashCode ^ unitId.hashCode ^ product.hashCode;
  }
}
