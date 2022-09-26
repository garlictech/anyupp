import 'package:anyupp/models.dart';
import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

import '../graphql/generated/crud-api.dart';
import 'Address.dart';
import 'ChainStyle.dart';
import 'ImageAsset.dart';
import 'LocalizedItem.dart';
import 'Location.dart';
import 'OpeningHours.dart';
import 'PaymentMode.dart';
import 'RatingPolicy.dart';
import 'ServiceFeePolicy.dart';
import 'TipPolicy.dart';

part 'Unit.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
class Unit extends $Unit {
  final String id;
  final String name;
  final Address address;
  final ChainStyle style;
  final List<PaymentMode?>? paymentModes;
  final String currency;
  final bool isAcceptingOrders;
  final List<ServingMode> supportedServingModes;
  final List<OrderMode> supportedOrderModes;
  final OrderPolicy orderPolicy;
  final double packagingTaxPercentage;
  final List<RatingPolicy>? ratingPolicies;
  final TipPolicy? tipPolicy;
  final ServiceFeePolicy? serviceFeePolicy;
  final SoldOutVisibilityPolicy? soldOutVisibilityPolicy;
  final OrderPaymentPolicy? orderPaymentPolicy;
  final Location location;
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
  final Map<String, OpeningHours>? openingHours;

  @JsonKey(ignore: true)
  double? distanceInKm_;

  set distanceInKm(double? distanceInKm) => distanceInKm_ = distanceInKm;
  double? get distanceInKm => distanceInKm_;

  Unit({required this.id,
      required this.name,
      required this.address,
      required this.style,
      required this.currency,
      required this.isAcceptingOrders,
      required this.supportedServingModes,
      required this.supportedOrderModes,
      this.orderPolicy = OrderPolicy.placeOnly,
      this.packagingTaxPercentage = 0,
      this.paymentModes,
      this.ratingPolicies,
      this.tipPolicy,
      this.serviceFeePolicy,
      this.soldOutVisibilityPolicy,
      this.orderPaymentPolicy,
      required this.location,
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
      this.openingHours,
      this.distanceInKm_});
  });

  factory Unit.fromJson(Map<String, dynamic> json) => _$UnitFromJson(json);

  Map<String, dynamic> toJson() => _$UnitToJson(this);
}
