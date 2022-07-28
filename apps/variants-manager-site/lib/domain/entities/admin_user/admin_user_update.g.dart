// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_user_update.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $AdminUserUpdate {
  const $AdminUserUpdate();

  String get id;
  String? get name;
  String? get phone;

  AdminUserUpdate copyWith({
    String? id,
    String? name,
    String? phone,
  }) =>
      AdminUserUpdate(
        id: id ?? this.id,
        name: name ?? this.name,
        phone: phone ?? this.phone,
      );

  AdminUserUpdate copyUsing(
      void Function(AdminUserUpdate$Change change) mutator) {
    final change = AdminUserUpdate$Change._(
      this.id,
      this.name,
      this.phone,
    );
    mutator(change);
    return AdminUserUpdate(
      id: change.id,
      name: change.name,
      phone: change.phone,
    );
  }

  @override
  String toString() => "AdminUserUpdate(id: $id, name: $name, phone: $phone)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is AdminUserUpdate &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      name == other.name &&
      phone == other.phone;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + name.hashCode;
    result = 37 * result + phone.hashCode;
    return result;
  }
}

class AdminUserUpdate$Change {
  AdminUserUpdate$Change._(
    this.id,
    this.name,
    this.phone,
  );

  String id;
  String? name;
  String? phone;
}

// ignore: avoid_classes_with_only_static_members
class AdminUserUpdate$ {
  static final id = Lens<AdminUserUpdate, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final name = Lens<AdminUserUpdate, String?>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );

  static final phone = Lens<AdminUserUpdate, String?>(
    (phoneContainer) => phoneContainer.phone,
    (phoneContainer, phone) => phoneContainer.copyWith(phone: phone),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AdminUserUpdate _$AdminUserUpdateFromJson(Map<String, dynamic> json) =>
    AdminUserUpdate(
      id: json['id'] as String,
      name: json['name'] as String? ?? null,
      phone: json['phone'] as String? ?? null,
    );

Map<String, dynamic> _$AdminUserUpdateToJson(AdminUserUpdate instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'phone': instance.phone,
    };
