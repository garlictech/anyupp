import 'dart:convert';

class Payment {
  String id;
  String accountId;

  Payment({
    this.id,
    this.accountId,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'accountId': accountId,
    };
  }

  static Payment fromMap(Map<dynamic, dynamic> map) {
    if (map == null) return null;

    return Payment(
      id: map['id'],
      accountId: map['accountId'],
    );
  }

  String toJson() => json.encode(toMap());

  static Payment fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() => 'Payment(id: $id, accountId: $accountId)';
}
