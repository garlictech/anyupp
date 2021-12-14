import 'package:flutter/foundation.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

@immutable
class GeneratedProductConfigComponent {
  final String productComponentId;
  final double price;
  final int? position;
  final LocalizedItem name;
  final List<Allergen>? allergens;
  final double? packagingFee;

  GeneratedProductConfigComponent({
    required this.productComponentId,
    required this.price,
    this.position,
    required this.name,
    this.allergens,
    this.packagingFee,
  });

  GeneratedProductConfigComponent copyWith({
    String? productComponentId,
    double? price,
    int? position,
    LocalizedItem? name,
    List<Allergen>? allergens,
    double? packagingFee,
  }) {
    return GeneratedProductConfigComponent(
      productComponentId: productComponentId ?? this.productComponentId,
      price: price ?? this.price,
      position: position ?? this.position,
      name: name ?? this.name,
      allergens: allergens ?? this.allergens,
      packagingFee: packagingFee ?? this.packagingFee,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productComponentId': productComponentId,
      'price': price,
      'position': position,
      'name': name.toJson(),
      'allergens': allergens?.map((x) => enumToString(x)).toList(),
      'packagingFee': packagingFee,
    };
  }

  factory GeneratedProductConfigComponent.fromJson(Map<String, dynamic> map) {
    return GeneratedProductConfigComponent(
      productComponentId: map['productComponentId'],
      price: map['price'],
      position: map['position'],
      packagingFee: map['packagingFee'],
      name: LocalizedItem.fromJson(map['name']),
      allergens: List<Allergen>.from(
          map['allergens']?.map((x) => enumFromString(x, Allergen.values))),
    );
  }

  @override
  String toString() {
    return 'GeneratedProductConfigComponent(productComponentId: $productComponentId, price: $price, packagingFee: $packagingFee, position: $position, name: $name, allergens: $allergens)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is GeneratedProductConfigComponent &&
        other.productComponentId == productComponentId &&
        other.price == price &&
        other.position == position &&
        other.name == name &&
        other.packagingFee == packagingFee &&
        listEquals(other.allergens, allergens);
  }

  @override
  int get hashCode {
    return productComponentId.hashCode ^
        price.hashCode ^
        position.hashCode ^
        name.hashCode ^
        packagingFee.hashCode ^
        allergens.hashCode;
  }
}
