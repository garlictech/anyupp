// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'NestedSortItem.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $NestedSortItem {
  const $NestedSortItem();

  String get id;
  String? get parentId;

  NestedSortItem copyWith({
    String? id,
    String? parentId,
  }) =>
      NestedSortItem(
        id: id ?? this.id,
        parentId: parentId ?? this.parentId,
      );

  NestedSortItem copyUsing(
      void Function(NestedSortItem$Change change) mutator) {
    final change = NestedSortItem$Change._(
      this.id,
      this.parentId,
    );
    mutator(change);
    return NestedSortItem(
      id: change.id,
      parentId: change.parentId,
    );
  }

  @override
  String toString() => "NestedSortItem(id: $id, parentId: $parentId)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is NestedSortItem &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      parentId == other.parentId;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + parentId.hashCode;
    return result;
  }
}

class NestedSortItem$Change {
  NestedSortItem$Change._(
    this.id,
    this.parentId,
  );

  String id;
  String? parentId;
}

// ignore: avoid_classes_with_only_static_members
class NestedSortItem$ {
  static final id = Lens<NestedSortItem, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final parentId = Lens<NestedSortItem, String?>(
    (parentIdContainer) => parentIdContainer.parentId,
    (parentIdContainer, parentId) =>
        parentIdContainer.copyWith(parentId: parentId),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

NestedSortItem _$NestedSortItemFromJson(Map<String, dynamic> json) =>
    NestedSortItem(
      id: json['id'] as String,
      parentId: json['parentId'] as String?,
    );

Map<String, dynamic> _$NestedSortItemToJson(NestedSortItem instance) {
  final val = <String, dynamic>{
    'id': instance.id,
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('parentId', instance.parentId);
  return val;
}
