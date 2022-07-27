import '/modules/login/login.dart';

abstract class ISocialLoginProvider {
  // Future<ProviderLoginResponse> signInWithProvider(LoginMethod method);

  // Future<ProviderLoginResponse> signInWithGoogle();

  // Future<ProviderLoginResponse> signInWithApple();

  // Future<ProviderLoginResponse> signInWithFacebook();

  // Future<ProviderLoginResponse> signInAnonymously();

  Future<void> logout();

  Future<List<LoginMethod>> fetchSignInMethodsForEmail(String email);

  bool isFederated(LoginMethod method);

  Future<ProviderLoginResponse> signUserInWithAuthCode(String authCode);
}
