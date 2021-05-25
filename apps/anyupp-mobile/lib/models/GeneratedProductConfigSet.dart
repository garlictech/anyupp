import 'package:flutter/foundation.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/Allergens.dart';

class GeneratedProductConfigSet extends Model {
  final String productSetId;
  final LocalizedItem name;
  final String description;
  final int position;
  final String type;
  final int maxSelection;
  final List<GeneratedProductConfigComponent> items;

  GeneratedProductConfigSet({
    @required this.productSetId,
    @required this.name,
    @required this.description,
    @required this.position,
    @required this.type,
    @required this.maxSelection,
    @required this.items,
  });

  GeneratedProductConfigSet copyWith({
    String productSetId,
    LocalizedItem name,
    String description,
    int position,
    String type,
    int maxSelection,
    List<GeneratedProductConfigComponent> items,
  }) {
    return GeneratedProductConfigSet(
      productSetId: productSetId ?? this.productSetId,
      name: name ?? this.name,
      description: description ?? this.description,
      position: position ?? this.position,
      type: type ?? this.type,
      maxSelection: maxSelection ?? this.maxSelection,
      items: items ?? this.items,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productSetId': productSetId,
      'name': name.toJson(),
      'description': description,
      'position': position,
      'type': type,
      'maxSelection': maxSelection,
      'items': items?.map((x) => x.toJson())?.toList(),
    };
  }

  factory GeneratedProductConfigSet.fromJson(Map<String, dynamic> map) {
    return GeneratedProductConfigSet(
      productSetId: map['productSetId'],
      name: LocalizedItem.fromJson(map['name']),
      description: map['description'],
      position: map['position'],
      type: map['type'],
      maxSelection: map['maxSelection'],
      items: map['items'] is List
          ? (map['items'] as List)
              .map((e) => GeneratedProductConfigComponent.fromJson(Map<String, dynamic>.from(e)))
              .toList()
          : null,
    );
  }

  @override
  String toString() {
    return 'GeneratedProductConfigSet(productSetId: $productSetId, name: $name, description: $description, position: $position, type: $type, maxSelection: $maxSelection, items: $items)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is GeneratedProductConfigSet &&
        other.productSetId == productSetId &&
        other.name == name &&
        other.description == description &&
        other.position == position &&
        other.type == type &&
        other.maxSelection == maxSelection &&
        listEquals(other.items, items);
  }

  @override
  int get hashCode {
    return productSetId.hashCode ^
        name.hashCode ^
        description.hashCode ^
        position.hashCode ^
        type.hashCode ^
        maxSelection.hashCode ^
        items.hashCode;
  }
}

class GeneratedProductConfigComponent extends Model {
  final String productComponentId;
  final double price;
  final int position;
  final LocalizedItem name;
  final String description;
  final List<Allergen> allergens;

  GeneratedProductConfigComponent({
    @required this.productComponentId,
    @required this.price,
    @required this.position,
    @required this.name,
    @required this.description,
    @required this.allergens,
  });

  GeneratedProductConfigComponent copyWith({
    String productComponentId,
    double price,
    int position,
    LocalizedItem name,
    String description,
    List<Allergen> allergens,
  }) {
    return GeneratedProductConfigComponent(
      productComponentId: productComponentId ?? this.productComponentId,
      price: price ?? this.price,
      position: position ?? this.position,
      name: name ?? this.name,
      description: description ?? this.description,
      allergens: allergens ?? this.allergens,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productComponentId': productComponentId,
      'price': price,
      'position': position,
      'name': name.toJson(),
      'description': description,
      'allergens': allergens?.map((x) => enumToString(x))?.toList(),
    };
  }

  factory GeneratedProductConfigComponent.fromJson(Map<String, dynamic> map) {
    return GeneratedProductConfigComponent(
      productComponentId: map['productComponentId'],
      price: map['price'],
      position: map['position'],
      name: LocalizedItem.fromJson(map['name']),
      description: map['description'],
      allergens: map['allergens'] is List
          ? (map['allergens'] as List).map((e) => enumFromString<Allergen>(e, Allergen.values)).toList()
          : null,
    );
  }

  @override
  String toString() {
    return 'GeneratedProductConfigComponent(productComponentId: $productComponentId, price: $price, position: $position, name: $name, description: $description, allergens: $allergens)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is GeneratedProductConfigComponent &&
        other.productComponentId == productComponentId &&
        other.price == price &&
        other.position == position &&
        other.name == name &&
        other.description == description &&
        listEquals(other.allergens, allergens);
  }

  @override
  int get hashCode {
    return productComponentId.hashCode ^
        price.hashCode ^
        position.hashCode ^
        name.hashCode ^
        description.hashCode ^
        allergens.hashCode;
  }
}
