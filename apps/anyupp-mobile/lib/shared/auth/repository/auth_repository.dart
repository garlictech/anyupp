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
  Future<CognitoAccessToken> getAccessToken() {
    return _authProvider.getAccessToken();
  }

  @override
  Future<CognitoIdToken> getIdToken() {
    return _authProvider.getIdToken();
  }
}
