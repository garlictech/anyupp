import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class ProductVariant {
  final String? id;
  final LocalizedItem variantName;
  final ProductVariantPack? pack;
  final double price;
  final int position;
  final double? packagingFee;

  ProductVariant({
    this.id,
    required this.variantName,
    this.pack,
    required this.price,
    required this.position,
    this.packagingFee,
  });

  ProductVariant copyWith({
    String? id,
    LocalizedItem? variantName,
    ProductVariantPack? pack,
    double? price,
    int? position,
    double? packagingFee,
  }) {
    return ProductVariant(
      id: id ?? this.id,
      variantName: variantName ?? this.variantName,
      pack: pack ?? this.pack,
      price: price ?? this.price,
      position: position ?? this.position,
      packagingFee: packagingFee ?? this.packagingFee,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'variantName': variantName.toJson(),
      'pack': pack?.toJson(),
      'price': price,
      'position': position,
      'packagingFee': packagingFee,
    };
  }

  factory ProductVariant.fromJson(Map<String, dynamic> map) {
    return ProductVariant(
      id: map['id'],
      variantName: LocalizedItem.fromJson(map['variantName']),
      pack:
          map['pack'] != null ? ProductVariantPack.fromJson(map['pack']) : null,
      price: map['price'],
      position: map['position'],
      packagingFee: map['packagingFee'],
    );
  }

  @override
  String toString() {
    return 'ProductVariant(id: $id, variantName: $variantName, packagingFee: $packagingFee, pack: $pack, price: $price, position: $position)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ProductVariant &&
        other.id == id &&
        other.variantName == variantName &&
        other.pack == pack &&
        other.price == price &&
        other.position == position &&
        other.packagingFee == packagingFee;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        variantName.hashCode ^
        pack.hashCode ^
        price.hashCode ^
        position.hashCode ^
        packagingFee.hashCode;
  }
}
