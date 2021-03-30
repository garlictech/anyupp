import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class GeneratedProduct extends Model {
  final String id;
  final String unitId;
  final String productCategoryId;
  final LocalizedItem name;
  final LocalizedItem description;
  final String productType;
  final int tax;
  final int position;
  final String image;
  final List<ProductVariant> variants;

  @override
  String getId() {
    return id;
  }

  const GeneratedProduct._internal(
      {@required this.id,
      @required this.unitId,
      @required this.productCategoryId,
      this.name,
      this.description,
      this.productType,
      this.tax,
      this.position,
      this.image,
      this.variants});

  factory GeneratedProduct(
      {String id,
      @required String unitId,
      @required String productCategoryId,
      LocalizedItem name,
      LocalizedItem description,
      String productType,
      int tax,
      int position,
      String image,
      List<ProductVariant> variants}) {
    return GeneratedProduct._internal(
        id: id == null ? UUID.getUUID() : id,
        unitId: unitId,
        productCategoryId: productCategoryId,
        name: name,
        description: description,
        productType: productType,
        tax: tax,
        position: position,
        image: image,
        variants: variants != null ? List.unmodifiable(variants) : variants);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GeneratedProduct &&
        id == other.id &&
        unitId == other.unitId &&
        productCategoryId == other.productCategoryId &&
        name == other.name &&
        description == other.description &&
        productType == other.productType &&
        tax == other.tax &&
        position == other.position &&
        image == other.image &&
        DeepCollectionEquality().equals(variants, other.variants);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("GeneratedProduct {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("unitId=" + "$unitId" + ", ");
    buffer.write("productCategoryId=" + "$productCategoryId" + ", ");
    buffer.write("name=" + (name != null ? name.toString() : "null") + ", ");
    buffer.write("description=" +
        (description != null ? description.toString() : "null") +
        ", ");
    buffer.write("productType=" + "$productType" + ", ");
    buffer.write("tax=" + (tax != null ? tax.toString() : "null") + ", ");
    buffer.write(
        "position=" + (position != null ? position.toString() : "null") + ", ");
    buffer.write("image=" + "$image");
    buffer.write("}");

    return buffer.toString();
  }

  GeneratedProduct copyWith(
      {String id,
      String unitId,
      String productCategoryId,
      LocalizedItem name,
      LocalizedItem description,
      String productType,
      int tax,
      int position,
      String image,
      List<ProductVariant> variants}) {
    return GeneratedProduct(
        id: id ?? this.id,
        unitId: unitId ?? this.unitId,
        productCategoryId: productCategoryId ?? this.productCategoryId,
        name: name ?? this.name,
        description: description ?? this.description,
        productType: productType ?? this.productType,
        tax: tax ?? this.tax,
        position: position ?? this.position,
        image: image ?? this.image,
        variants: variants ?? this.variants);
  }

  GeneratedProduct.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        unitId = json['unitId'],
        productCategoryId = json['productCategoryId'],
        name = json['name'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['name']))
            : null,
        description = json['description'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['description']))
            : null,
        productType = json['productType'],
        tax = json['tax'],
        position = json['position'],
        image = json['image'],
        variants = json['variants'] is List
            ? (json['variants'] as List)
                .map((e) =>
                    ProductVariant.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'unitId': unitId,
        'productCategoryId': productCategoryId,
        'name': name?.toJson(),
        'description': description?.toJson(),
        'productType': productType,
        'tax': tax,
        'position': position,
        'image': image,
        'variants': variants?.map((e) => e?.toJson())?.toList()
      };
}
