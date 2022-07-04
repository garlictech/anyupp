import 'package:flutter/foundation.dart';

import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

@immutable
class GeneratedProductConfigSet {
  final String productSetId;
  final LocalizedItem name;
  final String? description;
  final int? position;
  final ProductComponentSetType type;
  final int? maxSelection;
  final List<GeneratedProductConfigComponent> items;
  final List<ServingMode> supportedServingModes;
  final String? externalId;

  GeneratedProductConfigSet({
    required this.productSetId,
    required this.name,
    this.description,
    this.position,
    required this.type,
    this.maxSelection,
    required this.items,
    required this.supportedServingModes,
    this.externalId,
  });

  GeneratedProductConfigSet copyWith({
    String? productSetId,
    LocalizedItem? name,
    String? description,
    int? position,
    ProductComponentSetType? type,
    int? maxSelection,
    List<GeneratedProductConfigComponent>? items,
    List<ServingMode>? supportedServingModes,
    String? externalId,
  }) {
    return GeneratedProductConfigSet(
      productSetId: productSetId ?? this.productSetId,
      name: name ?? this.name,
      description: description ?? this.description,
      position: position ?? this.position,
      type: type ?? this.type,
      maxSelection: maxSelection ?? this.maxSelection,
      items: items ?? this.items,
      supportedServingModes:
          supportedServingModes ?? this.supportedServingModes,
      externalId: externalId ?? this.externalId,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productSetId': productSetId,
      'name': name.toJson(),
      'description': description,
      'position': position,
      'type': enumToString(type),
      'maxSelection': maxSelection,
      'items': items.map((x) => x.toJson()).toList(),
      'supportedServingModes':
          supportedServingModes.map((x) => enumToString(x)).toList(),
      'externalId': externalId,
    };
  }

  factory GeneratedProductConfigSet.fromJson(Map<String, dynamic> map) {
    return GeneratedProductConfigSet(
      productSetId: map['productSetId'],
      name: LocalizedItem.fromJson(map['name']),
      description: map['description'],
      position: map['position'],
      type: enumFromString(map['type'], ProductComponentSetType.values),
      maxSelection: map['maxSelection'],
      items: List<GeneratedProductConfigComponent>.from(map['items']
          ?.map((x) => GeneratedProductConfigComponent.fromJson(x))),
      supportedServingModes: map['supportedServingModes'] != null
          ? List<ServingMode>.from(
              map['supportedServingModes']?.map(
                (x) => enumFromString(
                  x,
                  ServingMode.values,
                ),
              ),
            )
          : [],
      externalId: map['externalId'],
    );
  }

  @override
  String toString() {
    return 'GeneratedProductConfigSet(productSetId: $productSetId, name: $name, supportedServingModes: $supportedServingModes, description: $description, position: $position, type: $type, maxSelection: $maxSelection, items: $items)';
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
        other.externalId == externalId &&
        listEquals(other.items, items) &&
        listEquals(other.supportedServingModes, supportedServingModes);
  }

  @override
  int get hashCode {
    return productSetId.hashCode ^
        name.hashCode ^
        description.hashCode ^
        position.hashCode ^
        type.hashCode ^
        maxSelection.hashCode ^
        items.hashCode ^
        externalId.hashCode ^
        supportedServingModes.hashCode;
  }
}
