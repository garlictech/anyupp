import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class LocalizedItem extends Model {
  final String id;
  final String en;
  final String de;
  final String hu;

  @override
  String getId() {
    return id;
  }

  const LocalizedItem._internal({@required this.id, this.en, this.de, this.hu});

  factory LocalizedItem({String id, String en, String de, String hu}) {
    return LocalizedItem._internal(
        id: id == null ? UUID.getUUID() : id, en: en, de: de, hu: hu);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LocalizedItem &&
        id == other.id &&
        en == other.en &&
        de == other.de &&
        hu == other.hu;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("LocalizedItem {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("en=" + "$en" + ", ");
    buffer.write("de=" + "$de" + ", ");
    buffer.write("hu=" + "$hu");
    buffer.write("}");

    return buffer.toString();
  }

  LocalizedItem copyWith({String id, String en, String de, String hu}) {
    return LocalizedItem(
        id: id ?? this.id,
        en: en ?? this.en,
        de: de ?? this.de,
        hu: hu ?? this.hu);
  }

  LocalizedItem.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        en = json['en'],
        de = json['de'],
        hu = json['hu'];

  Map<String, dynamic> toJson() => {'id': id, 'en': en, 'de': de, 'hu': hu};
}
