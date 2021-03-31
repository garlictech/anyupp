import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:flutter_login_facebook/flutter_login_facebook.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AwsSocialLoginProvider implements ISocialLoginProvider {
  final GoogleSignIn _googleSignIn;
  final FacebookLogin _facebookLogin;
  final AwsAuthProvider _authProvider;
  final CognitoService _service = getIt<CognitoService>();

  AwsSocialLoginProvider(this._googleSignIn, this._facebookLogin, this._authProvider);

  @override
  Future<bool> get appleSignInAvailable async => false;

  @override
  Future<List<LoginMethod>> fetchSignInMethodsForEmail(String email) async {
    print('***** AwsSocialLoginProvider.fetchSignInMethodsForEmail()=$email');
    // TODO AWS
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
    await Future.wait([
      _googleSignIn.signOut(),
      _facebookLogin.logOut(),
    ]);
    await _authProvider.getAuthenticatedUserProfile();
    return;
  }

  @override
  Future<ProviderLoginResponse> signInAnonymously() async {
    print('***** AwsSocialLoginProvider.signInAnonymously()');
    // throw UnimplementedError();
  }

  @override
  Future<ProviderLoginResponse> signInWithApple() async {
    print('***** AwsSocialLoginProvider.signInWithApple()');
    // try {
    //   CognitoSignInResult res = await Amplify.Auth.signInWithWebUI(provider: AuthProvider.apple);
    //   print('***** AwsSocialLoginProvider.signInWithApple().CognitoSignInResult.isSignedIn=${res?.isSignedIn}');
    //   //
    //   User user = await _authProvider.getAuthenticatedUserProfile();
    //   return ProviderLoginResponse(
    //     credential: null,
    //     user: user,
    //   );
    // } on AuthException catch (e) {
    //   print('***** AwsSocialLoginProvider.signInWithApple().AuthException=$e');
    //   throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    // } on Exception catch (e) {
    //   print('***** AwsSocialLoginProvider.signInWithApple().Exception=$e');
    //   throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    // }
  }

  @override
  Future<ProviderLoginResponse> signInWithFacebook() async {
    print('***** AwsSocialLoginProvider.signInWithFacebook()');
    try {



    } on Exception catch (e) {
      print('***** AwsSocialLoginProvider.signInWithFacebook().Exception=$e');
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    }
    return null;
  }

  @override
  Future<ProviderLoginResponse> signInWithFacebook2() async {
    print('***** AwsSocialLoginProvider.signInWithFacebook()');
    try {
      final loginResult = await _facebookLogin.logIn(permissions: [
        FacebookPermission.publicProfile,
        FacebookPermission.email,
      ]);
      print('***** AwsSocialLoginProvider.signInWithFacebook().loginResult=$loginResult');
      if (loginResult.status == FacebookLoginStatus.cancel) {
        throw LoginException(
            code: LoginException.CODE, subCode: LoginException.LOGIN_CANCELLED_BY_USER, message: 'User cancelled');
      }

      if (loginResult.status == FacebookLoginStatus.error) {
        throw LoginException(
            code: LoginException.CODE, subCode: LoginException.FACEBOOK_LOGIN_ERROR, message: loginResult.error);
      }

      CognitoCredentials _credential = await _service.loginWithCredentials(loginResult.accessToken.token, 'graph.facebook.com');
      print('***** AwsSocialLoginProvider.signInWithFacebook().sessionToken=${_credential.sessionToken}');

      // final credentials = Credentials(
      //   'eu-west-1:fbba3fff-b79b-46c6-af14-e4970ea092fe', // amplifyconfig.cognitoIdentityPoolId,
      //   'eu-west-1_Q2jSP0Dr8', // amplifyconfig.cognitoUserPoolId,
      //   '4keehn0k91r435im3k0e7vgotb', // amplifyconfig.cognitoClientId,
      //   loginResult.accessToken.token,
      //   'graph.facebook.com',
      // );
      // CognitoSignInResult res = await Amplify.Auth.signInWithWebUI(provider: AuthProvider.facebook);
      print(
          '***** AwsSocialLoginProvider.signInWithFacebook().CognitoSignInResult.isSignedIn=${_credential?.userIdentityId}');
      //
      User user = await _authProvider.getAuthenticatedUserProfile();
      return ProviderLoginResponse(
        credential: null,
        user: user,
      );
    } on Exception catch (e) {
      print('***** AwsSocialLoginProvider.signInWithFacebook().Exception=$e');
      throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    }
  }

  @override
  Future<ProviderLoginResponse> signInWithGoogle() async {
    print('***** AwsSocialLoginProvider.signInWithGoogle()');
    // try {
    //   CognitoSignInResult res = await Amplify.Auth.signInWithWebUI(provider: AuthProvider.google);
    //   print('***** AwsSocialLoginProvider.signInWithGoogle().CognitoSignInResult.isSignedIn=${res?.isSignedIn}');
    //   //
    //   User user = await _authProvider.getAuthenticatedUserProfile();
    //   return ProviderLoginResponse(
    //     credential: null,
    //     user: user,
    //   );
    // } on AuthException catch (e) {
    //   print('***** AwsSocialLoginProvider.signInWithGoogle().AuthException=$e');
    //   throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    // } on Exception catch (e) {
    //   print('***** AwsSocialLoginProvider.signInWithGoogle().Exception=$e');
    //   throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
    // }
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
