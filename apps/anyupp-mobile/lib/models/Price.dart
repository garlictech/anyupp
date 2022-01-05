import 'dart:convert';
import 'package:flutter/foundation.dart';

@immutable
class Price {
  final String currency;
  final double netPrice;
  final double taxPercentage;

  Price({
    required this.currency,
    required this.netPrice,
    required this.taxPercentage,
  });

  Price copyWith({
    String? currency,
    double? netPrice,
    double? taxPercentage,
  }) {
    return Price(
      currency: currency ?? this.currency,
      netPrice: netPrice ?? this.netPrice,
      taxPercentage: taxPercentage ?? this.taxPercentage,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'currency': currency,
      'netPrice': netPrice,
      'taxPercentage': taxPercentage,
    };
  }

  factory Price.fromMap(Map<String, dynamic> map) {
    return Price(
      currency: map['currency'] ?? '',
      netPrice: map['netPrice']?.toDouble() ?? 0.0,
      taxPercentage: map['taxPercentage']?.toDouble() ?? 0.0,
    );
  }

  String toJson() => json.encode(toMap());

  factory Price.fromJson(String source) => Price.fromMap(json.decode(source));

  @override
  String toString() =>
      'Packaging(currency: $currency, netPrice: $netPrice, taxPercentage: $taxPercentage)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Price &&
        other.currency == currency &&
        other.netPrice == netPrice &&
        other.taxPercentage == taxPercentage;
  }

  @override
  int get hashCode =>
      currency.hashCode ^ netPrice.hashCode ^ taxPercentage.hashCode;
}
