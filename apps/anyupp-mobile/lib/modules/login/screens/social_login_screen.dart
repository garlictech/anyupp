import 'dart:async';
import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:http/http.dart' as http;

class SocialLoginScreen extends StatelessWidget {
  final String title;
  final String provider;

  static const SIGNIN_CALLBACK = 'anyupp://signin/';
  static const SIGNOUT_CALLBACK = 'anyupp://signout/';

  final Completer<WebViewController> _webViewController = Completer<WebViewController>();

  SocialLoginScreen({Key key, this.title, this.provider}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(title),
        ),
        body: getWebView(context));
  }

  Widget getWebView(BuildContext context) {
    var url = '${AppConfig.UserPoolDomain}/oauth2/authorize?'
        'identity_provider=$provider&'
        'redirect_uri=$SIGNIN_CALLBACK&'
        'response_type=CODE&'
        'client_id=${AppConfig.UserPoolClientId}&'
        'scope=email%20openid%20profile%20aws.cognito.signin.user.admin';
    print('SocialLoginScreen.getWebView().url=$url');
    return WebView(
      initialUrl: url,
      javascriptMode: JavascriptMode.unrestricted,
      onWebViewCreated: (WebViewController webViewController) {
        _webViewController.complete(webViewController);
      },
      navigationDelegate: (NavigationRequest request) {
        print('SocialLoginScreen.navigationDelegate().request=$request');
        if (request.url.startsWith('$SIGNIN_CALLBACK?code=')) {
          var code = request.url.substring('$SIGNIN_CALLBACK?code='.length);
          // This is the authorization code!!!
          signUserInWithAuthCode(context, code);
          return NavigationDecision.prevent;
        }
        return NavigationDecision.navigate;
      },
      gestureNavigationEnabled: true,
    );
  }

  Future signUserInWithAuthCode(BuildContext context, String authCode) async {
    print('SocialLoginScreen.signUserInWithAuthCode().authCode=$authCode');
    var url = '${AppConfig.UserPoolDomain}/oauth2/token?'
        'grant_type=authorization_code&'
        'client_id=${AppConfig.UserPoolClientId}&'
        'code=$authCode&'
        'redirect_uri=$SIGNIN_CALLBACK';
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
    final tokenData = json.decode(response.body);
    final idToken = CognitoIdToken(tokenData['id_token']);
    final accessToken = CognitoAccessToken(tokenData['access_token']);
    final refreshToken = CognitoRefreshToken(tokenData['refresh_token']);
    print('SocialLoginScreen.signUserInWithAuthCode().idToken=$idToken');
    print('SocialLoginScreen.signUserInWithAuthCode().accessToken=$accessToken');
    print('SocialLoginScreen.signUserInWithAuthCode().refreshToken=$refreshToken');

    final session = CognitoUserSession(idToken, accessToken, refreshToken: refreshToken);
    AuthRepository repository = getIt<AuthRepository>();
    await repository.loginWithCognitoSession(session);
    Navigator.of(context).pop();
  }
}
