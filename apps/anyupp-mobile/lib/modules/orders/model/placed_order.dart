import 'dart:convert';

import 'package:fa_prev/shared/utils/firebase_conversion_utils.dart';

class PlacedOrder {
  // TODO: do we use these?
  static const int NONE = 0;
  static const int PLACED = 1;
  static const int RECEIVED = 6;
  static const int PROCESSING = 2;
  static const int READY = 3;
  static const int WAITING_FOR_PAYMENT = 4;
  static const int PAYED = 5;
  static const int FAILED = 10;
  static const int REJECTED = 11;

  String id;
  List<Item> items;
  String staffId;
  Map<String, StatusLog> statusLog;
  PriceShown sumPriceShown;
  bool takeAway;
  String userId;
  DateTime created;
  String paymentMethod;
  DateTime paymentIntention;

  PlacedOrder({
    this.id,
    this.items,
    this.staffId,
    this.statusLog,
    this.sumPriceShown,
    this.takeAway,
    this.userId,
    this.created,
    this.paymentMethod,
    this.paymentIntention,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'items': items?.map((x) => x?.toMap())?.toList(),
      'staffId': staffId,
      'statusLog': statusLog.map((key, value) => MapEntry(key, value.toMap())),
      'sumPriceShown': sumPriceShown?.toMap(),
      'takeAway': takeAway,
      'userId': userId,
      'created': created?.millisecondsSinceEpoch,
      'paymentMethod': paymentMethod,
      'paymentIntention': paymentIntention?.millisecondsSinceEpoch,
    };
  }

  static PlacedOrder fromMap(Map<dynamic, dynamic> map) {
    if (map == null) return null;

    return PlacedOrder(
      id: map['id'],
      items: List<Item>.from(map['items']?.map((x) => Item.fromMap(x))),
      staffId: map['staffId'],
      // statusLog: Map<String, StatusLog>.from(map['statusLog']),
      statusLog: Map<String, Map<dynamic, dynamic>>.from(map['statusLog'])
          .map((key, value) => MapEntry(key, StatusLog.fromMap(value))),
      sumPriceShown: PriceShown.fromMap(map['sumPriceShown']),
      takeAway: map['takeAway'],
      userId: map['userId'],
      paymentMethod: map['paymentMethod'],
      created: DateTime.fromMillisecondsSinceEpoch(map['created']),
      paymentIntention:  map['paymentIntention'] != null ? DateTime.fromMillisecondsSinceEpoch(map['paymentIntention']) : null,
    );
  }

  String toJson() => json.encode(toMap());

  static PlacedOrder fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() {
    return 'PlacedOrder(id: $id, payment: $paymentMethod, items: $items, staffId: $staffId, statusLog: $statusLog, sumPriceShown: $sumPriceShown, takeAway: $takeAway, userId: $userId, created: $created, paymentIntention: $paymentIntention)';
  }
}

class Item {
  PriceShown priceShown;
  String productId;
  String variantId;
  int quantity;
  Map<String, StatusLog> statusLog;
  Map<String, String> productName;
  Map<String, String> variantName;
  DateTime created;

  Item(
      {this.priceShown,
      this.productId,
      this.variantId,
      this.quantity,
      this.statusLog,
      this.productName,
      this.variantName,
      this.created});

  Map<String, dynamic> toMap() {
    return {
      'priceShown': priceShown?.toMap(),
      'productId': productId,
      'variantId': variantId,
      'quantity': quantity,
      'statusLog': statusLog.map((key, value) => MapEntry(key, value.toMap())),
      'productName': productName,
      'variantName': variantName,
      'created': created?.millisecondsSinceEpoch,
    };
  }

  static Item fromMap(Map<dynamic, dynamic> map) {
    if (map == null) return null;

    return Item(
      priceShown: PriceShown.fromMap(map['priceShown']),
      productId: map['productId'],
      variantId: map['variantId'],
      quantity: map['quantity'],
      statusLog: Map<String, Map<dynamic, dynamic>>.from(map['statusLog'])
          .map((key, value) => MapEntry(key, StatusLog.fromMap(value))),
      productName: Map<String, String>.from(map['productName']),
      variantName: Map<String, String>.from(map['variantName']),
      created: DateTime.fromMillisecondsSinceEpoch(map['created']),
    );
  }

  String toJson() => json.encode(toMap());

  static Item fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() {
    return 'Item(priceShown: $priceShown, productId: $productId, variantId: $variantId, quantity: $quantity, statusLog: $statusLog, productName: $productName, variantName: $variantName, created: $created)';
  }
}

class OrderStatus {
  static const PLACED = 'PLACED';
  static const PROCESSING = 'PROCESSING';
  static const READY = 'READY';
  static const PAID = 'PAID';
  static const REJECTED = 'REJECTED';
}

class StatusLog {
  final String userId;
  final String status;

  StatusLog({
    this.userId,
    this.status,
  });

  StatusLog copyWith({
    String userId,
    String status,
  }) {
    return StatusLog(
      userId: userId ?? this.userId,
      status: status ?? this.status,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'status': status,
    };
  }

  static StatusLog fromMap(Map<dynamic, dynamic> map) {
    if (map == null) return null;

    return StatusLog(
      userId: map['userId'],
      status: map['status'],
    );
  }

  String toJson() => json.encode(toMap());

  static StatusLog fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() => 'StatusLog(userId: $userId, status: $status)';
}

class PriceShown {
  String currency;
  double pricePerUnit;
  double priceSum;
  int taxPercentage;
  double taxSum;

  PriceShown({
    this.currency,
    this.pricePerUnit,
    this.priceSum,
    this.taxPercentage,
    this.taxSum,
  });

  Map<String, dynamic> toMap() {
    return {
      'currency': currency,
      'pricePerUnit': pricePerUnit,
      'priceSum': priceSum,
      'taxPercentage': taxPercentage,
      'taxSum': taxSum,
    };
  }

  static PriceShown fromMap(Map<dynamic, dynamic> map) {
    if (map == null) return null;

    return PriceShown(
      currency: map['currency'],
      // TODO ezeket getDoubleFromFirebaseValue() at kene tenni egy fuggetlen class-ba
      pricePerUnit: getDoubleFromFirebaseValue(map['pricePerUnit']),
      priceSum: getDoubleFromFirebaseValue(map['priceSum']),
      taxPercentage: map['taxPercentage'],
      taxSum: getDoubleFromFirebaseValue(map['taxSum']),
    );
  }

  String toJson() => json.encode(toMap());

  static PriceShown fromJson(String source) => fromMap(json.decode(source));
  @override
  String toString() {
    return 'PriceShown(currency: $currency, netPerUnit: $pricePerUnit, netSum: $priceSum, taxPercentage: $taxPercentage, taxSum: $taxSum)';
  }
}
