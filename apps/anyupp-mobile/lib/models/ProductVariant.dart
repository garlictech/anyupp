import 'package:json_annotation/json_annotation.dart';
import 'package:functional_data/functional_data.dart';

import 'LocalizedItem.dart';
import 'ProductVariantPack.dart';

part 'ProductVariant.g.dart';

@FunctionalData()
@JsonSerializable()
class ProductVariant extends $ProductVariant {
  final String? id;
  final LocalizedItem variantName;
  final ProductVariantPack? pack;
  final double price;
  final int position;
  final double? netPackagingFee;
  final bool? soldOut;
  final bool isAvailable;
  final String? externalId;

  ProductVariant(
      {this.id,
      required this.variantName,
      this.pack,
      required this.price,
      required this.position,
      this.netPackagingFee,
      this.soldOut,
      required this.isAvailable,
      this.externalId});

  factory ProductVariant.fromJson(Map<String, dynamic> json) =>
      _$ProductVariantFromJson(json);

  Map<String, dynamic> toJson() => _$ProductVariantToJson(this);
}
