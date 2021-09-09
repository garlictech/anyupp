import 'package:flutter/foundation.dart';

@immutable
class InvoiceInfo {
  // static const classType = AddressType();
  final String? id;
  final String name;
  final String taxNumber;
  final String country;
  final String city;
  final String postalCode;
  final String streetAddress;
  final String? invoiceMail;

  InvoiceInfo({
    this.id,
    required this.name,
    required this.taxNumber,
    required this.country,
    required this.city,
    required this.postalCode,
    required this.streetAddress,
    this.invoiceMail,
  });

  InvoiceInfo copyWith({
    String? id,
    String? name,
    String? taxNumber,
    String? country,
    String? city,
    String? postalCode,
    String? streetAddress,
    String? invoiceMail,
  }) {
    return InvoiceInfo(
      id: id ?? this.id,
      name: name ?? this.name,
      taxNumber: taxNumber ?? this.taxNumber,
      country: country ?? this.country,
      city: city ?? this.city,
      postalCode: postalCode ?? this.postalCode,
      streetAddress: streetAddress ?? this.streetAddress,
      invoiceMail: invoiceMail ?? this.invoiceMail,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'taxNumber': taxNumber,
      'country': country,
      'city': city,
      'postalCode': postalCode,
      'streetAddress': streetAddress,
      'invoiceMail': invoiceMail,
    };
  }

  factory InvoiceInfo.fromJson(Map<String, dynamic> map) {
    return InvoiceInfo(
      id: map['id'],
      name: map['name'],
      taxNumber: map['taxNumber'],
      country: map['country'],
      city: map['city'],
      postalCode: map['postalCode'],
      streetAddress: map['streetAddress'],
      invoiceMail: map['invoiceMail'],
    );
  }

  @override
  String toString() {
    return 'InvoiceInfo(id: $id, name: $name, taxNumber: $taxNumber, country: $country, city: $city, postalCode: $postalCode, streetAddress: $streetAddress, invoiceMail: $invoiceMail)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is InvoiceInfo &&
        other.id == id &&
        other.name == name &&
        other.taxNumber == taxNumber &&
        other.country == country &&
        other.city == city &&
        other.postalCode == postalCode &&
        other.streetAddress == streetAddress &&
        other.invoiceMail == invoiceMail;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        name.hashCode ^
        taxNumber.hashCode ^
        country.hashCode ^
        city.hashCode ^
        postalCode.hashCode ^
        streetAddress.hashCode ^
        invoiceMail.hashCode;
  }
}
