class ProductVariantPack {
  final String? id;
  final double size;
  final String unit;
  ProductVariantPack({
    this.id,
    required this.size,
    required this.unit,
  });

  ProductVariantPack copyWith({
    String? id,
    double? size,
    String? unit,
  }) {
    return ProductVariantPack(
      id: id ?? this.id,
      size: size ?? this.size,
      unit: unit ?? this.unit,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'size': size,
      'unit': unit,
    };
  }

  factory ProductVariantPack.fromJson(Map<String, dynamic> map) {
    return ProductVariantPack(
      id: map['id'],
      size: map['size'],
      unit: map['unit'],
    );
  }

  @override
  String toString() => 'ProductVariantPack(id: $id, size: $size, unit: $unit)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ProductVariantPack && other.id == id && other.size == size && other.unit == unit;
  }

  @override
  int get hashCode => id.hashCode ^ size.hashCode ^ unit.hashCode;
}
