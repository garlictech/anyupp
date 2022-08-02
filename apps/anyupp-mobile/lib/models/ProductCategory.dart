import '/models.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:functional_data/functional_data.dart';

part 'ProductCategory.g.dart';

@FunctionalData()
@JsonSerializable()
class ProductCategory extends $ProductCategory {
  final String id;
  final String ownerEntity;
  final String? parentId;
  final LocalizedItem name;
  final LocalizedItem? description;
  final String? image;
  final int position;

  ProductCategory({
    required this.id,
    required this.ownerEntity,
    required this.name,
    this.description,
    this.image,
    this.parentId,
    required this.position,
  });

  factory ProductCategory.fromJson(Map<String, dynamic> json) =>
      _$ProductCategoryFromJson(json);

  Map<String, dynamic> toJson() => _$ProductCategoryToJson(this);
}
