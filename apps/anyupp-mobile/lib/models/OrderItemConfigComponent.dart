import 'package:flutter/foundation.dart';
import 'package:fa_prev/models.dart';

@immutable
class OrderItemConfigComponent {
  final String productComponentId;
  final double price;
  final LocalizedItem name;
  final List<Allergen>? allergens;
  OrderItemConfigComponent({
    required this.productComponentId,
    required this.price,
    required this.name,
    this.allergens,
  });

  OrderItemConfigComponent copyWith({
    String? productComponentId,
    double? price,
    LocalizedItem? name,
    List<Allergen>? allergens,
  }) {
    return OrderItemConfigComponent(
      productComponentId: productComponentId ?? this.productComponentId,
      price: price ?? this.price,
      name: name ?? this.name,
      allergens: allergens ?? this.allergens,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productComponentId': productComponentId,
      'price': price,
      'name': name.toJson(),
      'allergens': allergens?.map((x) => x.toString()).toList(),
    };
  }

  factory OrderItemConfigComponent.fromJson(Map<String, dynamic> map) {
    return OrderItemConfigComponent(
      productComponentId: map['productComponentId'],
      price: map['price'],
      name: LocalizedItem.fromJson(map['name']),
      allergens: map['allergens'] != null
          ? List<Allergen>.from(map['allergens']?.map((x) => enumFromString(x, Allergen.values)))
          : null,
    );
  }

  @override
  String toString() {
    return 'OrderItemConfigComponent(productComponentId: $productComponentId, price: $price, name: $name, allergens: $allergens)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is OrderItemConfigComponent &&
        other.productComponentId == productComponentId &&
        other.price == price &&
        other.name == name &&
        listEquals(other.allergens, allergens);
  }

  @override
  int get hashCode {
    return productComponentId.hashCode ^ price.hashCode ^ name.hashCode ^ allergens.hashCode;
  }
}
