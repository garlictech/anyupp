import 'package:flutter/foundation.dart';

@immutable
class OrderRating {
  final String key;
  final int value;
  OrderRating({
    required this.key,
    required this.value,
  });

  OrderRating copyWith({
    String? key,
    int? value,
  }) {
    return OrderRating(
      key: key ?? this.key,
      value: value ?? this.value,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'key': key,
      'value': value,
    };
  }

  factory OrderRating.fromJson(Map<String, dynamic> map) {
    return OrderRating(
      key: map['key'] ?? '',
      value: map['value']?.toInt() ?? 0,
    );
  }

  @override
  String toString() => 'OrderRating(key: $key, value: $value)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is OrderRating && other.key == key && other.value == value;
  }

  @override
  int get hashCode => key.hashCode ^ value.hashCode;
}
