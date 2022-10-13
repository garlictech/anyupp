// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ProductComponentSet.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $ProductComponentSet {
  const $ProductComponentSet();

  String get id;
  ProductComponentSetType get type;
  LocalizedItem get name;
  List<String> get items;
  int? get maxSelection;
  List<ServingMode>? get supportedServingModes;

  ProductComponentSet copyWith({
    String? id,
    ProductComponentSetType? type,
    LocalizedItem? name,
    List<String>? items,
    int? maxSelection,
    List<ServingMode>? supportedServingModes,
  }) =>
      ProductComponentSet(
        id: id ?? this.id,
        type: type ?? this.type,
        name: name ?? this.name,
        items: items ?? this.items,
        maxSelection: maxSelection ?? this.maxSelection,
        supportedServingModes:
            supportedServingModes ?? this.supportedServingModes,
      );

  ProductComponentSet copyUsing(
      void Function(ProductComponentSet$Change change) mutator) {
    final change = ProductComponentSet$Change._(
      this.id,
      this.type,
      this.name,
      this.items,
      this.maxSelection,
      this.supportedServingModes,
    );
    mutator(change);
    return ProductComponentSet(
      id: change.id,
      type: change.type,
      name: change.name,
      items: change.items,
      maxSelection: change.maxSelection,
      supportedServingModes: change.supportedServingModes,
    );
  }

  @override
  String toString() =>
      "ProductComponentSet(id: $id, type: $type, name: $name, items: $items, maxSelection: $maxSelection, supportedServingModes: $supportedServingModes)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is ProductComponentSet &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      type == other.type &&
      name == other.name &&
      items == other.items &&
      maxSelection == other.maxSelection &&
      supportedServingModes == other.supportedServingModes;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + type.hashCode;
    result = 37 * result + name.hashCode;
    result = 37 * result + items.hashCode;
    result = 37 * result + maxSelection.hashCode;
    result = 37 * result + supportedServingModes.hashCode;
    return result;
  }
}

class ProductComponentSet$Change {
  ProductComponentSet$Change._(
    this.id,
    this.type,
    this.name,
    this.items,
    this.maxSelection,
    this.supportedServingModes,
  );

  String id;
  ProductComponentSetType type;
  LocalizedItem name;
  List<String> items;
  int? maxSelection;
  List<ServingMode>? supportedServingModes;
}

// ignore: avoid_classes_with_only_static_members
class ProductComponentSet$ {
  static final id = Lens<ProductComponentSet, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final type = Lens<ProductComponentSet, ProductComponentSetType>(
    (typeContainer) => typeContainer.type,
    (typeContainer, type) => typeContainer.copyWith(type: type),
  );

  static final name = Lens<ProductComponentSet, LocalizedItem>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );

  static final items = Lens<ProductComponentSet, List<String>>(
    (itemsContainer) => itemsContainer.items,
    (itemsContainer, items) => itemsContainer.copyWith(items: items),
  );

  static final maxSelection = Lens<ProductComponentSet, int?>(
    (maxSelectionContainer) => maxSelectionContainer.maxSelection,
    (maxSelectionContainer, maxSelection) =>
        maxSelectionContainer.copyWith(maxSelection: maxSelection),
  );

  static final supportedServingModes =
      Lens<ProductComponentSet, List<ServingMode>?>(
    (supportedServingModesContainer) =>
        supportedServingModesContainer.supportedServingModes,
    (supportedServingModesContainer, supportedServingModes) =>
        supportedServingModesContainer.copyWith(
            supportedServingModes: supportedServingModes),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductComponentSet _$ProductComponentSetFromJson(Map<String, dynamic> json) =>
    ProductComponentSet(
      id: json['id'] as String,
      name: LocalizedItem.fromJson(json['name'] as Map<String, dynamic>),
      type: json['type'],
      maxSelection: json['maxSelection'] as int?,
      items: (json['items'] as List<dynamic>).map((e) => e as String).toList(),
      supportedServingModes: json['supportedServingModes'] as List<dynamic>?,
    );

Map<String, dynamic> _$ProductComponentSetToJson(ProductComponentSet instance) {
  final val = <String, dynamic>{
    'id': instance.id,
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('type', instance.type);
  val['name'] = instance.name.toJson();
  val['items'] = instance.items;
  writeNotNull('maxSelection', instance.maxSelection);
  writeNotNull('supportedServingModes', instance.supportedServingModes);
  return val;
}
