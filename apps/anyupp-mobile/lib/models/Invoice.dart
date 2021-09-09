import 'package:flutter/foundation.dart';

@immutable
class Invoice {
  final String? id;
  final String? updatedAt;
  final String userId;
  final String transactionId;
  final String? taxNumber;
  final String streetAddress;
  final String status;
  final String postalCode;
  final String? pdfUrl;
  final String orderId;
  final String? externalInvoiceId;
  final String? email;
  final String customerName;
  final String? createdAt;
  final String country;
  final String city;

  Invoice({
    this.id,
    this.updatedAt,
    required this.userId,
    required this.transactionId,
    this.taxNumber,
    required this.streetAddress,
    required this.status,
    required this.postalCode,
    this.pdfUrl,
    required this.orderId,
    this.externalInvoiceId,
    this.email,
    required this.customerName,
    this.createdAt,
    required this.country,
    required this.city,
  });

  Invoice copyWith({
    String? id,
    String? updatedAt,
    String? userId,
    String? transactionId,
    String? taxNumber,
    String? streetAddress,
    String? status,
    String? postalCode,
    String? pdfUrl,
    String? orderId,
    String? externalInvoiceId,
    String? email,
    String? customerName,
    String? createdAt,
    String? country,
    String? city,
  }) {
    return Invoice(
      id: id ?? this.id,
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

  Map<String, dynamic> toJson() {
    return {
      'id': id,
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

  factory Invoice.fromJson(Map<String, dynamic> map) {
    return Invoice(
      id: map['id'],
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

  @override
  String toString() {
    return 'Invoice(id: $id, updatedAt: $updatedAt, userId: $userId, transactionId: $transactionId, taxNumber: $taxNumber, streetAddress: $streetAddress, status: $status, postalCode: $postalCode, pdfUrl: $pdfUrl, orderId: $orderId, externalInvoiceId: $externalInvoiceId, email: $email, customerName: $customerName, createdAt: $createdAt, country: $country, city: $city)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Invoice &&
        other.id == id &&
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
    return id.hashCode ^
        updatedAt.hashCode ^
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
