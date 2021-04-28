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
  Future<ProviderLoginResponse> loginWithEmailAndPassword(
      String email, String password) async {
    try {
      CognitoUser user = _service.createCognitoUser(email);
      CognitoUserSession session =
          await user.authenticateUser(_service.getAuthDetails(email, password));

      if (session.isValid()) {
        User user = await _authProvider.loginWithCognitoSession(session);
        return ProviderLoginResponse(
          credential: null,
          user: user,
        );
      }

      throw LoginException(
          code: LoginException.INVALID_CREDENTIALS,
          message: 'Invalid credentials');
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
    } on CognitoClientException catch (e) {
      if (e.code == 'LimitExceededException') {
        throw SignUpException(
            code: SignUpException.CODE,
            subCode: SignUpException.LIMIT_ECXEEDED,
            message: userName);
      }
    } on Exception catch (e) {
      throw SignUpException.fromException(
          SignUpException.UNKNOWN_ERROR, e.toString(), e);
    }
    return Future.value(codeResent);
  }

  @override
  Future<Map<String, dynamic>> sendPasswordResetEmail(String userName) async {
    CognitoUser user = _service.createCognitoUser(userName);
    bool passwordResent = false;
    Map<String, dynamic> codeDeliveryDetails;
    try {
      final data = await user.forgotPassword();
      if (data != null) {
        passwordResent = true;
        codeDeliveryDetails = data['CodeDeliveryDetails'];
      }
    } on Exception catch (e) {
      throw SignUpException.fromException(
          SignUpException.UNKNOWN_ERROR, e.toString(), e);
    }
    return Future.value(codeDeliveryDetails);
  }

  @override
  Future<bool> confirmPassword(
      String userName, String code, String newPassword) async {
    CognitoUser user = _service.createCognitoUser(userName);
    bool passwordConfirmed = false;
    try {
      final data = await user.confirmPassword(code, newPassword);
      if (data != null) {
        passwordConfirmed = true;
      }
    } on Exception catch (e) {
      throw SignUpException.fromException(
          SignUpException.UNKNOWN_ERROR, e.toString(), e);
    }
    return Future.value(passwordConfirmed);
  }
}
