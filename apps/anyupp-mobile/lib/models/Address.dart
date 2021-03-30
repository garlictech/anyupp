import 'package:flutter/foundation.dart';

import 'Location.dart';
import 'core/model_base.dart';
import 'core/uuid.dart';

@immutable
class Address extends Model {
  // static const classType = AddressType();
  final String id;
  final String address;
  final String city;
  final String country;
  final String title;
  final String postalCode;
  final Location location;

  String getId() {
    return id;
  }

  const Address._internal(
      {@required this.id,
      this.address,
      this.city,
      this.country,
      this.title,
      this.postalCode,
      this.location});

  factory Address(
      {String id,
      String address,
      String city,
      String country,
      String title,
      String postalCode,
      Location location}) {
    return Address._internal(
        id: id == null ? UUID.getUUID() : id,
        address: address,
        city: city,
        country: country,
        title: title,
        postalCode: postalCode,
        location: location);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Address &&
        id == other.id &&
        address == other.address &&
        city == other.city &&
        country == other.country &&
        title == other.title &&
        postalCode == other.postalCode &&
        location == other.location;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("Address {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("address=" + "$address" + ", ");
    buffer.write("city=" + "$city" + ", ");
    buffer.write("country=" + "$country" + ", ");
    buffer.write("title=" + "$title" + ", ");
    buffer.write("postalCode=" + "$postalCode" + ", ");
    buffer
        .write("location=" + (location != null ? location.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Address copyWith(
      {String id,
      String address,
      String city,
      String country,
      String title,
      String postalCode,
      Location location}) {
    return Address(
        id: id ?? this.id,
        address: address ?? this.address,
        city: city ?? this.city,
        country: country ?? this.country,
        title: title ?? this.title,
        postalCode: postalCode ?? this.postalCode,
        location: location ?? this.location);
  }

  Address.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        address = json['address'],
        city = json['city'],
        country = json['country'],
        title = json['title'],
        postalCode = json['postalCode'],
        location = json['location'] != null
            ? Location.fromJson(Map<String, dynamic>.from(json['location']))
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'address': address,
        'city': city,
        'country': country,
        'title': title,
        'postalCode': postalCode,
        'location': location?.toJson()
      };
}
