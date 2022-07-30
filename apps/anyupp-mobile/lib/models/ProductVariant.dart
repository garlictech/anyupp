import '/models.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:functional_data/functional_data.dart';

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
  final bool soldOut;
  final String? externalId;

  ProductVariant(
      {this.id,
      required this.variantName,
      this.pack,
      required this.price,
      required this.position,
      this.netPackagingFee,
      required this.soldOut,
      this.externalId});
}
