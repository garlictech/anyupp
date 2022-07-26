import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'GeneratedProduct.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
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
}
