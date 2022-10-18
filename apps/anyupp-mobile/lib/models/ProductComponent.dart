import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

import '/graphql/generated/crud-api.dart';
import 'LocalizedItem.dart';

part 'ProductComponent.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
class ProductComponent extends $ProductComponent{
  final String id;
  final String ownerEntity;
  final LocalizedItem name;
  final List<Allergen>? allergens;

  ProductComponent({
    required this.id,
    required this.name,
    required this.ownerEntity,
    this.allergens,
  });

  factory ProductComponent.fromJson(Map<String, dynamic> json) => _$ProductComponentFromJson(json);

  Map<String, dynamic> toJson() => _$ProductComponentToJson(this);

}
