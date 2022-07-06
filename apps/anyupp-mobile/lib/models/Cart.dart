import 'dart:convert';

import 'package:collection/collection.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class Cart {
  final String? id;
  final int? version;
  final String userId;
  final String unitId;
  final List<OrderItem> items;
  final PaymentMode? paymentMode;
  final Place? place;
  final ServingMode servingMode;
  final OrderMode orderMode;
  final OrderPolicy orderPolicy;
  final ServiceFeePolicy? serviceFeePolicy;
  final List<RatingPolicy>? ratingPolicies;
  final TipPolicy? tipPolicy;
  final SoldOutVisibilityPolicy? soldOutVisibilityPolicy;
  final CumulatedPrice? serviceFee;
  final Price? packagingSum;
  final PriceShown? sumPriceShown;
  final double packagingFeeTaxPercentage;
  final OrderRating? rating;
  final bool? hasRated;
  final Tip? tip;
  final String? guestLabel;

  Cart({
    this.id,
    this.version,
    required this.userId,
    required this.unitId,
    required this.items,
    this.paymentMode,
    this.place,
    required this.servingMode,
    required this.orderMode,
    required this.orderPolicy,
    this.serviceFeePolicy,
    this.ratingPolicies,
    this.tipPolicy,
    this.soldOutVisibilityPolicy,
    this.serviceFee,
    this.packagingSum,
    this.sumPriceShown,
    required this.packagingFeeTaxPercentage,
    this.rating,
    this.hasRated,
    this.tip,
    this.guestLabel,
  });

  Cart copyWith({
    String? id,
    int? version,
    String? userId,
    String? unitId,
    List<OrderItem>? items,
    PaymentMode? paymentMode,
    Place? place,
    ServingMode? servingMode,
    OrderMode? orderMode,
    OrderPolicy? orderPolicy,
    ServiceFeePolicy? serviceFeePolicy,
    List<RatingPolicy>? ratingPolicies,
    TipPolicy? tipPolicy,
    SoldOutVisibilityPolicy? soldOutVisibilityPolicy,
    CumulatedPrice? serviceFee,
    Price? packagingSum,
    PriceShown? sumPriceShown,
    double? packagingFeeTaxPercentage,
    OrderRating? rating,
    bool? hasRated,
    Tip? tip,
    String? guestLabel,
  }) {
    return Cart(
      id: id ?? this.id,
      version: version ?? this.version,
      userId: userId ?? this.userId,
      unitId: unitId ?? this.unitId,
      items: items ?? this.items,
      paymentMode: paymentMode ?? this.paymentMode,
      place: place ?? this.place,
      servingMode: servingMode ?? this.servingMode,
      orderMode: orderMode ?? this.orderMode,
      orderPolicy: orderPolicy ?? this.orderPolicy,
      serviceFeePolicy: serviceFeePolicy ?? this.serviceFeePolicy,
      ratingPolicies: ratingPolicies ?? this.ratingPolicies,
      tipPolicy: tipPolicy ?? this.tipPolicy,
      soldOutVisibilityPolicy:
          soldOutVisibilityPolicy ?? this.soldOutVisibilityPolicy,
      serviceFee: serviceFee ?? this.serviceFee,
      packagingSum: packagingSum ?? this.packagingSum,
      sumPriceShown: sumPriceShown ?? this.sumPriceShown,
      packagingFeeTaxPercentage:
          packagingFeeTaxPercentage ?? this.packagingFeeTaxPercentage,
      rating: rating ?? this.rating,
      hasRated: hasRated ?? this.hasRated,
      tip: tip ?? this.tip,
      guestLabel: guestLabel ?? this.guestLabel,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'version': version,
      'userId': userId,
      'unitId': unitId,
      'items': items.map((x) => x.toJson()).toList(),
      'paymentMode': paymentMode?.toJson(),
      'place': place?.toJson(),
      'servingMode': enumToString(servingMode),
      'orderMode': enumToString(orderMode),
      'orderPolicy': enumToString(orderPolicy),
      'serviceFeePolicy': serviceFeePolicy?.toJson(),
      'ratingPolicies': ratingPolicies?.map((x) => x.toJson()).toList(),
      'tipPolicy': tipPolicy?.toJson(),
      'soldOutVisibilityPolicy': enumToString(soldOutVisibilityPolicy),
      'serviceFee': enumToString(serviceFee),
      'packagingSum': packagingSum?.toJson(),
      'sumPriceShown': sumPriceShown?.toJson(),
      'packagingFeeTaxPercentage': packagingFeeTaxPercentage,
      'rating': rating?.toJson(),
      'hasRated': hasRated,
      'tip': tip?.toJson(),
      'guestLabel': guestLabel,
    };
  }

  factory Cart.fromJson(Map<String, dynamic> map) {
    return Cart(
      id: map['id'],
      version: map['version']?.toInt(),
      userId: map['userId'] ?? '',
      unitId: map['unitId'] ?? '',
      items:
          List<OrderItem>.from(map['items']?.map((x) => OrderItem.fromJson(x))),
      paymentMode: map['paymentMode'] != null
          ? PaymentMode.fromJson(map['paymentMode'])
          : null,
      place: map['place'] != null ? Place.fromJson(map['place']) : null,
      servingMode: enumFromStringNull(map['servingMode'], ServingMode.values) ??
          ServingMode.inPlace,
      orderMode: enumFromStringNull(map['orderMode'], OrderMode.values) ??
          OrderMode.instant,
      orderPolicy: enumFromStringNull(map['orderPolicy'], OrderPolicy.values) ??
          OrderPolicy.full,
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
      serviceFee: map['serviceFee'] != null
          ? CumulatedPrice.fromJson(map['serviceFee'])
          : null,
      packagingSum: map['packagingSum'] != null
          ? Price.fromJson(map['packagingSum'])
          : null,
      sumPriceShown: map['sumPriceShown'] != null
          ? PriceShown.fromJson(map['sumPriceShown'])
          : null,
      packagingFeeTaxPercentage:
          map['packagingFeeTaxPercentage']?.toDouble() ?? 0.0,
      rating:
          map['rating'] != null ? OrderRating.fromJson(map['rating']) : null,
      hasRated: map['hasRated'],
      tip: map['tip'] != null ? Tip.fromJson(map['tip']) : null,
      guestLabel: map['guestLabel'],
    );
  }

  String toJsonString() => json.encode(
        toJson(),
        toEncodable: (object) => enumToString(object),
      );

  factory Cart.fromJsonString(String source) =>
      Cart.fromJson(json.decode(source));

  @override
  String toString() {
    return 'Cart(id: $id, version: $version, userId: $userId, unitId: $unitId, guestLabel: $guestLabel, items: $items, paymentMode: $paymentMode, place: $place, servingMode: $servingMode, orderMode: $orderMode, orderPolicy: $orderPolicy, serviceFeePolicy: $serviceFeePolicy, ratingPolicies: $ratingPolicies, tipPolicy: $tipPolicy, soldOutVisibilityPolicy: $soldOutVisibilityPolicy, serviceFee: $serviceFee, packagingSum: $packagingSum, sumPriceShown: $sumPriceShown, packagingFeeTaxPercentage: $packagingFeeTaxPercentage, rating: $rating, hasRated: $hasRated, tip: $tip)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    final listEquals = const DeepCollectionEquality().equals;

    return other is Cart &&
        other.id == id &&
        other.version == version &&
        other.userId == userId &&
        other.unitId == unitId &&
        listEquals(other.items, items) &&
        other.paymentMode == paymentMode &&
        other.place == place &&
        other.servingMode == servingMode &&
        other.orderMode == orderMode &&
        other.orderPolicy == orderPolicy &&
        other.serviceFeePolicy == serviceFeePolicy &&
        listEquals(other.ratingPolicies, ratingPolicies) &&
        other.tipPolicy == tipPolicy &&
        other.soldOutVisibilityPolicy == soldOutVisibilityPolicy &&
        other.serviceFee == serviceFee &&
        other.packagingSum == packagingSum &&
        other.sumPriceShown == sumPriceShown &&
        other.packagingFeeTaxPercentage == packagingFeeTaxPercentage &&
        other.rating == rating &&
        other.hasRated == hasRated &&
        other.guestLabel == guestLabel &&
        other.tip == tip;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        version.hashCode ^
        userId.hashCode ^
        unitId.hashCode ^
        items.hashCode ^
        paymentMode.hashCode ^
        place.hashCode ^
        servingMode.hashCode ^
        orderMode.hashCode ^
        orderPolicy.hashCode ^
        serviceFeePolicy.hashCode ^
        ratingPolicies.hashCode ^
        tipPolicy.hashCode ^
        soldOutVisibilityPolicy.hashCode ^
        serviceFee.hashCode ^
        packagingSum.hashCode ^
        sumPriceShown.hashCode ^
        packagingFeeTaxPercentage.hashCode ^
        rating.hashCode ^
        hasRated.hashCode ^
        tip.hashCode ^
        guestLabel.hashCode;
  }
}
