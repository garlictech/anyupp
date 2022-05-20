import 'dart:async';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:flutter/animation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fa_prev/shared/nav.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final LoginRepository _repository;

  LoginBloc(this._repository) : super(LoggedOut()) {
    on<LoginWithMethod>(_onLoginWithMethod);
    on<CompleteLoginWithMethod>(_onCompleteLoginWithMethod);
    on<LoginWithEmailAndPassword>(_onLoginWithEmailAndPassword);
    on<RegisterWithEmailAndPassword>(_onRegisterWithEmailAndPassword);
    on<ConfirmRegistration>(_onConfirmRegistration);
    on<ResendConfirmationCode>(_onResendConfirmationCode);
    on<SignUpConfirm>(_onSignUpConfirm);
    on<SignUpConfirmed>(_onSignUpConfirmed);
    on<CodeReSendining>(_onCodeReSendining);
    on<SentConfirmCodeEmail>(_onSentConfirmCodeEmail);
    on<SendPasswordResetEmail>(_onSendPasswordResetEmail);
    on<PasswordResetInfoSent>(_onPasswordResetInfoSent);
    on<ConfirmPassword>(_onConfirmPassword);
    on<LoginErrorOccured>(_onLoginErrorOccured);
    on<SignUpErrorOccured>(_onSignUpErrorOccured);
    on<Logout>(_onLogout);
    on<ResetLogin>(_onResetLogin);
    on<ChangeEmailFormUI>(_onChangeEmailFormUI);
    on<StartLoginLoading>((event, emit) => emit(LoginInProgress()));
  }

  FutureOr<void> _handleError(Exception e, Emitter<LoginState> emit) {
    if (e is GraphQLException) {
      getIt<ExceptionBloc>().add(ShowException(e));
      emit(LoginError(e.code, e.message));
    } else if (e is PlatformException) {
      getIt<ExceptionBloc>()
          .add(ShowException(LoginException.fromPlatformException(e)));
      emit(LoginError(e.code, e.message));
    } else if (e is LoginException) {
      if (e.subCode == LoginException.UNCONFIRMED) {
        getIt<LoginBloc>().add(ChangeEmailFormUI(
            ui: LoginFormUI.SHOW_CONFIRM_SIGNUP,
            animationCurve: Curves.easeIn));
      } else {
        getIt<ExceptionBloc>().add(ShowException(e));
        emit(LoginError(e.code, e.message));
      }
    } else if (e is SignUpException) {
      getIt<ExceptionBloc>().add(ShowException(e));
      if (e.subCode == SignUpException.INVALID_CONFIRMATION_CODE ||
          e.subCode == SignUpException.LIMIT_ECXEEDED) {
        getIt<LoginBloc>().add(SignUpConfirm(e.message!));
      }
    } else {
      getIt<ExceptionBloc>().add(ShowException(
          LoginException.fromException(LoginException.UNKNOWN_ERROR, e)));
      emit(LoginError(LoginException.UNKNOWN_ERROR, e.toString()));
    }
  }

  FutureOr<void> _onLoginWithMethod(
      LoginWithMethod event, Emitter<LoginState> emit) async {
    try {
      if (event.method == LoginMethod.ANONYMOUS) {
        emit(LoginInProgress());
        await _repository.signInAnonymously();
      } else {
        emit(ShowSocialLoginWebView(event.method));
      }
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onCompleteLoginWithMethod(
      CompleteLoginWithMethod event, Emitter<LoginState> emit) async {
    try {
      emit(LoginInProgress());
      ProviderLoginResponse response =
          await _repository.signUserInWithAuthCode(event.code);
      log.d('*** LoginBloc().federated.loginResponse=$response');
      if (browser.isOpened()) {
        await browser.close();
      }
      emit(LoginSuccess());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onLoginWithEmailAndPassword(
      LoginWithEmailAndPassword event, Emitter<LoginState> emit) async {
    try {
      emit(EmailLoginInProgress());
      ProviderLoginResponse response = await _repository
          .loginWithEmailAndPassword(event.email, event.password);
      log.d('**** LoginBloc.LoginWithEmailAndPassword().finish()=$response');
      emit(LoginSuccess());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onRegisterWithEmailAndPassword(
      RegisterWithEmailAndPassword event, Emitter<LoginState> emit) async {
    try {
      emit(EmailLoginInProgress());
      String username = await _repository.registerUserWithEmailAndPassword(
        event.userEmail,
        event.userPhone,
        event.email,
        event.password,
      );
      getIt<LoginBloc>().add(ChangeEmailFormUI(
        ui: LoginFormUI.SHOW_CONFIRM_SIGNUP,
        animationCurve: Curves.easeIn,
      ));
      getIt<LoginBloc>().add(SignUpConfirm(username));
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onConfirmRegistration(
      ConfirmRegistration event, Emitter<LoginState> emit) async {
    try {
      bool confirmed = await _repository.confirmSignUp(event.user, event.code);
      if (confirmed) {
        getIt<LoginBloc>().add(ChangeEmailFormUI(
            ui: LoginFormUI.SHOW_CONFIRM_SIGNUP,
            animationCurve: Curves.easeIn));
        getIt<LoginBloc>().add(SignUpConfirmed());
      } else {
        getIt<ExceptionBloc>().add(ShowException(SignUpException(
            code: SignUpException.CODE,
            subCode: SignUpException.INVALID_CONFIRMATION_CODE)));
        getIt<LoginBloc>().add(SignUpConfirm(event.user));
      }
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onResendConfirmationCode(
      ResendConfirmationCode event, Emitter<LoginState> emit) async {
    try {
      getIt<LoginBloc>().add(CodeReSendining());
      bool resent = await _repository.resendConfirmationCode(event.user);
      if (resent) {
        getIt<LoginBloc>().add(SentConfirmCodeEmail(event.user));
        getIt<LoginBloc>().add(SignUpConfirm(event.user));
      } else {
        getIt<ExceptionBloc>().add(ShowException(SignUpException(
            code: SignUpException.CODE,
            subCode: SignUpException.UNKNOWN_ERROR)));
        getIt<LoginBloc>().add(SignUpConfirm(event.user));
      }
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onSignUpConfirm(
      SignUpConfirm event, Emitter<LoginState> emit) {
    emit(ConfirmCodeState(event.user));
  }

  FutureOr<void> _onSignUpConfirmed(
      SignUpConfirmed event, Emitter<LoginState> emit) {
    emit(CodeConfirmedState());
  }

  FutureOr<void> _onCodeReSendining(
      CodeReSendining event, Emitter<LoginState> emit) {
    emit(ConfirmCodeSending());
  }

  FutureOr<void> _onSentConfirmCodeEmail(
      SentConfirmCodeEmail event, Emitter<LoginState> emit) {
    emit(ConfirmCodeEmailSent(event.user));
  }

  FutureOr<void> _onSendPasswordResetEmail(
      SendPasswordResetEmail event, Emitter<LoginState> emit) async {
    try {
      emit(PasswordResetInProgress());
      Map<String, dynamic> passwordSentInfo =
          await _repository.sendPasswordResetEmail(event.email);
      getIt<LoginBloc>().add(PasswordResetInfoSent(
        event.email,
        passwordSentInfo['DeliveryMedium'],
        passwordSentInfo['Destination'],
      ));
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onPasswordResetInfoSent(
      PasswordResetInfoSent event, Emitter<LoginState> emit) {
    emit(PasswordResetInfoSentState(
      event.userName,
      event.deliveryMedium,
      event.destination,
    ));
  }

  FutureOr<void> _onConfirmPassword(
      ConfirmPassword event, Emitter<LoginState> emit) async {
    try {
      emit(ConfirmCodeSending());
      bool success = false;

      try {
        success = await _repository.confirmPassword(
          event.userName,
          event.code,
          event.password,
        );
      } on SignUpException catch (se) {
        log.d('********* SignUpBloc.Exception()=$se');
        getIt<ExceptionBloc>().add(ShowException(se));
      } on Exception catch (e) {
        log.d('********* LoginBloc.Exception()=$e');
        getIt<ExceptionBloc>().add(ShowException(SignUpException.fromException(
          SignUpException.UNKNOWN_ERROR,
          e.toString(),
          e,
        )));
      }
      if (success) {
        emit(PasswordReset());
      }
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onLoginErrorOccured(
      LoginErrorOccured event, Emitter<LoginState> emit) {
    emit(LoginError(event.code, event.message));
    getIt<ExceptionBloc>().add(ShowException(LoginException(
        code: LoginException.CODE,
        subCode: event.code,
        message: event.message)));
  }

  FutureOr<void> _onSignUpErrorOccured(
      SignUpErrorOccured event, Emitter<LoginState> emit) {
    emit(LoginError(event.code, event.message));
    getIt<ExceptionBloc>().add(ShowException(SignUpException(
        code: SignUpException.CODE,
        subCode: event.code,
        message: event.message)));
  }

  FutureOr<void> _onLogout(Logout event, Emitter<LoginState> emit) async {
    try {
      emit(LoginInProgress());
      await _repository.logout();
      Nav.reset(OnBoarding());
      emit(LoggedOut());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onResetLogin(ResetLogin event, Emitter<LoginState> emit) {
    emit(LoggedOut());
  }

  FutureOr<void> _onChangeEmailFormUI(
      ChangeEmailFormUI event, Emitter<LoginState> emit) {
    emit(EmailFormUIChange(
      ui: event.ui,
      animationDuration: event.animationDuration ?? Duration(milliseconds: 350),
      animationCurve: event.animationCurve,
    ));
  }
}
