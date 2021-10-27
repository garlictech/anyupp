import 'package:flutter/foundation.dart';

@immutable
class StripePaymentMethod {
  final String? id;
  final String last4;
  final String? brand;
  final int expMonth;
  final int expYear;
  final String? country;
  final String? name;

  StripePaymentMethod({
    this.id,
    required this.last4,
    this.brand,
    required this.expMonth,
    required this.expYear,
    this.country,
    this.name,
  });

  StripePaymentMethod copyWith({
    String? id,
    String? last4,
    String? brand,
    int? expMonth,
    int? expYear,
    String? country,
    String? name,
  }) {
    return StripePaymentMethod(
      id: id ?? this.id,
      last4: last4 ?? this.last4,
      brand: brand ?? this.brand,
      expMonth: expMonth ?? this.expMonth,
      expYear: expYear ?? this.expYear,
      country: country ?? this.country,
      name: name ?? this.name,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'last4': last4,
      'brand': brand,
      'expMonth': expMonth,
      'expYear': expYear,
      'country': country,
      'name': name,
    };
  }

  factory StripePaymentMethod.fromJson(Map<String, dynamic> map) {
    return StripePaymentMethod(
      id: map['id'],
      last4: map['last4'],
      brand: map['brand'],
      expMonth: map['exp_month'],
      expYear: map['exp_year'],
      country: map['country'],
      name: map['name'],
    );
  }

  @override
  String toString() {
    return 'StripePaymentMethod(id: $id, last4: $last4, brand: $brand, expMonth: $expMonth, expYear: $expYear, country: $country, name: $name)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is StripePaymentMethod &&
        other.id == id &&
        other.last4 == last4 &&
        other.brand == brand &&
        other.expMonth == expMonth &&
        other.expYear == expYear &&
        other.country == country &&
        other.name == name;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        last4.hashCode ^
        brand.hashCode ^
        expMonth.hashCode ^
        expYear.hashCode ^
        country.hashCode ^
        name.hashCode;
  }
}
