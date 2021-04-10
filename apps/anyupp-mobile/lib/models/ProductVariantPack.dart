import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class ProductVariantPack extends Model {
  final String id;
  final double size;
  final String unit;

  @override
  String getId() {
    return id;
  }

  const ProductVariantPack._internal({@required this.id, this.size, this.unit});

  factory ProductVariantPack({String id, double size, String unit}) {
    return ProductVariantPack._internal(
        id: id == null ? UUID.getUUID() : id, size: size, unit: unit);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProductVariantPack &&
        id == other.id &&
        size == other.size &&
        unit == other.unit;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("ProductVariantPack {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("size=" + (size != null ? size.toString() : "null") + ", ");
    buffer.write("unit=" + "$unit");
    buffer.write("}");

    return buffer.toString();
  }

  ProductVariantPack copyWith({String id, double size, String unit}) {
    return ProductVariantPack(
        id: id ?? this.id, size: size ?? this.size, unit: unit ?? this.unit);
  }

  ProductVariantPack.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        size = json['size'],
        unit = json['unit'];

  Map<String, dynamic> toJson() => {'id': id, 'size': size, 'unit': unit};
}
