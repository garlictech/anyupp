// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_user_list_viewmodel.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $AdminUserListViewModel {
  const $AdminUserListViewModel();

  bool get working;

  AdminUserListViewModel copyWith({
    bool? working,
  }) =>
      AdminUserListViewModel(
        working: working ?? this.working,
      );

  AdminUserListViewModel copyUsing(
      void Function(AdminUserListViewModel$Change change) mutator) {
    final change = AdminUserListViewModel$Change._(
      this.working,
    );
    mutator(change);
    return AdminUserListViewModel(
      working: change.working,
    );
  }

  @override
  String toString() => "AdminUserListViewModel(working: $working)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is AdminUserListViewModel &&
      other.runtimeType == runtimeType &&
      working == other.working;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    return working.hashCode;
  }
}

class AdminUserListViewModel$Change {
  AdminUserListViewModel$Change._(
    this.working,
  );

  bool working;
}

// ignore: avoid_classes_with_only_static_members
class AdminUserListViewModel$ {
  static final working = Lens<AdminUserListViewModel, bool>(
    (workingContainer) => workingContainer.working,
    (workingContainer, working) => workingContainer.copyWith(working: working),
  );
}
