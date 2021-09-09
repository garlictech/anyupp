import 'package:flutter/foundation.dart';

@immutable
class StatusLog {
  final String? id;
  final String userId;
  final String status;
  final double ts;
  final String? orderStatusLogId; // TODO ez mit keres itt?
  final String? orderItemStatusLogId; // TODO ez mit keres itt?

  StatusLog({
    this.id,
    required this.userId,
    required this.status,
    required this.ts,
    this.orderStatusLogId,
    this.orderItemStatusLogId,
  });

  StatusLog copyWith({
    String? id,
    String? userId,
    String? status,
    double? ts,
    String? orderStatusLogId,
    String? orderItemStatusLogId,
  }) {
    return StatusLog(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      status: status ?? this.status,
      ts: ts ?? this.ts,
      orderStatusLogId: orderStatusLogId ?? this.orderStatusLogId,
      orderItemStatusLogId: orderItemStatusLogId ?? this.orderItemStatusLogId,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'status': status,
      'ts': ts,
      'orderStatusLogId': orderStatusLogId,
      'orderItemStatusLogId': orderItemStatusLogId,
    };
  }

  factory StatusLog.fromJson(Map<String, dynamic> map) {
    return StatusLog(
      id: map['id'],
      userId: map['userId'],
      status: map['status'],
      ts: map['ts'],
      orderStatusLogId: map['orderStatusLogId'],
      orderItemStatusLogId: map['orderItemStatusLogId'],
    );
  }

  @override
  String toString() {
    return 'StatusLog(id: $id, userId: $userId, status: $status, ts: $ts, orderStatusLogId: $orderStatusLogId, orderItemStatusLogId: $orderItemStatusLogId)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is StatusLog &&
        other.id == id &&
        other.userId == userId &&
        other.status == status &&
        other.ts == ts &&
        other.orderStatusLogId == orderStatusLogId &&
        other.orderItemStatusLogId == orderItemStatusLogId;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        userId.hashCode ^
        status.hashCode ^
        ts.hashCode ^
        orderStatusLogId.hashCode ^
        orderItemStatusLogId.hashCode;
  }
}
