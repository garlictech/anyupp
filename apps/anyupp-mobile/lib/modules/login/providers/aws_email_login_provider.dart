import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/login/models/provider_login_response.dart';
import 'package:fa_prev/modules/login/models/sign_up_exception.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'email_login_provider_interface.dart';

class AwsEmailLoginProvider implements IEmailLoginProvider {
  final AwsAuthProvider _authProvider;
  final CognitoService _service;

  AwsEmailLoginProvider(this._authProvider, this._service);

  @override
  Future<String> get email async =>
      (await SharedPreferences.getInstance()).getString('auth_email');

  @override
  Future<bool> isSignInWithEmailLink(String emailLink) async {
    return false;
  }

  @override
  Future<ProviderLoginResponse> loginWithEmailAndPassword(
      String email, String password) async {
    try {
      CognitoUser user = _service.createCognitoUser(email);
      CognitoUserSession session =
          await user.authenticateUser(_service.getAuthDetails(email, password));

      if (session.isValid()) {
        User user = await _authProvider.getAuthenticatedUserProfile();
        return ProviderLoginResponse(
          credential: null,
          user: user,
        );
      }

      throw LoginException(
          code: LoginException.INVALID_CREDENTIALS,
          message: 'Invalid credentials');
    } on CognitoUserNewPasswordRequiredException catch (e) {
      // handle New Password challenge
      print(
          'loginWithEmailAndPassword.CognitoUserNewPasswordRequiredException=$e');
      rethrow;
    } on CognitoUserMfaRequiredException catch (e) {
      // handle SMS_MFA challenge
      print('loginWithEmailAndPassword.CognitoUserMfaRequiredException=$e');
      rethrow;
    } on CognitoUserSelectMfaTypeException catch (e) {
      // handle SELECT_MFA_TYPE challenge
      print('loginWithEmailAndPassword.CognitoUserSelectMfaTypeException=$e');
      rethrow;
    } on CognitoUserMfaSetupException catch (e) {
      // handle MFA_SETUP challenge
      print('loginWithEmailAndPassword.CognitoUserMfaSetupException=$e');
      rethrow;
    } on CognitoUserTotpRequiredException catch (e) {
      // handle SOFTWARE_TOKEN_MFA challenge
      print('loginWithEmailAndPassword.CognitoUserTotpRequiredException=$e');
      rethrow;
    } on CognitoUserCustomChallengeException catch (e) {
      // handle CUSTOM_CHALLENGE challenge
      print('loginWithEmailAndPassword.CognitoUserCustomChallengeException=$e');
      rethrow;
    } on CognitoUserConfirmationNecessaryException catch (e) {
      // handle User Confirmation Necessary
      print(
          'loginWithEmailAndPassword.CognitoUserConfirmationNecessaryException=$e');
      rethrow;
    } on CognitoClientException catch (e) {
      // handle Wrong Username and Password and Cognito Client
      print('loginWithEmailAndPassword.CognitoClientException=$e');
      if (e.code == 'UserNotConfirmedException') {
        throw LoginException(
            code: e.code,
            message: email,
            subCode: LoginException.UNCONFIRMED,
            details: e.runtimeType);
      }
      if (e.code == 'NotAuthorizedException') {
        throw LoginException(
            code: e.code,
            message: email,
            subCode: LoginException.INVALID_CREDENTIALS,
            details: e.runtimeType);
      } else {
        rethrow;
      }
    } catch (e) {
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    }
  }

  @override
  Future<bool> registerUserWithEmailAndPassword(
      String userEmail, String userPhone, String email, String password) async {
    try {
      List<AttributeArg> attributes = [];
      if (userPhone != null) {
        attributes.add(
          AttributeArg(name: 'phone_number', value: userPhone),
        );
      }
      if (userEmail != null) {
        attributes.add(AttributeArg(name: 'email', value: userEmail));
      }
      CognitoUserPoolData userPoolData = await _service.userPool
          .signUp(email, password, userAttributes: attributes);

      if (userPoolData.user != null) {
        return Future.value(true);
      }
    } on CognitoClientException catch (e) {
      if (e.code == 'UsernameExistsException') {
        throw SignUpException.fromException(
            SignUpException.USER_EXISTS, e.message, e);
      }
      if (e.code == 'InvalidPasswordException') {
        throw SignUpException.fromException(
            SignUpException.INVALID_PASSWORD, e.message, e);
      }

      print(e.code);
    } on Exception catch (e) {
      throw SignUpException.fromException(
          SignUpException.UNKNOWN_ERROR, e.toString(), e);
    }
    return Future.value(false);

    // TODO: implement registerUserWithEmailAndPassword
  }

  @override
  Future<bool> confirmSignUp(
    String userName,
    String code,
  ) async {
    CognitoUser user = _service.createCognitoUser(userName);
    bool registrationConfirmed = false;
    try {
      registrationConfirmed = await user.confirmRegistration(code);
    } on CognitoClientException catch (e) {
      if (e.code == 'ExpiredCodeException') {
        throw SignUpException(
            code: SignUpException.CODE,
            subCode: SignUpException.INVALID_CONFIRMATION_CODE,
            message: userName);
      }
    } on Exception catch (e) {
      throw SignUpException.fromException(
          SignUpException.UNKNOWN_ERROR, e.toString(), e);
    }
    return Future.value(registrationConfirmed);
  }

  @override
  Future<bool> resendConfirmationCode(String userName) async {
    CognitoUser user = _service.createCognitoUser(userName);
    bool codeResent = false;
    try {
      final status = await user.resendConfirmationCode();
      if (status != null) {
        codeResent = true;
      }
    } on Exception catch (e) {
      throw SignUpException.fromException(
          SignUpException.UNKNOWN_ERROR, e.toString(), e);
    }
    return Future.value(codeResent);
  }

  @override
  Future<void> sendPasswordResetEmail(String userName) async {
    CognitoUser user = _service.createCognitoUser(userName);
    bool passwordResent = false;
    try {
      final data = await user.forgotPassword();
      if (data != null) {
        passwordResent = true;
      }
    } on Exception catch (e) {
      throw SignUpException.fromException(
          SignUpException.UNKNOWN_ERROR, e.toString(), e);
    }
    return Future.value(passwordResent);
  }

  @override
  Future<void> sendSignInLinkToEmail(String email) {
    // TODO: implement sendSignInLinkToEmail
    throw UnimplementedError();
  }

  @override
  Future<ProviderLoginResponse> signInWithEmailLink(
      String email, String emailLink) {
    // TODO: implement signInWithEmailLink
    throw UnimplementedError();
  }
}
