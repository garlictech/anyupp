import '/models.dart';
import '/graphql/generated/crud-api.dart';
import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'GeneratedProduct.g.dart';

@FunctionalData()
class GeneratedProduct extends $GeneratedProduct {
  @override
  final String id;
  @override
  final String unitId;
  @override
  final String productCategoryId;
  @override
  final LocalizedItem name;
  @override
  final LocalizedItem? description;
  @override
  final ProductType productType;
  @override
  final int tax;
  @override
  final int position;
  @override
  final String? image;
  @override
  final List<ProductVariant> variants;
  @override
  final List<Allergen>? allergens;
  @override
  final List<GeneratedProductConfigSet>? configSets;
  @override
  final List<ServingMode> supportedServingModes;
  @override
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

  @override
  String toString() {
    return 'GeneratedProduct(id: $id, unitId: $unitId, supportedServingModes: $supportedServingModes, soldOut: $soldOut, productCategoryId: $productCategoryId, name: $name, description: $description, productType: $productType, tax: $tax, position: $position, image: $image, variants: $variants, allergens: $allergens, configSets: $configSets)';
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
}
