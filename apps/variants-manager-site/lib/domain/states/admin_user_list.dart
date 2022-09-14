import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/providers.dart';
import '../entities/admin_user/admin_user.dart';
import '../repositories/admin_users/admin_users.dart';

class AdminUserListState {
  final bool working;
  final List<AdminUser> users;

  AdminUserListState({this.working = false, this.users = const []});
}

class AdminUserListProvider extends StateNotifier<AdminUserListState> {
  final AdminUserRepository adminUserRepository;

  AdminUserListProvider(this.adminUserRepository) : super(AdminUserListState());

  refresh() async {
    state = AdminUserListState(working: true, users: state.users);
    final adminUserList = await adminUserRepository.getAdminUserList();
    state = AdminUserListState(working: false, users: adminUserList);
  }
}

final adminUserListProvider = StateNotifierProvider.autoDispose<
    AdminUserListProvider, AdminUserListState>((ref) {
  final adminUserRepository = ref.watch(adminUserRepositoryProvider);
  return AdminUserListProvider(adminUserRepository);
});
