// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth-state.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $AuthState {
  const $AuthState();

  String? get username;

  AuthState copyWith({
    String? username,
  }) =>
      AuthState(
        username: username ?? this.username,
      );

  AuthState copyUsing(void Function(AuthState$Change change) mutator) {
    final change = AuthState$Change._(
      this.username,
    );
    mutator(change);
    return AuthState(
      username: change.username,
    );
  }

  @override
  String toString() => "AuthState(username: $username)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is AuthState &&
      other.runtimeType == runtimeType &&
      username == other.username;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    return username.hashCode;
  }
}

class AuthState$Change {
  AuthState$Change._(
    this.username,
  );

  String? username;
}

// ignore: avoid_classes_with_only_static_members
class AuthState$ {
  static final username = Lens<AuthState, String?>(
    (usernameContainer) => usernameContainer.username,
    (usernameContainer, username) =>
        usernameContainer.copyWith(username: username),
  );
}
