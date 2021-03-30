import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class ProductCategory extends Model {
  final String id;
  final String unitId;
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
      @required this.unitId,
      this.name,
      this.description,
      this.image,
      this.position});

  factory ProductCategory(
      {String id,
      @required String unitId,
      LocalizedItem name,
      LocalizedItem description,
      String image,
      int position}) {
    return ProductCategory._internal(
        id: id == null ? UUID.getUUID() : id,
        unitId: unitId,
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
        unitId == other.unitId &&
        name == other.name &&
        description == other.description &&
        image == other.image &&
        position == other.position;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("ProductCategory {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("unitId=" + "$unitId" + ", ");
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
      String unitId,
      LocalizedItem name,
      LocalizedItem description,
      String image,
      int position}) {
    return ProductCategory(
        id: id ?? this.id,
        unitId: unitId ?? this.unitId,
        name: name ?? this.name,
        description: description ?? this.description,
        image: image ?? this.image,
        position: position ?? this.position);
  }

  ProductCategory.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        unitId = json['unitId'],
        name = json['name'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['name']))
            : null,
        description = json['description'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['description']))
            : null,
        image = json['image'],
        position = json['position'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'unitId': unitId,
        'name': name?.toJson(),
        'description': description?.toJson(),
        'image': image,
        'position': position
      };
}
