// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'graphql_api.graphql.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GetCustomerStripeCards$Query$StripeCard
    _$GetCustomerStripeCards$Query$StripeCardFromJson(
        Map<String, dynamic> json) {
  return GetCustomerStripeCards$Query$StripeCard()
    ..id = json['id'] as String
    ..brand = _$enumDecodeNullable(
        _$GetCustomerStripeCards$Query$StripeCard$CardBrandEnumMap,
        json['brand'],
        unknownValue:
            GetCustomerStripeCards$Query$StripeCard$CardBrand.ARTEMIS_UNKNOWN)
    ..last4 = json['last4'] as String
    ..exp_month = json['exp_month'] as int
    ..exp_year = json['exp_year'] as int;
}

Map<String, dynamic> _$GetCustomerStripeCards$Query$StripeCardToJson(
        GetCustomerStripeCards$Query$StripeCard instance) =>
    <String, dynamic>{
      'id': instance.id,
      'brand': _$GetCustomerStripeCards$Query$StripeCard$CardBrandEnumMap[
          instance.brand],
      'last4': instance.last4,
      'exp_month': instance.exp_month,
      'exp_year': instance.exp_year,
    };

T _$enumDecode<T>(
  Map<T, dynamic> enumValues,
  dynamic source, {
  T unknownValue,
}) {
  if (source == null) {
    throw ArgumentError('A value must be provided. Supported values: '
        '${enumValues.values.join(', ')}');
  }

  final value = enumValues.entries
      .singleWhere((e) => e.value == source, orElse: () => null)
      ?.key;

  if (value == null && unknownValue == null) {
    throw ArgumentError('`$source` is not one of the supported values: '
        '${enumValues.values.join(', ')}');
  }
  return value ?? unknownValue;
}

T _$enumDecodeNullable<T>(
  Map<T, dynamic> enumValues,
  dynamic source, {
  T unknownValue,
}) {
  if (source == null) {
    return null;
  }
  return _$enumDecode<T>(enumValues, source, unknownValue: unknownValue);
}

const _$GetCustomerStripeCards$Query$StripeCard$CardBrandEnumMap = {
  GetCustomerStripeCards$Query$StripeCard$CardBrand.amex: 'amex',
  GetCustomerStripeCards$Query$StripeCard$CardBrand.diners: 'diners',
  GetCustomerStripeCards$Query$StripeCard$CardBrand.discover: 'discover',
  GetCustomerStripeCards$Query$StripeCard$CardBrand.jcb: 'jcb',
  GetCustomerStripeCards$Query$StripeCard$CardBrand.mastercard: 'mastercard',
  GetCustomerStripeCards$Query$StripeCard$CardBrand.unionpay: 'unionpay',
  GetCustomerStripeCards$Query$StripeCard$CardBrand.visa: 'visa',
  GetCustomerStripeCards$Query$StripeCard$CardBrand.unknown: 'unknown',
  GetCustomerStripeCards$Query$StripeCard$CardBrand.ARTEMIS_UNKNOWN:
      'ARTEMIS_UNKNOWN',
};

GetCustomerStripeCards$Query _$GetCustomerStripeCards$QueryFromJson(
    Map<String, dynamic> json) {
  return GetCustomerStripeCards$Query()
    ..getCustomerStripeCards = (json['getCustomerStripeCards'] as List)
        ?.map((e) => e == null
            ? null
            : GetCustomerStripeCards$Query$StripeCard.fromJson(
                e as Map<String, dynamic>))
        ?.toList();
}

Map<String, dynamic> _$GetCustomerStripeCards$QueryToJson(
        GetCustomerStripeCards$Query instance) =>
    <String, dynamic>{
      'getCustomerStripeCards':
          instance.getCustomerStripeCards?.map((e) => e?.toJson())?.toList(),
    };

GetCustomerStripeCardsArguments _$GetCustomerStripeCardsArgumentsFromJson(
    Map<String, dynamic> json) {
  return GetCustomerStripeCardsArguments(
    customerId: json['customerId'] as String,
  );
}

Map<String, dynamic> _$GetCustomerStripeCardsArgumentsToJson(
        GetCustomerStripeCardsArguments instance) =>
    <String, dynamic>{
      'customerId': instance.customerId,
    };

StartStripePayment$Mutation _$StartStripePayment$MutationFromJson(
    Map<String, dynamic> json) {
  return StartStripePayment$Mutation()
    ..startStripePayment = json['startStripePayment'] as String;
}

Map<String, dynamic> _$StartStripePayment$MutationToJson(
        StartStripePayment$Mutation instance) =>
    <String, dynamic>{
      'startStripePayment': instance.startStripePayment,
    };

StartStripePaymentArguments _$StartStripePaymentArgumentsFromJson(
    Map<String, dynamic> json) {
  return StartStripePaymentArguments(
    chainId: json['chainId'] as String,
    unitId: json['unitId'] as String,
    userId: json['userId'] as String,
  );
}

Map<String, dynamic> _$StartStripePaymentArgumentsToJson(
        StartStripePaymentArguments instance) =>
    <String, dynamic>{
      'chainId': instance.chainId,
      'unitId': instance.unitId,
      'userId': instance.userId,
    };
