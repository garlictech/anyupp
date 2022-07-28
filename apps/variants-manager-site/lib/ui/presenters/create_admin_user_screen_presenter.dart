import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

import '../../domain/entities/admin_user/admin_user_create.dart';
import '/data/data.dart';
import '/domain/repositories/repositories.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../viewmodels/create_admin_user_viewmodel.dart';

class CreateAdminUserScreenPresenter
    extends StateNotifier<CreateAdminUserViewModel> {
  final AdminUserRepository adminUserRepository;
  final BuildContext context;
  final formKey = GlobalKey<FormBuilderState>();

  CreateAdminUserScreenPresenter(this.adminUserRepository, this.context)
      : super(CreateAdminUserViewModel());

  onSubmit() async {
    if (formKey.currentState!.saveAndValidate()) {
      state = state.copyWith(waiting: true, error: null);
      final values = formKey.currentState!.value;
      final input = AdminUserCreate(
        email: values['email'],
        name: values['name'],
        phone: values['phone'],
      );
      final result = await adminUserRepository.createAdminUser(input);
      state = state.copyWith(waiting: false);
      if (result == null) {
        state = state.copyWith(error: 'Cannot create user');
      } else {
        Navigator.pop(context);
      }
    }
  }
}

final createAdminUserScreenMVPProvider = StateNotifierProvider.autoDispose
    .family<CreateAdminUserScreenPresenter, CreateAdminUserViewModel,
        BuildContext>((ref, context) {
  final adminUserRepository = ref.watch(adminUserRepositoryProvider);
  return CreateAdminUserScreenPresenter(adminUserRepository, context);
});
