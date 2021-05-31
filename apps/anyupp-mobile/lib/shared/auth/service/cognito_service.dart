import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'cognito_local_storage.dart';

class CognitoService {
  final String region;
  final String userPoolId;
  final String clientId;
  final String identityPoolId;
  CognitoLocalStorage storage;

  CognitoUserPool _userPool;

  CognitoService(
      {@required this.region, @required this.identityPoolId, @required this.userPoolId, @required this.clientId}) {
    _userPool = CognitoUserPool(
      userPoolId,
      clientId,
      storage: storage,
    );
    init();
  }

  CognitoUser _cognitoUser;

  CognitoUserSession _userSession;

  CognitoUserSession get session => _userSession;

  CognitoUserPool get userPool => _userPool;

  Future<CognitoUser> get currentUser async {
    _cognitoUser = await _userPool.getCurrentUser();
    if (_cognitoUser != null) {
      _userSession = await _cognitoUser.getSession();
    }

    return _cognitoUser;
  }

  // Future<CognitoUserSession> get getSession async => (await currentUser)?.getSession();

  Future<bool> get isSessionValid async => (await session)?.isValid() ?? false;

  Future<void> init() async {
    await this.currentUser;
    _cognitoUser = await _userPool.getCurrentUser();
  }

  CognitoUser createCognitoUser(String username) {
    return CognitoUser(username, userPool);
  }

  AuthenticationDetails getAuthDetails(String username, String password) {
    return AuthenticationDetails(
      username: username,
      password: password,
    );
  }

  Future<bool> signOut() async {
    try {
      CognitoUser user = await this.currentUser;
      if (user != null) {
        await user.globalSignOut();
        await user.signOut();
      }

      return true;
    } on Exception catch (e) {
      print('signOut().error=$e');
      return false;
    }
  }

  Future<CognitoUser> createCognitoUserFromSession(CognitoUserSession session, String userName) async {
    final user = CognitoUser(userName, userPool, signInUserSession: session);
    _userSession = session;
    await _saveSessionToCache();
    return user;
  }

  Future<CognitoUser> refreshUserTokenFromStorageIsExists() async {
    print('refreshUserTokenFromStorageIsExists()');
    try {
      CognitoUserSession session = await _loadSessionFromCache();
      print('refreshUserTokenFromStorageIsExists().session=$session');
      // session.invalidateToken()
      if (session != null) {
        print('refreshUserTokenFromStorageIsExists().session.isValid=${session.isValid()}');
        if (session.isValid()) {
          final user = CognitoUser(null, userPool, signInUserSession: session);
          print('refreshUserTokenFromStorageIsExists().session.user=$user');
          _userSession = await user.getSession();
          print('refreshUserTokenFromStorageIsExists().validSession=$_userSession');
          return user;
        } else {
          print('refreshUserTokenFromStorageIsExists().refreshing token');
          final user = CognitoUser(null, userPool, signInUserSession: session);
          _userSession = await user.refreshSession(session.refreshToken);
          print('refreshUserTokenFromStorageIsExists().refreshedSession=$_userSession');
          await _saveSessionToCache();
          return user;
        }
      }
    } on Exception catch (e) {
      // print('refreshUserTokenFromStorageIsExists().exception. refreshing=$e, $trace');
      print('refreshUserTokenFromStorageIsExists().exception. refreshing=$e');
      final user = CognitoUser(null, userPool, signInUserSession: await _loadSessionFromCache());
      _userSession = await user.refreshSession(session.refreshToken);
      print('refreshUserTokenFromStorageIsExists().exception.refreshedSession=$_userSession');
      await _saveSessionToCache();
      return user;
    }

    _userSession = null;
    await _saveSessionToCache();
    return null;
  }

  Future<CognitoUserSession> _loadSessionFromCache() async {
    SharedPreferences sp = await SharedPreferences.getInstance();
    if (sp.getString('cognito_idtoken') != null) {
      CognitoIdToken idToken = CognitoIdToken(sp.getString('cognito_idtoken'));
      CognitoAccessToken accessToken = CognitoAccessToken(sp.getString('cognito_accesstoken'));
      CognitoRefreshToken refreshToken = CognitoRefreshToken(sp.getString('cognito_refreshtoken'));
      CognitoUserSession session = CognitoUserSession(idToken, accessToken, refreshToken: refreshToken);
      return session;
    }

    return null;
  }

  Future<bool> _saveSessionToCache() async {
    SharedPreferences sp = await SharedPreferences.getInstance();
    if (_userSession != null) {
      await sp.setString('cognito_idtoken', _userSession.idToken.jwtToken);
      await sp.setString('cognito_accesstoken', _userSession.accessToken.jwtToken);
      await sp.setString('cognito_refreshtoken', _userSession.refreshToken.token);
      return true;
    } else {
      await sp.remove('cognito_idtoken');
      await sp.remove('cognito_accesstoken');
      await sp.remove('cognito_refreshtoken');
    }
    if (_cognitoUser != null) {
      await sp.setString('cognito_username', _cognitoUser.username);
    } else {
      await sp.remove('cognito_username');
    }
    return true;
  }

  Future<CognitoCredentials> loginWithCredentials(String accessToken, String provider) async {
    print('loginWithCredentials()=$provider, identityPoolId=$identityPoolId');
    CognitoCredentials credentials = CognitoCredentials(identityPoolId, userPool);
    await credentials.getAwsCredentials(accessToken, provider);
    print('loginWithCredentials().credentials.userIdentityId=${credentials?.userIdentityId}');
    print('loginWithCredentials().credentials.accessKeyId=${credentials?.accessKeyId}');
    print('loginWithCredentials().credentials.secretAccessKey=${credentials?.secretAccessKey}');
    print('loginWithCredentials().credentials.sessionToken=${credentials?.sessionToken}');

    return credentials;
  }

  bool checkTokenValidity(String token) {
    if (DateTime.now().add(Duration(minutes: 5)).isBefore(tokenExpiration(token))) {
      return true;
    }
    return false;
  }

  DateTime tokenExpiration(String token) {
    final parts = token.split('.');

    if (parts.length != 3) {
      throw LoginException(); // TODO
    }

    final payloadMap = json.decode(_decodeBase64(parts[1]));

    if (payloadMap is! Map<String, dynamic>) {
      throw LoginException();
    }

    return DateTime.fromMillisecondsSinceEpoch(payloadMap['exp'] * 1000);
  }

  String _decodeBase64(String str) {
    var output = str.replaceAll('-', '+').replaceAll('_', '/');

    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw LoginException();
    }

    return utf8.decode(base64Url.decode(output));
  }
}
