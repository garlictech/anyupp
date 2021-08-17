import 'package:fa_prev/graphql/generated/anyupp-api.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';

@immutable
class User extends Model {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String profileImage;
  final UserInvoiceAddress invoiceAddress;

  @override
  String getId() {
    return id;
  }

  const User._internal({@required this.id, this.name, this.email, this.phone, this.profileImage, this.invoiceAddress});

  factory User(
      {String id, String name, String email, String phone, String profileImage, UserInvoiceAddress invoiceAddress}) {
    return User._internal(
        id: id == null ? UUID.getUUID() : id,
        name: name,
        email: email,
        phone: phone,
        profileImage: profileImage,
        invoiceAddress: invoiceAddress);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is User &&
        id == other.id &&
        name == other.name &&
        email == other.email &&
        phone == other.phone &&
        profileImage == other.profileImage &&
        invoiceAddress == other.invoiceAddress;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("User {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("name=" + "$name" + ", ");
    buffer.write("email=" + "$email" + ", ");
    buffer.write("phone=" + "$phone" + ", ");
    buffer.write("profileImage=" + "$profileImage" + ", ");
    buffer.write("invoiceAddress=" + "$invoiceAddress");
    buffer.write("}");

    return buffer.toString();
  }

  User copyWith(
      {String id, String name, String email, String phone, String profileImage, UserInvoiceAddress invoiceAddress}) {
    return User(
        id: id ?? this.id,
        name: name ?? this.name,
        email: email ?? this.email,
        phone: phone ?? this.phone,
        profileImage: profileImage ?? this.profileImage,
        invoiceAddress: invoiceAddress ?? this.invoiceAddress);
  }

  User.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        email = json['email'],
        phone = json['phone'],
        profileImage = json['profileImage'],
        invoiceAddress = json['invoiceAddress'] != null ? UserInvoiceAddress.fromJson(json['invoiceAddress']) : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'phone': phone,
        'profileImage': profileImage,
        'invoiceAddress': invoiceAddress != null ? invoiceAddress.toJson() : null,
      };
}
