import 'dart:convert';
import 'package:flutter/foundation.dart';

@immutable
class Invoice {
  final String updatedAt;
  final String userId;
  final String transactionId;
  final String taxNumber;
  final String streetAddress;
  final String status;
  final String postalCode;
  final String pdfUrl;
  final String orderId;
  final String externalInvoiceId;
  final String email;
  final String customerName;
  final String createdAt;
  final String country;
  final String city;
  Invoice({
    this.updatedAt,
    this.userId,
    this.transactionId,
    this.taxNumber,
    this.streetAddress,
    this.status,
    this.postalCode,
    this.pdfUrl,
    this.orderId,
    this.externalInvoiceId,
    this.email,
    this.customerName,
    this.createdAt,
    this.country,
    this.city,
  });

  Invoice copyWith({
    String updatedAt,
    String userId,
    String transactionId,
    String taxNumber,
    String streetAddress,
    String status,
    String postalCode,
    String pdfUrl,
    String orderId,
    String externalInvoiceId,
    String email,
    String customerName,
    String createdAt,
    String country,
    String city,
  }) {
    return Invoice(
      updatedAt: updatedAt ?? this.updatedAt,
      userId: userId ?? this.userId,
      transactionId: transactionId ?? this.transactionId,
      taxNumber: taxNumber ?? this.taxNumber,
      streetAddress: streetAddress ?? this.streetAddress,
      status: status ?? this.status,
      postalCode: postalCode ?? this.postalCode,
      pdfUrl: pdfUrl ?? this.pdfUrl,
      orderId: orderId ?? this.orderId,
      externalInvoiceId: externalInvoiceId ?? this.externalInvoiceId,
      email: email ?? this.email,
      customerName: customerName ?? this.customerName,
      createdAt: createdAt ?? this.createdAt,
      country: country ?? this.country,
      city: city ?? this.city,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'updatedAt': updatedAt,
      'userId': userId,
      'transactionId': transactionId,
      'taxNumber': taxNumber,
      'streetAddress': streetAddress,
      'status': status,
      'postalCode': postalCode,
      'pdfUrl': pdfUrl,
      'orderId': orderId,
      'externalInvoiceId': externalInvoiceId,
      'email': email,
      'customerName': customerName,
      'createdAt': createdAt,
      'country': country,
      'city': city,
    };
  }

  factory Invoice.fromMap(Map<String, dynamic> map) {
    return Invoice(
      updatedAt: map['updatedAt'],
      userId: map['userId'],
      transactionId: map['transactionId'],
      taxNumber: map['taxNumber'],
      streetAddress: map['streetAddress'],
      status: map['status'],
      postalCode: map['postalCode'],
      pdfUrl: map['pdfUrl'],
      orderId: map['orderId'],
      externalInvoiceId: map['externalInvoiceId'],
      email: map['email'],
      customerName: map['customerName'],
      createdAt: map['createdAt'],
      country: map['country'],
      city: map['city'],
    );
  }

  String toJson() => json.encode(toMap());

  factory Invoice.fromJson(String source) => Invoice.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Invoice(updatedAt: $updatedAt, userId: $userId, transactionId: $transactionId, taxNumber: $taxNumber, streetAddress: $streetAddress, status: $status, postalCode: $postalCode, pdfUrl: $pdfUrl, orderId: $orderId, externalInvoiceId: $externalInvoiceId, email: $email, customerName: $customerName, createdAt: $createdAt, country: $country, city: $city)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Invoice &&
        other.updatedAt == updatedAt &&
        other.userId == userId &&
        other.transactionId == transactionId &&
        other.taxNumber == taxNumber &&
        other.streetAddress == streetAddress &&
        other.status == status &&
        other.postalCode == postalCode &&
        other.pdfUrl == pdfUrl &&
        other.orderId == orderId &&
        other.externalInvoiceId == externalInvoiceId &&
        other.email == email &&
        other.customerName == customerName &&
        other.createdAt == createdAt &&
        other.country == country &&
        other.city == city;
  }

  @override
  int get hashCode {
    return updatedAt.hashCode ^
        userId.hashCode ^
        transactionId.hashCode ^
        taxNumber.hashCode ^
        streetAddress.hashCode ^
        status.hashCode ^
        postalCode.hashCode ^
        pdfUrl.hashCode ^
        orderId.hashCode ^
        externalInvoiceId.hashCode ^
        email.hashCode ^
        customerName.hashCode ^
        createdAt.hashCode ^
        country.hashCode ^
        city.hashCode;
  }
}
