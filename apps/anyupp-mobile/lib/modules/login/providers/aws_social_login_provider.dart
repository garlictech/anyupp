import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:http/http.dart' as http;

class AwsSocialLoginProvider implements ISocialLoginProvider {
  final IAuthProvider _authProvider;

  AwsSocialLoginProvider(this._authProvider);

  @override
  Future<List<LoginMethod>> fetchSignInMethodsForEmail(String email) async {
    log.d('***** AwsSocialLoginProvider.fetchSignInMethodsForEmail()=$email');
    return [];
  }

  @override
  bool isFederated(LoginMethod method) {
    log.d('***** AwsSocialLoginProvider.isFederated()=$method');
    return method == LoginMethod.APPLE ||
        method == LoginMethod.FACEBOOK ||
        method == LoginMethod.GOOGLE;
  }

  @override
  Future<ProviderLoginResponse> signUserInWithAuthCode(String authCode) async {
    log.d('AwsSocialLoginProvider.signUserInWithAuthCode().authCode=$authCode');
    var url = '${AppConfig.UserPoolDomain}/oauth2/token?'
        'grant_type=authorization_code&'
        'client_id=${AppConfig.UserPoolClientId}&'
        'code=$authCode&'
        'redirect_uri=${LoginScreen.SIGNIN_CALLBACK}';
    log.d('AwsSocialLoginProvider.signUserInWithAuthCode().url=$url');
    final response = await http.post(
      Uri.parse(url),
      body: {},
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    );
    log.d(
        'AwsSocialLoginProvider.signUserInWithAuthCode().response=${response.statusCode}');
    log.d(
        'AwsSocialLoginProvider.signUserInWithAuthCode().response.body=${response.body}');
    if (response.statusCode != 200) {
      log.d(
          'AwsSocialLoginProvider.error.reasonPhrase=${response.reasonPhrase}');
      throw Exception('Received bad status code from Cognito for auth code:' +
          response.statusCode.toString() +
          '; body: ' +
          response.body);
    }

    try {
      final tokenData = json.decode(response.body);
      final idToken = CognitoIdToken(tokenData['id_token']);
      final accessToken = CognitoAccessToken(tokenData['access_token']);
      final refreshToken = CognitoRefreshToken(tokenData['refresh_token']);
      dynamic payload = idToken.decodePayload();
      String username = payload['cognito:username'];
      log.d('AwsSocialLoginProvider()signUserInWithAuthCode().username=' +
          username);

      final session =
          CognitoUserSession(idToken, accessToken, refreshToken: refreshToken);
      User? user =
          await _authProvider.loginWithCognitoSession(session, username);
      return ProviderLoginResponse(
        user: user,
        credential: session,
      );
    } on Exception catch (e) {
      log.e('AwsSocialLoginProvider.signUserInWithAuthCode.exception=$e');
      throw LoginException.fromException('UNKNOWN_ERROR', e);
    }
  }

  @override
  Future<void> logout() async {
    log.d('AwsSocialLoginProvider.logout()');
    var url = '${AppConfig.UserPoolDomain}/logout?'
        'client_id=${AppConfig.UserPoolClientId}&'
        'logout_uri=${LoginScreen.SIGNOUT_CALLBACK}/logout';
    try {
      await http.get(Uri.parse(url));
    } on Exception catch (e) {
      log.e('AwsSocialLoginProvider.logout().error=$e');
    }
    await _authProvider.getAuthenticatedUserProfile();
  }
}
