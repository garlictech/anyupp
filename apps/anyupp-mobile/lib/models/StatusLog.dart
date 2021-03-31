import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class StatusLog extends Model {
  final String id;
  final String userId;
  final String status;
  final int ts;
  final String orderStatusLogId;
  final String orderItemStatusLogId;

  @override
  String getId() {
    return id;
  }

  const StatusLog._internal(
      {@required this.id,
      @required this.userId,
      this.status,
      this.ts,
      this.orderStatusLogId,
      this.orderItemStatusLogId});

  factory StatusLog(
      {String id,
      @required String userId,
      String status,
      int ts,
      String orderStatusLogId,
      String orderItemStatusLogId}) {
    return StatusLog._internal(
        id: id == null ? UUID.getUUID() : id,
        userId: userId,
        status: status,
        ts: ts,
        orderStatusLogId: orderStatusLogId,
        orderItemStatusLogId: orderItemStatusLogId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StatusLog &&
        id == other.id &&
        userId == other.userId &&
        status == other.status &&
        ts == other.ts &&
        orderStatusLogId == other.orderStatusLogId &&
        orderItemStatusLogId == other.orderItemStatusLogId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("StatusLog {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("userId=" + "$userId" + ", ");
    buffer.write("status=" + "$status" + ", ");
    buffer.write("ts=" + (ts != null ? ts.toString() : "null") + ", ");
    buffer.write("orderStatusLogId=" + "$orderStatusLogId" + ", ");
    buffer.write("orderItemStatusLogId=" + "$orderItemStatusLogId");
    buffer.write("}");

    return buffer.toString();
  }

  StatusLog copyWith(
      {String id,
      String userId,
      String status,
      int ts,
      String orderStatusLogId,
      String orderItemStatusLogId}) {
    return StatusLog(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        status: status ?? this.status,
        ts: ts ?? this.ts,
        orderStatusLogId: orderStatusLogId ?? this.orderStatusLogId,
        orderItemStatusLogId:
            orderItemStatusLogId ?? this.orderItemStatusLogId);
  }

  StatusLog.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        userId = json['userId'],
        status = json['status'],
        ts = json['ts'],
        orderStatusLogId = json['orderStatusLogId'],
        orderItemStatusLogId = json['orderItemStatusLogId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'status': status,
        'ts': ts,
        'orderStatusLogId': orderStatusLogId,
        'orderItemStatusLogId': orderItemStatusLogId
      };
}
