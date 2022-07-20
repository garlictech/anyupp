import 'package:functional_data/functional_data.dart';

import '../../domain/entities/admin_user/admin_user.dart';

part 'update_admin_user_viewmodel.g.dart';

@FunctionalData()
class UpdateAdminUserViewModel extends $UpdateAdminUserViewModel {
  final bool waiting;
  final String adminUserId;
  final String? error;
  final AdminUser? user;

  UpdateAdminUserViewModel(
      {this.waiting = false,
      required this.adminUserId,
      this.error = null,
      this.user = null});
}
