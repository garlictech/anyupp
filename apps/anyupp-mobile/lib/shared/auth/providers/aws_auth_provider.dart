import 'dart:async';
import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';

import 'package:rxdart/rxdart.dart';

import 'auth_provider_interface.dart';

class AwsAuthProvider implements IAuthProvider {
  StreamController<User> _userController = BehaviorSubject<User>();
  User _user;
  CognitoUser _cognitoUser;
  final CognitoService _service;

  AwsAuthProvider(this._service) {
    print('AwsAuthProvider().constructor()');
    getAuthenticatedUserProfile();
  }

  @override
  Future<User> getAuthenticatedUserProfile() async {
    try {
      _cognitoUser = await _service.refreshUserTokenFromStorageIsExists();
      if (_cognitoUser != null) {
        _user = _userFromAttributes(await _cognitoUser.getUserAttributes());
        _userController.add(_user);
        return _user;
      }
      print('getAuthenticatedUserProfile().user=$_user');
      if (_user != null) {
        return _user;
      }
      if (_user == null) {
        _cognitoUser = null;
        _user = null;
        _userController.add(null);
        return null;
      }
      return _user;
    } on Exception catch (e) {
      print('getAuthenticatedUserProfile().exception=$e');
      _user = null;
      _cognitoUser = null;
      _userController.add(null);
      return null;
    } on Error catch (e) {
      print('getAuthenticatedUserProfile().error=$e');
      _user = null;
      _cognitoUser = null;
      _userController.add(null);
      return null;
    }
  }


  @override
  Future<User> loginWithCognitoSession(CognitoUserSession session) async {
    print('loginWithCognitoSession().session=$session');
    try {
      _cognitoUser = await _service.createCognitoUserFromSession(session);
      await _cognitoUser.cacheTokens();
      print('loginWithCognitoSession().cognitoUser=$_cognitoUser');
      _user = _userFromAttributes(await _cognitoUser.getUserAttributes());
      print('loginWithCognitoSession().user=$_user');
      _userController.add(_user);
    } on Exception catch (e) {
      print('loginWithCognitoSession().error=$e');
      _cognitoUser = null;
      _user = null;
      _userController.add(_user);
    }
    return _user;
  }

  @override
  Stream<User> getAuthenticatedUserProfileStream() => _userController.stream;

  @override
  Future<void> cancel() async {
    // await _subscription.cancel();
    await _userController.close();
  }

  Future<void> triggerSingInSuccess() async {
    await getAuthenticatedUserProfile();
  }

  User _userFromAttributes(List<CognitoUserAttribute> attributes) {
    String email;
    String name;
    String subId;
    String loginMethod;
    for (int i = 0; i < attributes.length; i++) {
      CognitoUserAttribute a = attributes[i];
      // print('\t attr[${a.userAttributeKey}]=${a.value}');
      if (a.name == 'email') {
        email = a.value;
        name = email.split('@').first;
        continue;
      }
      if (a.name == 'sub') {
        // TODO
        subId = a.value;
        continue;
      }
      if (a.name == 'identities') {
        List<dynamic> json = jsonDecode(a.value);
        loginMethod = json.isNotEmpty
            ? json[0]['providerType']
            : 'UNKNOWN'; //LoginMethodUtils.stringToMethod(json[0]['providerType']);
        continue;
      }
    }
    User user = User(email: email, loginMethod: loginMethod, name: name, id: subId);
    return user;
  }

  @override
  Future<String> getAccessToken() async {
    try {
      CognitoUserSession session = await _service.session;
      if (!session.isValid()) {
        session = await (await _service.currentUser).getSession();
      }

      String token = session?.accessToken?.jwtToken;
      // print('***** getAccessToken().token=$token');
      return token;
    } on Exception catch (e) {
      print('***** getAccessToken().error=$e');
      return null;
    }
  }

  @override
  Future<String> getIdToken() async {
    try {
      CognitoUserSession session = await _service.session;
      String token = session?.idToken?.jwtToken;
      // print('***** getIdToken().token=$token');
      return token;
    } on Exception catch (e) {
      print('***** getIdToken().error=$e');
      return null;
    }
  }

  @override
  Future<void> clearUserSession() async {
    _user = null;
    _cognitoUser = null;
    _userController.add(_user);
  }

}
