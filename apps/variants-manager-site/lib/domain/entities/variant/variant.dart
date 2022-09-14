import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:variants_manager_site/domain/entities/localized_item/localized_item.dart';

part 'variant.g.dart';

@FunctionalData()
@JsonSerializable()
class Variant extends $Variant {
  @override
  final String id;
  @override
  final LocalizedItem variantName;

  Variant({required this.id, required this.variantName});

  factory Variant.fromJson(Map<String, dynamic> json) =>
      _$VariantFromJson(json);

  Map<String, dynamic> toJson() => _$VariantToJson(this);
}
