import '/models.dart';

import 'package:flutter/foundation.dart';

@immutable
class GeneratedProductCategory {
  final String id;
  final String productCategoryId;
  final int? productNum;
  final String unitId;
  final ProductCategory productCategory;
  final String? updatedAt;
  final String? createdAt;

  GeneratedProductCategory({
    required this.id,
    required this.productCategoryId,
    this.productNum,
    required this.unitId,
    required this.productCategory,
    this.updatedAt,
    this.createdAt,
  });

  GeneratedProductCategory copyWith({
    String? id,
    String? productCategoryId,
    int? productNum,
    String? unitId,
    ProductCategory? productCategory,
    String? updatedAt,
    String? createdAt,
  }) {
    return GeneratedProductCategory(
      id: id ?? this.id,
      productCategoryId: productCategoryId ?? this.productCategoryId,
      productNum: productNum ?? this.productNum,
      unitId: unitId ?? this.unitId,
      productCategory: productCategory ?? this.productCategory,
      updatedAt: updatedAt ?? this.updatedAt,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productCategoryId': productCategoryId,
      'productNum': productNum,
      'unitId': unitId,
      'productCategory': productCategory.toJson(),
      'updatedAt': updatedAt,
      'createdAt': createdAt,
    };
  }

  factory GeneratedProductCategory.fromJson(Map<String, dynamic> map) {
    return GeneratedProductCategory(
      id: map['id'],
      productCategoryId: map['productCategoryId'],
      productNum: map['productNum'],
      unitId: map['unitId'],
      productCategory: ProductCategory.fromJson(map['productCategory']),
      updatedAt: map['updatedAt'],
      createdAt: map['createdAt'],
    );
  }

  @override
  String toString() {
    return 'GeneratedProductCategory(id: $id, productCategoryId: $productCategoryId, productNum: $productNum, unitId: $unitId, productCategory: $productCategory, updatedAt: $updatedAt, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is GeneratedProductCategory &&
        other.id == id &&
        other.productCategoryId == productCategoryId &&
        other.productNum == productNum &&
        other.unitId == unitId &&
        other.productCategory == productCategory &&
        other.updatedAt == updatedAt &&
        other.createdAt == createdAt;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        productCategoryId.hashCode ^
        productNum.hashCode ^
        unitId.hashCode ^
        productCategory.hashCode ^
        updatedAt.hashCode ^
        createdAt.hashCode;
  }
}
