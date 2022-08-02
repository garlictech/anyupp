// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'LocalizedItem.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $LocalizedItem {
  const $LocalizedItem();

  String? get id;
  String? get en;
  String? get de;
  String? get hu;

  LocalizedItem copyWith({
    String? id,
    String? en,
    String? de,
    String? hu,
  }) =>
      LocalizedItem(
        id: id ?? this.id,
        en: en ?? this.en,
        de: de ?? this.de,
        hu: hu ?? this.hu,
      );

  LocalizedItem copyUsing(void Function(LocalizedItem$Change change) mutator) {
    final change = LocalizedItem$Change._(
      this.id,
      this.en,
      this.de,
      this.hu,
    );
    mutator(change);
    return LocalizedItem(
      id: change.id,
      en: change.en,
      de: change.de,
      hu: change.hu,
    );
  }

  @override
  String toString() => "LocalizedItem(id: $id, en: $en, de: $de, hu: $hu)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is LocalizedItem &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      en == other.en &&
      de == other.de &&
      hu == other.hu;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + en.hashCode;
    result = 37 * result + de.hashCode;
    result = 37 * result + hu.hashCode;
    return result;
  }
}

class LocalizedItem$Change {
  LocalizedItem$Change._(
    this.id,
    this.en,
    this.de,
    this.hu,
  );

  String? id;
  String? en;
  String? de;
  String? hu;
}

// ignore: avoid_classes_with_only_static_members
class LocalizedItem$ {
  static final id = Lens<LocalizedItem, String?>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final en = Lens<LocalizedItem, String?>(
    (enContainer) => enContainer.en,
    (enContainer, en) => enContainer.copyWith(en: en),
  );

  static final de = Lens<LocalizedItem, String?>(
    (deContainer) => deContainer.de,
    (deContainer, de) => deContainer.copyWith(de: de),
  );

  static final hu = Lens<LocalizedItem, String?>(
    (huContainer) => huContainer.hu,
    (huContainer, hu) => huContainer.copyWith(hu: hu),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalizedItem _$LocalizedItemFromJson(Map<String, dynamic> json) =>
    LocalizedItem(
      id: json['id'] as String?,
      en: json['en'] as String?,
      de: json['de'] as String?,
      hu: json['hu'] as String?,
    );

Map<String, dynamic> _$LocalizedItemToJson(LocalizedItem instance) {
  final val = <String, dynamic>{};

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('id', instance.id);
  writeNotNull('en', instance.en);
  writeNotNull('de', instance.de);
  writeNotNull('hu', instance.hu);
  return val;
}
