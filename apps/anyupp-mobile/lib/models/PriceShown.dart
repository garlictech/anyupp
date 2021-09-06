class PriceShown {
  final String? id;
  final String currency;
  final double pricePerUnit;
  final double priceSum;
  final int tax;
  final double taxSum;

  PriceShown({
    this.id,
    required this.currency,
    required this.pricePerUnit,
    required this.priceSum,
    required this.tax,
    required this.taxSum,
  });

  PriceShown copyWith({
    String? id,
    String? currency,
    double? pricePerUnit,
    double? priceSum,
    int? tax,
    double? taxSum,
  }) {
    return PriceShown(
      id: id ?? this.id,
      currency: currency ?? this.currency,
      pricePerUnit: pricePerUnit ?? this.pricePerUnit,
      priceSum: priceSum ?? this.priceSum,
      tax: tax ?? this.tax,
      taxSum: taxSum ?? this.taxSum,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'currency': currency,
      'pricePerUnit': pricePerUnit,
      'priceSum': priceSum,
      'tax': tax,
      'taxSum': taxSum,
    };
  }

  factory PriceShown.fromJson(Map<String, dynamic> map) {
    return PriceShown(
      id: map['id'],
      currency: map['currency'],
      pricePerUnit: map['pricePerUnit'],
      priceSum: map['priceSum'],
      tax: map['tax'],
      taxSum: map['taxSum'],
    );
  }

  @override
  String toString() {
    return 'PriceShown(id: $id, currency: $currency, pricePerUnit: $pricePerUnit, priceSum: $priceSum, tax: $tax, taxSum: $taxSum)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is PriceShown &&
        other.id == id &&
        other.currency == currency &&
        other.pricePerUnit == pricePerUnit &&
        other.priceSum == priceSum &&
        other.tax == tax &&
        other.taxSum == taxSum;
  }

  @override
  int get hashCode {
    return id.hashCode ^ currency.hashCode ^ pricePerUnit.hashCode ^ priceSum.hashCode ^ tax.hashCode ^ taxSum.hashCode;
  }
}
