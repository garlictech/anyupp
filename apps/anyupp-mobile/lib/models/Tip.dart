import '/graphql/generated/crud-api.dart';
import '/models/core/parsers.dart';
import 'package:flutter/foundation.dart';

@immutable
class Tip {
  final TipType type;
  final double value;

  Tip(
    this.type,
    this.value,
  );

  Tip copyWith({
    TipType? type,
    double? value,
  }) {
    return Tip(
      type ?? this.type,
      value ?? this.value,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': enumToString(type),
      'value': value,
    };
  }

  factory Tip.fromJson(Map<String, dynamic> map) {
    return Tip(
      enumFromString(map['type'], TipType.values),
      map['value']?.toDouble(),
    );
  }

  @override
  String toString() => 'Tip(type: $type, value: $value)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Tip && other.type == type && other.value == value;
  }

  @override
  int get hashCode => type.hashCode ^ value.hashCode;
}
