import '/graphql/generated/crud-api.dart';
import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

import 'LocalizedItem.dart';
import 'ProductConfigSet.dart';
import 'ProductVariant.dart';

part 'Product.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
class Product extends $Product {
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
  final List<ProductConfigSet>? configSets;
  @override
  final List<ServingMode> supportedServingModes;
  @override
  final bool soldOut;

  Product({
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

  factory Product.fromJson(Map<String, dynamic> json) => _$ProductFromJson(json);

  Map<String, dynamic> toJson() => _$ProductToJson(this);
}
