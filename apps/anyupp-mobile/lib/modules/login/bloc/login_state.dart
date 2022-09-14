import 'package:equatable/equatable.dart';
import '/modules/login/login.dart';
import 'package:flutter/animation.dart';

abstract class LoginState extends Equatable {
  const LoginState();
}

class LoginSuccess extends LoginState {
  const LoginSuccess();

  @override
  List<Object?> get props => [];
}

class LoggedOut extends LoginState {
  const LoggedOut();

  @override
  List<Object?> get props => [];
}

class NeedAccountLinking extends LoginState {
  final dynamic newProviderCredentials;
  final List<LoginMethod> existingProviderList;

  const NeedAccountLinking(this.newProviderCredentials, this.existingProviderList);

  @override
  List<Object?> get props => [newProviderCredentials, existingProviderList];
}

class NeedSMSCode extends LoginState {
  final String verificationId;
  final String phoneNumber;
  const NeedSMSCode(this.verificationId, this.phoneNumber);
  @override
  List<Object?> get props => [verificationId, phoneNumber];
}

class LoginInProgress extends LoginState {
  const LoginInProgress();

  @override
  List<Object?> get props => [];
}

class EmailLoginInProgress extends LoginState {
  const EmailLoginInProgress();

  @override
  List<Object?> get props => [];
}

class PasswordResetInProgress extends LoginState {
  const PasswordResetInProgress();

  @override
  List<Object?> get props => [];
}

class PasswordReset extends LoginState {
  const PasswordReset();

  @override
  List<Object?> get props => [];
}

class LoginError extends LoginState {
  final String code;
  final String? message;

  const LoginError(this.code, this.message);

  @override
  List<Object?> get props => [code, message];
}

class SignUpError extends LoginState {
  final String code;
  final String message;

  const SignUpError(this.code, this.message);

  @override
  List<Object?> get props => [code, message];
}

class AccountLinked extends LoginState {
  final LoginMethod provider;

  final bool linked;

  const AccountLinked(this.provider, this.linked);

  @override
  List<Object?> get props => [provider, linked];
}

class EmailLinkSent extends LoginState {
  final String email;

  EmailLinkSent(this.email);

  @override
  List<Object?> get props => [email];
}

class PasswordResetInfoSentState extends LoginState {
  final String userName;
  final String deliveryMedium;
  final String destination;

  PasswordResetInfoSentState(this.userName, this.deliveryMedium, this.destination);

  @override
  List<Object?> get props => [userName];
}

class ConfirmCodeSending extends LoginState {
  ConfirmCodeSending();

  @override
  List<Object?> get props => [];
}

class ConfirmCodeEmailSent extends LoginState {
  final String user;

  ConfirmCodeEmailSent(this.user);

  @override
  List<Object?> get props => [user];
}

class EmailRegistrationSuccess extends LoginState {
  final String email;

  EmailRegistrationSuccess(this.email);

  @override
  List<Object?> get props => [email];
}

class CodeConfirmedState extends LoginState {
  const CodeConfirmedState();

  @override
  List<Object?> get props => [];
}

class ConfirmCodeState extends LoginState {
  final String user;
  const ConfirmCodeState(this.user);

  @override
  List<Object?> get props => [user];
}

class UserCreated extends LoginState {
  const UserCreated();

  @override
  List<Object?> get props => [];
}

class EmailFormUIChange extends LoginState {
  final LoginFormUI ui;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final String? userName;

  EmailFormUIChange({required this.ui, this.animationDuration, this.animationCurve, this.userName});

  @override
  List<Object?> get props => [ui, userName];
}

class ShowSocialLoginWebView extends LoginState {
  final LoginMethod provider;
  ShowSocialLoginWebView(this.provider);

  @override
  List<Object?> get props => [provider];
}
