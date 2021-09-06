class Receipt {
  final String? id;
  final String userId;
  final String orderId;
  final String transactionId;
  // final String externalReceiptId; // TODO ez nem kell?
  final String? email;
  final String? pdfData;
  final String status;
  final String? updatedAt;
  final String? createdAt;
  Receipt({
    this.id,
    required this.userId,
    required this.orderId,
    required this.transactionId,
    this.email,
    this.pdfData,
    required this.status,
    this.updatedAt,
    this.createdAt,
  });

  Receipt copyWith({
    String? id,
    String? userId,
    String? orderId,
    String? transactionId,
    String? email,
    String? pdfData,
    String? status,
    String? updatedAt,
    String? createdAt,
  }) {
    return Receipt(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      orderId: orderId ?? this.orderId,
      transactionId: transactionId ?? this.transactionId,
      email: email ?? this.email,
      pdfData: pdfData ?? this.pdfData,
      status: status ?? this.status,
      updatedAt: updatedAt ?? this.updatedAt,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'orderId': orderId,
      'transactionId': transactionId,
      'email': email,
      'pdfData': pdfData,
      'status': status,
      'updatedAt': updatedAt,
      'createdAt': createdAt,
    };
  }

  factory Receipt.fromJson(Map<String, dynamic> map) {
    return Receipt(
      id: map['id'],
      userId: map['userId'],
      orderId: map['orderId'],
      transactionId: map['transactionId'],
      email: map['email'],
      pdfData: map['pdfData'],
      status: map['status'],
      updatedAt: map['updatedAt'],
      createdAt: map['createdAt'],
    );
  }

  @override
  String toString() {
    return 'Receipt(id: $id, userId: $userId, orderId: $orderId, transactionId: $transactionId, email: $email, pdfData: $pdfData, status: $status, updatedAt: $updatedAt, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Receipt &&
        other.id == id &&
        other.userId == userId &&
        other.orderId == orderId &&
        other.transactionId == transactionId &&
        other.email == email &&
        other.pdfData == pdfData &&
        other.status == status &&
        other.updatedAt == updatedAt &&
        other.createdAt == createdAt;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        userId.hashCode ^
        orderId.hashCode ^
        transactionId.hashCode ^
        email.hashCode ^
        pdfData.hashCode ^
        status.hashCode ^
        updatedAt.hashCode ^
        createdAt.hashCode;
  }
}
