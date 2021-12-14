import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';

import 'package:flutter/foundation.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

@immutable
class GeoUnit {
  final String id;
  final String groupId;
  final String chainId;
  final String name;
  final Address address;
  final ChainStyle style;
  final List<PaymentMode?>? paymentModes;
  final int distance;
  final String currency;
  final bool isAcceptingOrders;
  final List<OpeningHours> openingHoursNext7;
  final List<ServingMode> supportedServingModes;
  final List<OrderMode> supportedOrderModes;
  final double packagingTax;

  GeoUnit({
    required this.id,
    required this.groupId,
    required this.chainId,
    required this.name,
    required this.address,
    required this.style,
    this.paymentModes,
    required this.distance,
    required this.currency,
    required this.isAcceptingOrders,
    required this.openingHoursNext7,
    required this.supportedServingModes,
    required this.supportedOrderModes,
    required this.packagingTax,
  });

  GeoUnit copyWith({
    String? id,
    String? groupId,
    String? chainId,
    String? name,
    Address? address,
    ChainStyle? style,
    List<PaymentMode?>? paymentModes,
    int? distance,
    String? currency,
    bool? isAcceptingOrders,
    List<OpeningHours>? openingHoursNext7,
    List<ServingMode>? supportedServingModes,
    List<OrderMode>? supportedOrderModes,
    double? packagingTax,
  }) {
    return GeoUnit(
      id: id ?? this.id,
      groupId: groupId ?? this.groupId,
      chainId: chainId ?? this.chainId,
      name: name ?? this.name,
      address: address ?? this.address,
      style: style ?? this.style,
      paymentModes: paymentModes ?? this.paymentModes,
      distance: distance ?? this.distance,
      currency: currency ?? this.currency,
      isAcceptingOrders: isAcceptingOrders ?? this.isAcceptingOrders,
      openingHoursNext7: openingHoursNext7 ?? this.openingHoursNext7,
      supportedServingModes:
          supportedServingModes ?? this.supportedServingModes,
      supportedOrderModes: supportedOrderModes ?? this.supportedOrderModes,
      packagingTax: packagingTax ?? this.packagingTax,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'groupId': groupId,
      'chainId': chainId,
      'name': name,
      'address': address.toJson(),
      'style': style.toJson(),
      'paymentModes': paymentModes?.map((x) => x?.toJson()).toList(),
      'distance': distance,
      'currency': currency,
      'isAcceptingOrders': isAcceptingOrders,
      'openingHoursNext7': openingHoursNext7.map((x) => x.toJson()).toList(),
      'supportedServingModes':
          supportedServingModes.map((x) => enumToString(x)).toList(),
      'supportedOrderModes':
          supportedOrderModes.map((x) => enumToString(x)).toList(),
      'packagingTax': packagingTax,
    };
  }

  factory GeoUnit.fromJson(Map<String, dynamic> map) {
    return GeoUnit(
      id: map['id'],
      groupId: map['groupId'],
      chainId: map['chainId'],
      name: map['name'],
      address: Address.fromJson(map['address']),
      style: ChainStyle.fromJson(map['style']),
      paymentModes: List<PaymentMode?>.from(
          map['paymentModes']?.map((x) => PaymentMode?.fromJson(x))),
      distance: map['distance'],
      currency: map['currency'],
      isAcceptingOrders: map['isAcceptingOrders'],
      openingHoursNext7: map['openingHoursNext7'] != null
          ? List<OpeningHours>.from(
              map['openingHoursNext7']?.map((x) => OpeningHours.fromJson(x)))
          : [],
      supportedServingModes: map['supportedServingModes'] != null
          ? List<ServingMode>.from(map['supportedServingModes']
              ?.map((x) => enumFromString(x, ServingMode.values)))
          : [ServingMode.inPlace],
      supportedOrderModes: map['supportedOrderModes'] != null
          ? List<OrderMode>.from(map['supportedOrderModes']
              ?.map((x) => enumFromString(x, OrderMode.values)))
          : [OrderMode.instant],
      packagingTax: map['packagingTax'] ?? 0,
    );
  }

  @override
  String toString() {
    return 'GeoUnit(id: $id, groupId: $groupId, chainId: $chainId, name: $name, packagingTax: $packagingTax, address: $address, style: $style, paymentModes: $paymentModes, distance: $distance, currency: $currency, isAcceptingOrders: $isAcceptingOrders, openingHoursNext7: $openingHoursNext7, supportedServingModes: $supportedServingModes, supportedOrderModes: $supportedOrderModes)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    final listEquals = const DeepCollectionEquality().equals;

    return other is GeoUnit &&
        other.id == id &&
        other.groupId == groupId &&
        other.chainId == chainId &&
        other.name == name &&
        other.address == address &&
        other.style == style &&
        listEquals(other.paymentModes, paymentModes) &&
        other.distance == distance &&
        other.currency == currency &&
        other.isAcceptingOrders == isAcceptingOrders &&
        listEquals(other.openingHoursNext7, openingHoursNext7) &&
        listEquals(other.supportedServingModes, supportedServingModes) &&
        listEquals(other.supportedOrderModes, supportedOrderModes) &&
        other.packagingTax == packagingTax;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        groupId.hashCode ^
        chainId.hashCode ^
        name.hashCode ^
        address.hashCode ^
        style.hashCode ^
        paymentModes.hashCode ^
        distance.hashCode ^
        currency.hashCode ^
        isAcceptingOrders.hashCode ^
        supportedServingModes.hashCode ^
        supportedOrderModes.hashCode ^
        openingHoursNext7.hashCode ^
        packagingTax.hashCode;
  }
}
