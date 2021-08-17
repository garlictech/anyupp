import 'dart:async';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:rxdart/rxdart.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'auth_provider_interface.dart';

class AwsAuthProvider implements IAuthProvider {
  StreamController<User> _userController = BehaviorSubject<User>();
  User _user;
  final CognitoService _service;

  AwsAuthProvider(this._service) {
    // print('AwsAuthProvider().constructor()');
    getAuthenticatedUserProfile();
  }

  @override
  Future<User> getAuthenticatedUserProfile() async {
    try {
      bool isLooggedIn = await _service.refreshUserToken();
      // print('getAuthenticatedUserProfile().isLoggedIn=$isLooggedIn, user=$_user');
      if (isLooggedIn) {
        if (_user == null) {
          CognitoUser user = await _service.currentUser;
          if (user != null) {
            _user = await _userFromAttributes(user);
          }
        }
      } else {
        if (_user != null) {
          _user = null;
        }
      }
      _userController.add(_user);
      return _user;
    } on Exception catch (e) {
      print('getAuthenticatedUserProfile().exception=$e');
      _user = null;
      _userController.add(null);
      return null;
    } on Error catch (e) {
      print('getAuthenticatedUserProfile().error=$e');
      _user = null;
      _userController.add(null);
      return null;
    }
  }

  @override
  Future<User> loginWithCognitoSession(CognitoUserSession session, String username) async {
    // print('loginWithCognitoSession().session=$session, username=$username');
    try {
      CognitoUser user = await _service.createCognitoUserFromSession(session, username);
      await user.cacheTokens();
      // print('loginWithCognitoSession().cognitoUser=${user.username}');
      _user = await _userFromAttributes(user);
      // print('loginWithCognitoSession().user=$_user');
      // await _service.createCognitoUserFromSession(session, _user.id);
      _userController.add(_user);
    } on Exception catch (e) {
      print('loginWithCognitoSession().error=$e');
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

  Future<User> _userFromAttributes(CognitoUser cognitoUser) async {
    String email;
    String name;
    String phone;
    List<CognitoUserAttribute> attributes = await cognitoUser.getUserAttributes();

    print('_userFromAttributes().start()');
    for (int i = 0; i < attributes.length; i++) {
      CognitoUserAttribute a = attributes[i];
      print('\tattr[${a.name}]=${a.value}');
      if (a.name != null && a.name == 'name') {
        name = a.value;
      }
      // print('\t attr[${a.userAttributeKey}]=${a.value}');
      if (a.name != null && name == null && a.name == 'email') {
        email = a.value;
        name = email.split('@').first;
      }

      if (a.name != null && a.name == 'phone_number') {
        phone = a.value;
      }
    }

    CognitoIdToken idToken = (await cognitoUser.getSession()).idToken;
    dynamic payload = idToken.decodePayload();
    String username = payload['cognito:username'];
    print('loginWithCognitoSession().username=' + username);

    User user = User(email: email, name: name, id: username, phone: phone);
    return user;
  }

  @override
  Future<String> getAccessToken() async {
    try {
      CognitoUserSession session = await _service.session;
      if (session == null || !session.isValid()) {
        session = await (await _service.currentUser)?.getSession();
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
    _userController.add(_user);
    SharedPreferences sp = await SharedPreferences.getInstance();
    await sp.clear();
  }
}
