import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class ProductVariant extends Model {
  final String id;
  final LocalizedItem variantName;
  final ProductVariantPack pack;
  final bool isAvailable;
  final double price;
  final int position;
  final String generatedProductVariantsId;

  @override
  String getId() {
    return id;
  }

  const ProductVariant._internal(
      {@required this.id,
      this.variantName,
      this.pack,
      this.isAvailable,
      this.price,
      this.position,
      this.generatedProductVariantsId});

  factory ProductVariant(
      {String id,
      LocalizedItem variantName,
      ProductVariantPack pack,
      bool isAvailable,
      double price,
      int position,
      String generatedProductVariantsId}) {
    return ProductVariant._internal(
        id: id == null ? UUID.getUUID() : id,
        variantName: variantName,
        pack: pack,
        isAvailable: isAvailable,
        price: price,
        position: position,
        generatedProductVariantsId: generatedProductVariantsId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProductVariant &&
        id == other.id &&
        variantName == other.variantName &&
        pack == other.pack &&
        isAvailable == other.isAvailable &&
        price == other.price &&
        position == other.position &&
        generatedProductVariantsId == other.generatedProductVariantsId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("ProductVariant {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("variantName=" +
        (variantName != null ? variantName.toString() : "null") +
        ", ");
    buffer.write("pack=" + (pack != null ? pack.toString() : "null") + ", ");
    buffer.write("isAvailable=" +
        (isAvailable != null ? isAvailable.toString() : "null") +
        ", ");
    buffer.write("price=" + (price != null ? price.toString() : "null") + ", ");
    buffer.write(
        "position=" + (position != null ? position.toString() : "null") + ", ");
    buffer.write("generatedProductVariantsId=" + "$generatedProductVariantsId");
    buffer.write("}");

    return buffer.toString();
  }

  ProductVariant copyWith(
      {String id,
      LocalizedItem variantName,
      ProductVariantPack pack,
      bool isAvailable,
      double price,
      int position,
      String generatedProductVariantsId}) {
    return ProductVariant(
        id: id ?? this.id,
        variantName: variantName ?? this.variantName,
        pack: pack ?? this.pack,
        isAvailable: isAvailable ?? this.isAvailable,
        price: price ?? this.price,
        position: position ?? this.position,
        generatedProductVariantsId:
            generatedProductVariantsId ?? this.generatedProductVariantsId);
  }

  ProductVariant.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        variantName = json['variantName'] != null
            ? LocalizedItem.fromJson(
                Map<String, dynamic>.from(json['variantName']))
            : null,
        pack = json['pack'] != null
            ? ProductVariantPack.fromJson(
                Map<String, dynamic>.from(json['pack']))
            : null,
        isAvailable = json['isAvailable'],
        price = json['price'],
        position = json['position'],
        generatedProductVariantsId = json['generatedProductVariantsId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'variantName': variantName?.toJson(),
        'pack': pack?.toJson(),
        'isAvailable': isAvailable,
        'price': price,
        'position': position,
        'generatedProductVariantsId': generatedProductVariantsId
      };
}
