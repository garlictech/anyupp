import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models/core/parsers.dart';
import 'package:flutter/foundation.dart';

@immutable
class ServiceFeePolicy {
  final ServiceFeeType type;
  final double percentage;
  final double taxPercentage;
  ServiceFeePolicy({
    required this.type,
    required this.percentage,
    required this.taxPercentage,
  });

  ServiceFeePolicy copyWith({
    ServiceFeeType? type,
    double? percentage,
    double? taxPercentage,
  }) {
    return ServiceFeePolicy(
      type: type ?? this.type,
      percentage: percentage ?? this.percentage,
      taxPercentage: taxPercentage ?? this.taxPercentage,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': enumToString(type),
      'percentage': percentage,
      'taxPercentage': taxPercentage,
    };
  }

  factory ServiceFeePolicy.fromJson(Map<String, dynamic> map) {
    return ServiceFeePolicy(
      type: enumFromString(map['type'], ServiceFeeType.values),
      percentage: map['percentage']?.toDouble() ?? 0.0,
      taxPercentage: map['taxPercentage']?.toDouble() ?? 0.0,
    );
  }

  @override
  String toString() =>
      'ServiceFeePolicy(type: $type, percentage: $percentage, taxPercentage: $taxPercentage)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ServiceFeePolicy &&
        other.type == type &&
        other.percentage == percentage &&
        other.taxPercentage == taxPercentage;
  }

  @override
  int get hashCode =>
      type.hashCode ^ percentage.hashCode ^ taxPercentage.hashCode;
}
