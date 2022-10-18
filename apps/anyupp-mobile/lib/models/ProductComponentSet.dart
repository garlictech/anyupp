import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

import '/graphql/generated/crud-api.dart';
import 'LocalizedItem.dart';

part 'ProductComponentSet.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
class ProductComponentSet extends $ProductComponentSet {
  final String id;
  final ProductComponentSetType type;
  final LocalizedItem name;
  final List<String> items;
  final int? maxSelection;
  final List<ServingMode>? supportedServingModes;

  ProductComponentSet({
    required this.id,
    required this.name,
    required this.type,
    this.maxSelection,
    required this.items,
    this.supportedServingModes,
  });

  factory ProductComponentSet.fromJson(Map<String, dynamic> json) => _$ProductComponentSetFromJson(json);

  Map<String, dynamic> toJson() => _$ProductComponentSetToJson(this);

}
