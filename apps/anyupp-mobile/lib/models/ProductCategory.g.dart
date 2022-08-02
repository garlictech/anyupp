// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ProductCategory.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $ProductCategory {
  const $ProductCategory();

  String get id;
  String get ownerEntity;
  String? get parentId;
  LocalizedItem get name;
  LocalizedItem? get description;
  String? get image;
  int get position;

  ProductCategory copyWith({
    String? id,
    String? ownerEntity,
    String? parentId,
    LocalizedItem? name,
    LocalizedItem? description,
    String? image,
    int? position,
  }) =>
      ProductCategory(
        id: id ?? this.id,
        ownerEntity: ownerEntity ?? this.ownerEntity,
        parentId: parentId ?? this.parentId,
        name: name ?? this.name,
        description: description ?? this.description,
        image: image ?? this.image,
        position: position ?? this.position,
      );

  ProductCategory copyUsing(
      void Function(ProductCategory$Change change) mutator) {
    final change = ProductCategory$Change._(
      this.id,
      this.ownerEntity,
      this.parentId,
      this.name,
      this.description,
      this.image,
      this.position,
    );
    mutator(change);
    return ProductCategory(
      id: change.id,
      ownerEntity: change.ownerEntity,
      parentId: change.parentId,
      name: change.name,
      description: change.description,
      image: change.image,
      position: change.position,
    );
  }

  @override
  String toString() =>
      "ProductCategory(id: $id, ownerEntity: $ownerEntity, parentId: $parentId, name: $name, description: $description, image: $image, position: $position)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is ProductCategory &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      ownerEntity == other.ownerEntity &&
      parentId == other.parentId &&
      name == other.name &&
      description == other.description &&
      image == other.image &&
      position == other.position;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + ownerEntity.hashCode;
    result = 37 * result + parentId.hashCode;
    result = 37 * result + name.hashCode;
    result = 37 * result + description.hashCode;
    result = 37 * result + image.hashCode;
    result = 37 * result + position.hashCode;
    return result;
  }
}

class ProductCategory$Change {
  ProductCategory$Change._(
    this.id,
    this.ownerEntity,
    this.parentId,
    this.name,
    this.description,
    this.image,
    this.position,
  );

  String id;
  String ownerEntity;
  String? parentId;
  LocalizedItem name;
  LocalizedItem? description;
  String? image;
  int position;
}

// ignore: avoid_classes_with_only_static_members
class ProductCategory$ {
  static final id = Lens<ProductCategory, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final ownerEntity = Lens<ProductCategory, String>(
    (ownerEntityContainer) => ownerEntityContainer.ownerEntity,
    (ownerEntityContainer, ownerEntity) =>
        ownerEntityContainer.copyWith(ownerEntity: ownerEntity),
  );

  static final parentId = Lens<ProductCategory, String?>(
    (parentIdContainer) => parentIdContainer.parentId,
    (parentIdContainer, parentId) =>
        parentIdContainer.copyWith(parentId: parentId),
  );

  static final name = Lens<ProductCategory, LocalizedItem>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );

  static final description = Lens<ProductCategory, LocalizedItem?>(
    (descriptionContainer) => descriptionContainer.description,
    (descriptionContainer, description) =>
        descriptionContainer.copyWith(description: description),
  );

  static final image = Lens<ProductCategory, String?>(
    (imageContainer) => imageContainer.image,
    (imageContainer, image) => imageContainer.copyWith(image: image),
  );

  static final position = Lens<ProductCategory, int>(
    (positionContainer) => positionContainer.position,
    (positionContainer, position) =>
        positionContainer.copyWith(position: position),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductCategory _$ProductCategoryFromJson(Map<String, dynamic> json) =>
    ProductCategory(
      id: json['id'] as String,
      ownerEntity: json['ownerEntity'] as String,
      name: json['name'],
      description: json['description'],
      image: json['image'] as String?,
      parentId: json['parentId'] as String?,
      position: json['position'] as int,
    );

Map<String, dynamic> _$ProductCategoryToJson(ProductCategory instance) {
  final val = <String, dynamic>{
    'id': instance.id,
    'ownerEntity': instance.ownerEntity,
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('parentId', instance.parentId);
  writeNotNull('name', instance.name);
  writeNotNull('description', instance.description);
  writeNotNull('image', instance.image);
  val['position'] = instance.position;
  return val;
}
