// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_user.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $AdminUser {
  const $AdminUser();

  String get id;
  String get name;
  String get email;
  String? get phone;

  AdminUser copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
  }) =>
      AdminUser(
        id: id ?? this.id,
        name: name ?? this.name,
        email: email ?? this.email,
        phone: phone ?? this.phone,
      );

  AdminUser copyUsing(void Function(AdminUser$Change change) mutator) {
    final change = AdminUser$Change._(
      this.id,
      this.name,
      this.email,
      this.phone,
    );
    mutator(change);
    return AdminUser(
      id: change.id,
      name: change.name,
      email: change.email,
      phone: change.phone,
    );
  }

  @override
  String toString() =>
      "AdminUser(id: $id, name: $name, email: $email, phone: $phone)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is AdminUser &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      name == other.name &&
      email == other.email &&
      phone == other.phone;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + name.hashCode;
    result = 37 * result + email.hashCode;
    result = 37 * result + phone.hashCode;
    return result;
  }
}

class AdminUser$Change {
  AdminUser$Change._(
    this.id,
    this.name,
    this.email,
    this.phone,
  );

  String id;
  String name;
  String email;
  String? phone;
}

// ignore: avoid_classes_with_only_static_members
class AdminUser$ {
  static final id = Lens<AdminUser, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final name = Lens<AdminUser, String>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );

  static final email = Lens<AdminUser, String>(
    (emailContainer) => emailContainer.email,
    (emailContainer, email) => emailContainer.copyWith(email: email),
  );

  static final phone = Lens<AdminUser, String?>(
    (phoneContainer) => phoneContainer.phone,
    (phoneContainer, phone) => phoneContainer.copyWith(phone: phone),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AdminUser _$AdminUserFromJson(Map<String, dynamic> json) => AdminUser(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String?,
    );

Map<String, dynamic> _$AdminUserToJson(AdminUser instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
    };
