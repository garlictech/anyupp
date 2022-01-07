import 'package:flutter/foundation.dart';

@immutable
class UserInvoiceAddress {
  final String customerName;
  final String taxNumber;
  final String country;
  final String city;
  final String streetAddress;
  final String postalCode;
  final String? email;

  UserInvoiceAddress({
    required this.customerName,
    required this.taxNumber,
    required this.country,
    required this.city,
    required this.streetAddress,
    required this.postalCode,
    this.email,
  });

  UserInvoiceAddress copyWith({
    String? customerName,
    String? taxNumber,
    String? country,
    String? city,
    String? streetAddress,
    String? postalCode,
    String? email,
  }) {
    return UserInvoiceAddress(
      customerName: customerName ?? this.customerName,
      taxNumber: taxNumber ?? this.taxNumber,
      country: country ?? this.country,
      city: city ?? this.city,
      streetAddress: streetAddress ?? this.streetAddress,
      postalCode: postalCode ?? this.postalCode,
      email: email ?? this.email,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'customerName': customerName,
      'taxNumber': taxNumber,
      'country': country,
      'city': city,
      'streetAddress': streetAddress,
      'postalCode': postalCode,
      'email': email,
    };
  }

  factory UserInvoiceAddress.fromJson(Map<String, dynamic> map) {
    return UserInvoiceAddress(
      customerName: map['customerName'],
      taxNumber: map['taxNumber'],
      country: map['country'],
      city: map['city'],
      streetAddress: map['streetAddress'],
      postalCode: map['postalCode'],
      email: map['email'] != null ? map['email'] : null,
    );
  }

  @override
  String toString() {
    return 'UserInvoiceAddress(customerName: $customerName, taxNumber: $taxNumber, country: $country, city: $city, streetAddress: $streetAddress, postalCode: $postalCode, email: $email)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is UserInvoiceAddress &&
        other.customerName == customerName &&
        other.taxNumber == taxNumber &&
        other.country == country &&
        other.city == city &&
        other.streetAddress == streetAddress &&
        other.postalCode == postalCode &&
        other.email == email;
  }

  @override
  int get hashCode {
    return customerName.hashCode ^
        taxNumber.hashCode ^
        country.hashCode ^
        city.hashCode ^
        streetAddress.hashCode ^
        postalCode.hashCode ^
        email.hashCode;
  }
}
