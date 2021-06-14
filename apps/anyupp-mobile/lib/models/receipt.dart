import 'dart:convert';

class Receipt {
  final String createdAt;
  final String email;
  final String id;
  final String orderId;
  final String pdfUrl;
  final String status;
  final String transactionId;
  final String updatedAt;
  final String userId;
  Receipt({
     this.createdAt,
     this.email,
     this.id,
     this.orderId,
     this.pdfUrl,
     this.status,
     this.transactionId,
     this.updatedAt,
     this.userId,
  });

  Receipt copyWith({
    String createdAt,
    String email,
    String id,
    String orderId,
    String pdfUrl,
    String status,
    String transactionId,
    String updatedAt,
    String userId,
  }) {
    return Receipt(
      createdAt: createdAt ?? this.createdAt,
      email: email ?? this.email,
      id: id ?? this.id,
      orderId: orderId ?? this.orderId,
      pdfUrl: pdfUrl ?? this.pdfUrl,
      status: status ?? this.status,
      transactionId: transactionId ?? this.transactionId,
      updatedAt: updatedAt ?? this.updatedAt,
      userId: userId ?? this.userId,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'createdAt': createdAt,
      'email': email,
      'id': id,
      'orderId': orderId,
      'pdfUrl': pdfUrl,
      'status': status,
      'transactionId': transactionId,
      'updatedAt': updatedAt,
      'userId': userId,
    };
  }

  factory Receipt.fromMap(Map<String, dynamic> map) {
    return Receipt(
      createdAt: map['createdAt'],
      email: map['email'],
      id: map['id'],
      orderId: map['orderId'],
      pdfUrl: map['pdfUrl'],
      status: map['status'],
      transactionId: map['transactionId'],
      updatedAt: map['updatedAt'],
      userId: map['userId'],
    );
  }

  String toJson() => json.encode(toMap());

  factory Receipt.fromJson(String source) => Receipt.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Receipt(createdAt: $createdAt, email: $email, id: $id, orderId: $orderId, pdfUrl: $pdfUrl, status: $status, transactionId: $transactionId, updatedAt: $updatedAt, userId: $userId)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
  
    return other is Receipt &&
      other.createdAt == createdAt &&
      other.email == email &&
      other.id == id &&
      other.orderId == orderId &&
      other.pdfUrl == pdfUrl &&
      other.status == status &&
      other.transactionId == transactionId &&
      other.updatedAt == updatedAt &&
      other.userId == userId;
  }

  @override
  int get hashCode {
    return createdAt.hashCode ^
      email.hashCode ^
      id.hashCode ^
      orderId.hashCode ^
      pdfUrl.hashCode ^
      status.hashCode ^
      transactionId.hashCode ^
      updatedAt.hashCode ^
      userId.hashCode;
  }
}
