import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'admin_user.g.dart';

@FunctionalData()
@JsonSerializable()
class AdminUser extends $AdminUser {
  final String id;
  final String name;
  final String email;
  final String? phone;

  AdminUser({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
  });

  factory AdminUser.fromJson(Map<String, dynamic> json) =>
      _$AdminUserFromJson(json);

  Map<String, dynamic> toJson() => _$AdminUserToJson(this);
}
