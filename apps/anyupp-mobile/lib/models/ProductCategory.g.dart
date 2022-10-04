// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ProductCategory.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $ProductCategory {
  const $ProductCategory();

  String get id;
  String get ownerEntity;
  LocalizedItem get name;
  LocalizedItem? get description;
  String? get image;
  int get position;

  ProductCategory copyWith({
    String? id,
    String? ownerEntity,
    LocalizedItem? name,
    LocalizedItem? description,
    String? image,
    int? position,
  }) =>
      ProductCategory(
        id: id ?? this.id,
        ownerEntity: ownerEntity ?? this.ownerEntity,
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
      this.name,
      this.description,
      this.image,
      this.position,
    );
    mutator(change);
    return ProductCategory(
      id: change.id,
      ownerEntity: change.ownerEntity,
      name: change.name,
      description: change.description,
      image: change.image,
      position: change.position,
    );
  }

  @override
  String toString() =>
      "ProductCategory(id: $id, ownerEntity: $ownerEntity, name: $name, description: $description, image: $image, position: $position)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is ProductCategory &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      ownerEntity == other.ownerEntity &&
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
    this.name,
    this.description,
    this.image,
    this.position,
  );

  String id;
  String ownerEntity;
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
      name: LocalizedItem.fromJson(json['name'] as Map<String, dynamic>),
      description: json['description'] == null
          ? null
          : LocalizedItem.fromJson(json['description'] as Map<String, dynamic>),
      image: json['image'] as String?,
      position: json['position'] as int,
    );

Map<String, dynamic> _$ProductCategoryToJson(ProductCategory instance) {
  final val = <String, dynamic>{
    'id': instance.id,
    'ownerEntity': instance.ownerEntity,
    'name': instance.name.toJson(),
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('description', instance.description?.toJson());
  writeNotNull('image', instance.image);
  val['position'] = instance.position;
  return val;
}
