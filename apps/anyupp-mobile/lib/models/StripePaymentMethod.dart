import 'dart:convert';

class StripePaymentMethod {
  final String id;
  final String last4;
  final String brand;
  final int expMonth;
  final int expYear;
  final String country;
  final String name;

  StripePaymentMethod({
    this.id,
    this.last4,
    this.brand,
    this.expMonth,
    this.expYear,
    this.country,
    this.name,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'last4': last4,
      'brand': brand,
      'exp_month': expMonth,
      'exp_year': expYear,
      'country': country,
      'name': name,
    };
  }

  factory StripePaymentMethod.fromMap(Map<String, dynamic> map) {
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

  String toJson() => json.encode(toMap());

  factory StripePaymentMethod.fromJson(String source) => StripePaymentMethod.fromMap(json.decode(source));

  @override
  String toString() {
    return 'StripePaymentMethod(name: $name, id: $id, last4: $last4, brand: $brand, expMonth: $expMonth, expYear: $expYear, country: $country)';
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
    return id.hashCode ^ last4.hashCode ^ brand.hashCode ^ expMonth.hashCode ^ expYear.hashCode ^ country.hashCode ^ name.hashCode;
  }
}
