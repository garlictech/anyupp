import 'dart:convert';

import 'package:flutter/foundation.dart';

import 'package:fa_prev/models.dart';

abstract class PayloadData {
  PayloadData();

  PayloadData.fromJson(String json);

  String toJson();
}

@immutable
class RateOrderPayload extends PayloadData {
  final String orderId;
  final RatingPolicy? ratingPolicy;
  final TipPolicy? tipPolicy;
  RateOrderPayload({
    required this.orderId,
    this.ratingPolicy,
    this.tipPolicy,
  });

  RateOrderPayload copyWith({
    String? orderId,
    RatingPolicy? ratingPolicy,
    TipPolicy? tipPolicy,
  }) {
    return RateOrderPayload(
      orderId: orderId ?? this.orderId,
      ratingPolicy: ratingPolicy ?? this.ratingPolicy,
      tipPolicy: tipPolicy ?? this.tipPolicy,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'orderId': orderId,
      'ratingPolicy': ratingPolicy?.toJson(),
      'tipPolicy': tipPolicy?.toJson(),
    };
  }

  factory RateOrderPayload.fromMap(Map<String, dynamic> map) {
    return RateOrderPayload(
      orderId: map['orderId'] ?? '',
      ratingPolicy: map['ratingPolicy'] != null
          ? RatingPolicy.fromJson(map['ratingPolicy'])
          : null,
      tipPolicy: map['tipPolicy'] != null
          ? TipPolicy.fromJson(map['tipPolicy'])
          : null,
    );
  }

  String toJson() => json.encode(toMap());

  factory RateOrderPayload.fromJson(String source) =>
      RateOrderPayload.fromMap(json.decode(source));

  @override
  String toString() =>
      'RateOrderPayload(orderId: $orderId, ratingPolicy: $ratingPolicy, tipPolicy: $tipPolicy)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is RateOrderPayload &&
        other.orderId == orderId &&
        other.ratingPolicy == ratingPolicy &&
        other.tipPolicy == tipPolicy;
  }

  @override
  int get hashCode =>
      orderId.hashCode ^ ratingPolicy.hashCode ^ tipPolicy.hashCode;
}

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
