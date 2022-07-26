import 'package:fa_prev/models.dart';
import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

import 'package:fa_prev/graphql/generated/crud-api.dart';

part 'GeoUnit.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
class GeoUnit extends $GeoUnit {
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

  @override
  String toString() {
    return 'GeoUnit(id: $id, groupId: $groupId, chainId: $chainId, name: $name, location: $location, soldOutVisibilityPolicy: $soldOutVisibilityPolicy, serviceFeePolicy: $serviceFeePolicy, ratingPolicies: $ratingPolicies, tipPolicy: $tipPolicy, orderPolicy: $orderPolicy, packagingTax: $packagingTax, address: $address, style: $style, paymentModes: $paymentModes, distance: $distance, currency: $currency, isAcceptingOrders: $isAcceptingOrders, openingHoursNext7: $openingHoursNext7, supportedServingModes: $supportedServingModes, supportedOrderModes: $supportedOrderModes)';
  }
}
