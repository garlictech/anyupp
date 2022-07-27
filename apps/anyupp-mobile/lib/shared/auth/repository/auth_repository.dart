import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import '/models.dart';
import '/shared/auth.dart';
import 'package:flutter/material.dart';

class AuthRepository implements IAuthProvider {
  final IAuthProvider _authProvider;

  Widget? nextPageAfterLogin;

  AuthRepository(this._authProvider);

  Future<User?> getAuthenticatedUserProfile() {
    return _authProvider.getAuthenticatedUserProfile();
  }

  Stream<User?> getAuthenticatedUserProfileStream() {
    return _authProvider.getAuthenticatedUserProfileStream();
  }

  @override
  Future<void> cancel() {
    return _authProvider.cancel();
  }

  @override
  Future<String?> getAccessToken() {
    return _authProvider.getAccessToken();
  }

  @override
  Future<String?> getIdToken() {
    return _authProvider.getIdToken();
  }

  @override
  Future<void> clearUserSession() {
    return _authProvider.clearUserSession();
  }

  @override
  Future<User?> loginWithCognitoSession(
      CognitoUserSession session, String username) {
    return _authProvider.loginWithCognitoSession(session, username);
  }
}
