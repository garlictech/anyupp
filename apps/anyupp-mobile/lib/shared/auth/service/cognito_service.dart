import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import '/core/core.dart';
import '/modules/login/login.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'cognito_local_storage.dart';

class CognitoService {
  final String region;
  final String userPoolId;
  final String clientId;
  final String identityPoolId;

  CognitoUserPool _userPool;

  CognitoUser? _cognitoUser;

  CognitoUserSession? _userSession;

  CognitoUserSession? get session => _userSession;

  CognitoUserPool get userPool => _userPool;

  CognitoService({
    required this.region,
    required this.identityPoolId,
    required this.userPoolId,
    required this.clientId,
  }) : _userPool = CognitoUserPool(userPoolId, clientId,
            storage: CognitoLocalStorage()) {
    init();
  }

  Future<CognitoUser?> get currentUser async {
    try {
      _cognitoUser = await _userPool.getCurrentUser();
      _userSession = await _cognitoUser?.getSession();
    } on Exception catch (e) {
      log.e('getCurrentUser().exception=$e');
      return null;
    }
    return _cognitoUser;
  }

  // Future<CognitoUserSession> get getSession async => (await currentUser)?.getSession();

  Future<bool> get isSessionValid async => (await session)?.isValid() ?? false;

  Future<void> init() async {
    _cognitoUser = await this.currentUser;
    log.d('CognitoService.init().cognitoUser=$_cognitoUser');
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
    log.d('CognitoService.signOut()');
    try {
      CognitoUser? user = await this.currentUser;
      if (user != null) {
        await user.globalSignOut();
        await user.signOut();
      }
      _cognitoUser = null;
      return true;
    } on Exception catch (e) {
      log.e('signOut().error=$e');
      return false;
    }
  }

  Future<CognitoUser> createCognitoUserFromSession(
      CognitoUserSession session, String userName) async {
    // log.d('CognitoService.createCognitoUserFromSession().session=$session, userName=$userName');
    _cognitoUser = CognitoUser(userName, userPool, signInUserSession: session);
    _userSession = session;
    await _cognitoUser!.cacheTokens();
    await _saveSessionToCache();
    return _cognitoUser!;
  }

  Future<bool> refreshUserToken() async {
    // log.d('CognitoService.refreshUserToken().start()');
    try {
      if (_cognitoUser == null) {
        _cognitoUser = await _userPool.getCurrentUser();
        // log.d('CognitoService.refreshUserToken().user=$_cognitoUser');
        if (_cognitoUser == null) {
          // No token, need login!
          return false;
        }

        _userSession = await _cognitoUser?.getSession();
        log.d('CognitoService.refreshUserToken().session=$_userSession');
        if (_userSession == null || !_userSession!.isValid()) {
          _userSession =
              await _cognitoUser?.refreshSession(_userSession!.refreshToken!);
          // log.d('CognitoService.refreshUserToken().newsession()=$_userSession');
        }
        return true;
      }

      _userSession = await _cognitoUser?.getSession();
      // log.d('CognitoService.refreshUserToken().session2=$_userSession');
      if (!(session?.isValid() ?? false)) {
        // log.d('CognitoService.refreshUserToken().start refresh session2()');
        _userSession =
            await _cognitoUser?.refreshSession(session!.refreshToken!);
        // log.d('CognitoService.refreshUserToken().newsession2()=$_userSession');
      }
    } on Exception catch (e) {
      log.e('CognitoService.refreshUserToken().error=$e');
      return false;
    }

    return true;
  }

  Future<CognitoUser?> refreshUserTokenFromStorageIsExists2() async {
    log.d('refreshUserTokenFromStorageIsExists()');
    SharedPreferences sp = await SharedPreferences.getInstance();
    String? username = sp.getString('cognito_username');
    log.d('refreshUserTokenFromStorageIsExists().username=$username');
    try {
      CognitoUserSession? session = await _loadSessionFromCache();
      log.d('refreshUserTokenFromStorageIsExists().session=$session');
      // session.invalidateToken()
      if (session != null) {
        log.d(
            'refreshUserTokenFromStorageIsExists().session.isValid=${session.isValid()}');
        if (session.isValid()) {
          final user =
              CognitoUser(username, userPool, signInUserSession: session);
          log.d('refreshUserTokenFromStorageIsExists().session.user=$user');
          _userSession = await user.getSession();
          log.d(
              'refreshUserTokenFromStorageIsExists().validSession=$_userSession');
          return user;
        } else {
          log.d('refreshUserTokenFromStorageIsExists().refreshing token');
          final user =
              CognitoUser(username, userPool, signInUserSession: session);
          _userSession = await user.refreshSession(session.refreshToken!);
          log.d(
              'refreshUserTokenFromStorageIsExists().refreshedSession=$_userSession');
          await _saveSessionToCache();
          return user;
        }
      }
    } on Exception catch (e) {
      // log.d('refreshUserTokenFromStorageIsExists().exception. refreshing=$e, $trace');
      log.e('refreshUserTokenFromStorageIsExists().exception. refreshing=$e');
      final user = CognitoUser(username, userPool,
          signInUserSession: await _loadSessionFromCache());
      _userSession = await user.refreshSession(_userSession!.refreshToken!);
      log.e(
          'refreshUserTokenFromStorageIsExists().exception.refreshedSession=$_userSession');
      await _saveSessionToCache();
      return user;
    }

    _userSession = null;
    await _saveSessionToCache();
    return null;
  }

  Future<CognitoUserSession?> _loadSessionFromCache() async {
    SharedPreferences sp = await SharedPreferences.getInstance();
    if (sp.getString('cognito_idtoken') != null) {
      CognitoIdToken idToken = CognitoIdToken(sp.getString('cognito_idtoken'));
      CognitoAccessToken accessToken =
          CognitoAccessToken(sp.getString('cognito_accesstoken'));
      CognitoRefreshToken refreshToken =
          CognitoRefreshToken(sp.getString('cognito_refreshtoken'));
      CognitoUserSession session =
          CognitoUserSession(idToken, accessToken, refreshToken: refreshToken);
      return session;
    }

    return null;
  }

  Future<bool> _saveSessionToCache() async {
    SharedPreferences sp = await SharedPreferences.getInstance();
    if (_userSession != null) {
      await sp.setString(
          'cognito_idtoken', _userSession!.idToken.jwtToken ?? '');
      await sp.setString(
          'cognito_accesstoken', _userSession!.accessToken.jwtToken ?? '');
      await sp.setString(
          'cognito_refreshtoken', _userSession!.refreshToken?.token ?? '');
      return true;
    } else {
      await sp.remove('cognito_idtoken');
      await sp.remove('cognito_accesstoken');
      await sp.remove('cognito_refreshtoken');
    }
    if (_cognitoUser != null) {
      await sp.setString('cognito_username', _cognitoUser!.username ?? '');
    } else {
      await sp.remove('cognito_username');
    }
    return true;
  }

  Future<CognitoCredentials> loginWithCredentials(
      String accessToken, String provider) async {
    log.d('loginWithCredentials()=$provider, identityPoolId=$identityPoolId');
    CognitoCredentials credentials =
        CognitoCredentials(identityPoolId, userPool);
    await credentials.getAwsCredentials(accessToken, provider);
    log.d(
        'loginWithCredentials().credentials.userIdentityId=${credentials.userIdentityId}');
    log.d(
        'loginWithCredentials().credentials.accessKeyId=${credentials.accessKeyId}');
    log.d(
        'loginWithCredentials().credentials.secretAccessKey=${credentials.secretAccessKey}');
    log.d(
        'loginWithCredentials().credentials.sessionToken=${credentials.sessionToken}');

    return credentials;
  }

  bool checkTokenValidity(String token) {
    if (DateTime.now()
        .add(Duration(minutes: 5))
        .isBefore(tokenExpiration(token))) {
      return true;
    }
    return false;
  }

  DateTime tokenExpiration(String token) {
    final parts = token.split('.');

    if (parts.length != 3) {
      throw LoginException();
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
