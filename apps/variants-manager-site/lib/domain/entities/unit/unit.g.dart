// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'unit.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $Unit {
  const $Unit();

  String get id;
  String get name;

  Unit copyWith({
    String? id,
    String? name,
  }) =>
      Unit(
        id: id ?? this.id,
        name: name ?? this.name,
      );

  Unit copyUsing(void Function(Unit$Change change) mutator) {
    final change = Unit$Change._(
      this.id,
      this.name,
    );
    mutator(change);
    return Unit(
      id: change.id,
      name: change.name,
    );
  }

  @override
  String toString() => "Unit(id: $id, name: $name)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is Unit &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      name == other.name;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + name.hashCode;
    return result;
  }
}

class Unit$Change {
  Unit$Change._(
    this.id,
    this.name,
  );

  String id;
  String name;
}

// ignore: avoid_classes_with_only_static_members
class Unit$ {
  static final id = Lens<Unit, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final name = Lens<Unit, String>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Unit _$UnitFromJson(Map<String, dynamic> json) => Unit(
      id: json['id'] as String,
      name: json['name'] as String,
    );

Map<String, dynamic> _$UnitToJson(Unit instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
    };
