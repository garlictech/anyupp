import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class ProductVariant {
  final String? id;
  final LocalizedItem variantName;
  final ProductVariantPack? pack;
  final double price;
  final int position;
  // final List<Availability> availabilities; // TODO ez nem kell?
  // final String generatedProductVariantsId; // TODO ez mi?

  ProductVariant({
    this.id,
    required this.variantName,
    this.pack,
    required this.price,
    required this.position,
  });

  ProductVariant copyWith({
    String? id,
    LocalizedItem? variantName,
    ProductVariantPack? pack,
    double? price,
    int? position,
  }) {
    return ProductVariant(
      id: id ?? this.id,
      variantName: variantName ?? this.variantName,
      pack: pack ?? this.pack,
      price: price ?? this.price,
      position: position ?? this.position,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'variantName': variantName.toJson(),
      'pack': pack?.toJson(),
      'price': price,
      'position': position,
    };
  }

  factory ProductVariant.fromJson(Map<String, dynamic> map) {
    return ProductVariant(
      id: map['id'],
      variantName: LocalizedItem.fromJson(map['variantName']),
      pack: map['pack'] != null ? ProductVariantPack.fromJson(map['pack']) : null,
      price: map['price'],
      position: map['position'],
    );
  }

  @override
  String toString() {
    return 'ProductVariant(id: $id, variantName: $variantName, pack: $pack, price: $price, position: $position)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ProductVariant &&
        other.id == id &&
        other.variantName == variantName &&
        other.pack == pack &&
        other.price == price &&
        other.position == position;
  }

  @override
  int get hashCode {
    return id.hashCode ^ variantName.hashCode ^ pack.hashCode ^ price.hashCode ^ position.hashCode;
  }
}
