import '/models.dart';

import 'package:flutter/foundation.dart';

@immutable
class Address {
  // static const classType = AddressType();
  final String? id;
  final String address;
  final String city;
  final String country;
  final String title;
  final String postalCode;
  final Location? location;
  Address({
    this.id,
    required this.address,
    required this.city,
    required this.country,
    required this.title,
    required this.postalCode,
    this.location,
  });

  Address copyWith({
    String? id,
    String? address,
    String? city,
    String? country,
    String? title,
    String? postalCode,
    Location? location,
  }) {
    return Address(
      id: id ?? this.id,
      address: address ?? this.address,
      city: city ?? this.city,
      country: country ?? this.country,
      title: title ?? this.title,
      postalCode: postalCode ?? this.postalCode,
      location: location ?? this.location,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'address': address,
      'city': city,
      'country': country,
      'title': title,
      'postalCode': postalCode,
      'location': location?.toJson(),
    };
  }

  factory Address.fromJson(Map<String, dynamic> map) {
    return Address(
      id: map['id'],
      address: map['address'],
      city: map['city'],
      country: map['country'],
      title: map['title'],
      postalCode: map['postalCode'],
      location:
          map['location'] != null ? Location.fromJson(map['location']) : null,
    );
  }

  @override
  String toString() {
    return 'Address(id: $id, address: $address, city: $city, country: $country, title: $title, postalCode: $postalCode, location: $location)';
  }

  String asFormattedString() {
    return '${city}, ${address}, ${postalCode}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Address &&
        other.id == id &&
        other.address == address &&
        other.city == city &&
        other.country == country &&
        other.title == title &&
        other.postalCode == postalCode &&
        other.location == location;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        address.hashCode ^
        city.hashCode ^
        country.hashCode ^
        title.hashCode ^
        postalCode.hashCode ^
        location.hashCode;
  }
}
