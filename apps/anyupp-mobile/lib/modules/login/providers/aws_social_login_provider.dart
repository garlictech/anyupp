import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:amazon_cognito_identity_dart_2/sig_v4.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:flutter_login_facebook/flutter_login_facebook.dart';

class AwsSocialLoginProvider implements ISocialLoginProvider {
  final AwsAuthProvider _authProvider;
  final FacebookLogin _facebookLogin = FacebookLogin();
  final CognitoService _service = getIt<CognitoService>();

  AwsSocialLoginProvider(this._authProvider);

  @override
  Future<bool> get appleSignInAvailable async => false;

  @override
  Future<List<LoginMethod>> fetchSignInMethodsForEmail(String email) async {
    print('***** AwsSocialLoginProvider.fetchSignInMethodsForEmail()=$email');
    return [];
  }

  @override
  bool isFederated(LoginMethod method) {
    print('***** AwsSocialLoginProvider.isFederated()=$method');
    return method == LoginMethod.APPLE || method == LoginMethod.FACEBOOK || method == LoginMethod.GOOGLE;
  }

  @override
  Future<void> logout() async {
    print('***** AwsSocialLoginProvider.logout()');
    // await Future.wait([
    //   _googleSignIn.signOut(),
    //   _facebookLogin.logOut(),
    // ]);
    await _authProvider.getAuthenticatedUserProfile();
    return;
  }

  @override
  Future<ProviderLoginResponse> signInAnonymously() async {
    print('***** AwsSocialLoginProvider.signInAnonymously()');
    return null;
    // throw UnimplementedError();
  }

  @override
  Future<ProviderLoginResponse> signInWithApple() async {
    print('***** AwsSocialLoginProvider.signInWithApple()');
    try {
      CognitoSignInResult res = await Amplify.Auth.signInWithWebUI(provider: AuthProvider.apple);
      print('***** AwsSocialLoginProvider.signInWithApple().CognitoSignInResult.isSignedIn=${res?.isSignedIn}');
      //
      User user = await _authProvider.getAuthenticatedUserProfile();
      return ProviderLoginResponse(
        credential: null,
        user: user,
      );
    } on AuthException catch (e) {
      print('***** AwsSocialLoginProvider.signInWithApple().AuthException=$e');
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    } on Exception catch (e) {
      print('***** AwsSocialLoginProvider.signInWithApple().Exception=$e');
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    }
  }

  @override
  Future<ProviderLoginResponse> signInWithFacebook() async {
    print('***** AwsSocialLoginProvider.signInWithFacebook()');
    try {
      final loginResult = await _facebookLogin.logIn(permissions: [
        FacebookPermission.publicProfile,
        FacebookPermission.email,
      ]);
      print('***** AwsSocialLoginProvider.signInWithFacebook().loginResult=$loginResult');
      print('***** AwsSocialLoginProvider.signInWithFacebook().loginResult.map=${loginResult.toMap()}');
      if (loginResult.status == FacebookLoginStatus.cancel) {
        throw LoginException(
            code: LoginException.CODE, subCode: LoginException.LOGIN_CANCELLED_BY_USER, message: 'User cancelled');
      }

      if (loginResult.status == FacebookLoginStatus.error) {
        throw LoginException(
            code: LoginException.CODE, subCode: LoginException.FACEBOOK_LOGIN_ERROR, message: loginResult.error);
      }

      String email = await _facebookLogin.getUserEmail();
      FacebookUserProfile fpProfile = await _facebookLogin.getUserProfile();
      String fpProfileImage = await _facebookLogin.getProfileImageUrl(width: 200);

      CognitoCredentials _credential = await _service.loginWithCredentials(loginResult.accessToken.token, 'graph.facebook.com');
      User user = User(
        id: _credential.userIdentityId.split(':')[1],
        email: email,
        name: fpProfile?.name ?? fpProfile?.userId,
        profileImage: fpProfileImage,
      );
      await _authProvider.setCredentials(user, _credential);

      return ProviderLoginResponse(
        credential: _credential,
        user: user,
      );
    } on AuthException catch (e) {
      print('***** AwsSocialLoginProvider.signInWithFacebook().AuthException=$e');
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    } on Exception catch (e) {
      print('***** AwsSocialLoginProvider.signInWithFacebook().Exception=$e');
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    }
  }


  @override
  Future<ProviderLoginResponse> signInWithGoogle() async {
    print('***** AwsSocialLoginProvider.signInWithGoogle()');
    try {
      CognitoSignInResult res = await Amplify.Auth.signInWithWebUI(provider: AuthProvider.google);
      print('***** AwsSocialLoginProvider.signInWithGoogle().CognitoSignInResult.isSignedIn=${res?.isSignedIn}');
      //
      User user = await _authProvider.getAuthenticatedUserProfile();
      return ProviderLoginResponse(
        credential: null,
        user: user,
      );
    } on AuthException catch (e) {
      print('***** AwsSocialLoginProvider.signInWithGoogle().AuthException=$e');
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    } on Exception catch (e) {
      print('***** AwsSocialLoginProvider.signInWithGoogle().Exception=$e');
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    }
  }

  @override
  Future<ProviderLoginResponse> signInWithProvider(LoginMethod method) async {
    print('***** AwsSocialLoginProvider.signInWithProvider()');
    if (method == LoginMethod.FACEBOOK) {
      return signInWithFacebook();
    } else if (method == LoginMethod.GOOGLE) {
      return signInWithGoogle();
    } else if (method == LoginMethod.APPLE) {
      return signInWithApple();
    }
    throw LoginException(
        code: LoginException.CODE,
        subCode: LoginException.ERROR_LOGIN_INVALID_PROVIDER,
        message: 'The given provider($method) is not a Social provider!');
  }
}
