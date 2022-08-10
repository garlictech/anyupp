// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'Unit.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $Unit {
  const $Unit();

  String get id;
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

  Unit copyWith({
    String? id,
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
      Unit(
        id: id ?? this.id,
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

  Unit copyUsing(void Function(Unit$Change change) mutator) {
    final change = Unit$Change._(
      this.id,
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
    return Unit(
      id: change.id,
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
      "Unit(id: $id, name: $name, address: $address, style: $style, paymentModes: $paymentModes, distance: $distance, currency: $currency, isAcceptingOrders: $isAcceptingOrders, openingHoursNext7: $openingHoursNext7, supportedServingModes: $supportedServingModes, supportedOrderModes: $supportedOrderModes, orderPolicy: $orderPolicy, packagingTax: $packagingTax, ratingPolicies: $ratingPolicies, tipPolicy: $tipPolicy, serviceFeePolicy: $serviceFeePolicy, soldOutVisibilityPolicy: $soldOutVisibilityPolicy, orderPaymentPolicy: $orderPaymentPolicy, location: $location, adBannersEnabled: $adBannersEnabled, adBanners: $adBanners, canRequestVatInvoice: $canRequestVatInvoice, description: $description, email: $email, phone: $phone, coverBannersEnabled: $coverBannersEnabled, coverBanners: $coverBanners, canCallWaiter: $canCallWaiter, isVisibleInApp: $isVisibleInApp)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is Unit &&
      other.runtimeType == runtimeType &&
      id == other.id &&
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

class Unit$Change {
  Unit$Change._(
    this.id,
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
class Unit$ {
  static final id = Lens<Unit, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final name = Lens<Unit, String>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );

  static final address = Lens<Unit, Address>(
    (addressContainer) => addressContainer.address,
    (addressContainer, address) => addressContainer.copyWith(address: address),
  );

  static final style = Lens<Unit, ChainStyle>(
    (styleContainer) => styleContainer.style,
    (styleContainer, style) => styleContainer.copyWith(style: style),
  );

  static final paymentModes = Lens<Unit, List<PaymentMode?>?>(
    (paymentModesContainer) => paymentModesContainer.paymentModes,
    (paymentModesContainer, paymentModes) =>
        paymentModesContainer.copyWith(paymentModes: paymentModes),
  );

  static final distance = Lens<Unit, int>(
    (distanceContainer) => distanceContainer.distance,
    (distanceContainer, distance) =>
        distanceContainer.copyWith(distance: distance),
  );

  static final currency = Lens<Unit, String>(
    (currencyContainer) => currencyContainer.currency,
    (currencyContainer, currency) =>
        currencyContainer.copyWith(currency: currency),
  );

  static final isAcceptingOrders = Lens<Unit, bool>(
    (isAcceptingOrdersContainer) =>
        isAcceptingOrdersContainer.isAcceptingOrders,
    (isAcceptingOrdersContainer, isAcceptingOrders) =>
        isAcceptingOrdersContainer.copyWith(
            isAcceptingOrders: isAcceptingOrders),
  );

  static final openingHoursNext7 = Lens<Unit, List<OpeningHours>>(
    (openingHoursNext7Container) =>
        openingHoursNext7Container.openingHoursNext7,
    (openingHoursNext7Container, openingHoursNext7) =>
        openingHoursNext7Container.copyWith(
            openingHoursNext7: openingHoursNext7),
  );

  static final supportedServingModes = Lens<Unit, List<ServingMode>>(
    (supportedServingModesContainer) =>
        supportedServingModesContainer.supportedServingModes,
    (supportedServingModesContainer, supportedServingModes) =>
        supportedServingModesContainer.copyWith(
            supportedServingModes: supportedServingModes),
  );

  static final supportedOrderModes = Lens<Unit, List<OrderMode>>(
    (supportedOrderModesContainer) =>
        supportedOrderModesContainer.supportedOrderModes,
    (supportedOrderModesContainer, supportedOrderModes) =>
        supportedOrderModesContainer.copyWith(
            supportedOrderModes: supportedOrderModes),
  );

  static final orderPolicy = Lens<Unit, OrderPolicy>(
    (orderPolicyContainer) => orderPolicyContainer.orderPolicy,
    (orderPolicyContainer, orderPolicy) =>
        orderPolicyContainer.copyWith(orderPolicy: orderPolicy),
  );

  static final packagingTax = Lens<Unit, double>(
    (packagingTaxContainer) => packagingTaxContainer.packagingTax,
    (packagingTaxContainer, packagingTax) =>
        packagingTaxContainer.copyWith(packagingTax: packagingTax),
  );

  static final ratingPolicies = Lens<Unit, List<RatingPolicy>?>(
    (ratingPoliciesContainer) => ratingPoliciesContainer.ratingPolicies,
    (ratingPoliciesContainer, ratingPolicies) =>
        ratingPoliciesContainer.copyWith(ratingPolicies: ratingPolicies),
  );

  static final tipPolicy = Lens<Unit, TipPolicy?>(
    (tipPolicyContainer) => tipPolicyContainer.tipPolicy,
    (tipPolicyContainer, tipPolicy) =>
        tipPolicyContainer.copyWith(tipPolicy: tipPolicy),
  );

  static final serviceFeePolicy = Lens<Unit, ServiceFeePolicy?>(
    (serviceFeePolicyContainer) => serviceFeePolicyContainer.serviceFeePolicy,
    (serviceFeePolicyContainer, serviceFeePolicy) =>
        serviceFeePolicyContainer.copyWith(serviceFeePolicy: serviceFeePolicy),
  );

  static final soldOutVisibilityPolicy = Lens<Unit, SoldOutVisibilityPolicy?>(
    (soldOutVisibilityPolicyContainer) =>
        soldOutVisibilityPolicyContainer.soldOutVisibilityPolicy,
    (soldOutVisibilityPolicyContainer, soldOutVisibilityPolicy) =>
        soldOutVisibilityPolicyContainer.copyWith(
            soldOutVisibilityPolicy: soldOutVisibilityPolicy),
  );

  static final orderPaymentPolicy = Lens<Unit, OrderPaymentPolicy?>(
    (orderPaymentPolicyContainer) =>
        orderPaymentPolicyContainer.orderPaymentPolicy,
    (orderPaymentPolicyContainer, orderPaymentPolicy) =>
        orderPaymentPolicyContainer.copyWith(
            orderPaymentPolicy: orderPaymentPolicy),
  );

  static final location = Lens<Unit, Location?>(
    (locationContainer) => locationContainer.location,
    (locationContainer, location) =>
        locationContainer.copyWith(location: location),
  );

  static final adBannersEnabled = Lens<Unit, bool?>(
    (adBannersEnabledContainer) => adBannersEnabledContainer.adBannersEnabled,
    (adBannersEnabledContainer, adBannersEnabled) =>
        adBannersEnabledContainer.copyWith(adBannersEnabled: adBannersEnabled),
  );

  static final adBanners = Lens<Unit, List<ImageAsset>?>(
    (adBannersContainer) => adBannersContainer.adBanners,
    (adBannersContainer, adBanners) =>
        adBannersContainer.copyWith(adBanners: adBanners),
  );

  static final canRequestVatInvoice = Lens<Unit, bool?>(
    (canRequestVatInvoiceContainer) =>
        canRequestVatInvoiceContainer.canRequestVatInvoice,
    (canRequestVatInvoiceContainer, canRequestVatInvoice) =>
        canRequestVatInvoiceContainer.copyWith(
            canRequestVatInvoice: canRequestVatInvoice),
  );

  static final description = Lens<Unit, LocalizedItem?>(
    (descriptionContainer) => descriptionContainer.description,
    (descriptionContainer, description) =>
        descriptionContainer.copyWith(description: description),
  );

  static final email = Lens<Unit, String?>(
    (emailContainer) => emailContainer.email,
    (emailContainer, email) => emailContainer.copyWith(email: email),
  );

  static final phone = Lens<Unit, String?>(
    (phoneContainer) => phoneContainer.phone,
    (phoneContainer, phone) => phoneContainer.copyWith(phone: phone),
  );

  static final coverBannersEnabled = Lens<Unit, bool?>(
    (coverBannersEnabledContainer) =>
        coverBannersEnabledContainer.coverBannersEnabled,
    (coverBannersEnabledContainer, coverBannersEnabled) =>
        coverBannersEnabledContainer.copyWith(
            coverBannersEnabled: coverBannersEnabled),
  );

  static final coverBanners = Lens<Unit, List<ImageAsset>?>(
    (coverBannersContainer) => coverBannersContainer.coverBanners,
    (coverBannersContainer, coverBanners) =>
        coverBannersContainer.copyWith(coverBanners: coverBanners),
  );

  static final canCallWaiter = Lens<Unit, bool?>(
    (canCallWaiterContainer) => canCallWaiterContainer.canCallWaiter,
    (canCallWaiterContainer, canCallWaiter) =>
        canCallWaiterContainer.copyWith(canCallWaiter: canCallWaiter),
  );

  static final isVisibleInApp = Lens<Unit, bool>(
    (isVisibleInAppContainer) => isVisibleInAppContainer.isVisibleInApp,
    (isVisibleInAppContainer, isVisibleInApp) =>
        isVisibleInAppContainer.copyWith(isVisibleInApp: isVisibleInApp),
  );
}
