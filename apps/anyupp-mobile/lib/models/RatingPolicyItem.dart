import '/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class RatingPolicyItem {
  final int value;
  final LocalizedItem? text;
  final String? icon;
  RatingPolicyItem({
    required this.value,
    this.text,
    this.icon,
  });

  RatingPolicyItem copyWith({
    int? value,
    LocalizedItem? text,
    String? icon,
  }) {
    return RatingPolicyItem(
      value: value ?? this.value,
      text: text ?? this.text,
      icon: icon ?? this.icon,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'value': value,
      'text': text?.toJson(),
      'icon': icon,
    };
  }

  factory RatingPolicyItem.fromJson(Map<String, dynamic> map) {
    return RatingPolicyItem(
      value: map['value']?.toInt() ?? 0,
      text: map['text'] != null ? LocalizedItem.fromJson(map['text']) : null,
      icon: map['icon'],
    );
  }

  @override
  String toString() =>
      'RatingPolicyItem(value: $value, text: $text, icon: $icon)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is RatingPolicyItem &&
        other.value == value &&
        other.text == text &&
        other.icon == icon;
  }

  @override
  int get hashCode => value.hashCode ^ text.hashCode ^ icon.hashCode;
}
