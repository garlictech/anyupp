import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

import 'ProductVariant.dart';

part 'VariantItems.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
class VariantItems extends $VariantItems {
  final List<ProductVariant> items;

  VariantItems({
    required this.items,
  });

  factory VariantItems.fromJson(Map<String, dynamic> json) =>
      _$VariantItemsFromJson(json);

  Map<String, dynamic> toJson() => _$VariantItemsToJson(this);
}
