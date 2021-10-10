import 'package:flutter/foundation.dart';

@immutable
class StatusLog {
  final String? id;
  final String userId;
  final String status;
  final double ts;

  StatusLog({
    this.id,
    required this.userId,
    required this.status,
    required this.ts,
  });

  StatusLog copyWith({
    String? id,
    String? userId,
    String? status,
    double? ts,
  }) {
    return StatusLog(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      status: status ?? this.status,
      ts: ts ?? this.ts,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'status': status,
      'ts': ts,
    };
  }

  factory StatusLog.fromJson(Map<String, dynamic> map) {
    return StatusLog(
      id: map['id'],
      userId: map['userId'],
      status: map['status'],
      ts: map['ts'],
    );
  }

  @override
  String toString() {
    return 'StatusLog(id: $id, userId: $userId, status: $status, ts: $ts)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is StatusLog && other.id == id && other.userId == userId && other.status == status && other.ts == ts;
  }

  @override
  int get hashCode {
    return id.hashCode ^ userId.hashCode ^ status.hashCode ^ ts.hashCode;
  }
}
