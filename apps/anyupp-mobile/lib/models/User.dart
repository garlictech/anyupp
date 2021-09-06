import 'package:fa_prev/graphql/generated/anyupp-api.dart';

class User {
  final String id;
  final String? name;
  final String? email;
  final String? phone;
  final String? profileImage;
  final UserInvoiceAddress? invoiceAddress;
  User({
    required this.id,
    this.name,
    this.email,
    this.phone,
    this.profileImage,
    this.invoiceAddress,
  });

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? profileImage,
    UserInvoiceAddress? invoiceAddress,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      profileImage: profileImage ?? this.profileImage,
      invoiceAddress: invoiceAddress ?? this.invoiceAddress,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'profileImage': profileImage,
      'invoiceAddress': invoiceAddress?.toJson(),
    };
  }

  factory User.fromJson(Map<String, dynamic> map) {
    return User(
      id: map['id'],
      name: map['name'],
      email: map['email'],
      phone: map['phone'],
      profileImage: map['profileImage'],
      invoiceAddress: map['invoiceAddress'] != null ? UserInvoiceAddress.fromJson(map['invoiceAddress']) : null,
    );
  }

  @override
  String toString() {
    return 'User(id: $id, name: $name, email: $email, phone: $phone, profileImage: $profileImage, invoiceAddress: $invoiceAddress)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is User &&
        other.id == id &&
        other.name == name &&
        other.email == email &&
        other.phone == phone &&
        other.profileImage == profileImage &&
        other.invoiceAddress == invoiceAddress;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        name.hashCode ^
        email.hashCode ^
        phone.hashCode ^
        profileImage.hashCode ^
        invoiceAddress.hashCode;
  }
}
