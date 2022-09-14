// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'localized_item.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $LocalizedItem {
  const $LocalizedItem();

  String? get en;
  String? get hu;
  String? get de;

  LocalizedItem copyWith({
    String? en,
    String? hu,
    String? de,
  }) =>
      LocalizedItem(
        en: en ?? this.en,
        hu: hu ?? this.hu,
        de: de ?? this.de,
      );

  LocalizedItem copyUsing(void Function(LocalizedItem$Change change) mutator) {
    final change = LocalizedItem$Change._(
      this.en,
      this.hu,
      this.de,
    );
    mutator(change);
    return LocalizedItem(
      en: change.en,
      hu: change.hu,
      de: change.de,
    );
  }

  @override
  String toString() => "LocalizedItem(en: $en, hu: $hu, de: $de)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is LocalizedItem &&
      other.runtimeType == runtimeType &&
      en == other.en &&
      hu == other.hu &&
      de == other.de;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + en.hashCode;
    result = 37 * result + hu.hashCode;
    result = 37 * result + de.hashCode;
    return result;
  }
}

class LocalizedItem$Change {
  LocalizedItem$Change._(
    this.en,
    this.hu,
    this.de,
  );

  String? en;
  String? hu;
  String? de;
}

// ignore: avoid_classes_with_only_static_members
class LocalizedItem$ {
  static final en = Lens<LocalizedItem, String?>(
    (enContainer) => enContainer.en,
    (enContainer, en) => enContainer.copyWith(en: en),
  );

  static final hu = Lens<LocalizedItem, String?>(
    (huContainer) => huContainer.hu,
    (huContainer, hu) => huContainer.copyWith(hu: hu),
  );

  static final de = Lens<LocalizedItem, String?>(
    (deContainer) => deContainer.de,
    (deContainer, de) => deContainer.copyWith(de: de),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalizedItem _$LocalizedItemFromJson(Map<String, dynamic> json) =>
    LocalizedItem(
      en: json['en'] as String?,
      hu: json['hu'] as String?,
      de: json['de'] as String?,
    );

Map<String, dynamic> _$LocalizedItemToJson(LocalizedItem instance) =>
    <String, dynamic>{
      'en': instance.en,
      'hu': instance.hu,
      'de': instance.de,
    };
