import 'package:json_annotation/json_annotation.dart';
import 'package:functional_data/functional_data.dart';

import 'LocalizedItem.dart';

part 'ProductCategory.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
class ProductCategory extends $ProductCategory {
  final String id;
  final String ownerEntity;
  /*final temp todo*/ String? parentId;
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
  }) {
    // temp todo
    if ("seeded_product_category_c1_3_id" == id) {
      parentId = "seeded_product_category_c1_2_id";
    };
    if ("seeded_product_category_c1_4_id" == id) {
      parentId = "seeded_product_category_c1_2_id";
    };
  }

  factory ProductCategory.fromJson(Map<String, dynamic> json) =>
      _$ProductCategoryFromJson(json);

  Map<String, dynamic> toJson() => _$ProductCategoryToJson(this);
}
