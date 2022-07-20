import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'admin_user_update.g.dart';

@FunctionalData()
@JsonSerializable()
class AdminUserUpdate extends $AdminUserUpdate {
  final String id;
  final String? name;
  final String? phone;

  AdminUserUpdate({
    required this.id,
    this.name = null,
    this.phone = null,
  });

  factory AdminUserUpdate.fromJson(Map<String, dynamic> json) =>
      _$AdminUserUpdateFromJson(json);

  Map<String, dynamic> toJson() => _$AdminUserUpdateToJson(this);
}
