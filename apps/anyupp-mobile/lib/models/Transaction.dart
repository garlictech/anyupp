import '/models.dart';
import 'package:flutter/foundation.dart';
import '/graphql/generated/crud-api.dart';

@immutable
class Transaction {
  final String? id;
  final String userId;
  final String orderId;
  final PaymentStatus? status;
  final String? currency;
  final double? total;
  final String? type;
  final String? externalTransactionId;
  final Receipt? receipt;
  final Invoice? invoice;
  final String? createdAt;
  final String? updatedAt;

  Transaction({
    this.id,
    required this.userId,
    required this.orderId,
    this.status,
    this.currency,
    this.total,
    this.type,
    this.externalTransactionId,
    this.receipt,
    this.invoice,
    this.createdAt,
    this.updatedAt,
  });

  Transaction copyWith({
    String? id,
    String? userId,
    String? orderId,
    PaymentStatus? status,
    String? currency,
    double? total,
    String? type,
    String? externalTransactionId,
    Receipt? receipt,
    Invoice? invoice,
    String? createdAt,
    String? updatedAt,
  }) {
    return Transaction(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      orderId: orderId ?? this.orderId,
      status: status ?? this.status,
      currency: currency ?? this.currency,
      total: total ?? this.total,
      type: type ?? this.type,
      externalTransactionId: externalTransactionId ?? this.externalTransactionId,
      receipt: receipt ?? this.receipt,
      invoice: invoice ?? this.invoice,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'orderId': orderId,
      'status': enumToString(status),
      'currency': currency,
      'total': total,
      'type': type,
      'externalTransactionId': externalTransactionId,
      'receipt': receipt?.toJson(),
      'invoice': invoice?.toJson(),
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  factory Transaction.fromJson(Map<String, dynamic> map) {
    return Transaction(
      id: map['id'],
      userId: map['userId'],
      orderId: map['orderId'],
      status: enumFromString(map['status'], PaymentStatus.values),
      currency: map['currency'],
      total: map['total'],
      type: map['type'],
      externalTransactionId: map['externalTransactionId'],
      receipt: map['receipt'] != null ? Receipt.fromJson(map['receipt']) : null,
      invoice: map['invoice'] != null ? Invoice.fromJson(map['invoice']) : null,
      createdAt: map['createdAt'],
      updatedAt: map['updatedAt'],
    );
  }

  @override
  String toString() {
    return 'TransactionItem(id: $id, userId: $userId, orderId: $orderId, status: $status, currency: $currency, total: $total, type: $type, externalTransactionId: $externalTransactionId, receipt: $receipt, invoice: $invoice, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Transaction &&
        other.id == id &&
        other.userId == userId &&
        other.orderId == orderId &&
        other.status == status &&
        other.currency == currency &&
        other.total == total &&
        other.type == type &&
        other.externalTransactionId == externalTransactionId &&
        other.receipt == receipt &&
        other.invoice == invoice &&
        other.createdAt == createdAt &&
        other.updatedAt == updatedAt;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        userId.hashCode ^
        orderId.hashCode ^
        status.hashCode ^
        currency.hashCode ^
        total.hashCode ^
        type.hashCode ^
        externalTransactionId.hashCode ^
        receipt.hashCode ^
        invoice.hashCode ^
        createdAt.hashCode ^
        updatedAt.hashCode;
  }
}
