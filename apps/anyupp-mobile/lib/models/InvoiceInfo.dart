import 'package:flutter/foundation.dart';
import 'core/model_base.dart';
import 'core/uuid.dart';

@immutable
class InvoiceInfo extends Model {
  // static const classType = AddressType();
  final String id;
  final String name;
  final String taxNumber;
  final String country;
  final String city;
  final String postalCode;
  final String streetAddress;
  final String invoiceMail;

  String getId() {
    return id;
  }

  const InvoiceInfo._internal(
      {this.id,
      this.name,
      this.taxNumber,
      this.country,
      this.city,
      this.postalCode,
      this.streetAddress,
      this.invoiceMail});

  factory InvoiceInfo(
      {String id,
      String name,
      String taxNumber,
      String country,
      String city,
      String postalCode,
      String streetAddress,
      String invoiceMail}) {
    return InvoiceInfo._internal(
        id: id == null ? UUID.getUUID() : id,
        name: name,
        taxNumber: taxNumber,
        country: country,
        city: city,
        postalCode: postalCode,
        streetAddress: streetAddress,
        invoiceMail: invoiceMail);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is InvoiceInfo &&
        id == other.id &&
        name == other.name &&
        taxNumber == other.taxNumber &&
        country == other.country &&
        city == other.city &&
        postalCode == other.postalCode &&
        streetAddress == other.streetAddress &&
        invoiceMail == other.invoiceMail;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("Address {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("name=" + "$name" + ", ");
    buffer.write("taxNumber=" + "$taxNumber" + ", ");
    buffer.write("country=" + "$country" + ", ");
    buffer.write("city=" + "$city" + ", ");
    buffer.write("postalCode=" + "$postalCode" + ", ");
    buffer.write("streetAddress=" +
        (streetAddress != null ? streetAddress.toString() : "null"));
    buffer.write("invoiceMail=" + "$invoiceMail" + ", ");

    buffer.write("}");

    return buffer.toString();
  }

  InvoiceInfo copyWith(
      {String id,
      String name,
      String city,
      String country,
      String postalCode,
      String streetAddress,
      String invoiceMail}) {
    return InvoiceInfo(
        id: id ?? this.id,
        name: name ?? this.name,
        taxNumber: taxNumber ?? this.taxNumber,
        country: country ?? this.country,
        city: city ?? this.city,
        postalCode: postalCode ?? this.postalCode,
        streetAddress: streetAddress ?? this.streetAddress,
        invoiceMail: invoiceMail ?? this.invoiceMail);
  }

  InvoiceInfo.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        taxNumber = json['taxNumber'],
        country = json['country'],
        city = json['city'],
        postalCode = json['postalCode'],
        streetAddress = json['streetAddress'],
        invoiceMail = json['invoiceMail'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'taxNumber': taxNumber,
        'country': country,
        'city': city,
        'postalCode': postalCode,
        'streetAddress': streetAddress,
        'invoiceMail': invoiceMail
      };
}
