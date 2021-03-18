

import 'package:fa_prev/shared/models.dart';

import 'address.dart';

class Chain {
  String name;
  String email;
  String phone;
  String profileImage;
  Address address;
  Payment payment;
  String description;
  Map<String, bool> products;
  Style style;
  Map<String, ProductCategory> productCategories;

  Chain({
    this.name,
    this.email,
    this.phone,
    this.profileImage,
    this.address,
    this.payment,
    this.description,
    this.products,
    this.style,
    this.productCategories,
  });
}

class Style {
  Map<String, String> colors;
  Map<String, String> fonts;
  Map<String, String> logos;
  Map<String, String> backgrounds;
  Map<String, Label> text;

  Style({
    this.colors,
    this.fonts,
    this.logos,
    this.backgrounds,
    this.text,
  });
}

class Label {
  String language; // == id
  Map<String, String> translations;

  Label({this.language, this.translations});
}
