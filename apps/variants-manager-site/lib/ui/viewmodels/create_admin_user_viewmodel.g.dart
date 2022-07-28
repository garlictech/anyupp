// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_admin_user_viewmodel.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $CreateAdminUserViewModel {
  const $CreateAdminUserViewModel();

  bool get waiting;
  String? get error;

  CreateAdminUserViewModel copyWith({
    bool? waiting,
    String? error,
  }) =>
      CreateAdminUserViewModel(
        waiting: waiting ?? this.waiting,
        error: error ?? this.error,
      );

  CreateAdminUserViewModel copyUsing(
      void Function(CreateAdminUserViewModel$Change change) mutator) {
    final change = CreateAdminUserViewModel$Change._(
      this.waiting,
      this.error,
    );
    mutator(change);
    return CreateAdminUserViewModel(
      waiting: change.waiting,
      error: change.error,
    );
  }

  @override
  String toString() =>
      "CreateAdminUserViewModel(waiting: $waiting, error: $error)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is CreateAdminUserViewModel &&
      other.runtimeType == runtimeType &&
      waiting == other.waiting &&
      error == other.error;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + waiting.hashCode;
    result = 37 * result + error.hashCode;
    return result;
  }
}

class CreateAdminUserViewModel$Change {
  CreateAdminUserViewModel$Change._(
    this.waiting,
    this.error,
  );

  bool waiting;
  String? error;
}

// ignore: avoid_classes_with_only_static_members
class CreateAdminUserViewModel$ {
  static final waiting = Lens<CreateAdminUserViewModel, bool>(
    (waitingContainer) => waitingContainer.waiting,
    (waitingContainer, waiting) => waitingContainer.copyWith(waiting: waiting),
  );

  static final error = Lens<CreateAdminUserViewModel, String?>(
    (errorContainer) => errorContainer.error,
    (errorContainer, error) => errorContainer.copyWith(error: error),
  );
}
