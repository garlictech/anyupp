import '/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class ProductCategory {
  final String id;
  final String? parentId;
  final String chainId;
  final LocalizedItem name;
  final LocalizedItem? description;
  final String? image;
  final int position;

  ProductCategory({
    required this.id,
    required this.chainId,
    required this.name,
    this.parentId,
    this.description,
    this.image,
    required this.position,
  });

  ProductCategory copyWith({
    String? id,
    String? chainId,
    String? parentId,
    LocalizedItem? name,
    LocalizedItem? description,
    String? image,
    int? position,
  }) {
    return ProductCategory(
      id: id ?? this.id,
      chainId: chainId ?? this.chainId,
      parentId: parentId ?? this.parentId,
      name: name ?? this.name,
      description: description ?? this.description,
      image: image ?? this.image,
      position: position ?? this.position,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'chainId': chainId,
      'parentId': parentId,
      'name': name.toJson(),
      'description': description?.toJson(),
      'image': image,
      'position': position,
    };
  }

  factory ProductCategory.fromJson(Map<String, dynamic> map) {
    return ProductCategory(
      id: map['id'],
      chainId: map['chainId'],
      parentId: map['parentId'],
      name: LocalizedItem.fromJson(map['name']),
      description: map['description'] != null
          ? LocalizedItem.fromJson(map['description'])
          : null,
      image: map['image'],
      position: map['position'],
    );
  }

  @override
  String toString() {
    return 'ProductCategory(id: $id, parent: $id, chainId: $chainId, name: $name, description: $description, image: $image, position: $position)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ProductCategory &&
        other.id == id &&
        other.chainId == chainId &&
        other.parentId == parentId &&
        other.name == name &&
        other.description == description &&
        other.image == image &&
        other.position == position;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        chainId.hashCode ^
        parentId.hashCode ^
        name.hashCode ^
        description.hashCode ^
        image.hashCode ^
        position.hashCode;
  }
}
