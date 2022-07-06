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
  final OrderPolicy orderPolicy;
  final double packagingTax;
  final List<RatingPolicy>? ratingPolicies;
  final TipPolicy? tipPolicy;
  final ServiceFeePolicy? serviceFeePolicy;
  final SoldOutVisibilityPolicy? soldOutVisibilityPolicy;
  final OrderPaymentPolicy? orderPaymentPolicy;
  final Location? location;
  final bool? adBannersEnabled;
  final List<ImageAsset>? adBanners;
  final bool? canRequestVatInvoice;
  final LocalizedItem? description;
  final String? email;
  final String? phone;
  final bool? coverBannersEnabled;
  final List<ImageAsset>? coverBanners;
  final bool? canCallWaiter;
  final bool isVisibleInApp;

  GeoUnit({
    required this.id,
    required this.groupId,
    required this.chainId,
    required this.name,
    required this.address,
    required this.style,
    required this.distance,
    required this.currency,
    required this.isAcceptingOrders,
    required this.openingHoursNext7,
    required this.supportedServingModes,
    required this.supportedOrderModes,
    required this.orderPolicy,
    required this.packagingTax,
    this.paymentModes,
    this.ratingPolicies,
    this.tipPolicy,
    this.serviceFeePolicy,
    this.soldOutVisibilityPolicy,
    this.orderPaymentPolicy,
    this.location,
    this.adBannersEnabled,
    this.adBanners,
    this.canRequestVatInvoice,
    this.description,
    this.email,
    this.phone,
    this.coverBannersEnabled,
    this.coverBanners,
    this.canCallWaiter,
    this.isVisibleInApp = true,
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
    OrderPolicy? orderPolicy,
    double? packagingTax,
    List<RatingPolicy>? ratingPolicies,
    TipPolicy? tipPolicy,
    ServiceFeePolicy? serviceFeePolicy,
    SoldOutVisibilityPolicy? soldOutVisibilityPolicy,
    OrderPaymentPolicy? orderPaymentPolicy,
    Location? location,
    bool? adBannersEnabled,
    List<ImageAsset>? adBanners,
    bool? canRequestVatInvoice,
    LocalizedItem? description,
    String? email,
    String? phone,
    bool? coverBannersEnabled,
    List<ImageAsset>? coverBanners,
    bool? canCallWaiter,
    bool? isVisibleInApp,
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
      orderPolicy: orderPolicy ?? this.orderPolicy,
      packagingTax: packagingTax ?? this.packagingTax,
      ratingPolicies: ratingPolicies ?? this.ratingPolicies,
      tipPolicy: tipPolicy ?? this.tipPolicy,
      serviceFeePolicy: serviceFeePolicy ?? this.serviceFeePolicy,
      soldOutVisibilityPolicy:
          soldOutVisibilityPolicy ?? this.soldOutVisibilityPolicy,
      orderPaymentPolicy: orderPaymentPolicy ?? this.orderPaymentPolicy,
      location: location ?? this.location,
      adBannersEnabled: adBannersEnabled ?? this.adBannersEnabled,
      adBanners: adBanners ?? this.adBanners,
      canRequestVatInvoice:
          canRequestVatInvoice ?? this.canRequestVatInvoice ?? true,
      description: description ?? this.description,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      coverBannersEnabled: coverBannersEnabled ?? this.coverBannersEnabled,
      coverBanners: coverBanners ?? this.coverBanners,
      canCallWaiter: canCallWaiter ?? this.canCallWaiter,
      isVisibleInApp: isVisibleInApp ?? this.isVisibleInApp,
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
      'orderPolicy': enumToString(orderPolicy),
      'packagingTaxPercentage': packagingTax,
      'ratingPolicies': ratingPolicies?.map((x) => x.toJson()).toList(),
      'tipPolicy': tipPolicy?.toJson(),
      'serviceFeePolicy': serviceFeePolicy?.toJson(),
      'soldOutVisibilityPolicy': enumToString(soldOutVisibilityPolicy),
      'orderPaymentPolicy': enumToString(orderPaymentPolicy),
      'location': location?.toJson(),
      'adBannersEnabled': adBannersEnabled,
      'adBanners': adBanners?.map((x) => x.toJson()).toList(),
      'canRequestVatInvoice': canRequestVatInvoice,
      'description': description?.toJson(),
      'email': email,
      'phone': phone,
      'coverBannersEnabled': coverBannersEnabled,
      'coverBanners': coverBanners?.map((x) => x.toJson()).toList(),
      'canCallWaiter': canCallWaiter,
      'isVisibleInApp': isVisibleInApp,
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
      distance: map['distance'] ?? 0,
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
      orderPolicy: map['orderPolicy'] != null
          ? enumFromString(map['orderPolicy'], OrderPolicy.values)
          : Mock.mockOrderPolicy(),
      packagingTax: map['unit']?['packagingTaxPercentage'] ?? 0,
      ratingPolicies: map['ratingPolicies'] != null
          ? List<RatingPolicy>.from(
              map['ratingPolicies']?.map((x) => RatingPolicy.fromJson(x)))
          : Mock.mockRatingPolicy() != null
              ? [Mock.mockRatingPolicy()!]
              : null,
      tipPolicy: map['tipPolicy'] != null
          ? TipPolicy.fromJson(map['tipPolicy'])
          : Mock.mockTipPolicy(),
      serviceFeePolicy: map['serviceFeePolicy'] != null
          ? ServiceFeePolicy.fromJson(map['serviceFeePolicy'])
          : Mock.mockServiceFeePolicy(),
      soldOutVisibilityPolicy: enumFromStringNull(
        map['soldOutVisibilityPolicy'],
        SoldOutVisibilityPolicy.values,
      ),
      orderPaymentPolicy: enumFromStringNull(
            map['unit']?['orderPaymentPolicy'],
            OrderPaymentPolicy.values,
          ) ??
          OrderPaymentPolicy.prepay, // TODO mock, kivenni
      location:
          map['location'] != null ? Location.fromJson(map['location']) : null,
      adBannersEnabled: map['unit']?['adBannersEnabled'] ?? false,
      adBanners: map['unit']?['adBanners'] != null
          ? List<ImageAsset>.from(
              map['unit']?['adBanners']?.map((x) => ImageAsset.fromJson(x)))
          : null,
      canRequestVatInvoice: map['unit']?['canRequestVatInvoice'] ?? true,
      description: map['unit']?['description'] != null
          ? LocalizedItem.fromJson(map['unit']?['description'])
          : null,
      phone: map['unit']?['phone'],
      email: map['unit']?['email'],
      coverBannersEnabled: map['unit']?['coverBannersEnabled'] ?? false,
      coverBanners: map['unit']?['coverBanners'] != null
          ? List<ImageAsset>.from(
              map['unit']?['coverBanners']?.map((x) => ImageAsset.fromJson(x)))
          : null,
      canCallWaiter: map['unit']?['canCallWaiter'] ?? false,
      isVisibleInApp: map['unit']?['isVisibleInApp'] ?? true,
    );
  }

  @override
  String toString() {
    return 'GeoUnit(id: $id, groupId: $groupId, chainId: $chainId, name: $name, location: $location, soldOutVisibilityPolicy: $soldOutVisibilityPolicy, serviceFeePolicy: $serviceFeePolicy, ratingPolicies: $ratingPolicies, tipPolicy: $tipPolicy, orderPolicy: $orderPolicy, packagingTax: $packagingTax, address: $address, style: $style, paymentModes: $paymentModes, distance: $distance, currency: $currency, isAcceptingOrders: $isAcceptingOrders, openingHoursNext7: $openingHoursNext7, supportedServingModes: $supportedServingModes, supportedOrderModes: $supportedOrderModes)';
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
        listEquals(other.ratingPolicies, ratingPolicies) &&
        other.packagingTax == packagingTax &&
        other.serviceFeePolicy == serviceFeePolicy &&
        other.tipPolicy == tipPolicy &&
        other.soldOutVisibilityPolicy == soldOutVisibilityPolicy &&
        other.orderPaymentPolicy == orderPaymentPolicy &&
        other.location == location &&
        other.adBannersEnabled == adBannersEnabled &&
        listEquals(other.adBanners, adBanners) &&
        other.canRequestVatInvoice == canRequestVatInvoice &&
        other.description == description &&
        other.phone == phone &&
        other.email == email &&
        other.coverBannersEnabled == coverBannersEnabled &&
        listEquals(other.coverBanners, coverBanners) &&
        other.canCallWaiter == canCallWaiter &&
        other.isVisibleInApp == isVisibleInApp;
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
        packagingTax.hashCode ^
        ratingPolicies.hashCode ^
        tipPolicy.hashCode ^
        serviceFeePolicy.hashCode ^
        soldOutVisibilityPolicy.hashCode ^
        orderPaymentPolicy.hashCode ^
        location.hashCode ^
        adBannersEnabled.hashCode ^
        adBanners.hashCode ^
        canRequestVatInvoice.hashCode ^
        description.hashCode ^
        phone.hashCode ^
        email.hashCode ^
        coverBannersEnabled.hashCode ^
        coverBanners.hashCode ^
        canCallWaiter.hashCode ^
        isVisibleInApp.hashCode;
  }
}
