import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

@immutable
class GeneratedProduct {
  final String id;
  final String unitId;
  final String productCategoryId;
  final LocalizedItem name;
  final LocalizedItem? description;
  final ProductType productType;
  final int tax;
  final int position;
  final String? image;
  final List<ProductVariant> variants;
  final List<Allergen>? allergens;
  final List<GeneratedProductConfigSet>? configSets;
  final List<ServingMode> supportedServingModes;
  final bool soldOut;

  GeneratedProduct({
    required this.id,
    required this.unitId,
    required this.productCategoryId,
    required this.name,
    this.description,
    required this.productType,
    required this.tax,
    required this.position,
    this.image,
    required this.variants,
    this.allergens,
    this.configSets,
    required this.supportedServingModes,
    this.soldOut = false,
  });

  GeneratedProduct copyWith({
    String? id,
    String? unitId,
    String? productCategoryId,
    LocalizedItem? name,
    LocalizedItem? description,
    ProductType? productType,
    int? tax,
    int? position,
    String? image,
    List<ProductVariant>? variants,
    List<Allergen>? allergens,
    List<GeneratedProductConfigSet>? configSets,
    List<ServingMode>? supportedServingModes,
    bool? soldOut,
  }) {
    return GeneratedProduct(
      id: id ?? this.id,
      unitId: unitId ?? this.unitId,
      productCategoryId: productCategoryId ?? this.productCategoryId,
      name: name ?? this.name,
      description: description ?? this.description,
      productType: productType ?? this.productType,
      tax: tax ?? this.tax,
      position: position ?? this.position,
      image: image ?? this.image,
      variants: variants ?? this.variants,
      allergens: allergens ?? this.allergens,
      configSets: configSets ?? this.configSets,
      supportedServingModes:
          supportedServingModes ?? this.supportedServingModes,
      soldOut: soldOut ?? this.soldOut,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'unitId': unitId,
      'productCategoryId': productCategoryId,
      'name': name.toJson(),
      'description': description?.toJson(),
      'productType': enumToString(productType),
      'tax': tax,
      'position': position,
      'image': image,
      'variants': variants.map((x) => x.toJson()).toList(),
      'allergens': allergens,
      'configSets': configSets?.map((x) => x.toJson()).toList(),
      'supportedServingModes':
          supportedServingModes.map((x) => enumToString(x)).toList(),
      'soldOut': soldOut,
    };
  }

  factory GeneratedProduct.fromJson(Map<String, dynamic> map) {
    return GeneratedProduct(
      id: map['id'],
      unitId: map['unitId'],
      productCategoryId: map['productCategoryId'],
      name: LocalizedItem.fromJson(map['name']),
      description: map['description'] != null
          ? LocalizedItem.fromJson(map['description'])
          : null,
      productType: enumFromString(map['productType'], ProductType.values),
      tax: map['tax'],
      position: map['position'],
      image: map['image'],
      variants: List<ProductVariant>.from(
          map['variants']?.map((x) => ProductVariant.fromJson(x))),
      allergens: map['allergens'] != null
          ? List<Allergen>.from(
              map['allergens']?.map((x) => enumFromString(x, Allergen.values)))
          : null,
      configSets: map['configSets'] != null
          ? List<GeneratedProductConfigSet>.from(map['configSets']
              ?.map((x) => GeneratedProductConfigSet?.fromJson(x)))
          : null,
      supportedServingModes: map['supportedServingModes'] != null
          ? List<ServingMode>.from(
              map['supportedServingModes']?.map(
                (x) => enumFromString(
                  x,
                  ServingMode.values,
                ),
              ),
            )
          : [],
      soldOut: map['soldOut'] ?? false,
    );
  }

  @override
  String toString() {
    return 'GeneratedProduct(id: $id, unitId: $unitId, supportedServingModes: $supportedServingModes, soldOut: $soldOut, productCategoryId: $productCategoryId, name: $name, description: $description, productType: $productType, tax: $tax, position: $position, image: $image, variants: $variants, allergens: $allergens, configSets: $configSets)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    final listEquals = const DeepCollectionEquality().equals;

    return other is GeneratedProduct &&
        other.id == id &&
        other.unitId == unitId &&
        other.productCategoryId == productCategoryId &&
        other.name == name &&
        other.description == description &&
        other.productType == productType &&
        other.tax == tax &&
        other.position == position &&
        other.image == image &&
        other.soldOut == soldOut &&
        listEquals(other.variants, variants) &&
        listEquals(other.allergens, allergens) &&
        listEquals(other.configSets, configSets) &&
        listEquals(other.supportedServingModes, supportedServingModes);
  }

  @override
  int get hashCode {
    return id.hashCode ^
        unitId.hashCode ^
        productCategoryId.hashCode ^
        name.hashCode ^
        description.hashCode ^
        productType.hashCode ^
        tax.hashCode ^
        position.hashCode ^
        image.hashCode ^
        variants.hashCode ^
        allergens.hashCode ^
        configSets.hashCode ^
        supportedServingModes.hashCode ^
        soldOut.hashCode;
  }
}
