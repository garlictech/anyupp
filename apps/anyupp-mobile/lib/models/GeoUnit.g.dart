// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'GeoUnit.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $GeoUnit {
  const $GeoUnit();

  String get id;
  String get groupId;
  String get chainId;
  String get name;
  Address get address;
  ChainStyle get style;
  List<PaymentMode?>? get paymentModes;
  int get distance;
  String get currency;
  bool get isAcceptingOrders;
  List<OpeningHours> get openingHoursNext7;
  List<ServingMode> get supportedServingModes;
  List<OrderMode> get supportedOrderModes;
  OrderPolicy get orderPolicy;
  double get packagingTax;
  List<RatingPolicy>? get ratingPolicies;
  TipPolicy? get tipPolicy;
  ServiceFeePolicy? get serviceFeePolicy;
  SoldOutVisibilityPolicy? get soldOutVisibilityPolicy;
  OrderPaymentPolicy? get orderPaymentPolicy;
  Location? get location;
  bool? get adBannersEnabled;
  List<ImageAsset>? get adBanners;
  bool? get canRequestVatInvoice;
  LocalizedItem? get description;
  String? get email;
  String? get phone;
  bool? get coverBannersEnabled;
  List<ImageAsset>? get coverBanners;
  bool? get canCallWaiter;
  bool get isVisibleInApp;

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
  }) =>
      GeoUnit(
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
        canRequestVatInvoice: canRequestVatInvoice ?? this.canRequestVatInvoice,
        description: description ?? this.description,
        email: email ?? this.email,
        phone: phone ?? this.phone,
        coverBannersEnabled: coverBannersEnabled ?? this.coverBannersEnabled,
        coverBanners: coverBanners ?? this.coverBanners,
        canCallWaiter: canCallWaiter ?? this.canCallWaiter,
        isVisibleInApp: isVisibleInApp ?? this.isVisibleInApp,
      );

  GeoUnit copyUsing(void Function(GeoUnit$Change change) mutator) {
    final change = GeoUnit$Change._(
      this.id,
      this.groupId,
      this.chainId,
      this.name,
      this.address,
      this.style,
      this.paymentModes,
      this.distance,
      this.currency,
      this.isAcceptingOrders,
      this.openingHoursNext7,
      this.supportedServingModes,
      this.supportedOrderModes,
      this.orderPolicy,
      this.packagingTax,
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
      this.isVisibleInApp,
    );
    mutator(change);
    return GeoUnit(
      id: change.id,
      groupId: change.groupId,
      chainId: change.chainId,
      name: change.name,
      address: change.address,
      style: change.style,
      paymentModes: change.paymentModes,
      distance: change.distance,
      currency: change.currency,
      isAcceptingOrders: change.isAcceptingOrders,
      openingHoursNext7: change.openingHoursNext7,
      supportedServingModes: change.supportedServingModes,
      supportedOrderModes: change.supportedOrderModes,
      orderPolicy: change.orderPolicy,
      packagingTax: change.packagingTax,
      ratingPolicies: change.ratingPolicies,
      tipPolicy: change.tipPolicy,
      serviceFeePolicy: change.serviceFeePolicy,
      soldOutVisibilityPolicy: change.soldOutVisibilityPolicy,
      orderPaymentPolicy: change.orderPaymentPolicy,
      location: change.location,
      adBannersEnabled: change.adBannersEnabled,
      adBanners: change.adBanners,
      canRequestVatInvoice: change.canRequestVatInvoice,
      description: change.description,
      email: change.email,
      phone: change.phone,
      coverBannersEnabled: change.coverBannersEnabled,
      coverBanners: change.coverBanners,
      canCallWaiter: change.canCallWaiter,
      isVisibleInApp: change.isVisibleInApp,
    );
  }

  @override
  String toString() =>
      "GeoUnit(id: $id, groupId: $groupId, chainId: $chainId, name: $name, address: $address, style: $style, paymentModes: $paymentModes, distance: $distance, currency: $currency, isAcceptingOrders: $isAcceptingOrders, openingHoursNext7: $openingHoursNext7, supportedServingModes: $supportedServingModes, supportedOrderModes: $supportedOrderModes, orderPolicy: $orderPolicy, packagingTax: $packagingTax, ratingPolicies: $ratingPolicies, tipPolicy: $tipPolicy, serviceFeePolicy: $serviceFeePolicy, soldOutVisibilityPolicy: $soldOutVisibilityPolicy, orderPaymentPolicy: $orderPaymentPolicy, location: $location, adBannersEnabled: $adBannersEnabled, adBanners: $adBanners, canRequestVatInvoice: $canRequestVatInvoice, description: $description, email: $email, phone: $phone, coverBannersEnabled: $coverBannersEnabled, coverBanners: $coverBanners, canCallWaiter: $canCallWaiter, isVisibleInApp: $isVisibleInApp)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is GeoUnit &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      groupId == other.groupId &&
      chainId == other.chainId &&
      name == other.name &&
      address == other.address &&
      style == other.style &&
      paymentModes == other.paymentModes &&
      distance == other.distance &&
      currency == other.currency &&
      isAcceptingOrders == other.isAcceptingOrders &&
      openingHoursNext7 == other.openingHoursNext7 &&
      supportedServingModes == other.supportedServingModes &&
      supportedOrderModes == other.supportedOrderModes &&
      orderPolicy == other.orderPolicy &&
      packagingTax == other.packagingTax &&
      ratingPolicies == other.ratingPolicies &&
      tipPolicy == other.tipPolicy &&
      serviceFeePolicy == other.serviceFeePolicy &&
      soldOutVisibilityPolicy == other.soldOutVisibilityPolicy &&
      orderPaymentPolicy == other.orderPaymentPolicy &&
      location == other.location &&
      adBannersEnabled == other.adBannersEnabled &&
      adBanners == other.adBanners &&
      canRequestVatInvoice == other.canRequestVatInvoice &&
      description == other.description &&
      email == other.email &&
      phone == other.phone &&
      coverBannersEnabled == other.coverBannersEnabled &&
      coverBanners == other.coverBanners &&
      canCallWaiter == other.canCallWaiter &&
      isVisibleInApp == other.isVisibleInApp;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + groupId.hashCode;
    result = 37 * result + chainId.hashCode;
    result = 37 * result + name.hashCode;
    result = 37 * result + address.hashCode;
    result = 37 * result + style.hashCode;
    result = 37 * result + paymentModes.hashCode;
    result = 37 * result + distance.hashCode;
    result = 37 * result + currency.hashCode;
    result = 37 * result + isAcceptingOrders.hashCode;
    result = 37 * result + openingHoursNext7.hashCode;
    result = 37 * result + supportedServingModes.hashCode;
    result = 37 * result + supportedOrderModes.hashCode;
    result = 37 * result + orderPolicy.hashCode;
    result = 37 * result + packagingTax.hashCode;
    result = 37 * result + ratingPolicies.hashCode;
    result = 37 * result + tipPolicy.hashCode;
    result = 37 * result + serviceFeePolicy.hashCode;
    result = 37 * result + soldOutVisibilityPolicy.hashCode;
    result = 37 * result + orderPaymentPolicy.hashCode;
    result = 37 * result + location.hashCode;
    result = 37 * result + adBannersEnabled.hashCode;
    result = 37 * result + adBanners.hashCode;
    result = 37 * result + canRequestVatInvoice.hashCode;
    result = 37 * result + description.hashCode;
    result = 37 * result + email.hashCode;
    result = 37 * result + phone.hashCode;
    result = 37 * result + coverBannersEnabled.hashCode;
    result = 37 * result + coverBanners.hashCode;
    result = 37 * result + canCallWaiter.hashCode;
    result = 37 * result + isVisibleInApp.hashCode;
    return result;
  }
}

class GeoUnit$Change {
  GeoUnit$Change._(
    this.id,
    this.groupId,
    this.chainId,
    this.name,
    this.address,
    this.style,
    this.paymentModes,
    this.distance,
    this.currency,
    this.isAcceptingOrders,
    this.openingHoursNext7,
    this.supportedServingModes,
    this.supportedOrderModes,
    this.orderPolicy,
    this.packagingTax,
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
    this.isVisibleInApp,
  );

  String id;
  String groupId;
  String chainId;
  String name;
  Address address;
  ChainStyle style;
  List<PaymentMode?>? paymentModes;
  int distance;
  String currency;
  bool isAcceptingOrders;
  List<OpeningHours> openingHoursNext7;
  List<ServingMode> supportedServingModes;
  List<OrderMode> supportedOrderModes;
  OrderPolicy orderPolicy;
  double packagingTax;
  List<RatingPolicy>? ratingPolicies;
  TipPolicy? tipPolicy;
  ServiceFeePolicy? serviceFeePolicy;
  SoldOutVisibilityPolicy? soldOutVisibilityPolicy;
  OrderPaymentPolicy? orderPaymentPolicy;
  Location? location;
  bool? adBannersEnabled;
  List<ImageAsset>? adBanners;
  bool? canRequestVatInvoice;
  LocalizedItem? description;
  String? email;
  String? phone;
  bool? coverBannersEnabled;
  List<ImageAsset>? coverBanners;
  bool? canCallWaiter;
  bool isVisibleInApp;
}

// ignore: avoid_classes_with_only_static_members
class GeoUnit$ {
  static final id = Lens<GeoUnit, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final groupId = Lens<GeoUnit, String>(
    (groupIdContainer) => groupIdContainer.groupId,
    (groupIdContainer, groupId) => groupIdContainer.copyWith(groupId: groupId),
  );

  static final chainId = Lens<GeoUnit, String>(
    (chainIdContainer) => chainIdContainer.chainId,
    (chainIdContainer, chainId) => chainIdContainer.copyWith(chainId: chainId),
  );

  static final name = Lens<GeoUnit, String>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );

  static final address = Lens<GeoUnit, Address>(
    (addressContainer) => addressContainer.address,
    (addressContainer, address) => addressContainer.copyWith(address: address),
  );

  static final style = Lens<GeoUnit, ChainStyle>(
    (styleContainer) => styleContainer.style,
    (styleContainer, style) => styleContainer.copyWith(style: style),
  );

  static final paymentModes = Lens<GeoUnit, List<PaymentMode?>?>(
    (paymentModesContainer) => paymentModesContainer.paymentModes,
    (paymentModesContainer, paymentModes) =>
        paymentModesContainer.copyWith(paymentModes: paymentModes),
  );

  static final distance = Lens<GeoUnit, int>(
    (distanceContainer) => distanceContainer.distance,
    (distanceContainer, distance) =>
        distanceContainer.copyWith(distance: distance),
  );

  static final currency = Lens<GeoUnit, String>(
    (currencyContainer) => currencyContainer.currency,
    (currencyContainer, currency) =>
        currencyContainer.copyWith(currency: currency),
  );

  static final isAcceptingOrders = Lens<GeoUnit, bool>(
    (isAcceptingOrdersContainer) =>
        isAcceptingOrdersContainer.isAcceptingOrders,
    (isAcceptingOrdersContainer, isAcceptingOrders) =>
        isAcceptingOrdersContainer.copyWith(
            isAcceptingOrders: isAcceptingOrders),
  );

  static final openingHoursNext7 = Lens<GeoUnit, List<OpeningHours>>(
    (openingHoursNext7Container) =>
        openingHoursNext7Container.openingHoursNext7,
    (openingHoursNext7Container, openingHoursNext7) =>
        openingHoursNext7Container.copyWith(
            openingHoursNext7: openingHoursNext7),
  );

  static final supportedServingModes = Lens<GeoUnit, List<ServingMode>>(
    (supportedServingModesContainer) =>
        supportedServingModesContainer.supportedServingModes,
    (supportedServingModesContainer, supportedServingModes) =>
        supportedServingModesContainer.copyWith(
            supportedServingModes: supportedServingModes),
  );

  static final supportedOrderModes = Lens<GeoUnit, List<OrderMode>>(
    (supportedOrderModesContainer) =>
        supportedOrderModesContainer.supportedOrderModes,
    (supportedOrderModesContainer, supportedOrderModes) =>
        supportedOrderModesContainer.copyWith(
            supportedOrderModes: supportedOrderModes),
  );

  static final orderPolicy = Lens<GeoUnit, OrderPolicy>(
    (orderPolicyContainer) => orderPolicyContainer.orderPolicy,
    (orderPolicyContainer, orderPolicy) =>
        orderPolicyContainer.copyWith(orderPolicy: orderPolicy),
  );

  static final packagingTax = Lens<GeoUnit, double>(
    (packagingTaxContainer) => packagingTaxContainer.packagingTax,
    (packagingTaxContainer, packagingTax) =>
        packagingTaxContainer.copyWith(packagingTax: packagingTax),
  );

  static final ratingPolicies = Lens<GeoUnit, List<RatingPolicy>?>(
    (ratingPoliciesContainer) => ratingPoliciesContainer.ratingPolicies,
    (ratingPoliciesContainer, ratingPolicies) =>
        ratingPoliciesContainer.copyWith(ratingPolicies: ratingPolicies),
  );

  static final tipPolicy = Lens<GeoUnit, TipPolicy?>(
    (tipPolicyContainer) => tipPolicyContainer.tipPolicy,
    (tipPolicyContainer, tipPolicy) =>
        tipPolicyContainer.copyWith(tipPolicy: tipPolicy),
  );

  static final serviceFeePolicy = Lens<GeoUnit, ServiceFeePolicy?>(
    (serviceFeePolicyContainer) => serviceFeePolicyContainer.serviceFeePolicy,
    (serviceFeePolicyContainer, serviceFeePolicy) =>
        serviceFeePolicyContainer.copyWith(serviceFeePolicy: serviceFeePolicy),
  );

  static final soldOutVisibilityPolicy =
      Lens<GeoUnit, SoldOutVisibilityPolicy?>(
    (soldOutVisibilityPolicyContainer) =>
        soldOutVisibilityPolicyContainer.soldOutVisibilityPolicy,
    (soldOutVisibilityPolicyContainer, soldOutVisibilityPolicy) =>
        soldOutVisibilityPolicyContainer.copyWith(
            soldOutVisibilityPolicy: soldOutVisibilityPolicy),
  );

  static final orderPaymentPolicy = Lens<GeoUnit, OrderPaymentPolicy?>(
    (orderPaymentPolicyContainer) =>
        orderPaymentPolicyContainer.orderPaymentPolicy,
    (orderPaymentPolicyContainer, orderPaymentPolicy) =>
        orderPaymentPolicyContainer.copyWith(
            orderPaymentPolicy: orderPaymentPolicy),
  );

  static final location = Lens<GeoUnit, Location?>(
    (locationContainer) => locationContainer.location,
    (locationContainer, location) =>
        locationContainer.copyWith(location: location),
  );

  static final adBannersEnabled = Lens<GeoUnit, bool?>(
    (adBannersEnabledContainer) => adBannersEnabledContainer.adBannersEnabled,
    (adBannersEnabledContainer, adBannersEnabled) =>
        adBannersEnabledContainer.copyWith(adBannersEnabled: adBannersEnabled),
  );

  static final adBanners = Lens<GeoUnit, List<ImageAsset>?>(
    (adBannersContainer) => adBannersContainer.adBanners,
    (adBannersContainer, adBanners) =>
        adBannersContainer.copyWith(adBanners: adBanners),
  );

  static final canRequestVatInvoice = Lens<GeoUnit, bool?>(
    (canRequestVatInvoiceContainer) =>
        canRequestVatInvoiceContainer.canRequestVatInvoice,
    (canRequestVatInvoiceContainer, canRequestVatInvoice) =>
        canRequestVatInvoiceContainer.copyWith(
            canRequestVatInvoice: canRequestVatInvoice),
  );

  static final description = Lens<GeoUnit, LocalizedItem?>(
    (descriptionContainer) => descriptionContainer.description,
    (descriptionContainer, description) =>
        descriptionContainer.copyWith(description: description),
  );

  static final email = Lens<GeoUnit, String?>(
    (emailContainer) => emailContainer.email,
    (emailContainer, email) => emailContainer.copyWith(email: email),
  );

  static final phone = Lens<GeoUnit, String?>(
    (phoneContainer) => phoneContainer.phone,
    (phoneContainer, phone) => phoneContainer.copyWith(phone: phone),
  );

  static final coverBannersEnabled = Lens<GeoUnit, bool?>(
    (coverBannersEnabledContainer) =>
        coverBannersEnabledContainer.coverBannersEnabled,
    (coverBannersEnabledContainer, coverBannersEnabled) =>
        coverBannersEnabledContainer.copyWith(
            coverBannersEnabled: coverBannersEnabled),
  );

  static final coverBanners = Lens<GeoUnit, List<ImageAsset>?>(
    (coverBannersContainer) => coverBannersContainer.coverBanners,
    (coverBannersContainer, coverBanners) =>
        coverBannersContainer.copyWith(coverBanners: coverBanners),
  );

  static final canCallWaiter = Lens<GeoUnit, bool?>(
    (canCallWaiterContainer) => canCallWaiterContainer.canCallWaiter,
    (canCallWaiterContainer, canCallWaiter) =>
        canCallWaiterContainer.copyWith(canCallWaiter: canCallWaiter),
  );

  static final isVisibleInApp = Lens<GeoUnit, bool>(
    (isVisibleInAppContainer) => isVisibleInAppContainer.isVisibleInApp,
    (isVisibleInAppContainer, isVisibleInApp) =>
        isVisibleInAppContainer.copyWith(isVisibleInApp: isVisibleInApp),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeoUnit _$GeoUnitFromJson(Map<String, dynamic> json) => GeoUnit(
      id: json['id'] as String,
      groupId: json['groupId'] as String,
      chainId: json['chainId'] as String,
      name: json['name'] as String,
      address: json['address'],
      style: json['style'],
      distance: json['distance'] as int,
      currency: json['currency'] as String,
      isAcceptingOrders: json['isAcceptingOrders'] as bool,
      openingHoursNext7: json['openingHoursNext7'] as List<dynamic>,
      supportedServingModes: (json['supportedServingModes'] as List<dynamic>)
          .map((e) => $enumDecode(_$ServingModeEnumMap, e))
          .toList(),
      supportedOrderModes: (json['supportedOrderModes'] as List<dynamic>)
          .map((e) => $enumDecode(_$OrderModeEnumMap, e))
          .toList(),
      orderPolicy: $enumDecode(_$OrderPolicyEnumMap, json['orderPolicy']),
      packagingTax: (json['packagingTax'] as num).toDouble(),
      paymentModes: json['paymentModes'] as List<dynamic>?,
      ratingPolicies: json['ratingPolicies'] as List<dynamic>?,
      tipPolicy: json['tipPolicy'],
      serviceFeePolicy: json['serviceFeePolicy'],
      soldOutVisibilityPolicy: $enumDecodeNullable(
          _$SoldOutVisibilityPolicyEnumMap, json['soldOutVisibilityPolicy']),
      orderPaymentPolicy: $enumDecodeNullable(
          _$OrderPaymentPolicyEnumMap, json['orderPaymentPolicy']),
      location: json['location'],
      adBannersEnabled: json['adBannersEnabled'] as bool?,
      adBanners: json['adBanners'] as List<dynamic>?,
      canRequestVatInvoice: json['canRequestVatInvoice'] as bool?,
      description: json['description'],
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      coverBannersEnabled: json['coverBannersEnabled'] as bool?,
      coverBanners: json['coverBanners'] as List<dynamic>?,
      canCallWaiter: json['canCallWaiter'] as bool?,
      isVisibleInApp: json['isVisibleInApp'] as bool? ?? true,
    );

Map<String, dynamic> _$GeoUnitToJson(GeoUnit instance) => <String, dynamic>{
      'id': instance.id,
      'groupId': instance.groupId,
      'chainId': instance.chainId,
      'name': instance.name,
      'address': instance.address,
      'style': instance.style,
      'paymentModes': instance.paymentModes,
      'distance': instance.distance,
      'currency': instance.currency,
      'isAcceptingOrders': instance.isAcceptingOrders,
      'openingHoursNext7': instance.openingHoursNext7,
      'supportedServingModes': instance.supportedServingModes
          .map((e) => _$ServingModeEnumMap[e]!)
          .toList(),
      'supportedOrderModes': instance.supportedOrderModes
          .map((e) => _$OrderModeEnumMap[e]!)
          .toList(),
      'orderPolicy': _$OrderPolicyEnumMap[instance.orderPolicy]!,
      'packagingTax': instance.packagingTax,
      'ratingPolicies': instance.ratingPolicies,
      'tipPolicy': instance.tipPolicy,
      'serviceFeePolicy': instance.serviceFeePolicy,
      'soldOutVisibilityPolicy':
          _$SoldOutVisibilityPolicyEnumMap[instance.soldOutVisibilityPolicy],
      'orderPaymentPolicy':
          _$OrderPaymentPolicyEnumMap[instance.orderPaymentPolicy],
      'location': instance.location,
      'adBannersEnabled': instance.adBannersEnabled,
      'adBanners': instance.adBanners,
      'canRequestVatInvoice': instance.canRequestVatInvoice,
      'description': instance.description,
      'email': instance.email,
      'phone': instance.phone,
      'coverBannersEnabled': instance.coverBannersEnabled,
      'coverBanners': instance.coverBanners,
      'canCallWaiter': instance.canCallWaiter,
      'isVisibleInApp': instance.isVisibleInApp,
    };

const _$ServingModeEnumMap = {
  ServingMode.inPlace: 'inPlace',
  ServingMode.takeAway: 'takeAway',
  ServingMode.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

const _$OrderModeEnumMap = {
  OrderMode.instant: 'instant',
  OrderMode.pickup: 'pickup',
  OrderMode.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

const _$OrderPolicyEnumMap = {
  OrderPolicy.noOrders: 'noOrders',
  OrderPolicy.placeOnly: 'placeOnly',
  OrderPolicy.placeWithPaymentType: 'placeWithPaymentType',
  OrderPolicy.full: 'full',
  OrderPolicy.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

const _$SoldOutVisibilityPolicyEnumMap = {
  SoldOutVisibilityPolicy.faded: 'faded',
  SoldOutVisibilityPolicy.invisible: 'invisible',
  SoldOutVisibilityPolicy.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

const _$OrderPaymentPolicyEnumMap = {
  OrderPaymentPolicy.prepay: 'prepay',
  OrderPaymentPolicy.afterpay: 'afterpay',
  OrderPaymentPolicy.artemisUnknown: 'ARTEMIS_UNKNOWN',
};
