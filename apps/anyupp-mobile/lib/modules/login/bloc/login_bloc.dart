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

  LoginBloc(this._repository) : super(LoggedOut());

  @override
  Stream<LoginState> mapEventToState(LoginEvent event) async* {
    print('*** LoginBloc().mapEventToState=$event');
    try {
      if (event is LoginWithMethod) {
        if (event.method == LoginMethod.ANONYMOUS) {
          yield LoginInProgress();
          await _repository.signInAnonymously();
        } else {
          yield ShowSocialLoginWebView(event.method);
        }

        //return;
      }

      if (event is CompleteLoginWithMethod) {
        ProviderLoginResponse response = await _repository.signUserInWithAuthCode(event.code);
        print('*** LoginBloc().federated.loginResponse=$response');
        yield LoginSuccess();
      }

      // --- Handle login with email and password
      if (event is LoginWithEmailAndPassword) {
        yield EmailLoginInProgress();
        ProviderLoginResponse response = await _repository.loginWithEmailAndPassword(event.email, event.password);
        print('**** LoginBloc.LoginWithEmailAndPassword().finish()=$response');
        yield LoginSuccess();
      }

      // --- Handle registration with email and password
      if (event is RegisterWithEmailAndPassword) {
        yield EmailLoginInProgress();
        String username = await _repository.registerUserWithEmailAndPassword(
          event.userEmail,
          event.userPhone,
          event.email,
          event.password,
        );
        getIt<LoginBloc>().add(ChangeEmailFormUI(ui: LoginFormUI.SHOW_CONFIRM_SIGNUP, animationCurve: Curves.easeIn));
        getIt<LoginBloc>().add(SignUpConfirm(username));
      }
      if (event is ConfirmRegistration) {
        bool confirmed = await _repository.confirmSignUp(event.user, event.code);
        if (confirmed) {
          getIt<LoginBloc>().add(ChangeEmailFormUI(ui: LoginFormUI.SHOW_CONFIRM_SIGNUP, animationCurve: Curves.easeIn));
          getIt<LoginBloc>().add(SignUpConfirmed());
        } else {
          getIt<ExceptionBloc>().add(ShowException(
              SignUpException(code: SignUpException.CODE, subCode: SignUpException.INVALID_CONFIRMATION_CODE)));
          getIt<LoginBloc>().add(SignUpConfirm(event.user));
        }
      }

      if (event is ResendConfirmationCode) {
        getIt<LoginBloc>().add(CodeReSendining());
        bool resent = await _repository.resendConfirmationCode(event.user);
        if (resent) {
          getIt<LoginBloc>().add(SentConfirmCodeEmail(event.user));
          getIt<LoginBloc>().add(SignUpConfirm(event.user));
        } else {
          getIt<ExceptionBloc>()
              .add(ShowException(SignUpException(code: SignUpException.CODE, subCode: SignUpException.UNKNOWN_ERROR)));
          getIt<LoginBloc>().add(SignUpConfirm(event.user));
        }
      }

      if (event is SignUpConfirm) {
        yield ConfirmCodeState(event.user);
      }

      if (event is SignUpConfirmed) {
        yield CodeConfirmedState();
      }

      if (event is CodeReSendining) {
        yield ConfirmCodeSending();
      }

      if (event is SentConfirmCodeEmail) {
        yield ConfirmCodeEmailSent(event.user);
      }

      // --- Handle send password reset to email
      if (event is SendPasswordResetEmail) {
        yield PasswordResetInProgress();
        Map<String, dynamic> passwordSentInfo = await _repository.sendPasswordResetEmail(event.email);
        getIt<LoginBloc>().add(PasswordResetInfoSent(
          event.email,
          passwordSentInfo['DeliveryMedium'],
          passwordSentInfo['Destination'],
        ));
      }

      if (event is PasswordResetInfoSent) {
        yield PasswordResetInfoSentState(
          event.userName,
          event.deliveryMedium,
          event.destination,
        );
      }

      if (event is ConfirmPassword) {
        yield ConfirmCodeSending();
        bool success = false;

        try {
          success = await _repository.confirmPassword(
            event.userName,
            event.code,
            event.password,
          );
        } on SignUpException catch (se) {
          print('********* SignUpBloc.Exception()=$se');
          getIt<ExceptionBloc>().add(ShowException(se));
        } on Exception catch (e) {
          print('********* LoginBloc.Exception()=$e');
          getIt<ExceptionBloc>().add(ShowException(SignUpException.fromException(
            SignUpException.UNKNOWN_ERROR,
            e.toString(),
            e,
          )));
        }
        if (success) {
          yield PasswordReset();
        }
      }

      // --- Handle external errors (eg. errors from repository)
      if (event is LoginErrorOccured) {
        getIt<ExceptionBloc>()
            .add(ShowException(LoginException(code: LoginException.CODE, subCode: event.code, message: event.message)));
        yield LoginError(event.code, event.message);
      }

      if (event is SignUpErrorOccured) {
        getIt<ExceptionBloc>().add(
            ShowException(SignUpException(code: SignUpException.CODE, subCode: event.code, message: event.message)));
        yield LoginError(event.code, event.message);
      }

      // --- Handle Logout
      if (event is Logout) {
        yield LoginInProgress();
        await _repository.logout();
        Nav.reset(OnBoarding());
        yield LoggedOut();
      }

      // --- Handle reset login
      if (event is ResetLogin) {
        yield LoggedOut();
      }

      // --- Change the animation of the email forms in the login screen
      if (event is ChangeEmailFormUI) {
        yield EmailFormUIChange(
          ui: event.ui,
          animationDuration: event.animationDuration ?? Duration(milliseconds: 350),
          animationCurve: event.animationCurve,
        );
      }
    } on GraphQLException catch (e) {
      print('********* LoginBloc.PlatformException()=$e');
      getIt<ExceptionBloc>().add(ShowException(e));
      yield LoginError(e.code, e.message);
    } on PlatformException catch (pe) {
      print('********* LoginBloc.PlatformException()=$pe');
      getIt<ExceptionBloc>().add(ShowException(LoginException.fromPlatformException(pe)));
      yield LoginError(pe.code, pe.message);
    } on LoginException catch (le) {
      print('********* LoginBloc.LoginException()=$le');
      if (le.subCode == LoginException.UNCONFIRMED) {
        getIt<LoginBloc>().add(ChangeEmailFormUI(ui: LoginFormUI.SHOW_CONFIRM_SIGNUP, animationCurve: Curves.easeIn));
      } else {
        getIt<ExceptionBloc>().add(ShowException(le));
        yield LoginError(le.code, le.message);
      }
    } on SignUpException catch (se) {
      print('********* SignUpBloc.Exception()=$se');
      getIt<ExceptionBloc>().add(ShowException(se));
      if (se.subCode == SignUpException.INVALID_CONFIRMATION_CODE || se.subCode == SignUpException.LIMIT_ECXEEDED) {
        getIt<LoginBloc>().add(SignUpConfirm(se.message!));
      }
    } on Exception catch (e) {
      print('********* LoginBloc.Exception()=$e');
      getIt<ExceptionBloc>().add(ShowException(LoginException.fromException(LoginException.UNKNOWN_ERROR, e)));
      yield LoginError(LoginException.UNKNOWN_ERROR, e.toString());
    }
  }
}
