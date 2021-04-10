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
  final String loginMethod;

  @override
  String getId() {
    return id;
  }

  const User._internal(
      {@required this.id,
      this.name,
      this.email,
      this.phone,
      this.profileImage,
      this.loginMethod});

  factory User(
      {String id,
      String name,
      String email,
      String phone,
      String profileImage,
      String loginMethod}) {
    return User._internal(
        id: id == null ? UUID.getUUID() : id,
        name: name,
        email: email,
        phone: phone,
        profileImage: profileImage,
        loginMethod: loginMethod);
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
        loginMethod == other.loginMethod;
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
    buffer.write("loginMethod=" + "$loginMethod");
    buffer.write("}");

    return buffer.toString();
  }

  User copyWith(
      {String id,
      String name,
      String email,
      String phone,
      String profileImage,
      String loginMethod}) {
    return User(
        id: id ?? this.id,
        name: name ?? this.name,
        email: email ?? this.email,
        phone: phone ?? this.phone,
        profileImage: profileImage ?? this.profileImage,
        loginMethod: loginMethod ?? this.loginMethod);
  }

  User.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        email = json['email'],
        phone = json['phone'],
        profileImage = json['profileImage'],
        loginMethod = json['loginMethod'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'phone': phone,
        'profileImage': profileImage,
        'loginMethod': loginMethod
      };
}
