import 'package:fa_prev/shared/auth.dart';
import 'package:flutter/material.dart';

class AuthRepository {
  final IAuthProvider _loginRepository;

  // TODO not so nice here...
  Widget nextPageAfterLogin;

  AuthRepository(this._loginRepository);

  Stream<AuthenticatedUser> getAuthenticatedUser() {
    return _loginRepository.authenticatedUser;
  }

  Future<User> getAuthenticatedUserProfile() {
    return _loginRepository.getAuthenticatedUserProfile();
  }

  Stream<User> getAuthenticatedUserProfileStream() {
    return _loginRepository.getAuthenticatedUserProfileStream();
  }
}
