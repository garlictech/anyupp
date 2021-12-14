import 'package:flutter/foundation.dart';

@immutable
class Packaging {
  final double fee;
  final double tax;

  Packaging(
    this.fee,
    this.tax,
  );

  Packaging copyWith({
    double? fee,
    double? tax,
  }) {
    return Packaging(
      fee ?? this.fee,
      tax ?? this.tax,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'fee': fee,
      'tax': tax,
    };
  }

  factory Packaging.fromJson(Map<String, dynamic> map) {
    return Packaging(
      map['fee'],
      map['tax'],
    );
  }

  @override
  String toString() => 'Packaging(fee: $fee, tax: $tax)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Packaging && other.fee == fee && other.tax == tax;
  }

  @override
  int get hashCode => fee.hashCode ^ tax.hashCode;
}
