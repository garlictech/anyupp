import '/graphql/generated/crud-api.dart';
import '/models.dart';

import 'package:flutter/foundation.dart';

@immutable
class PaymentMode {
  final String? id;
  final PaymentType type;
  final String? caption;
  final PaymentMethod method;
  final String? geoUnitPaymentModesId;

  PaymentMode({
    this.id,
    required this.type,
    this.caption,
    required this.method,
    this.geoUnitPaymentModesId,
  });

  PaymentMode copyWith({
    String? id,
    PaymentType? type,
    String? caption,
    PaymentMethod? method,
    String? geoUnitPaymentModesId,
  }) {
    return PaymentMode(
      id: id ?? this.id,
      type: type ?? this.type,
      caption: caption ?? this.caption,
      method: method ?? this.method,
      geoUnitPaymentModesId: geoUnitPaymentModesId ?? this.geoUnitPaymentModesId,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': enumToString(type),
      'caption': caption,
      'method': enumToString(method),
      'geoUnitPaymentModesId': geoUnitPaymentModesId,
    };
  }

  factory PaymentMode.fromJson(Map<String, dynamic> map) {
    return PaymentMode(
      id: map['id'],
      type: enumFromString(map['type'], PaymentType.values),
      caption: map['caption'],
      method: enumFromString(map['method'], PaymentMethod.values),
      geoUnitPaymentModesId: map['geoUnitPaymentModesId'],
    );
  }

  @override
  String toString() {
    return 'PaymentMode(id: $id, type: $type, caption: $caption, method: $method, geoUnitPaymentModesId: $geoUnitPaymentModesId)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is PaymentMode &&
        other.id == id &&
        other.type == type &&
        other.caption == caption &&
        other.method == method &&
        other.geoUnitPaymentModesId == geoUnitPaymentModesId;
  }

  @override
  int get hashCode {
    return id.hashCode ^ type.hashCode ^ caption.hashCode ^ method.hashCode ^ geoUnitPaymentModesId.hashCode;
  }
}
