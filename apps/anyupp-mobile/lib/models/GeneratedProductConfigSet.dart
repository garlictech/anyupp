import 'package:flutter/foundation.dart';

import 'package:fa_prev/models.dart';

class GeneratedProductConfigSet {
  final String productSetId;
  final LocalizedItem name;
  final String? description;
  final int? position;
  final String type;
  final int? maxSelection;
  final List<GeneratedProductConfigComponent> items;

  GeneratedProductConfigSet({
    required this.productSetId,
    required this.name,
    this.description,
    this.position,
    required this.type,
    this.maxSelection,
    required this.items,
  });

  GeneratedProductConfigSet copyWith({
    String? productSetId,
    LocalizedItem? name,
    String? description,
    int? position,
    String? type,
    int? maxSelection,
    List<GeneratedProductConfigComponent>? items,
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
      'items': items.map((x) => x.toJson()).toList(),
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
      items: List<GeneratedProductConfigComponent>.from(
          map['items']?.map((x) => GeneratedProductConfigComponent.fromJson(x))),
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
