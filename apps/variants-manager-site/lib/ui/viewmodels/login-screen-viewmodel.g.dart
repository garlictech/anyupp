// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'login-screen-viewmodel.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $LoginScreenViewModel {
  const $LoginScreenViewModel();

  bool get loggingIn;
  bool get passwordVisibility;

  LoginScreenViewModel copyWith({
    bool? loggingIn,
    bool? passwordVisibility,
  }) =>
      LoginScreenViewModel(
        loggingIn: loggingIn ?? this.loggingIn,
        passwordVisibility: passwordVisibility ?? this.passwordVisibility,
      );

  LoginScreenViewModel copyUsing(
      void Function(LoginScreenViewModel$Change change) mutator) {
    final change = LoginScreenViewModel$Change._(
      this.loggingIn,
      this.passwordVisibility,
    );
    mutator(change);
    return LoginScreenViewModel(
      loggingIn: change.loggingIn,
      passwordVisibility: change.passwordVisibility,
    );
  }

  @override
  String toString() =>
      "LoginScreenViewModel(loggingIn: $loggingIn, passwordVisibility: $passwordVisibility)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is LoginScreenViewModel &&
      other.runtimeType == runtimeType &&
      loggingIn == other.loggingIn &&
      passwordVisibility == other.passwordVisibility;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + loggingIn.hashCode;
    result = 37 * result + passwordVisibility.hashCode;
    return result;
  }
}

class LoginScreenViewModel$Change {
  LoginScreenViewModel$Change._(
    this.loggingIn,
    this.passwordVisibility,
  );

  bool loggingIn;
  bool passwordVisibility;
}

// ignore: avoid_classes_with_only_static_members
class LoginScreenViewModel$ {
  static final loggingIn = Lens<LoginScreenViewModel, bool>(
    (loggingInContainer) => loggingInContainer.loggingIn,
    (loggingInContainer, loggingIn) =>
        loggingInContainer.copyWith(loggingIn: loggingIn),
  );

  static final passwordVisibility = Lens<LoginScreenViewModel, bool>(
    (passwordVisibilityContainer) =>
        passwordVisibilityContainer.passwordVisibility,
    (passwordVisibilityContainer, passwordVisibility) =>
        passwordVisibilityContainer.copyWith(
            passwordVisibility: passwordVisibility),
  );
}
