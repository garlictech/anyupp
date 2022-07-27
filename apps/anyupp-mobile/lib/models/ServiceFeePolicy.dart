import '/graphql/generated/crud-api.dart';
import '/models/core/parsers.dart';
import 'package:flutter/foundation.dart';

@immutable
class ServiceFeePolicy {
  final ServiceFeeType type;
  final double percentage;
  ServiceFeePolicy({
    required this.type,
    required this.percentage,
  });

  ServiceFeePolicy copyWith({
    ServiceFeeType? type,
    double? percentage,
  }) {
    return ServiceFeePolicy(
      type: type ?? this.type,
      percentage: percentage ?? this.percentage,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': enumToString(type),
      'percentage': percentage,
    };
  }

  factory ServiceFeePolicy.fromJson(Map<String, dynamic> map) {
    return ServiceFeePolicy(
      type: enumFromString(map['type'], ServiceFeeType.values),
      percentage: map['percentage']?.toDouble() ?? 0.0,
    );
  }

  @override
  String toString() => 'ServiceFeePolicy(type: $type, percentage: $percentage)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ServiceFeePolicy &&
        other.type == type &&
        other.percentage == percentage;
  }

  @override
  int get hashCode => type.hashCode ^ percentage.hashCode;
}
