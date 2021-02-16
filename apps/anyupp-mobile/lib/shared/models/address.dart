import 'dart:convert';

import 'package:google_maps_flutter/google_maps_flutter.dart';

class Address {
  String country;
  String city;
  String postalCode;
  String address;
  String name;
  LatLng location;

  Address({
    this.country,
    this.city,
    this.postalCode,
    this.address,
    this.name,
    this.location,
  });

  Map<String, dynamic> toMap() {
    return {
      'country': country,
      'city': city,
      'postalCode': postalCode,
      'address': address,
      'name': name,
      'location': location,
    };
  }

  static Address fromMap(Map<dynamic, dynamic> map) {
    if (map == null) return null;

    return Address(
      country: map['country'],
      city: map['city'],
      postalCode: map['postalCode'],
      address: map['address'],
      name: map['name'],
      location: map['location'] != null ? LatLng(map['location']['lat'], map['location']['lng']) : null,
    );
  }

  String toJson() => json.encode(toMap());

  static Address fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() {
    return 'Address(country: $country, city: $city, postalCode: $postalCode, address: $address, name: $name, location: $location)';
  }

  String toAddressString() {
    return '$city, $address, $postalCode';
  }
}
