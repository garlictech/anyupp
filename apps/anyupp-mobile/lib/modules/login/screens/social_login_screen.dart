import 'dart:async';
import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:flutter/material.dart';

import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

class SocialLoginScreen extends StatefulWidget {
  final String title;
  final String provider;

  static const SIGNIN_CALLBACK = 'anyupp://signin/';
  static const SIGNOUT_CALLBACK = 'anyupp://signout/';

  SocialLoginScreen({required this.title, required this.provider});

  @override
  _SocialLoginScreenState createState() => _SocialLoginScreenState();
}

class _SocialLoginScreenState extends State<SocialLoginScreen> {
  final Completer<WebViewController> _webViewController = Completer<WebViewController>();
  String? _error;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: _error != null ? _buildErrorScreen() : _buildWebView(context));
  }

  Widget _buildWebView(BuildContext context) {
    var url = '${AppConfig.UserPoolDomain}/oauth2/authorize?'
        'identity_provider=${widget.provider}&'
        'redirect_uri=${SocialLoginScreen.SIGNIN_CALLBACK}&'
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
        if (request.url.startsWith('${SocialLoginScreen.SIGNIN_CALLBACK}?code=')) {
          var code = request.url.substring('${SocialLoginScreen.SIGNIN_CALLBACK}?code='.length);
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
        'redirect_uri=${SocialLoginScreen.SIGNIN_CALLBACK}';
    final response = await http.post(
      Uri.parse(url),
      body: {},
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    );
    print('SocialLoginScreen.signUserInWithAuthCode().response=${response.statusCode}');
    print('SocialLoginScreen.signUserInWithAuthCode().response.body=${response.body}');
    if (response.statusCode != 200) {
      setState(() {
        _error = '${response.statusCode}: ${response.body}';
      });
      return;
      // throw Exception('Received bad status code from Cognito for auth code:' +
      //     response.statusCode.toString() +
      //     '; body: ' +
      //     response.body);
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
      AuthRepository repository = getIt<AuthRepository>();
      await repository.loginWithCognitoSession(session, username);

      Navigator.of(context).pop();
    } on Exception catch (e) {
      setState(() {
        _error = 'UNKNOWN_ERROR: $e';
      });
    }
  }

  Widget _buildErrorScreen() {
    return Container(
      child: Center(
        child: Column(
          children: [
            Text(
              _error!,
              textAlign: TextAlign.center,
              style: Fonts.satoshi(
                color: Colors.red,
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                primary: Color(0xFF30BF60),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0),
                ),
              ),
              child: Text(
                trans('login.email.buttonLogin'),
                softWrap: false,
                textAlign: TextAlign.center,
                style: Fonts.satoshi(
                  color: theme.secondary0,
                  fontSize: 18.0,
                  fontWeight: FontWeight.normal,
                ),
              ),
              onPressed: () {
                setState(() {
                  _error = null;
                });
              },
            ),
          ],
        ),
      ),
    );
  }
}
