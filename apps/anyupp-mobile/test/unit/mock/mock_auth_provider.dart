import 'dart:async';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:rxdart/rxdart.dart';

class MockAuthProvider implements IAuthProvider {
  StreamController<User> _userController = BehaviorSubject<User>();
  User _user;

  MockAuthProvider({User user}) {
    _user = user ?? User(
      id: 'test@anyupp.com',
      email: 'test@anyupp.com',
      name: 'Test User',
    );
    getAuthenticatedUserProfile();
  }


  @override
  Future<User> getAuthenticatedUserProfile() async {
    _userController.add(_user);
    return _user;
  }

  @override
  Future<User> loginWithCognitoSession(CognitoUserSession session, String username) async {
    _userController.add(_user);
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

  @override
  Future<String> getAccessToken() async {
    return 'DUMMY_ACCESS_TOKEN';
  }

  @override
  Future<String> getIdToken() async {
    return 'DUMMY_ID_TOKEN';
  }

  @override
  Future<void> clearUserSession() async {
    _user = null;
    _userController.add(_user);
  }
}
