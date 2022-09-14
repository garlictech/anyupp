import '/domain/states/admin_user_list.dart';
import 'package:flutter/material.dart';

import '../views/screens/update_admin_user_screen.dart';
import '/data/data.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../viewmodels/admin_user_list_viewmodel.dart';

class AdminUserListScreenPresenter
    extends StateNotifier<AdminUserListViewModel> {
  final BuildContext context;
  final Ref ref;

  AdminUserListScreenPresenter(this.context, this.ref)
      : super(AdminUserListViewModel()) {
    onRefreshList();
  }

  onRefreshList() async {
    final adminUserList = ref.read(adminUserListProvider.notifier);
    await adminUserList.refresh();
  }

  onEditClicked(String id) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => UpdateAdminUserScreen(adminUserId: id),
      ),
    );
  }

  onDeleteClicked(String id) {
    final adminUserRepository = ref.read(adminUserRepositoryProvider);
    showDialog(
        context: context,
        builder: (BuildContext ctx) {
          return AlertDialog(
            title: const Text('Please Confirm'),
            content: const Text('Are you sure to delete the data?'),
            actions: [
              // The "Yes" button
              TextButton(
                  onPressed: () async {
                    // Close the dialog
                    state = state.copyWith(working: true);
                    Navigator.of(context).pop();
                    await adminUserRepository.deleteAdminUser(id);
                    state = state.copyWith(working: false);
                    onRefreshList();
                  },
                  child: const Text('Yes')),
              TextButton(
                  onPressed: () {
                    // Close the dialog
                    Navigator.of(context).pop();
                  },
                  child: const Text('No'))
            ],
          );
        });
  }
}

final adminUserListMVPProvider = StateNotifierProvider.autoDispose
    .family<AdminUserListScreenPresenter, AdminUserListViewModel, BuildContext>(
        (ref, context) {
  return AdminUserListScreenPresenter(context, ref);
});
