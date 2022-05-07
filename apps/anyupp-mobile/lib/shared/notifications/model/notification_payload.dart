import 'dart:convert';

import 'package:fa_prev/models/core/parsers.dart';
import 'package:flutter/foundation.dart';

enum NotificationPayloadType {
  RATE_ORDER,
  SHOW_ORDER,
  SHOW_DIALOG,
}

@immutable
class NotificationPayload {
  final NotificationPayloadType type;
  final String data;
  // Default constructor
  NotificationPayload(
    this.type,
    this.data,
  );

  NotificationPayload copyWith({
    NotificationPayloadType? type,
    String? data,
  }) {
    return NotificationPayload(
      type ?? this.type,
      data ?? this.data,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'type': enumToString(type),
      'data': data,
    };
  }

  factory NotificationPayload.fromMap(Map<String, dynamic> map) {
    return NotificationPayload(
      enumFromString(map['type'], NotificationPayloadType.values),
      map['data'],
    );
  }

  String toJson() => json.encode(toMap());

  factory NotificationPayload.fromJson(String source) =>
      NotificationPayload.fromMap(json.decode(source));

  @override
  String toString() => 'NotificationPayload(type: $type, data: $data)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is NotificationPayload &&
        other.type == type &&
        other.data == data;
  }

  @override
  int get hashCode => type.hashCode ^ data.hashCode;
}
