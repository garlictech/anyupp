import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:flutter/animation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fa_prev/shared/nav.dart';

import 'package:fa_prev/modules/login/login.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final LoginRepository _repository;

  LoginBloc(this._repository) : super(LoggedOut());

  @override
  Stream<LoginState> mapEventToState(LoginEvent event) async* {
    print('*** LoginBloc().mapEventToState=$event');
    try {
      // if (event is LoginWithMethod) {
      //   yield ShowSocialLoginWebView(event.method);
      //   return;
      // }

      // --- Handle logins
      if (event is LoginWithMethod) {
        yield LoginInProgress();

        // --- HANDLE FEDERATED LOGINS (FACEBOOK, APPLE, GOOGLE)
        if (_repository.isFederated(event.method)) {
          print('*** LoginBloc().federated=${event.method}');

          // --- Get provider specific auth Credential from the given provider
          ProviderLoginResponse loginResponse =
              await _repository.signInWithProvider(event.method);
          print('*** LoginBloc().federated.loginResponse=$loginResponse');
          yield LoginSuccess();
        } else {
          // --- Handle not Federated logins (PHONE, Anonymous)
          yield LoginInProgress();

          // --- Handle Anonymous login
          if (event.method == LoginMethod.ANONYMOUS) {
            await _repository.signInAnonymously();
          }

          // Login success...
          yield LoginSuccess();
        }
      }

      // --- Handle phone login (Require SMS code)
      if (event is LoginWithPhoneRequireSMSCode) {
        yield LoginInProgress();
        print('**** LoginBloc.signInWithPhone()=${event.phoneNumber}');
        await _repository.signInWithPhone(event.phoneNumber, event.linkAccount);
      }

      // --- Handle phone login (SMS code arrived, need to show enter SMS code form)
      if (event is LoginWithPhoneSMSCodeArrived) {
        print(
            '**** LoginBloc.LoginWithPhoneSMSCodeArrived()=${event.verificationId}');
        yield NeedSMSCode(event.verificationId, event.phoneNumber);
      }

      // --- Handle phone login (Manually enter the SMS code)
      if (event is LoginWithPhoneVerifySMSCode) {
        print(
            '**** LoginBloc.LoginWithPhoneVerifySMSCode().verificationId=${event.verificationId}, smsCode=${event.smsCode}');
        await _repository.validateSMSCodeWithPhone(
            event.verificationId, event.smsCode);
        yield LoginSuccess();
      }

      // --- Handle phone link success
      if (event is PhoneLoginSuccess) {
        yield LoginSuccess();
      }

      // --- Handle start email login
      if (event is StartLoginWithEmail) {
        yield LoginInProgress();
        await _repository.sendSignInLinkToEmail(event.email);
        yield EmailLinkSent(event.email);
      }

      // --- Handle finish login with email link
      if (event is FinishLoginWithEmailLink) {
        bool isSignInWithEmailLink =
            await _repository.isSignInWithEmailLink(event.emailLink);
        if (isSignInWithEmailLink) {
          yield LoginInProgress();
          String email = await _repository.email;
          ProviderLoginResponse response =
              await _repository.signInWithEmailLink(email, event.emailLink);
          print('**** LoginBloc.signInWithEmailLink().finish()=$response');
          yield LoginSuccess();
        }
      }

      // --- Handle login with email and password
      if (event is LoginWithEmailAndPassword) {
        yield LoginInProgress();
        ProviderLoginResponse response = await _repository
            .loginWithEmailAndPassword(event.email, event.password);
        print('**** LoginBloc.LoginWithEmailAndPassword().finish()=$response');
        yield LoginSuccess();
      }

      // --- Handle registration with email and password
      if (event is RegisterWithEmailAndPassword) {
        yield LoginInProgress();
        bool res = await _repository.registerUserWithEmailAndPassword(
            event.email, event.password);
        if (res) {
          getIt<LoginBloc>().add(ChangeEmailFormUI(
              ui: LoginFormUI.SHOW_CONFIRM_SIGNUP,
              animationCurve: Curves.easeIn, userName: event.email));
        }
        //print('**** LoginBloc.RegisterWithEmailAndPassword().finish()=$response');
        //yield EmailRegistrationSuccess(event.email);
      }

      if (event is SignUpConfirmed) {
        yield CodeConfirmedState();
      }

      // --- Handle send password reset to email
      if (event is SendPasswordResetEmail) {
        yield LoginInProgress();
        await _repository.sendPasswordResetEmail(event.email);
        yield PasswordResetEmailSent(event.email);
      }

      // --- Handle external errors (eg. errors from repository)
      if (event is LoginErrorOccured) {
        getIt<ExceptionBloc>().add(ShowException(LoginException(
            code: LoginException.CODE,
            subCode: event.code,
            message: event.message)));
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
          userName: event.userName,
          ui: event.ui,
          animationDuration:
              event.animationDuration ?? Duration(milliseconds: 350),
          animationCurve: event.animationCurve ?? Curves.bounceInOut,
        );
      }
    } on PlatformException catch (pe) {
      print('********* LoginBloc.PlatformException()=$pe');
      getIt<ExceptionBloc>()
          .add(ShowException(LoginException.fromPlatformException(pe)));
      yield LoginError(pe.code, pe.message);
    } on LoginException catch (le) {
      print('********* LoginBloc.LoginException()=$le');
      getIt<ExceptionBloc>().add(ShowException(le));
      yield LoginError(le.code, le.message);
    } on Exception catch (e) {
      print('********* LoginBloc.Exception()=$e');
      getIt<ExceptionBloc>().add(ShowException(
          LoginException.fromException(LoginException.UNKNOWN_ERROR, e)));
      yield LoginError(LoginException.UNKNOWN_ERROR, e.toString());
    }
  }
}
