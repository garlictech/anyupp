import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:flutter/material.dart';

class AuthRepository implements IAuthProvider {
  final IAuthProvider _authProvider;

  Widget? nextPageAfterLogin;

  AuthRepository(this._authProvider);

  Future<User?> getAuthenticatedUserProfile() {
    return _authProvider.getAuthenticatedUserProfile();
  }

  Stream<User?> getAuthenticatedUserProfileStream() {
    // TODO: ezt lehet at kene irni, hogy ne null User-t adjon, hanem exception, ha nincs user.
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
  Future<User?> loginWithCognitoSession(CognitoUserSession session, String username) {
    return _authProvider.loginWithCognitoSession(session, username);
  }
}
