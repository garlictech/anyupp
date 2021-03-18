import 'dart:convert';

import 'package:fa_prev/shared/utils/firebase_conversion_utils.dart';


class Product {
  String id;
  Map<String, String> name;
  Map<String, String> description;
  String image;
  String productCategoryId;
  int position;
  dynamic contains; // TODO: Contains
  int tax;
  List<Variant> variants;
  // bool isAvailable;
  bool isVisible;
  // TODO: ingredients

  Product({
    this.id,
    this.name,
    this.description,
    this.image,
    this.productCategoryId,
    this.position,
    this.contains,
    this.tax,
    this.variants,
    // this.isAvailable,
    this.isVisible,
  });

  Product copyWith({
    String id,
    Map<String, String> name,
    Map<String, String> description,
    String image,
    String productCategoryId,
    String position,
    Contains contains,
    Map<String, int> tax,
    List<Variant> variants,
    bool isAvailable,
    bool isVisible,
    int order,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      image: image ?? this.image,
      productCategoryId: productCategoryId ?? this.productCategoryId,
      position: position ?? this.position,
      contains: contains ?? this.contains,
      tax: tax ?? this.tax,
      variants: variants ?? this.variants,
      // isAvailable: isAvailable ?? this.isAvailable,
      isVisible: isVisible ?? this.isVisible,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'image': image,
      'productCategoryId': productCategoryId,
      'position': position,
      'contains': contains?.toMap(),
      'tax': tax,
      'variants': variants?.map((x) => x?.toMap())?.toList(),
      // 'isAvailable': isAvailable,
      'isVisible': isVisible,
    };
  }

  static Product fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return Product(
      id: map['id'],
      name: Map<String, String>.from(map['name']),
      description: Map<String, String>.from(map['description']),
      image: map['image'],
      productCategoryId: map['productCategoryId'],
      // TODO ezt ki kellene vinni
      position: getIntFromFirebaseValue(map['position']),
      contains: Contains.fromMap(map['contains']),
      tax: getIntFromFirebaseValue(map['tax']),
      variants: List<Variant>.from(map['variants']?.map((x) => Variant.fromMap(Map<String, dynamic>.from(x)))),
      // isAvailable: map['isAvailable'],
      isVisible: map['isVisible'],
    );
  }

  String toJson() => json.encode(toMap());

  static Product fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() {
    return 'Product(id: $id, name: $name, description: $description, image: $image, position: $position, contains: $contains, tax: $tax, variants: $variants, isVisible: $isVisible)';
  }
}

class Contains {
  String id;
  Map<String, bool> allergens;

  Contains({
    this.id,
    this.allergens,
  });

  Contains copyWith({
    String id,
    Map<String, bool> allergens,
  }) {
    return Contains(
      id: id ?? this.id,
      allergens: allergens ?? this.allergens,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'allergens': allergens,
    };
  }

  static Contains fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return Contains(
      id: map['id'],
      allergens: Map<String, bool>.from(map['allergens']),
    );
  }

  String toJson() => json.encode(toMap());

  static Contains fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() => 'Contains(id: $id, allergens: $allergens)';
}

class Ingredient {
  String name;
  int amount;

  Ingredient({
    this.name,
    this.amount,
  });

  Ingredient copyWith({
    String name,
    int amount,
  }) {
    return Ingredient(
      name: name ?? this.name,
      amount: amount ?? this.amount,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'amount': amount,
    };
  }

  static Ingredient fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return Ingredient(
      name: map['name'],
      amount: map['amount'],
    );
  }

  String toJson() => json.encode(toMap());

  static Ingredient fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() => 'Ingredient(name: $name, amount: $amount)';
}

class Variant {
  String id;
  double price;
  // List<Ingredient> ingredients;
  Map<String, String> variantName;
  Pack pack;
  int position;
  // TODO: ??? isAvailable
  // TODO: ??? availabilityMask

  Variant({
    this.id,
    this.price,
    // this.ingredients,
    this.position,
    this.variantName,
    this.pack,
  });

  Variant copyWith({
    String id,
    Map<String, dynamic> price,
    List<Ingredient> ingredients,
    String position,
    Map<String, String> variantName,
    Pack pack,
  }) {
    return Variant(
      id: id ?? this.id,
      price: price ?? this.price,
      // ingredients: ingredients ?? this.ingredients,
      position: position ?? this.position,
      variantName: variantName ?? this.variantName,
      pack: pack ?? this.pack,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'price': price,
      // 'ingredients': ingredients?.map((x) => x?.toMap())?.toList(),
      'position': position,
      'variantName': variantName,
      'pack': pack?.toMap(),
    };
  }

  static Variant fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return Variant(
      id: map['id'],
      price: getDoubleFromFirebaseValue(map['price']),
      // ingredients: List<Ingredient>.from(map['ingredients']?.map((x) => Ingredient.fromMap(x))),
      position: getIntFromFirebaseValue(map['position']),
      variantName: Map<String, String>.from(map['variantName']),
      pack: Pack.fromMap(Map<String, dynamic>.from(map['pack'])),
    );
  }

  String toJson() => json.encode(toMap());

  static Variant fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() {
    return 'Variant(id: $id, price: $price, position: $position, variantName: $variantName, pack: $pack)';
  }
}

class Pack {
  double size;
  String unit;

  Pack({
    this.size,
    this.unit,
  });

  Map<String, dynamic> toMap() {
    return {
      'size': size,
      'unit': unit,
    };
  }

  static Pack fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return Pack(
      size: double.parse(map['size'].toString()),
      unit: map['unit'],
    );
  }

  String toJson() => json.encode(toMap());

  static Pack fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() => 'Pack(size: $size, unit: $unit)';
}
