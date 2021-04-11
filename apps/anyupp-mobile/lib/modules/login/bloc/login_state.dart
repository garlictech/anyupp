import 'package:equatable/equatable.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:flutter/animation.dart';

abstract class LoginState extends Equatable {
  const LoginState();
}

class LoginSuccess extends LoginState {
  const LoginSuccess();

  @override
  List<Object> get props => [];
}

class LoggedOut extends LoginState {
  const LoggedOut();

  @override
  List<Object> get props => [];
}

class NeedAccountLinking extends LoginState {
  // TODO AWS remove
  final dynamic newProviderCredentials;
  final List<LoginMethod> existingProviderList;

  const NeedAccountLinking(this.newProviderCredentials, this.existingProviderList);

  @override
  List<Object> get props => [newProviderCredentials, existingProviderList];
}

class NeedSMSCode extends LoginState {
  final String verificationId;
  final String phoneNumber;
  const NeedSMSCode(this.verificationId, this.phoneNumber);
  @override
  List<Object> get props => [verificationId, phoneNumber];
}

class LoginInProgress extends LoginState {
  const LoginInProgress();

  @override
  List<Object> get props => [];
}

class LoginError extends LoginState {
  final String code;
  final String message;

  const LoginError(this.code, this.message);

  @override
  List<Object> get props => [code, message];
}

class AccountLinked extends LoginState {
  final LoginMethod provider;

  final bool linked;

  const AccountLinked(this.provider, this.linked);

  @override
  List<Object> get props => [provider, linked];
}

class EmailLinkSent extends LoginState {
  final String email;

  EmailLinkSent(this.email);

  @override
  List<Object> get props => [email];
}


class PasswordResetEmailSent extends LoginState {
  final String email;

  PasswordResetEmailSent(this.email);

  @override
  List<Object> get props => [email];
}

class EmailRegistrationSuccess extends LoginState {
  final String email;

  EmailRegistrationSuccess(this.email);

  @override
  List<Object> get props => [email];
}


class EmailFormUIChange extends LoginState {
  final LoginFormUI ui;
  final Duration animationDuration;
  final Curve animationCurve;

  EmailFormUIChange({this.ui, this.animationDuration, this.animationCurve});

  @override
  List<Object> get props => [ui, animationDuration, animationCurve];
}

class ShowSocialLoginWebView extends LoginState {

  final LoginMethod provider;
  ShowSocialLoginWebView(this.provider);

  @override
  List<Object> get props => [provider];
}
