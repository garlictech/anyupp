import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class PriceShown extends Model {
  final String id;
  final String currency;
  final double pricePerUnit;
  final double priceSum;
  final int tax;
  final double taxSum;

  @override
  String getId() {
    return id;
  }

  const PriceShown._internal(
      {@required this.id,
      this.currency,
      this.pricePerUnit,
      this.priceSum,
      this.tax,
      this.taxSum});

  factory PriceShown(
      {String id,
      String currency,
      double pricePerUnit,
      double priceSum,
      int tax,
      double taxSum}) {
    return PriceShown._internal(
        id: id == null ? UUID.getUUID() : id,
        currency: currency,
        pricePerUnit: pricePerUnit,
        priceSum: priceSum,
        tax: tax,
        taxSum: taxSum);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PriceShown &&
        id == other.id &&
        currency == other.currency &&
        pricePerUnit == other.pricePerUnit &&
        priceSum == other.priceSum &&
        tax == other.tax &&
        taxSum == other.taxSum;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("PriceShown {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("currency=" + "$currency" + ", ");
    buffer.write("pricePerUnit=" +
        (pricePerUnit != null ? pricePerUnit.toString() : "null") +
        ", ");
    buffer.write(
        "priceSum=" + (priceSum != null ? priceSum.toString() : "null") + ", ");
    buffer.write("tax=" + (tax != null ? tax.toString() : "null") + ", ");
    buffer.write("taxSum=" + (taxSum != null ? taxSum.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  PriceShown copyWith(
      {String id,
      String currency,
      double pricePerUnit,
      double priceSum,
      int tax,
      double taxSum}) {
    return PriceShown(
        id: id ?? this.id,
        currency: currency ?? this.currency,
        pricePerUnit: pricePerUnit ?? this.pricePerUnit,
        priceSum: priceSum ?? this.priceSum,
        tax: tax ?? this.tax,
        taxSum: taxSum ?? this.taxSum);
  }

  PriceShown.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        currency = json['currency'],
        pricePerUnit = json['pricePerUnit'],
        priceSum = json['priceSum'],
        tax = json['tax'],
        taxSum = json['taxSum'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'currency': currency,
        'pricePerUnit': pricePerUnit,
        'priceSum': priceSum,
        'tax': tax,
        'taxSum': taxSum
      };
}
