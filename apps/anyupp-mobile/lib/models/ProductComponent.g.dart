// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ProductComponent.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $ProductComponent {
  const $ProductComponent();

  String get id;
  String get ownerEntity;
  LocalizedItem get name;
  List<Allergen>? get allergens;

  ProductComponent copyWith({
    String? id,
    String? ownerEntity,
    LocalizedItem? name,
    List<Allergen>? allergens,
  }) =>
      ProductComponent(
        id: id ?? this.id,
        ownerEntity: ownerEntity ?? this.ownerEntity,
        name: name ?? this.name,
        allergens: allergens ?? this.allergens,
      );

  ProductComponent copyUsing(
      void Function(ProductComponent$Change change) mutator) {
    final change = ProductComponent$Change._(
      this.id,
      this.ownerEntity,
      this.name,
      this.allergens,
    );
    mutator(change);
    return ProductComponent(
      id: change.id,
      ownerEntity: change.ownerEntity,
      name: change.name,
      allergens: change.allergens,
    );
  }

  @override
  String toString() =>
      "ProductComponent(id: $id, ownerEntity: $ownerEntity, name: $name, allergens: $allergens)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is ProductComponent &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      ownerEntity == other.ownerEntity &&
      name == other.name &&
      allergens == other.allergens;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + ownerEntity.hashCode;
    result = 37 * result + name.hashCode;
    result = 37 * result + allergens.hashCode;
    return result;
  }
}

class ProductComponent$Change {
  ProductComponent$Change._(
    this.id,
    this.ownerEntity,
    this.name,
    this.allergens,
  );

  String id;
  String ownerEntity;
  LocalizedItem name;
  List<Allergen>? allergens;
}

// ignore: avoid_classes_with_only_static_members
class ProductComponent$ {
  static final id = Lens<ProductComponent, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final ownerEntity = Lens<ProductComponent, String>(
    (ownerEntityContainer) => ownerEntityContainer.ownerEntity,
    (ownerEntityContainer, ownerEntity) =>
        ownerEntityContainer.copyWith(ownerEntity: ownerEntity),
  );

  static final name = Lens<ProductComponent, LocalizedItem>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );

  static final allergens = Lens<ProductComponent, List<Allergen>?>(
    (allergensContainer) => allergensContainer.allergens,
    (allergensContainer, allergens) =>
        allergensContainer.copyWith(allergens: allergens),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductComponent _$ProductComponentFromJson(Map<String, dynamic> json) =>
    ProductComponent(
      id: json['id'] as String,
      name: LocalizedItem.fromJson(json['name'] as Map<String, dynamic>),
      ownerEntity: json['ownerEntity'] as String,
      allergens: json['allergens'] as List<dynamic>?,
    );

Map<String, dynamic> _$ProductComponentToJson(ProductComponent instance) {
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

  writeNotNull('allergens', instance.allergens);
  return val;
}
