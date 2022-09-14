// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_user_create.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $AdminUserCreate {
  const $AdminUserCreate();

  String get email;
  String get name;
  String? get phone;
  String? get id;

  AdminUserCreate copyWith({
    String? email,
    String? name,
    String? phone,
    String? id,
  }) =>
      AdminUserCreate(
        email: email ?? this.email,
        name: name ?? this.name,
        phone: phone ?? this.phone,
        id: id ?? this.id,
      );

  AdminUserCreate copyUsing(
      void Function(AdminUserCreate$Change change) mutator) {
    final change = AdminUserCreate$Change._(
      this.email,
      this.name,
      this.phone,
      this.id,
    );
    mutator(change);
    return AdminUserCreate(
      email: change.email,
      name: change.name,
      phone: change.phone,
      id: change.id,
    );
  }

  @override
  String toString() =>
      "AdminUserCreate(email: $email, name: $name, phone: $phone, id: $id)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is AdminUserCreate &&
      other.runtimeType == runtimeType &&
      email == other.email &&
      name == other.name &&
      phone == other.phone &&
      id == other.id;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + email.hashCode;
    result = 37 * result + name.hashCode;
    result = 37 * result + phone.hashCode;
    result = 37 * result + id.hashCode;
    return result;
  }
}

class AdminUserCreate$Change {
  AdminUserCreate$Change._(
    this.email,
    this.name,
    this.phone,
    this.id,
  );

  String email;
  String name;
  String? phone;
  String? id;
}

// ignore: avoid_classes_with_only_static_members
class AdminUserCreate$ {
  static final email = Lens<AdminUserCreate, String>(
    (emailContainer) => emailContainer.email,
    (emailContainer, email) => emailContainer.copyWith(email: email),
  );

  static final name = Lens<AdminUserCreate, String>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );

  static final phone = Lens<AdminUserCreate, String?>(
    (phoneContainer) => phoneContainer.phone,
    (phoneContainer, phone) => phoneContainer.copyWith(phone: phone),
  );

  static final id = Lens<AdminUserCreate, String?>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AdminUserCreate _$AdminUserCreateFromJson(Map<String, dynamic> json) =>
    AdminUserCreate(
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String? ?? null,
      id: json['id'] as String? ?? null,
    );

Map<String, dynamic> _$AdminUserCreateToJson(AdminUserCreate instance) =>
    <String, dynamic>{
      'email': instance.email,
      'name': instance.name,
      'phone': instance.phone,
      'id': instance.id,
    };
