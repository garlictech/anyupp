// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'variant.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $Variant {
  const $Variant();

  String get id;
  LocalizedItem get variantName;

  Variant copyWith({
    String? id,
    LocalizedItem? variantName,
  }) =>
      Variant(
        id: id ?? this.id,
        variantName: variantName ?? this.variantName,
      );

  Variant copyUsing(void Function(Variant$Change change) mutator) {
    final change = Variant$Change._(
      this.id,
      this.variantName,
    );
    mutator(change);
    return Variant(
      id: change.id,
      variantName: change.variantName,
    );
  }

  @override
  String toString() => "Variant(id: $id, variantName: $variantName)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is Variant &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      variantName == other.variantName;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + variantName.hashCode;
    return result;
  }
}

class Variant$Change {
  Variant$Change._(
    this.id,
    this.variantName,
  );

  String id;
  LocalizedItem variantName;
}

// ignore: avoid_classes_with_only_static_members
class Variant$ {
  static final id = Lens<Variant, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final variantName = Lens<Variant, LocalizedItem>(
    (variantNameContainer) => variantNameContainer.variantName,
    (variantNameContainer, variantName) =>
        variantNameContainer.copyWith(variantName: variantName),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Variant _$VariantFromJson(Map<String, dynamic> json) => Variant(
      id: json['id'] as String,
      variantName:
          LocalizedItem.fromJson(json['variantName'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$VariantToJson(Variant instance) => <String, dynamic>{
      'id': instance.id,
      'variantName': instance.variantName,
    };
