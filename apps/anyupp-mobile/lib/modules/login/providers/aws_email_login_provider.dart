import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/graphql/generated/anyupp-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/login/models/provider_login_response.dart';
import 'package:fa_prev/modules/login/models/sign_up_exception.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'email_login_provider_interface.dart';

class AwsEmailLoginProvider implements IEmailLoginProvider {
  final IAuthProvider _authProvider;
  final CognitoService _service;

  AwsEmailLoginProvider(this._authProvider, this._service);

  @override
  Future<String?> get email async => (await SharedPreferences.getInstance()).getString('auth_email');

  @override
  Future<ProviderLoginResponse> loginWithEmailAndPassword(String email, String password,
      {bool isAnonymus = false}) async {
    try {
      CognitoUser user = _service.createCognitoUser(email);
      CognitoUserSession? session = await user.authenticateUser(_service.getAuthDetails(email, password));
      if (session != null && session.isValid()) {
        User? user = await _authProvider.loginWithCognitoSession(session, isAnonymus ? 'Anonymus' : email);
        await _service;
        return ProviderLoginResponse(
          credential: null,
          user: user,
        );
      }

      throw LoginException(code: LoginException.INVALID_CREDENTIALS, message: 'Invalid credentials');
    } on CognitoClientException catch (e) {
      // handle Wrong Username and Password and Cognito Client
      print('loginWithEmailAndPassword.CognitoClientException=$e');
      if (e.code == 'UserNotConfirmedException') {
        throw LoginException(code: e.code, message: email, subCode: LoginException.UNCONFIRMED, details: e.runtimeType);
      }
      if (e.code == 'NotAuthorizedException') {
        throw LoginException(
            code: e.code, message: email, subCode: LoginException.INVALID_CREDENTIALS, details: e.runtimeType);
      } else {
        rethrow;
      }
    } on Exception catch (e) {
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    }
  }

  @override
  Future<ProviderLoginResponse> signInAnonymously() async {
    try {
      var result = await GQL.backend.execute(CreateAnonymUserMutation(), useApi: true);
      // QueryResult result = await GQL.backend.executeMutation(
      //   mutation: MUTATION_CREATE_ANONYM_USER,
      //   variables: {},
      //   useApi: true,
      // );
      // print('signInAnonymously.response().exception=${result.exception}');
      // print('signInAnonymously.response().data=${jsonEncode(result.data)}');

      String? email = result.data?.createAnonymUser.username;
      String? pwd = result.data?.createAnonymUser.pwd;
      if (email != null && pwd != null) {
        return loginWithEmailAndPassword(email, pwd, isAnonymus: true);
      }
      throw LoginException(
        code: LoginException.INVALID_CREDENTIALS,
        message: 'signInAnonymously(): Username or password is null',
      );
    } on Exception catch (e) {
      print('signInAnonymously.exception=$e');
      throw LoginException(
          code: LoginException.CODE,
          message: "Failed to Create Anonymus user",
          subCode: LoginException.INVALID_ANONYMUS_USER,
          details: "Couldn't create anonymus user.");
    }
  }

  @override
  Future<String> registerUserWithEmailAndPassword(
    String userEmail,
    String? userPhone,
    String email,
    String password,
  ) async {
    try {
      List<AttributeArg> attributes = [];
      attributes.add(AttributeArg(name: 'email', value: userEmail));
      String username = UUID.getUUID();
      print('**** registerUserWithEmailAndPassword().username=$username, email=$email');
      CognitoUserPoolData userPoolData = await _service.userPool.signUp(username, password, userAttributes: attributes);
      print('**** registerUserWithEmailAndPassword().userPoolData=$userPoolData');

      return Future.value(username);
    } on CognitoClientException catch (e) {
      print('**** registerUserWithEmailAndPassword().CognitoClientException=$e');
      if (e.code == 'UsernameExistsException' || e.code == 'UserLambdaValidationException') {
        throw SignUpException.fromException(SignUpException.USER_EXISTS, e.message!, e);
      }
      if (e.code == 'InvalidPasswordException') {
        throw SignUpException.fromException(SignUpException.INVALID_PASSWORD, e.message!, e);
      }

      rethrow;
    } on Exception catch (e) {
      print('**** registerUserWithEmailAndPassword().error=$e');
      throw SignUpException.fromException(SignUpException.UNKNOWN_ERROR, e.toString(), e);
    }
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
            code: SignUpException.CODE, subCode: SignUpException.INVALID_CONFIRMATION_CODE, message: userName);
      }
    } on Exception catch (e) {
      throw SignUpException.fromException(SignUpException.UNKNOWN_ERROR, e.toString(), e);
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
        throw SignUpException(code: SignUpException.CODE, subCode: SignUpException.LIMIT_ECXEEDED, message: userName);
      }
    } on Exception catch (e) {
      throw SignUpException.fromException(SignUpException.UNKNOWN_ERROR, e.toString(), e);
    }
    return Future.value(codeResent);
  }

  @override
  Future<Map<String, dynamic>> sendPasswordResetEmail(String userName) async {
    CognitoUser user = _service.createCognitoUser(userName);
    try {
      Map<String, dynamic> codeDeliveryDetails = {};
      final data = await user.forgotPassword();
      if (data != null) {
        codeDeliveryDetails = data['CodeDeliveryDetails'];
      }
      return Future.value(codeDeliveryDetails);
    } on Exception catch (e) {
      throw SignUpException.fromException(SignUpException.UNKNOWN_ERROR, e.toString(), e);
    }
  }

  @override
  Future<bool> confirmPassword(String userName, String code, String newPassword) async {
    CognitoUser user = _service.createCognitoUser(userName);
    try {
      final passwordConfirmed = await user.confirmPassword(code, newPassword);
      return Future.value(passwordConfirmed);
    } on Exception catch (e) {
      throw SignUpException.fromException(SignUpException.UNKNOWN_ERROR, e.toString(), e);
    }
  }
}
