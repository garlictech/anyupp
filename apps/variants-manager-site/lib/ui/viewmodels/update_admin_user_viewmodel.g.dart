// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_admin_user_viewmodel.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $UpdateAdminUserViewModel {
  const $UpdateAdminUserViewModel();

  bool get waiting;
  String get adminUserId;
  String? get error;
  AdminUser? get user;

  UpdateAdminUserViewModel copyWith({
    bool? waiting,
    String? adminUserId,
    String? error,
    AdminUser? user,
  }) =>
      UpdateAdminUserViewModel(
        waiting: waiting ?? this.waiting,
        adminUserId: adminUserId ?? this.adminUserId,
        error: error ?? this.error,
        user: user ?? this.user,
      );

  UpdateAdminUserViewModel copyUsing(
      void Function(UpdateAdminUserViewModel$Change change) mutator) {
    final change = UpdateAdminUserViewModel$Change._(
      this.waiting,
      this.adminUserId,
      this.error,
      this.user,
    );
    mutator(change);
    return UpdateAdminUserViewModel(
      waiting: change.waiting,
      adminUserId: change.adminUserId,
      error: change.error,
      user: change.user,
    );
  }

  @override
  String toString() =>
      "UpdateAdminUserViewModel(waiting: $waiting, adminUserId: $adminUserId, error: $error, user: $user)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is UpdateAdminUserViewModel &&
      other.runtimeType == runtimeType &&
      waiting == other.waiting &&
      adminUserId == other.adminUserId &&
      error == other.error &&
      user == other.user;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + waiting.hashCode;
    result = 37 * result + adminUserId.hashCode;
    result = 37 * result + error.hashCode;
    result = 37 * result + user.hashCode;
    return result;
  }
}

class UpdateAdminUserViewModel$Change {
  UpdateAdminUserViewModel$Change._(
    this.waiting,
    this.adminUserId,
    this.error,
    this.user,
  );

  bool waiting;
  String adminUserId;
  String? error;
  AdminUser? user;
}

// ignore: avoid_classes_with_only_static_members
class UpdateAdminUserViewModel$ {
  static final waiting = Lens<UpdateAdminUserViewModel, bool>(
    (waitingContainer) => waitingContainer.waiting,
    (waitingContainer, waiting) => waitingContainer.copyWith(waiting: waiting),
  );

  static final adminUserId = Lens<UpdateAdminUserViewModel, String>(
    (adminUserIdContainer) => adminUserIdContainer.adminUserId,
    (adminUserIdContainer, adminUserId) =>
        adminUserIdContainer.copyWith(adminUserId: adminUserId),
  );

  static final error = Lens<UpdateAdminUserViewModel, String?>(
    (errorContainer) => errorContainer.error,
    (errorContainer, error) => errorContainer.copyWith(error: error),
  );

  static final user = Lens<UpdateAdminUserViewModel, AdminUser?>(
    (userContainer) => userContainer.user,
    (userContainer, user) => userContainer.copyWith(user: user),
  );
}
