import 'package:flutter/foundation.dart';

@immutable
class LocalizedItem {
  final String? id;
  final String? en;
  final String? de;
  final String? hu;

  LocalizedItem({
    this.id,
    this.en,
    this.de,
    this.hu,
  });

  LocalizedItem copyWith({
    String? id,
    String? en,
    String? de,
    String? hu,
  }) {
    return LocalizedItem(
      id: id ?? this.id,
      en: en ?? this.en,
      de: de ?? this.de,
      hu: hu ?? this.hu,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'en': en,
      'de': de,
      'hu': hu,
    };
  }

  factory LocalizedItem.fromJson(Map<String, dynamic> map) {
    return LocalizedItem(
      id: map['id'],
      en: map['en'],
      de: map['de'],
      hu: map['hu'],
    );
  }

  @override
  String toString() {
    return 'LocalizedItem(id: $id, en: $en, de: $de, hu: $hu)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is LocalizedItem && other.id == id && other.en == en && other.de == de && other.hu == hu;
  }

  @override
  int get hashCode {
    return id.hashCode ^ en.hashCode ^ de.hashCode ^ hu.hashCode;
  }
}
