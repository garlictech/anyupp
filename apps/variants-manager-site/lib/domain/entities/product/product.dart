import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:variants_manager_site/domain/entities/variant/variant.dart';

part 'product.g.dart';

@FunctionalData()
@JsonSerializable()
class Product extends $Product {
  @override
  final String id;
  @override
  final List<Variant> variants;
  @override
  final String name;

  Product({required this.id, required this.variants, required this.name});

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);

  Map<String, dynamic> toJson() => _$ProductToJson(this);
}
