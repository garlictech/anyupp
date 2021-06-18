import 'dart:convert';

import 'package:fa_prev/models/Invoice.dart';
import 'package:fa_prev/models/receipt.dart';

class TransactionItem {
  final String createdAt;
  final String currency;
  final String externalTransactionId;
  final String orderId;
  final String status;
  final double total;
  final String type;
  final String updatedAt;
  final String id;
  final String userId;
  final Receipt receipt;
  final Invoice invoice;
  TransactionItem(
      {this.createdAt,
      this.currency,
      this.externalTransactionId,
      this.orderId,
      this.status,
      this.total,
      this.type,
      this.updatedAt,
      this.id,
      this.userId,
      this.receipt,
      this.invoice});

  TransactionItem copyWith(
      {String createdAt,
      String currency,
      String externalTransactionId,
      String orderId,
      String status,
      double total,
      String type,
      String updatedAt,
      String id,
      String userId,
      Receipt receipt,
      Invoice invoice}) {
    return TransactionItem(
        createdAt: createdAt ?? this.createdAt,
        currency: currency ?? this.currency,
        externalTransactionId: externalTransactionId ?? this.externalTransactionId,
        orderId: orderId ?? this.orderId,
        status: status ?? this.status,
        total: total ?? this.total,
        type: type ?? this.type,
        updatedAt: updatedAt ?? this.updatedAt,
        id: id ?? this.id,
        userId: userId ?? this.userId,
        invoice: invoice ?? this.invoice,
        receipt: receipt ?? this.receipt);
  }

  Map<String, dynamic> toMap() {
    return {
      'createdAt': createdAt,
      'currency': currency,
      'externalTransactionId': externalTransactionId,
      'orderId': orderId,
      'status': status,
      'total': total,
      'type': type,
      'updatedAt': updatedAt,
      'id': id,
      'userId': userId,
      'receipt': receipt.toMap(),
      'invoice': invoice.toMap()
    };
  }

  factory TransactionItem.fromMap(Map<String, dynamic> map) {
    return TransactionItem(
        createdAt: map['createdAt'],
        currency: map['currency'],
        externalTransactionId: map['externalTransactionId'],
        orderId: map['orderId'],
        status: map['status'],
        total: map['total'],
        type: map['type'],
        updatedAt: map['updatedAt'],
        id: map['id'],
        userId: map['userId'],  
        invoice: map['invoice'] != null ? Invoice.fromMap(Map<String, dynamic>.from(map['invoice'])) : null,
        receipt: map['receipt'] != null ? Receipt.fromMap(Map<String, dynamic>.from(map['receipt'])) : null);
  }

  String toJson() => json.encode(toMap());

  factory TransactionItem.fromJson(String source) => TransactionItem.fromMap(json.decode(source));

  @override
  String toString() {
    return 'TransActionItem(createdAt: $createdAt, currency: $currency, externalTransactionId: $externalTransactionId orderId: $orderId, status: $status, total: $total, type: $type, updatedAt: $updatedAt, id: $id, userId: $userId), receipt: ${receipt.toString()}, invoice: ${invoice.toString()}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is TransactionItem &&
        other.createdAt == createdAt &&
        other.currency == currency &&
        other.externalTransactionId == externalTransactionId &&
        other.orderId == orderId &&
        other.status == status &&
        other.total == total &&
        other.type == type &&
        other.updatedAt == updatedAt &&
        other.id == id &&
        other.userId == userId &&
        other.receipt == receipt &&
        other.invoice == invoice;
  }

  @override
  int get hashCode {
    return createdAt.hashCode ^
        currency.hashCode ^
        externalTransactionId.hashCode ^
        orderId.hashCode ^
        status.hashCode ^
        total.hashCode ^
        type.hashCode ^
        updatedAt.hashCode ^
        id.hashCode ^
        userId.hashCode ^
        invoice.hashCode ^
        receipt.hashCode;
  }
}
