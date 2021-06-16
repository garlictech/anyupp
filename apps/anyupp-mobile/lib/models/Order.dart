import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';

import 'core/model_base.dart';

@immutable
class Order extends Model {
  final String id;
  final String orderNum;
  final String userId;
  final String unitId;
  final List<OrderItem> items;
  final PaymentMode paymentMode;
  final String staffId;
  final PriceShown sumPriceShown;
  final bool takeAway;
  final Place place;
  final int paymentIntention;
  final List<StatusLog> statusLog;
  final String created;
  final OrderStatus status;
  final bool archived;
  final TransactionItem transactionItem;

  @override
  String getId() {
    return id;
  }

  const Order._internal(
      {@required this.id,
      @required this.orderNum,
      @required this.userId,
      @required this.unitId,
      this.items,
      this.paymentMode,
      this.staffId,
      this.sumPriceShown,
      this.takeAway,
      this.place,
      this.paymentIntention,
      this.statusLog,
      this.created,
      this.status,
      this.archived,
      this.transactionItem});

  factory Order(
      {String id,
      @required String orderNum,
      @required String userId,
      @required String unitId,
      List<OrderItem> items,
      PaymentMode paymentMode,
      String staffId,
      PriceShown sumPriceShown,
      bool takeAway,
      Place place,
      int paymentIntention,
      List<StatusLog> statusLog,
      String created,
      OrderStatus status,
      bool archived,
      TransactionItem transactionItem}) {
    return Order._internal(
        id: id == null ? UUID.getUUID() : id,
        orderNum: orderNum,
        userId: userId,
        unitId: unitId,
        items: items != null ? List.unmodifiable(items) : items,
        paymentMode: paymentMode,
        staffId: staffId,
        sumPriceShown: sumPriceShown,
        takeAway: takeAway,
        place: place,
        paymentIntention: paymentIntention,
        statusLog: statusLog != null ? List.unmodifiable(statusLog) : statusLog,
        created: created,
        status: status,
        archived: archived,
        transactionItem: transactionItem);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Order &&
        id == other.id &&
        orderNum == other.orderNum &&
        userId == other.userId &&
        unitId == other.unitId &&
        DeepCollectionEquality().equals(items, other.items) &&
        paymentMode == other.paymentMode &&
        staffId == other.staffId &&
        sumPriceShown == other.sumPriceShown &&
        takeAway == other.takeAway &&
        place == other.place &&
        paymentIntention == other.paymentIntention &&
        DeepCollectionEquality().equals(statusLog, other.statusLog) &&
        created == other.created &&
        status == other.status &&
        archived == other.archived &&
        transactionItem == other.transactionItem;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("Order {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("orderNum=" + "$orderNum" + ", ");
    buffer.write("userId=" + "$userId" + ", ");
    buffer.write("unitId=" + "$unitId" + ", ");
    buffer.write("paymentMode=" + (paymentMode != null ? paymentMode.toString() : "null") + ", ");
    buffer.write("staffId=" + "$staffId" + ", ");
    buffer.write("sumPriceShown=" + (sumPriceShown != null ? sumPriceShown.toString() : "null") + ", ");
    buffer.write("takeAway=" + (takeAway != null ? takeAway.toString() : "null") + ", ");
    buffer.write("place=" + (place != null ? place.toString() : "null") + ", ");
    buffer.write("paymentIntention=" + (paymentIntention != null ? paymentIntention.toString() : "null") + ", ");
    buffer.write("created=" + (created != null ? created.toString() : "null") + ", ");
    buffer.write("status=" + (status != null ? enumToString(status) : "null"));
    buffer.write("archived=" + (archived != null ? archived.toString() : "null"));
    buffer.write("transactionItem=" + (transactionItem != null ? transactionItem.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Order copyWith(
      {String id,
      String orderItem,
      String userId,
      String unitId,
      List<OrderItem> items,
      PaymentMode paymentMode,
      String staffId,
      PriceShown sumPriceShown,
      bool takeAway,
      Place place,
      int paymentIntention,
      List<StatusLog> statusLog,
      String created,
      OrderStatus status,
      bool archived,
      TransactionItem transactionItem}) {
    return Order(
        id: id ?? this.id,
        orderNum: orderNum ?? this.orderNum,
        userId: userId ?? this.userId,
        unitId: unitId ?? this.unitId,
        items: items ?? this.items,
        paymentMode: paymentMode ?? this.paymentMode,
        staffId: staffId ?? this.staffId,
        sumPriceShown: sumPriceShown ?? this.sumPriceShown,
        takeAway: takeAway ?? this.takeAway,
        place: place ?? this.place,
        paymentIntention: paymentIntention ?? this.paymentIntention,
        statusLog: statusLog ?? this.statusLog,
        created: created ?? this.created,
        status: status ?? this.status,
        archived: archived ?? this.archived,
        transactionItem: transactionItem ?? this.transactionItem);
  }

  Order.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        orderNum = json['orderNum'],
        userId = json['userId'],
        unitId = json['unitId'],
        items = json['items'] is List
            ? (json['items'] as List).map((e) => OrderItem.fromJson(Map<String, dynamic>.from(e))).toList()
            : null,
        paymentMode =
            json['paymentMode'] != null ? PaymentMode.fromJson(Map<String, dynamic>.from(json['paymentMode'])) : null,
        staffId = json['staffId'],
        sumPriceShown = json['sumPriceShown'] != null
            ? PriceShown.fromJson(Map<String, dynamic>.from(json['sumPriceShown']))
            : null,
        takeAway = json['takeAway'],
        place = json['place'] != null ? Place.fromJson(Map<String, dynamic>.from(json['place'])) : null,
        paymentIntention = json['paymentIntention'],
        statusLog = json['statusLog'] is List
            ? (json['statusLog'] as List).map((e) => StatusLog.fromJson(Map<String, dynamic>.from(e))).toList()
            : null,
        created = json['createdAt'],
        status = enumFromString<OrderStatus>(json['status'], OrderStatus.values),
        archived = json['archived'],
        transactionItem = json['transaction'] != null
            ? TransactionItem.fromMap(Map<String, dynamic>.from(json['transaction']))
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'orderNum': orderNum,
        'userId': userId,
        'unitId': unitId,
        'items': items?.map((e) => e?.toJson())?.toList(),
        'paymentMode': paymentMode?.toJson(),
        'staffId': staffId,
        'sumPriceShown': sumPriceShown?.toJson(),
        'takeAway': takeAway,
        'place': place?.toJson(),
        'paymentIntention': paymentIntention,
        'statusLog': statusLog?.map((e) => e?.toJson())?.toList(),
        'createdAt': created,
        'status': enumToString(status),
        'archived': archived,
        'transaction': transactionItem.toMap()
      };

  String getFormattedDate() {
    final DateFormat parser = DateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    final DateFormat formatter = DateFormat('yyyy-MM-dd HH:mm:ss');
    if (this.created != null) {
      try {
        DateTime dateTime = parser.parseUTC(created).toLocal();
        return formatter.format(dateTime);
      } on Exception {
        return "";
      }
    } else {
      return "";
    }
  }
}
