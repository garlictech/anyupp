import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class ProductCategory extends Model {
  final String id;
  final String chainId;
  final LocalizedItem name;
  final LocalizedItem description;
  final String image;
  final int position;

  @override
  String getId() {
    return id;
  }

  const ProductCategory._internal(
      {@required this.id,
      @required this.chainId,
      this.name,
      this.description,
      this.image,
      this.position});

  factory ProductCategory(
      {String id,
      @required String chainId,
      LocalizedItem name,
      LocalizedItem description,
      String image,
      int position}) {
    return ProductCategory._internal(
        id: id == null ? UUID.getUUID() : id,
        chainId: chainId,
        name: name,
        description: description,
        image: image,
        position: position);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProductCategory &&
        id == other.id &&
        chainId == other.chainId &&
        name == other.name &&
        description == other.description &&
        image == other.image &&
        position == other.position;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("ProductCategory {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("chainId=" + "$chainId" + ", ");
    buffer.write("name=" + (name != null ? name.toString() : "null") + ", ");
    buffer.write("description=" +
        (description != null ? description.toString() : "null") +
        ", ");
    buffer.write("image=" + "$image" + ", ");
    buffer
        .write("position=" + (position != null ? position.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  ProductCategory copyWith(
      {String id,
      String chainId,
      LocalizedItem name,
      LocalizedItem description,
      String image,
      int position}) {
    return ProductCategory(
        id: id ?? this.id,
        chainId: chainId ?? this.chainId,
        name: name ?? this.name,
        description: description ?? this.description,
        image: image ?? this.image,
        position: position ?? this.position);
  }

  ProductCategory.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        chainId = json['chainId'],
        name = json['name'] != null
            ? LocalizedItem.fromJson(
                Map<String, dynamic>.from(json['name']))
            : null,
        description = json['description'] != null
            ? LocalizedItem.fromJson(
                Map<String, dynamic>.from(json['description']))
            : null,
        image = json['image'],
        position = json['position'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'chainId': chainId,
        'name': name?.toJson(),
        'description': description?.toJson(),
        'image': image,
        'position': position
      };
}
