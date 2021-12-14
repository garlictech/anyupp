import 'package:flutter/foundation.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

@immutable
class Order {
  final String id;
  final String orderNum;
  final String userId;
  final String unitId;
  final List<OrderItem> items;
  final PaymentMode paymentMode;
  final PriceShown sumPriceShown;
  final Place? place;
  final double? paymentIntention;
  final List<StatusLog> statusLog;
  final String? createdAt;
  final bool archived;
  final Transaction? transaction;
  final PaymentStatus? transactionStatus;
  final String? transactionId;
  final ServingMode? servingMode;
  final OrderMode? orderMode;
  final Packaging? packaging;

  Order({
    required this.id,
    required this.orderNum,
    required this.userId,
    required this.unitId,
    required this.items,
    required this.paymentMode,
    required this.sumPriceShown,
    this.place,
    this.paymentIntention,
    required this.statusLog,
    this.createdAt,
    required this.archived,
    this.transaction,
    this.transactionStatus,
    this.transactionId,
    this.servingMode,
    this.orderMode,
    this.packaging,
  });
  // final UnpayCategory? unpayCategory;

  Order copyWith({
    String? id,
    String? orderNum,
    String? userId,
    String? unitId,
    List<OrderItem>? items,
    PaymentMode? paymentMode,
    PriceShown? sumPriceShown,
    Place? place,
    double? paymentIntention,
    List<StatusLog>? statusLog,
    String? created,
    bool? archived,
    Transaction? transaction,
    PaymentStatus? transactionStatus,
    String? transactionId,
    ServingMode? servingMode,
    OrderMode? orderMode,
    Packaging? packaging,
  }) {
    return Order(
      id: id ?? this.id,
      orderNum: orderNum ?? this.orderNum,
      userId: userId ?? this.userId,
      unitId: unitId ?? this.unitId,
      items: items ?? this.items,
      paymentMode: paymentMode ?? this.paymentMode,
      sumPriceShown: sumPriceShown ?? this.sumPriceShown,
      place: place ?? this.place,
      paymentIntention: paymentIntention ?? this.paymentIntention,
      statusLog: statusLog ?? this.statusLog,
      createdAt: created ?? this.createdAt,
      archived: archived ?? this.archived,
      transaction: transaction ?? this.transaction,
      transactionStatus: transactionStatus ?? this.transactionStatus,
      transactionId: transactionId ?? this.transactionId,
      servingMode: servingMode ?? this.servingMode,
      orderMode: orderMode ?? this.orderMode,
      packaging: packaging ?? this.packaging,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'orderNum': orderNum,
      'userId': userId,
      'unitId': unitId,
      'items': items.map((x) => x.toJson()).toList(),
      'paymentMode': paymentMode.toJson(),
      'sumPriceShown': sumPriceShown.toJson(),
      'place': place?.toJson(),
      'paymentIntention': paymentIntention,
      'statusLog': statusLog.map((x) => x.toJson()).toList(),
      'createdAt': createdAt,
      'archived': archived,
      'transaction': transaction?.toJson(),
      'transactionStatus': transactionStatus,
      'transactionId': transactionId,
      'servingMode': enumToString(servingMode),
      'orderMode': enumToString(orderMode),
      'packaging': packaging?.toJson(),
    };
  }

  factory Order.fromJson(Map<String, dynamic> map) {
    return Order(
      id: map['id'],
      orderNum: map['orderNum'],
      userId: map['userId'],
      unitId: map['unitId'],
      items:
          List<OrderItem>.from(map['items']?.map((x) => OrderItem.fromJson(x))),
      paymentMode: PaymentMode.fromJson(map['paymentMode']),
      sumPriceShown: PriceShown.fromJson(map['sumPriceShown']),
      place: map['place'] != null ? Place.fromJson(map['place']) : null,
      paymentIntention: map['paymentIntention'],
      statusLog: List<StatusLog>.from(
          map['statusLog']?.map((x) => StatusLog.fromJson(x))),
      createdAt: map['createdAt'],
      archived: map['archived'],
      transaction: map['transaction'] != null
          ? Transaction.fromJson(map['transaction'])
          : null,
      transactionStatus: map['transactionStatus'] != null
          ? enumFromString<PaymentStatus>(
              map['transactionStatus'], PaymentStatus.values)
          : null,
      transactionId: map['transactionId'],
      orderMode: enumFromStringNull(
          map['orderMode'], OrderMode.values, OrderMode.instant),
      servingMode: enumFromStringNull(
          map['servingMode'], ServingMode.values, ServingMode.inPlace),
      packaging: map['packaging'] != null
          ? Packaging.fromJson(map['packaging'])
          : null,
    );
  }

  @override
  String toString() {
    return 'Order(id: $id, orderNum: $orderNum, userId: $userId, unitId: $unitId, orderMode: $orderMode, servingMode: $servingMode, items: $items, paymentMode: $paymentMode, sumPriceShown: $sumPriceShown, place: $place, paymentIntention: $paymentIntention, statusLog: $statusLog, createdAt: $createdAt, archived: $archived, transaction: $transaction, transactionStatus: $transactionStatus, transactionId: $transactionId)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Order &&
        other.id == id &&
        other.orderNum == orderNum &&
        other.userId == userId &&
        other.unitId == unitId &&
        listEquals(other.items, items) &&
        other.paymentMode == paymentMode &&
        other.sumPriceShown == sumPriceShown &&
        other.place == place &&
        other.paymentIntention == paymentIntention &&
        listEquals(other.statusLog, statusLog) &&
        other.createdAt == createdAt &&
        other.archived == archived &&
        other.transaction == transaction &&
        other.transactionStatus == transactionStatus &&
        other.transactionId == transactionId &&
        other.servingMode == servingMode &&
        other.orderMode == orderMode;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        orderNum.hashCode ^
        userId.hashCode ^
        unitId.hashCode ^
        items.hashCode ^
        paymentMode.hashCode ^
        sumPriceShown.hashCode ^
        place.hashCode ^
        paymentIntention.hashCode ^
        statusLog.hashCode ^
        createdAt.hashCode ^
        archived.hashCode ^
        transaction.hashCode ^
        transactionStatus.hashCode ^
        transactionId.hashCode ^
        orderMode.hashCode ^
        servingMode.hashCode;
  }
}
