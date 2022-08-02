import '/models.dart';

import 'package:json_annotation/json_annotation.dart';
import 'package:functional_data/functional_data.dart';

part 'GeneratedProductCategory.g.dart';

@FunctionalData()
@JsonSerializable()
class GeneratedProductCategory extends $GeneratedProductCategory {
  final String id;
  final String productCategoryId;
  final int? productNum;
  final String ownerEntity;
  final ProductCategory productCategory;
  final String? updatedAt;
  final String? createdAt;

  GeneratedProductCategory({
    required this.id,
    required this.productCategoryId,
    this.productNum,
    required this.ownerEntity,
    required this.productCategory,
    this.updatedAt,
    this.createdAt,
  });

  factory GeneratedProductCategory.fromJson(Map<String, dynamic> json) =>
      _$GeneratedProductCategoryFromJson(json);

  Map<String, dynamic> toJson() => _$GeneratedProductCategoryToJson(this);
}
