import 'package:equatable/equatable.dart';
//import 'package:firebase_auth/firebase_auth.dart';

import 'package:fa_prev/modules/login/login.dart';
import 'package:flutter/animation.dart';

enum LoginFormUI {
  SHOW_LOGIN_WITH_LINK,
  SHOW_LOGIN_WITH_PASSWORD,
  SHOW_REGISTRATION,
  SHOW_FORGOT_PASSWORD,
}

abstract class LoginEvent extends Equatable {
  const LoginEvent();

  @override
  List<Object> get props => [];
}

class LoginErrorOccured extends LoginEvent {
  final String code;
  final String message;

  const LoginErrorOccured(this.code, this.message);

  @override
  List<Object> get props => [code, message];
}

class LoginWithMethod extends LoginEvent {
  final LoginMethod method;

  const LoginWithMethod(this.method);

  @override
  List<Object> get props => [method];
}

class CompleteLoginWithMethod extends LoginEvent {
  final LoginMethod method;
  final String code;

  const CompleteLoginWithMethod(this.method, this.code);

  @override
  List<Object> get props => [method, code];
}

class LoginWithPhoneRequireSMSCode extends LoginEvent {
  final String phoneNumber;
  final bool linkAccount;

  const LoginWithPhoneRequireSMSCode(this.phoneNumber, this.linkAccount);

  @override
  List<Object> get props => [phoneNumber, linkAccount];
}

class LoginWithPhoneSMSCodeArrived extends LoginEvent {
  final String verificationId;
  final String phoneNumber;

  const LoginWithPhoneSMSCodeArrived(this.verificationId, this.phoneNumber);

  @override
  List<Object> get props => [verificationId, phoneNumber];
}

class LoginWithPhoneVerifySMSCode extends LoginEvent {
  final String verificationId;
  final String smsCode;

  const LoginWithPhoneVerifySMSCode(this.verificationId, this.smsCode);

  @override
  List<Object> get props => [verificationId, smsCode];
}

class LinkCurrentAccountWithProvider extends LoginEvent {
  final LoginMethod providerToBeLinked;

  const LinkCurrentAccountWithProvider(this.providerToBeLinked);

  @override
  List<Object> get props => [providerToBeLinked];
}

class UnlinkCurrentAccountFromProvider extends LoginEvent {
  final LoginMethod providerToBeUnlinked;

  const UnlinkCurrentAccountFromProvider(this.providerToBeUnlinked);

  @override
  List<Object> get props => [providerToBeUnlinked];
}

class ResetLogin extends LoginEvent {
  const ResetLogin();
}

class Logout extends LoginEvent {
  const Logout();
}

class PhoneLoginSuccess extends LoginEvent {
  const PhoneLoginSuccess();
}

class StartLoginWithEmail extends LoginEvent {
  final String email;

  StartLoginWithEmail(this.email);

  @override
  List<Object> get props => [email];
}

class FinishLoginWithEmailLink extends LoginEvent {
  final String emailLink;

  FinishLoginWithEmailLink(this.emailLink);

  @override
  List<Object> get props => [emailLink];
}

class LoginWithEmailAndPassword extends LoginEvent {
  final String email;
  final String password;

  const LoginWithEmailAndPassword(this.email, this.password);

  @override
  List<Object> get props => [email, password];
}

class RegisterWithEmailAndPassword extends LoginEvent {
  final String email;
  final String password;

  const RegisterWithEmailAndPassword(this.email, this.password);

  @override
  List<Object> get props => [email, password];
}

class SendPasswordResetEmail extends LoginEvent {
  final String email;

  const SendPasswordResetEmail(this.email);

  @override
  List<Object> get props => [email];
}

class ChangeEmailFormUI extends LoginEvent {
  final LoginFormUI ui;
  final Duration animationDuration;
  final Curve animationCurve;

  ChangeEmailFormUI({this.ui, this.animationDuration, this.animationCurve = Curves.elasticIn});

  @override
  List<Object> get props => [ui];
}
