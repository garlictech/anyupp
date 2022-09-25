// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ProductConfigComponent.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $ProductConfigComponent {
  const $ProductConfigComponent();

  String get productComponentId;
  double get price;
  int get position;
  double? get netPackagingFee;
  bool? get soldOut;

  ProductConfigComponent copyWith({
    String? productComponentId,
    double? price,
    int? position,
    double? netPackagingFee,
    bool? soldOut,
  }) =>
      ProductConfigComponent(
        productComponentId: productComponentId ?? this.productComponentId,
        price: price ?? this.price,
        position: position ?? this.position,
        netPackagingFee: netPackagingFee ?? this.netPackagingFee,
        soldOut: soldOut ?? this.soldOut,
      );

  ProductConfigComponent copyUsing(
      void Function(ProductConfigComponent$Change change) mutator) {
    final change = ProductConfigComponent$Change._(
      this.productComponentId,
      this.price,
      this.position,
      this.netPackagingFee,
      this.soldOut,
    );
    mutator(change);
    return ProductConfigComponent(
      productComponentId: change.productComponentId,
      price: change.price,
      position: change.position,
      netPackagingFee: change.netPackagingFee,
      soldOut: change.soldOut,
    );
  }

  @override
  String toString() =>
      "ProductConfigComponent(productComponentId: $productComponentId, price: $price, position: $position, netPackagingFee: $netPackagingFee, soldOut: $soldOut)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is ProductConfigComponent &&
      other.runtimeType == runtimeType &&
      productComponentId == other.productComponentId &&
      price == other.price &&
      position == other.position &&
      netPackagingFee == other.netPackagingFee &&
      soldOut == other.soldOut;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + productComponentId.hashCode;
    result = 37 * result + price.hashCode;
    result = 37 * result + position.hashCode;
    result = 37 * result + netPackagingFee.hashCode;
    result = 37 * result + soldOut.hashCode;
    return result;
  }
}

class ProductConfigComponent$Change {
  ProductConfigComponent$Change._(
    this.productComponentId,
    this.price,
    this.position,
    this.netPackagingFee,
    this.soldOut,
  );

  String productComponentId;
  double price;
  int position;
  double? netPackagingFee;
  bool? soldOut;
}

// ignore: avoid_classes_with_only_static_members
class ProductConfigComponent$ {
  static final productComponentId = Lens<ProductConfigComponent, String>(
    (productComponentIdContainer) =>
        productComponentIdContainer.productComponentId,
    (productComponentIdContainer, productComponentId) =>
        productComponentIdContainer.copyWith(
            productComponentId: productComponentId),
  );

  static final price = Lens<ProductConfigComponent, double>(
    (priceContainer) => priceContainer.price,
    (priceContainer, price) => priceContainer.copyWith(price: price),
  );

  static final position = Lens<ProductConfigComponent, int>(
    (positionContainer) => positionContainer.position,
    (positionContainer, position) =>
        positionContainer.copyWith(position: position),
  );

  static final netPackagingFee = Lens<ProductConfigComponent, double?>(
    (netPackagingFeeContainer) => netPackagingFeeContainer.netPackagingFee,
    (netPackagingFeeContainer, netPackagingFee) =>
        netPackagingFeeContainer.copyWith(netPackagingFee: netPackagingFee),
  );

  static final soldOut = Lens<ProductConfigComponent, bool?>(
    (soldOutContainer) => soldOutContainer.soldOut,
    (soldOutContainer, soldOut) => soldOutContainer.copyWith(soldOut: soldOut),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductConfigComponent _$ProductConfigComponentFromJson(
        Map<String, dynamic> json) =>
    ProductConfigComponent(
      productComponentId: json['productComponentId'] as String,
      price: (json['price'] as num).toDouble(),
      position: json['position'] as int,
      netPackagingFee: (json['netPackagingFee'] as num?)?.toDouble(),
      soldOut: json['soldOut'] as bool? ?? false,
    );

Map<String, dynamic> _$ProductConfigComponentToJson(
    ProductConfigComponent instance) {
  final val = <String, dynamic>{
    'productComponentId': instance.productComponentId,
    'price': instance.price,
    'position': instance.position,
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('netPackagingFee', instance.netPackagingFee);
  writeNotNull('soldOut', instance.soldOut);
  return val;
}
