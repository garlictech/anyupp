import 'package:flutter/foundation.dart';

@immutable
class CumulatedPrice {
  final String currency;
  final double grossPrice;
  final double taxContent;
  CumulatedPrice({
    required this.currency,
    required this.grossPrice,
    required this.taxContent,
  });

  CumulatedPrice copyWith({
    String? currency,
    double? grossPrice,
    double? taxContent,
  }) {
    return CumulatedPrice(
      currency: currency ?? this.currency,
      grossPrice: grossPrice ?? this.grossPrice,
      taxContent: taxContent ?? this.taxContent,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'currency': currency,
      'grossPrice': grossPrice,
      'taxContent': taxContent,
    };
  }

  factory CumulatedPrice.fromJson(Map<String, dynamic> map) {
    return CumulatedPrice(
      currency: map['currency'] ?? '',
      grossPrice: map['grossPrice']?.toDouble() ?? 0.0,
      taxContent: map['taxContent']?.toDouble() ?? 0.0,
    );
  }

  @override
  String toString() =>
      'CumulatedPrice(currency: $currency, grossPrice: $grossPrice, taxContent: $taxContent)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is CumulatedPrice &&
        other.currency == currency &&
        other.grossPrice == grossPrice &&
        other.taxContent == taxContent;
  }

  @override
  int get hashCode =>
      currency.hashCode ^ grossPrice.hashCode ^ taxContent.hashCode;
}
