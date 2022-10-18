import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

import 'ProductConfigComponent.dart';

part 'ProductConfigSet.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
class ProductConfigSet extends $ProductConfigSet {
  final String productSetId;
  final int position;
  final List<ProductConfigComponent> items;

  ProductConfigSet({
    required this.productSetId,
    required this.position,
    required this.items,
  });

  factory ProductConfigSet.fromJson(Map<String, dynamic> json) => _$ProductConfigSetFromJson(json);

  Map<String, dynamic> toJson() => _$ProductConfigSetToJson(this);

}
