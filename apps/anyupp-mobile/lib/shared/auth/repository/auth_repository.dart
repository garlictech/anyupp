import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:flutter/material.dart';

class AuthRepository implements IAuthProvider {
  final IAuthProvider _authProvider;

  // TODO not so nice here...
  Widget nextPageAfterLogin;

  AuthRepository(this._authProvider);

  Future<User> getAuthenticatedUserProfile() {
    return _authProvider.getAuthenticatedUserProfile();
  }

  Stream<User> getAuthenticatedUserProfileStream() {
    return _authProvider.getAuthenticatedUserProfileStream();
  }

  @override
  Future<void> cancel() {
    return _authProvider.cancel();
  }

  @override
  Future<String> getAccessToken() {
    return _authProvider.getAccessToken();
  }

  @override
  Future<String> getIdToken() {
    return _authProvider.getIdToken();
  }

  @override
  Future<void> clearUserSession() {
    return _authProvider.clearUserSession();
  }

  @override
  Future<void> setCredentials(User user, CognitoCredentials credentials) {
    return _authProvider.setCredentials(user, credentials);
  }
}
