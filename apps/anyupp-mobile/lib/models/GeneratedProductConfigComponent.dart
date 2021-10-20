import 'package:flutter/foundation.dart';
import 'package:fa_prev/models.dart';

@immutable
class GeneratedProductConfigComponent {
  final String productComponentId;
  final double price;
  final int? position;
  final LocalizedItem name;
  final List<Allergen>? allergens;

  GeneratedProductConfigComponent({
    required this.productComponentId,
    required this.price,
    this.position,
    required this.name,
    this.allergens,
  });

  GeneratedProductConfigComponent copyWith({
    String? productComponentId,
    double? price,
    int? position,
    LocalizedItem? name,
    List<Allergen>? allergens,
  }) {
    return GeneratedProductConfigComponent(
      productComponentId: productComponentId ?? this.productComponentId,
      price: price ?? this.price,
      position: position ?? this.position,
      name: name ?? this.name,
      allergens: allergens ?? this.allergens,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productComponentId': productComponentId,
      'price': price,
      'position': position,
      'name': name.toJson(),
      'allergens': allergens?.map((x) => x.toString()).toList(),
    };
  }

  factory GeneratedProductConfigComponent.fromJson(Map<String, dynamic> map) {
    return GeneratedProductConfigComponent(
      productComponentId: map['productComponentId'],
      price: map['price'],
      position: map['position'],
      name: LocalizedItem.fromJson(map['name']),
      allergens: List<Allergen>.from(map['allergens']?.map((x) => enumFromString(x, Allergen.values))),
    );
  }

  @override
  String toString() {
    return 'GeneratedProductConfigComponent(productComponentId: $productComponentId, price: $price, position: $position, name: $name, allergens: $allergens)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is GeneratedProductConfigComponent &&
        other.productComponentId == productComponentId &&
        other.price == price &&
        other.position == position &&
        other.name == name &&
        listEquals(other.allergens, allergens);
  }

  @override
  int get hashCode {
    return productComponentId.hashCode ^ price.hashCode ^ position.hashCode ^ name.hashCode ^ allergens.hashCode;
  }
}
