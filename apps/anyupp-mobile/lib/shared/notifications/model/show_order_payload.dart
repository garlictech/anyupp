import 'dart:convert';
import '/shared/notifications/model/payload_data.dart';
import 'package:flutter/foundation.dart';

@immutable
class ShowOrderPayload extends PayloadData {
  final String orderId;
  final String unitId;

  ShowOrderPayload({
    required this.orderId,
    required this.unitId,
  });

  ShowOrderPayload copyWith({
    String? orderId,
    String? unitId,
  }) {
    return ShowOrderPayload(
      orderId: orderId ?? this.orderId,
      unitId: unitId ?? this.unitId,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'orderId': orderId,
      'unitId': unitId,
    };
  }

  factory ShowOrderPayload.fromMap(Map<String, dynamic> map) {
    return ShowOrderPayload(
      orderId: map['orderId'] ?? '',
      unitId: map['unitId'] ?? '',
    );
  }

  String toJson() => json.encode(toMap());

  factory ShowOrderPayload.fromJson(String source) =>
      ShowOrderPayload.fromMap(json.decode(source));

  @override
  String toString() => 'ShowOrderPayload(orderId: $orderId, unitId: $unitId)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ShowOrderPayload &&
        other.orderId == orderId &&
        other.unitId == unitId;
  }

  @override
  int get hashCode => orderId.hashCode ^ unitId.hashCode;
}
