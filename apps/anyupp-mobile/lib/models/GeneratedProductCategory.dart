import 'dart:convert';

import 'package:fa_prev/models/ProductCategory.dart';
import 'package:flutter/foundation.dart';

@immutable
class GeneratedProductCategory {
  final String updatedAt;
  final String createdAt;
  final String id;
  final String productCategoryId;
  final int productNum;
  final String unitId;
  final ProductCategory productCategory;
  GeneratedProductCategory({
     this.updatedAt,
     this.createdAt,
     this.id,
     this.productCategoryId,
     this.productNum,
     this.unitId,
     this.productCategory,
  });

  GeneratedProductCategory copyWith({
    String updatedAt,
    String createdAt,
    String id,
    String productCategoryId,
    int productNum,
    String unitId,
    ProductCategory  productCategory,
  }) {
    return GeneratedProductCategory(
      updatedAt: updatedAt ?? this.updatedAt,
      createdAt: createdAt ?? this.createdAt,
      id: id ?? this.id,
      productCategoryId: productCategoryId ?? this.productCategoryId,
      productNum: productNum ?? this.productNum,
      unitId: unitId ?? this.unitId,
      productCategory: productCategory ?? this.productCategory,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'updatedAt': updatedAt,
      'createdAt': createdAt,
      'id': id,
      'productCategoryId': productCategoryId,
      'productNum': productNum,
      'unitId': unitId,
      'productCategory': productCategory,
    };
  }

  factory GeneratedProductCategory.fromMap(Map<String, dynamic> map) {
    return GeneratedProductCategory(
      updatedAt: map['updatedAt'],
      createdAt: map['createdAt'],
      id: map['id'],
      productCategoryId: map['productCategoryId'],
      productNum: map['productNum'],
      unitId: map['unitId'],
      productCategory: map['productCategory'] != null
            ?  ProductCategory.fromJson(Map<String, dynamic>.from(map['productCategory']))
            : null
    );
  }

  String toJson() => json.encode(toMap());

  factory GeneratedProductCategory.fromJson(String source) => GeneratedProductCategory.fromMap(json.decode(source));

  @override
  String toString() {
    return 'GeneratedProductCategory(updatedAt: $updatedAt, createdAt: $createdAt, id: $id, productCategoryId: $productCategoryId, productNum: $productNum, unitId: $unitId, productCategory: $productCategory)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
  
    return other is GeneratedProductCategory &&
      other.updatedAt == updatedAt &&
      other.createdAt == createdAt &&
      other.id == id &&
      other.productCategoryId == productCategoryId &&
      other.productNum == productNum &&
      other.unitId == unitId &&
      productCategory == other.productCategory;
  }

  @override
  int get hashCode {
    return updatedAt.hashCode ^
      createdAt.hashCode ^
      id.hashCode ^
      productCategoryId.hashCode ^
      productNum.hashCode ^
      unitId.hashCode ^
      productCategory.hashCode;
  }
}
