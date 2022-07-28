import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

import '../../domain/entities/admin_user/admin_user_update.dart';
import '/data/data.dart';
import '/domain/repositories/repositories.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../viewmodels/update_admin_user_viewmodel.dart';

class UpdateAdminUserScreenPresenter
    extends StateNotifier<UpdateAdminUserViewModel> {
  final AdminUserRepository adminUserRepository;
  final BuildContext context;
  final formKey = GlobalKey<FormBuilderState>();

  UpdateAdminUserScreenPresenter(
      this.adminUserRepository, this.context, String adminUserId)
      : super(UpdateAdminUserViewModel(adminUserId: adminUserId)) {
    onRefresh();
  }

  onSubmit() async {
    if (formKey.currentState != null ||
        !formKey.currentState!.saveAndValidate()) {
      state = state.copyWith(waiting: true, error: null);
      final values = formKey.currentState!.value;
      final input = AdminUserUpdate(
        id: state.adminUserId,
        name: values['name'],
        phone: values['phone'],
      );
      final result = await adminUserRepository.updateAdminUser(input);

      if (!result) {
        state =
            state.copyWith(waiting: false, error: 'Cannot update admin user');
      } else {
        onRefresh();
      }
    }
  }

  onRefresh() async {
    state = state.copyWith(waiting: true);
    final adminUser = await adminUserRepository.getAdminUser(state.adminUserId);
    state = state.copyWith(waiting: false, user: adminUser);
  }
}

class UpdateAdminUserScreenMVPProviderParams extends Equatable {
  final String adminUserId;
  final BuildContext context;
  UpdateAdminUserScreenMVPProviderParams(
      {required this.adminUserId, required this.context});

  @override
  List<Object> get props => [adminUserId, context];
}

final updateAdminUserScreenMVPProvider = StateNotifierProvider.autoDispose
    .family<UpdateAdminUserScreenPresenter, UpdateAdminUserViewModel,
        UpdateAdminUserScreenMVPProviderParams>((ref, params) {
  final adminUserRepository = ref.watch(adminUserRepositoryProvider);
  return UpdateAdminUserScreenPresenter(
      adminUserRepository, params.context, params.adminUserId);
});
