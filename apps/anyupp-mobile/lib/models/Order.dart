import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/utils/graphql_coercers.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

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
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool archived;
  final Transaction? transaction;
  final PaymentStatus? transactionStatus;
  final String? transactionId;
  final ServingMode? servingMode;
  final OrderMode? orderMode;
  final Price? packagingSum;
  final OrderRating? rating;
  final bool? hasRated;
  final Tip? tip;
  final PaymentStatus? tipTransactionStatus;
  final String? tipTransactionId;
  final Transaction? tipTransaction;
  final CumulatedPrice? serviceFee;
  final OrderPolicy orderPolicy;
  final ServiceFeePolicy? serviceFeePolicy;
  final List<RatingPolicy>? ratingPolicies;
  final TipPolicy? tipPolicy;
  final SoldOutVisibilityPolicy? soldOutVisibilityPolicy;
  final OrderStatus? currentStatus;

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
    required this.createdAt,
    required this.updatedAt,
    required this.archived,
    this.transaction,
    this.transactionStatus,
    this.transactionId,
    this.servingMode,
    this.orderMode,
    this.packagingSum,
    this.rating,
    this.hasRated,
    this.tip,
    this.tipTransactionStatus,
    this.tipTransactionId,
    this.tipTransaction,
    this.serviceFee,
    required this.orderPolicy,
    this.serviceFeePolicy,
    this.ratingPolicies,
    this.tipPolicy,
    this.soldOutVisibilityPolicy,
    this.currentStatus,
  });

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
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? archived,
    Transaction? transaction,
    PaymentStatus? transactionStatus,
    String? transactionId,
    ServingMode? servingMode,
    OrderMode? orderMode,
    Price? packagingSum,
    OrderRating? rating,
    bool? hasRated,
    Tip? tip,
    PaymentStatus? tipTransactionStatus,
    String? tipTransactionId,
    Transaction? tipTransaction,
    CumulatedPrice? serviceFee,
    OrderPolicy? orderPolicy,
    ServiceFeePolicy? serviceFeePolicy,
    List<RatingPolicy>? ratingPolicies,
    TipPolicy? tipPolicy,
    SoldOutVisibilityPolicy? soldOutVisibilityPolicy,
    OrderStatus? currentStatus,
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
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      archived: archived ?? this.archived,
      transaction: transaction ?? this.transaction,
      transactionStatus: transactionStatus ?? this.transactionStatus,
      transactionId: transactionId ?? this.transactionId,
      servingMode: servingMode ?? this.servingMode,
      orderMode: orderMode ?? this.orderMode,
      packagingSum: packagingSum ?? this.packagingSum,
      rating: rating ?? this.rating,
      hasRated: hasRated ?? this.hasRated,
      tip: tip ?? this.tip,
      tipTransactionStatus: tipTransactionStatus ?? this.tipTransactionStatus,
      tipTransactionId: tipTransactionId ?? this.tipTransactionId,
      tipTransaction: tipTransaction ?? this.tipTransaction,
      serviceFee: serviceFee ?? this.serviceFee,
      orderPolicy: orderPolicy ?? this.orderPolicy,
      serviceFeePolicy: serviceFeePolicy ?? this.serviceFeePolicy,
      ratingPolicies: ratingPolicies ?? this.ratingPolicies,
      tipPolicy: tipPolicy ?? this.tipPolicy,
      soldOutVisibilityPolicy:
          soldOutVisibilityPolicy ?? this.soldOutVisibilityPolicy,
      currentStatus: currentStatus ?? this.currentStatus,
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
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'archived': archived,
      'transaction': transaction?.toJson(),
      'transactionStatus': transactionStatus,
      'transactionId': transactionId,
      'servingMode': enumToString(servingMode),
      'orderMode': enumToString(orderMode),
      'packagingSum': packagingSum?.toJson(),
      'rating': rating?.toJson(),
      'hasRated': hasRated,
      'tip': tip?.toJson(),
      'tipTransactionStatus': tipTransactionStatus,
      'tipTransactionId': tipTransactionId,
      'tipTransaction': tipTransaction?.toJson(),
      'serviceFee': serviceFee?.toJson(),
      'orderPolicy': enumToString(orderPolicy),
      'serviceFeePolicy': serviceFeePolicy?.toJson(),
      'ratingPolicies': ratingPolicies?.map((x) => x.toJson()).toList(),
      'tipPolicy': tipPolicy?.toJson(),
      'soldOutVisibilityPolicy': enumToString(soldOutVisibilityPolicy),
      'currentStatus': enumToString(currentStatus),
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
      packagingSum: map['packagingSum'] != null
          ? Price.fromJson(map['packagingSum'])
          : null,
      rating:
          map['rating'] != null ? OrderRating.fromJson(map['rating']) : null,
      hasRated: map['hasRated'] ?? false,
      tip: map['tip'] != null ? Tip.fromJson(map['tip']) : null,
      tipTransactionStatus: map['tipTransactionStatus'] != null
          ? enumFromString<PaymentStatus>(
              map['tipTransactionStatus'], PaymentStatus.values)
          : null,
      tipTransactionId: map['tipTransactionId'],
      tipTransaction: map['tipTransaction'] != null
          ? Transaction.fromJson(map['tipTransaction'])
          : null,
      serviceFee: map['serviceFee'] != null
          ? CumulatedPrice.fromJson(map['serviceFee'])
          : null,
      orderPolicy: map['orderPolicy'] != null
          ? enumFromString(map['orderPolicy'], OrderPolicy.values)
          : OrderPolicy.full,
      serviceFeePolicy: map['serviceFeePolicy'] != null
          ? ServiceFeePolicy.fromJson(map['serviceFeePolicy'])
          : null,
      ratingPolicies: map['ratingPolicies'] != null
          ? List<RatingPolicy>.from(
              map['ratingPolicies']?.map((x) => RatingPolicy.fromJson(x)))
          : null,
      tipPolicy: map['tipPolicy'] != null
          ? TipPolicy.fromJson(map['tipPolicy'])
          : null,
      soldOutVisibilityPolicy: enumFromStringNull(
          map['soldOutVisibilityPolicy'], SoldOutVisibilityPolicy.values),
      currentStatus:
          enumFromStringNull(map['currentStatus'], OrderStatus.values),
      createdAt: fromGraphQLAWSDateTimeToDartDateTime(map['createdAt']),
      updatedAt: fromGraphQLAWSDateTimeToDartDateTime(map['updatedAt']),
    );
  }

  @override
  String toString() {
    return 'Order(id: $id, orderNum: $orderNum, userId: $userId, unitId: $unitId, currentStatus:$currentStatus, serviceFee: $serviceFee, orderMode: $orderMode, servingMode: $servingMode, items: $items, paymentMode: $paymentMode, sumPriceShown: $sumPriceShown, place: $place, paymentIntention: $paymentIntention, createdAt: $createdAt, archived: $archived, transaction: $transaction, transactionStatus: $transactionStatus, transactionId: $transactionId)';
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
        other.createdAt == createdAt &&
        other.updatedAt == updatedAt &&
        other.archived == archived &&
        other.transaction == transaction &&
        other.transactionStatus == transactionStatus &&
        other.transactionId == transactionId &&
        other.servingMode == servingMode &&
        other.orderMode == orderMode &&
        other.rating == rating &&
        other.hasRated == hasRated &&
        other.tip == tip &&
        other.tipTransactionStatus == tipTransactionStatus &&
        other.tipTransactionId == tipTransactionId &&
        other.tipTransaction == tipTransaction &&
        other.serviceFee == serviceFee &&
        other.orderPolicy == orderPolicy &&
        other.serviceFeePolicy == serviceFeePolicy &&
        listEquals(other.ratingPolicies, ratingPolicies) &&
        other.tipPolicy == tipPolicy &&
        other.soldOutVisibilityPolicy == soldOutVisibilityPolicy &&
        other.currentStatus == currentStatus;
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
        createdAt.hashCode ^
        updatedAt.hashCode ^
        archived.hashCode ^
        transaction.hashCode ^
        transactionStatus.hashCode ^
        transactionId.hashCode ^
        orderMode.hashCode ^
        servingMode.hashCode ^
        rating.hashCode ^
        hasRated.hashCode ^
        tip.hashCode ^
        tipTransactionStatus.hashCode ^
        tipTransactionId.hashCode ^
        tipTransaction.hashCode ^
        serviceFee.hashCode ^
        orderPolicy.hashCode ^
        serviceFeePolicy.hashCode ^
        ratingPolicies.hashCode ^
        tipPolicy.hashCode ^
        soldOutVisibilityPolicy.hashCode ^
        currentStatus.hashCode;
  }
}
