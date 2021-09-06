import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';

class GeneratedProduct {
  final String id;
  final String unitId;
  final String productCategoryId;
  final LocalizedItem name;
  final LocalizedItem? description;
  final String productType;
  final int tax;
  final int position;
  final String? image;
  final List<ProductVariant> variants;
  final List<String>? allergens; // TODO ez miert String? Allergen kene
  final List<GeneratedProductConfigSet>? configSets;
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
  });

  GeneratedProduct copyWith({
    String? id,
    String? unitId,
    String? productCategoryId,
    LocalizedItem? name,
    LocalizedItem? description,
    String? productType,
    int? tax,
    int? position,
    String? image,
    List<ProductVariant>? variants,
    List<String>? allergens,
    List<GeneratedProductConfigSet>? configSets,
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
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'unitId': unitId,
      'productCategoryId': productCategoryId,
      'name': name.toJson(),
      'description': description?.toJson(),
      'productType': productType,
      'tax': tax,
      'position': position,
      'image': image,
      'variants': variants.map((x) => x.toJson()).toList(),
      'allergens': allergens?.map((x) => enumToString(x)).toList(),
      'configSets': configSets?.map((x) => x.toJson()).toList(),
    };
  }

  factory GeneratedProduct.fromJson(Map<String, dynamic> map) {
    return GeneratedProduct(
      id: map['id'],
      unitId: map['unitId'],
      productCategoryId: map['productCategoryId'],
      name: LocalizedItem.fromJson(map['name']),
      description: map['description'] != null ? LocalizedItem.fromJson(map['description']) : null,
      productType: map['productType'],
      tax: map['tax'],
      position: map['position'],
      image: map['image'],
      variants: List<ProductVariant>.from(map['variants']?.map((x) => ProductVariant.fromJson(x))),
      allergens: map['allergens'] != null ? List<String>.from(map['allergens']?.map((x) => x as String)) : null,
      configSets: map['configSets'] != null
          ? List<GeneratedProductConfigSet>.from(map['configSets']?.map((x) => GeneratedProductConfigSet?.fromJson(x)))
          : null,
    );
  }

  @override
  String toString() {
    return 'GeneratedProduct(id: $id, unitId: $unitId, productCategoryId: $productCategoryId, name: $name, description: $description, productType: $productType, tax: $tax, position: $position, image: $image, variants: $variants, allergens: $allergens, configSets: $configSets)';
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
        listEquals(other.variants, variants) &&
        listEquals(other.allergens, allergens) &&
        listEquals(other.configSets, configSets);
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
        configSets.hashCode;
  }
}
