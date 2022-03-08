import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class GeneratedProductConfigComponent {
  final String productComponentId;
  final double price;
  final int? position;
  final LocalizedItem name;
  final List<Allergen>? allergens;
  final double? netPackagingFee;
  final bool soldOut;
  final String? externalId;

  GeneratedProductConfigComponent({
    required this.productComponentId,
    required this.price,
    this.position,
    required this.name,
    this.allergens,
    this.netPackagingFee,
    this.soldOut = false,
    this.externalId,
  });

  GeneratedProductConfigComponent copyWith({
    String? productComponentId,
    double? price,
    int? position,
    LocalizedItem? name,
    List<Allergen>? allergens,
    double? netPackagingFee,
    bool? soldOut,
    String? externalId,
  }) {
    return GeneratedProductConfigComponent(
      productComponentId: productComponentId ?? this.productComponentId,
      price: price ?? this.price,
      position: position ?? this.position,
      name: name ?? this.name,
      allergens: allergens ?? this.allergens,
      netPackagingFee: netPackagingFee ?? this.netPackagingFee,
      soldOut: soldOut ?? this.soldOut,
      externalId: externalId ?? this.externalId,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productComponentId': productComponentId,
      'price': price,
      'position': position,
      'name': name.toJson(),
      'allergens': allergens?.map((x) => enumToString(x)).toList(),
      'netPackagingFee': netPackagingFee,
      'soldOut': soldOut,
      'externalId': externalId,
    };
  }

  factory GeneratedProductConfigComponent.fromJson(Map<String, dynamic> map) {
    return GeneratedProductConfigComponent(
      productComponentId: map['productComponentId'],
      price: map['price'],
      position: map['position'],
      netPackagingFee: map['netPackagingFee'],
      name: LocalizedItem.fromJson(map['name']),
      externalId: map['externalId'],
      allergens: map['allergens'] != null
          ? List<Allergen>.from(
              map['allergens']?.map((x) => enumFromString(x, Allergen.values)))
          : null,
      soldOut: map['soldOut'] ?? false,
    );
  }

  @override
  String toString() {
    return 'GeneratedProductConfigComponent(productComponentId: $productComponentId, externalId: $externalId, price: $price, soldOut: $soldOut, netPackagingFee: $netPackagingFee, position: $position, name: $name, allergens: $allergens)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is GeneratedProductConfigComponent &&
        other.productComponentId == productComponentId &&
        other.price == price &&
        other.position == position &&
        other.name == name &&
        other.netPackagingFee == netPackagingFee &&
        other.soldOut == soldOut &&
        other.externalId == externalId &&
        listEquals(other.allergens, allergens);
  }

  @override
  int get hashCode {
    return productComponentId.hashCode ^
        price.hashCode ^
        position.hashCode ^
        name.hashCode ^
        netPackagingFee.hashCode ^
        allergens.hashCode ^
        soldOut.hashCode ^
        externalId.hashCode;
  }
}
