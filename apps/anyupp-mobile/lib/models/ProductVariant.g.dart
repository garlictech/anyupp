// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ProductVariant.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $ProductVariant {
  const $ProductVariant();

  String? get id;
  LocalizedItem get variantName;
  ProductVariantPack? get pack;
  double get price;
  int get position;
  double? get netPackagingFee;
  bool? get soldOut;
  bool get isAvailable;
  String? get externalId;

  ProductVariant copyWith({
    String? id,
    LocalizedItem? variantName,
    ProductVariantPack? pack,
    double? price,
    int? position,
    double? netPackagingFee,
    bool? soldOut,
    bool? isAvailable,
    String? externalId,
  }) =>
      ProductVariant(
        id: id ?? this.id,
        variantName: variantName ?? this.variantName,
        pack: pack ?? this.pack,
        price: price ?? this.price,
        position: position ?? this.position,
        netPackagingFee: netPackagingFee ?? this.netPackagingFee,
        soldOut: soldOut ?? this.soldOut,
        isAvailable: isAvailable ?? this.isAvailable,
        externalId: externalId ?? this.externalId,
      );

  ProductVariant copyUsing(
      void Function(ProductVariant$Change change) mutator) {
    final change = ProductVariant$Change._(
      this.id,
      this.variantName,
      this.pack,
      this.price,
      this.position,
      this.netPackagingFee,
      this.soldOut,
      this.isAvailable,
      this.externalId,
    );
    mutator(change);
    return ProductVariant(
      id: change.id,
      variantName: change.variantName,
      pack: change.pack,
      price: change.price,
      position: change.position,
      netPackagingFee: change.netPackagingFee,
      soldOut: change.soldOut,
      isAvailable: change.isAvailable,
      externalId: change.externalId,
    );
  }

  @override
  String toString() =>
      "ProductVariant(id: $id, variantName: $variantName, pack: $pack, price: $price, position: $position, netPackagingFee: $netPackagingFee, soldOut: $soldOut, isAvailable: $isAvailable, externalId: $externalId)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is ProductVariant &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      variantName == other.variantName &&
      pack == other.pack &&
      price == other.price &&
      position == other.position &&
      netPackagingFee == other.netPackagingFee &&
      soldOut == other.soldOut &&
      isAvailable == other.isAvailable &&
      externalId == other.externalId;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + variantName.hashCode;
    result = 37 * result + pack.hashCode;
    result = 37 * result + price.hashCode;
    result = 37 * result + position.hashCode;
    result = 37 * result + netPackagingFee.hashCode;
    result = 37 * result + soldOut.hashCode;
    result = 37 * result + isAvailable.hashCode;
    result = 37 * result + externalId.hashCode;
    return result;
  }
}

class ProductVariant$Change {
  ProductVariant$Change._(
    this.id,
    this.variantName,
    this.pack,
    this.price,
    this.position,
    this.netPackagingFee,
    this.soldOut,
    this.isAvailable,
    this.externalId,
  );

  String? id;
  LocalizedItem variantName;
  ProductVariantPack? pack;
  double price;
  int position;
  double? netPackagingFee;
  bool? soldOut;
  bool isAvailable;
  String? externalId;
}

// ignore: avoid_classes_with_only_static_members
class ProductVariant$ {
  static final id = Lens<ProductVariant, String?>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final variantName = Lens<ProductVariant, LocalizedItem>(
    (variantNameContainer) => variantNameContainer.variantName,
    (variantNameContainer, variantName) =>
        variantNameContainer.copyWith(variantName: variantName),
  );

  static final pack = Lens<ProductVariant, ProductVariantPack?>(
    (packContainer) => packContainer.pack,
    (packContainer, pack) => packContainer.copyWith(pack: pack),
  );

  static final price = Lens<ProductVariant, double>(
    (priceContainer) => priceContainer.price,
    (priceContainer, price) => priceContainer.copyWith(price: price),
  );

  static final position = Lens<ProductVariant, int>(
    (positionContainer) => positionContainer.position,
    (positionContainer, position) =>
        positionContainer.copyWith(position: position),
  );

  static final netPackagingFee = Lens<ProductVariant, double?>(
    (netPackagingFeeContainer) => netPackagingFeeContainer.netPackagingFee,
    (netPackagingFeeContainer, netPackagingFee) =>
        netPackagingFeeContainer.copyWith(netPackagingFee: netPackagingFee),
  );

  static final soldOut = Lens<ProductVariant, bool?>(
    (soldOutContainer) => soldOutContainer.soldOut,
    (soldOutContainer, soldOut) => soldOutContainer.copyWith(soldOut: soldOut),
  );

  static final isAvailable = Lens<ProductVariant, bool>(
    (isAvailableContainer) => isAvailableContainer.isAvailable,
    (isAvailableContainer, isAvailable) =>
        isAvailableContainer.copyWith(isAvailable: isAvailable),
  );

  static final externalId = Lens<ProductVariant, String?>(
    (externalIdContainer) => externalIdContainer.externalId,
    (externalIdContainer, externalId) =>
        externalIdContainer.copyWith(externalId: externalId),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductVariant _$ProductVariantFromJson(Map<String, dynamic> json) =>
    ProductVariant(
      id: json['id'] as String?,
      variantName:
          LocalizedItem.fromJson(json['variantName'] as Map<String, dynamic>),
      pack: json['pack'] == null
          ? null
          : ProductVariantPack.fromJson(json['pack'] as Map<String, dynamic>),
      price: (json['price'] as num).toDouble(),
      position: json['position'] as int,
      netPackagingFee: (json['netPackagingFee'] as num?)?.toDouble(),
      soldOut: json['soldOut'] as bool?,
      isAvailable: json['isAvailable'] as bool,
      externalId: json['externalId'] as String?,
    );

Map<String, dynamic> _$ProductVariantToJson(ProductVariant instance) {
  final val = <String, dynamic>{};

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('id', instance.id);
  val['variantName'] = instance.variantName.toJson();
  writeNotNull('pack', instance.pack?.toJson());
  val['price'] = instance.price;
  val['position'] = instance.position;
  writeNotNull('netPackagingFee', instance.netPackagingFee);
  writeNotNull('soldOut', instance.soldOut);
  val['isAvailable'] = instance.isAvailable;
  writeNotNull('externalId', instance.externalId);
  return val;
}
