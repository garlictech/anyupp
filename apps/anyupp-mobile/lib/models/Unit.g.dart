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
  String get currency;
  bool get isAcceptingOrders;
  List<ServingMode> get supportedServingModes;
  List<OrderMode> get supportedOrderModes;
  OrderPolicy get orderPolicy;
  double get packagingTaxPercentage;
  List<RatingPolicy>? get ratingPolicies;
  TipPolicy? get tipPolicy;
  ServiceFeePolicy? get serviceFeePolicy;
  SoldOutVisibilityPolicy? get soldOutVisibilityPolicy;
  OrderPaymentPolicy? get orderPaymentPolicy;
  Location get location;
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
    String? currency,
    bool? isAcceptingOrders,
    List<ServingMode>? supportedServingModes,
    List<OrderMode>? supportedOrderModes,
    OrderPolicy? orderPolicy,
    double? packagingTaxPercentage,
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
        currency: currency ?? this.currency,
        isAcceptingOrders: isAcceptingOrders ?? this.isAcceptingOrders,
        supportedServingModes:
            supportedServingModes ?? this.supportedServingModes,
        supportedOrderModes: supportedOrderModes ?? this.supportedOrderModes,
        orderPolicy: orderPolicy ?? this.orderPolicy,
        packagingTaxPercentage:
            packagingTaxPercentage ?? this.packagingTaxPercentage,
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
      this.currency,
      this.isAcceptingOrders,
      this.supportedServingModes,
      this.supportedOrderModes,
      this.orderPolicy,
      this.packagingTaxPercentage,
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
      currency: change.currency,
      isAcceptingOrders: change.isAcceptingOrders,
      supportedServingModes: change.supportedServingModes,
      supportedOrderModes: change.supportedOrderModes,
      orderPolicy: change.orderPolicy,
      packagingTaxPercentage: change.packagingTaxPercentage,
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
      "Unit(id: $id, name: $name, address: $address, style: $style, paymentModes: $paymentModes, currency: $currency, isAcceptingOrders: $isAcceptingOrders, supportedServingModes: $supportedServingModes, supportedOrderModes: $supportedOrderModes, orderPolicy: $orderPolicy, packagingTaxPercentage: $packagingTaxPercentage, ratingPolicies: $ratingPolicies, tipPolicy: $tipPolicy, serviceFeePolicy: $serviceFeePolicy, soldOutVisibilityPolicy: $soldOutVisibilityPolicy, orderPaymentPolicy: $orderPaymentPolicy, location: $location, adBannersEnabled: $adBannersEnabled, adBanners: $adBanners, canRequestVatInvoice: $canRequestVatInvoice, description: $description, email: $email, phone: $phone, coverBannersEnabled: $coverBannersEnabled, coverBanners: $coverBanners, canCallWaiter: $canCallWaiter, isVisibleInApp: $isVisibleInApp)";

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
      currency == other.currency &&
      isAcceptingOrders == other.isAcceptingOrders &&
      supportedServingModes == other.supportedServingModes &&
      supportedOrderModes == other.supportedOrderModes &&
      orderPolicy == other.orderPolicy &&
      packagingTaxPercentage == other.packagingTaxPercentage &&
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
    result = 37 * result + currency.hashCode;
    result = 37 * result + isAcceptingOrders.hashCode;
    result = 37 * result + supportedServingModes.hashCode;
    result = 37 * result + supportedOrderModes.hashCode;
    result = 37 * result + orderPolicy.hashCode;
    result = 37 * result + packagingTaxPercentage.hashCode;
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
    this.currency,
    this.isAcceptingOrders,
    this.supportedServingModes,
    this.supportedOrderModes,
    this.orderPolicy,
    this.packagingTaxPercentage,
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
  String currency;
  bool isAcceptingOrders;
  List<ServingMode> supportedServingModes;
  List<OrderMode> supportedOrderModes;
  OrderPolicy orderPolicy;
  double packagingTaxPercentage;
  List<RatingPolicy>? ratingPolicies;
  TipPolicy? tipPolicy;
  ServiceFeePolicy? serviceFeePolicy;
  SoldOutVisibilityPolicy? soldOutVisibilityPolicy;
  OrderPaymentPolicy? orderPaymentPolicy;
  Location location;
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

  static final packagingTaxPercentage = Lens<Unit, double>(
    (packagingTaxPercentageContainer) =>
        packagingTaxPercentageContainer.packagingTaxPercentage,
    (packagingTaxPercentageContainer, packagingTaxPercentage) =>
        packagingTaxPercentageContainer.copyWith(
            packagingTaxPercentage: packagingTaxPercentage),
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

  static final location = Lens<Unit, Location>(
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

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Unit _$UnitFromJson(Map<String, dynamic> json) => Unit(
      id: json['id'] as String,
      name: json['name'] as String,
      address: Address.fromJson(json['address'] as Map<String, dynamic>),
      style: ChainStyle.fromJson(json['style'] as Map<String, dynamic>),
      currency: json['currency'] as String,
      isAcceptingOrders: json['isAcceptingOrders'] as bool,
      supportedServingModes: (json['supportedServingModes'] as List<dynamic>)
          .map((e) => $enumDecode(_$ServingModeEnumMap, e))
          .toList(),
      supportedOrderModes: (json['supportedOrderModes'] as List<dynamic>)
          .map((e) => $enumDecode(_$OrderModeEnumMap, e))
          .toList(),
      orderPolicy:
          $enumDecodeNullable(_$OrderPolicyEnumMap, json['orderPolicy']) ??
              OrderPolicy.placeOnly,
      packagingTaxPercentage:
          (json['packagingTaxPercentage'] as num?)?.toDouble() ?? 0,
      paymentModes: (json['paymentModes'] as List<dynamic>?)
          ?.map((e) => e == null
              ? null
              : PaymentMode.fromJson(e as Map<String, dynamic>))
          .toList(),
      ratingPolicies: (json['ratingPolicies'] as List<dynamic>?)
          ?.map((e) => RatingPolicy.fromJson(e as Map<String, dynamic>))
          .toList(),
      tipPolicy: json['tipPolicy'] == null
          ? null
          : TipPolicy.fromJson(json['tipPolicy'] as Map<String, dynamic>),
      serviceFeePolicy: json['serviceFeePolicy'] == null
          ? null
          : ServiceFeePolicy.fromJson(
              json['serviceFeePolicy'] as Map<String, dynamic>),
      soldOutVisibilityPolicy: $enumDecodeNullable(
          _$SoldOutVisibilityPolicyEnumMap, json['soldOutVisibilityPolicy']),
      orderPaymentPolicy: $enumDecodeNullable(
          _$OrderPaymentPolicyEnumMap, json['orderPaymentPolicy']),
      location: Location.fromJson(json['location'] as Map<String, dynamic>),
      adBannersEnabled: json['adBannersEnabled'] as bool?,
      adBanners: (json['adBanners'] as List<dynamic>?)
          ?.map((e) => ImageAsset.fromJson(e as Map<String, dynamic>))
          .toList(),
      canRequestVatInvoice: json['canRequestVatInvoice'] as bool?,
      description: json['description'] == null
          ? null
          : LocalizedItem.fromJson(json['description'] as Map<String, dynamic>),
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      coverBannersEnabled: json['coverBannersEnabled'] as bool?,
      coverBanners: (json['coverBanners'] as List<dynamic>?)
          ?.map((e) => ImageAsset.fromJson(e as Map<String, dynamic>))
          .toList(),
      canCallWaiter: json['canCallWaiter'] as bool?,
      isVisibleInApp: json['isVisibleInApp'] as bool? ?? true,
    );

Map<String, dynamic> _$UnitToJson(Unit instance) {
  final val = <String, dynamic>{
    'id': instance.id,
    'name': instance.name,
    'address': instance.address.toJson(),
    'style': instance.style.toJson(),
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull(
      'paymentModes', instance.paymentModes?.map((e) => e?.toJson()).toList());
  val['currency'] = instance.currency;
  val['isAcceptingOrders'] = instance.isAcceptingOrders;
  val['supportedServingModes'] = instance.supportedServingModes
      .map((e) => _$ServingModeEnumMap[e]!)
      .toList();
  val['supportedOrderModes'] =
      instance.supportedOrderModes.map((e) => _$OrderModeEnumMap[e]!).toList();
  val['orderPolicy'] = _$OrderPolicyEnumMap[instance.orderPolicy]!;
  val['packagingTaxPercentage'] = instance.packagingTaxPercentage;
  writeNotNull('ratingPolicies',
      instance.ratingPolicies?.map((e) => e.toJson()).toList());
  writeNotNull('tipPolicy', instance.tipPolicy?.toJson());
  writeNotNull('serviceFeePolicy', instance.serviceFeePolicy?.toJson());
  writeNotNull('soldOutVisibilityPolicy',
      _$SoldOutVisibilityPolicyEnumMap[instance.soldOutVisibilityPolicy]);
  writeNotNull('orderPaymentPolicy',
      _$OrderPaymentPolicyEnumMap[instance.orderPaymentPolicy]);
  val['location'] = instance.location.toJson();
  writeNotNull('adBannersEnabled', instance.adBannersEnabled);
  writeNotNull(
      'adBanners', instance.adBanners?.map((e) => e.toJson()).toList());
  writeNotNull('canRequestVatInvoice', instance.canRequestVatInvoice);
  writeNotNull('description', instance.description?.toJson());
  writeNotNull('email', instance.email);
  writeNotNull('phone', instance.phone);
  writeNotNull('coverBannersEnabled', instance.coverBannersEnabled);
  writeNotNull(
      'coverBanners', instance.coverBanners?.map((e) => e.toJson()).toList());
  writeNotNull('canCallWaiter', instance.canCallWaiter);
  val['isVisibleInApp'] = instance.isVisibleInApp;
  return val;
}

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
