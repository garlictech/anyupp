import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'admin_user_create.g.dart';

@FunctionalData()
@JsonSerializable()
class AdminUserCreate extends $AdminUserCreate {
  final String email;
  final String name;
  final String? phone;
  final String? id;

  AdminUserCreate({
    required this.name,
    required this.email,
    this.phone = null,
    this.id = null,
  });

  factory AdminUserCreate.fromJson(Map<String, dynamic> json) =>
      _$AdminUserCreateFromJson(json);

  Map<String, dynamic> toJson() => _$AdminUserCreateToJson(this);
}
