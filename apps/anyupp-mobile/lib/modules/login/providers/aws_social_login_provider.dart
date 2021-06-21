import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:http/http.dart' as http;

class AwsSocialLoginProvider implements ISocialLoginProvider {
  final AwsAuthProvider _authProvider;

  AwsSocialLoginProvider(this._authProvider);

  @override
  Future<List<LoginMethod>> fetchSignInMethodsForEmail(String email) async {
    print('***** AwsSocialLoginProvider.fetchSignInMethodsForEmail()=$email');
    return [];
  }

  @override
  bool isFederated(LoginMethod method) {
    print('***** AwsSocialLoginProvider.isFederated()=$method');
    return method == LoginMethod.APPLE || method == LoginMethod.FACEBOOK || method == LoginMethod.GOOGLE;
  }

  @override
  Future<void> logout() async {
    print('***** AwsSocialLoginProvider.logout()');
    // await Future.wait([
    //   _googleSignIn.signOut(),
    //   _facebookLogin.logOut(),
    // ]);
    await _authProvider.getAuthenticatedUserProfile();
    return;
  }

  @override
  Future<ProviderLoginResponse> signUserInWithAuthCode(String authCode) async {
    print('SocialLoginScreen.signUserInWithAuthCode().authCode=$authCode');
    var url = '${AppConfig.UserPoolDomain}/oauth2/token?'
        'grant_type=authorization_code&'
        'client_id=${AppConfig.UserPoolClientId}&'
        'code=$authCode&'
        'redirect_uri=${SocialLoginScreen.SIGNIN_CALLBACK}';
    final response = await http.post(
      url,
      body: {},
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    );
    print('SocialLoginScreen.signUserInWithAuthCode().response=${response.statusCode}');
    print('SocialLoginScreen.signUserInWithAuthCode().response.body=${response.body}');
    if (response.statusCode != 200) {
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
      print('SocialLoginScreen.signUserInWithAuthCode().idToken=${idToken.jwtToken}');
      print('SocialLoginScreen.signUserInWithAuthCode().accessToken=${accessToken.jwtToken}');
      print('SocialLoginScreen.signUserInWithAuthCode().refreshToken=${refreshToken.token}');

      dynamic payload = idToken.decodePayload();
      String username = payload['cognito:username'];
      print('SocialLoginScreen()signUserInWithAuthCode().username=' + username);

      final session = CognitoUserSession(idToken, accessToken, refreshToken: refreshToken);
      User user = await _authProvider.loginWithCognitoSession(session, username);
      return ProviderLoginResponse(
        user: user,
        credential: session,
      );
    } on Exception catch (e) {
      throw LoginException.fromException('UNKNOWN_ERROR', e);
    }
  }
}
