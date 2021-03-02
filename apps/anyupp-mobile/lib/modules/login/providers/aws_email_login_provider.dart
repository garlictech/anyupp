import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/login/models/provider_login_response.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'email_login_provider_interface.dart';

class AwsEmailLoginProvider implements IEmailLoginProvider {
  final AwsAuthProvider _authProvider;

  AwsEmailLoginProvider(this._authProvider);

  @override
  Future<String> get email async => (await SharedPreferences.getInstance()).getString('auth_email');

  @override
  Future<bool> isSignInWithEmailLink(String emailLink) async {
    return false;
  }

  @override
  Future<ProviderLoginResponse> loginWithEmailAndPassword(String email, String password) async {
    try {
      SignInResult signInResult = await Amplify.Auth.signIn(
        username: email,
        password: password,
      );
      if (signInResult.isSignedIn) {
        User user = await _authProvider.getAuthenticatedUserProfile();
        return ProviderLoginResponse(
          credential: null,
          user: user,
        );
      }

      throw LoginException(code: LoginException.INVALID_CREDENTIALS, message: 'Invalid credentials');
    } on AuthException catch (e) {
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    } on Exception catch (e) {
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    }
  }

  @override
  Future<ProviderLoginResponse> registerUserWithEmailAndPassword(String email, String password) {
    // TODO: implement registerUserWithEmailAndPassword
    throw UnimplementedError();
  }

  @override
  Future<void> sendPasswordResetEmail(String email) {
    // TODO: implement sendPasswordResetEmail
    throw UnimplementedError();
  }

  @override
  Future<void> sendSignInLinkToEmail(String email) {
    // TODO: implement sendSignInLinkToEmail
    throw UnimplementedError();
  }

  @override
  Future<ProviderLoginResponse> signInWithEmailLink(String email, String emailLink) {
    // TODO: implement signInWithEmailLink
    throw UnimplementedError();
  }
}
