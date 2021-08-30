import 'package:fa_prev/models.dart';

class ProductCategory {
  final String? id;
  final String chainId;
  final LocalizedItem name;
  final LocalizedItem? description;
  final String? image;
  final int position;

  ProductCategory({
    this.id,
    required this.chainId,
    required this.name,
    this.description,
    this.image,
    required this.position,
  });

  ProductCategory copyWith({
    String? id,
    String? chainId,
    LocalizedItem? name,
    LocalizedItem? description,
    String? image,
    int? position,
  }) {
    return ProductCategory(
      id: id ?? this.id,
      chainId: chainId ?? this.chainId,
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
      name: LocalizedItem.fromJson(map['name']),
      description: map['description'] != null ? LocalizedItem.fromJson(map['description']) : null,
      image: map['image'],
      position: map['position'],
    );
  }

  @override
  String toString() {
    return 'ProductCategory(id: $id, chainId: $chainId, name: $name, description: $description, image: $image, position: $position)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ProductCategory &&
        other.id == id &&
        other.chainId == chainId &&
        other.name == name &&
        other.description == description &&
        other.image == image &&
        other.position == position;
  }

  @override
  int get hashCode {
    return id.hashCode ^ chainId.hashCode ^ name.hashCode ^ description.hashCode ^ image.hashCode ^ position.hashCode;
  }
}
