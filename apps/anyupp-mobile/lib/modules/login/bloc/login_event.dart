import 'package:equatable/equatable.dart';
import '/modules/login/login.dart';
import 'package:flutter/animation.dart';

enum LoginFormUI {
  SHOW_PASSWORD_CONFIRM,
  SHOW_LOGIN_WITH_PASSWORD,
  SHOW_REGISTRATION,
  SHOW_FORGOT_PASSWORD,
  SHOW_CONFIRM_SIGNUP
}

abstract class LoginEvent extends Equatable {
  const LoginEvent();

  @override
  List<Object?> get props => [];
}

class LoginErrorOccured extends LoginEvent {
  final String code;
  final String message;

  const LoginErrorOccured(this.code, this.message);

  @override
  List<Object?> get props => [code, message];
}

class SignUpErrorOccured extends LoginEvent {
  final String code;
  final String message;

  const SignUpErrorOccured(this.code, this.message);

  @override
  List<Object?> get props => [code, message];
}

class LoginWithMethod extends LoginEvent {
  final LoginMethod method;

  const LoginWithMethod(this.method);

  @override
  List<Object?> get props => [method];
}

class CompleteLoginWithMethod extends LoginEvent {
  final String code;

  const CompleteLoginWithMethod(this.code);

  @override
  List<Object?> get props => [code];
}

class LinkCurrentAccountWithProvider extends LoginEvent {
  final LoginMethod providerToBeLinked;

  const LinkCurrentAccountWithProvider(this.providerToBeLinked);

  @override
  List<Object?> get props => [providerToBeLinked];
}

class UnlinkCurrentAccountFromProvider extends LoginEvent {
  final LoginMethod providerToBeUnlinked;

  const UnlinkCurrentAccountFromProvider(this.providerToBeUnlinked);

  @override
  List<Object?> get props => [providerToBeUnlinked];
}

class ResetLogin extends LoginEvent {
  const ResetLogin();
}

class StartLoginLoading extends LoginEvent {
  const StartLoginLoading();
}

class Logout extends LoginEvent {
  const Logout();
}

class StartLoginWithEmail extends LoginEvent {
  final String email;

  StartLoginWithEmail(this.email);

  @override
  List<Object?> get props => [email];
}

class ConfirmRegistration extends LoginEvent {
  final String user;
  final String code;

  ConfirmRegistration(this.user, this.code);

  @override
  List<Object?> get props => [user, code];
}

class ResendConfirmationCode extends LoginEvent {
  final String user;

  ResendConfirmationCode(this.user);

  @override
  List<Object?> get props => [user];
}

class SignUpConfirm extends LoginEvent {
  final String user;

  SignUpConfirm(this.user);

  @override
  List<Object?> get props => [user];
}

class SignUpConfirmed extends LoginEvent {
  const SignUpConfirmed();
}

class CodeReSendining extends LoginEvent {
  const CodeReSendining();
}

class LoginWithEmailAndPassword extends LoginEvent {
  final String email;
  final String password;

  const LoginWithEmailAndPassword(this.email, this.password);

  @override
  List<Object?> get props => [email, password];
}

class RegisterWithEmailAndPassword extends LoginEvent {
  final String userEmail;
  final String? userPhone;
  final String email;
  final String password;

  const RegisterWithEmailAndPassword(
      {required this.userEmail,
      this.userPhone,
      required this.email,
      required this.password});

  @override
  List<Object?> get props => [userEmail, userPhone, email, password];
}

class SendPasswordResetEmail extends LoginEvent {
  final String email;

  const SendPasswordResetEmail(this.email);

  @override
  List<Object?> get props => [email];
}

class PasswordResetInfoSent extends LoginEvent {
  final String userName;
  final String deliveryMedium;
  final String destination;

  const PasswordResetInfoSent(
      this.userName, this.deliveryMedium, this.destination);

  @override
  List<Object?> get props => [userName, deliveryMedium, destination];
}

class ConfirmPassword extends LoginEvent {
  final String userName;
  final String code;
  final String password;

  const ConfirmPassword(
      {required this.userName, required this.code, required this.password});

  @override
  List<Object?> get props => [userName, code, password];
}

class SentConfirmCodeEmail extends LoginEvent {
  final String user;

  const SentConfirmCodeEmail(this.user);

  @override
  List<Object?> get props => [user];
}

class ChangeEmailFormUI extends LoginEvent {
  final LoginFormUI ui;
  final Duration? animationDuration;
  final Curve animationCurve;

  ChangeEmailFormUI({
    required this.ui,
    this.animationDuration,
    this.animationCurve = Curves.elasticIn,
  });

  @override
  List<Object?> get props => [ui];
}
