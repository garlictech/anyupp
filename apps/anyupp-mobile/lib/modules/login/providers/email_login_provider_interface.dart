import 'package:fa_prev/modules/login/login.dart';

abstract class IEmailLoginProvider {
  Future<bool> registerUserWithEmailAndPassword(String email, String password);
  Future<ProviderLoginResponse> loginWithEmailAndPassword(
      String email, String password);
  Future<void> sendSignInLinkToEmail(String email);
  Future<String> get email;
  Future<bool> isSignInWithEmailLink(String emailLink);
  Future<ProviderLoginResponse> signInWithEmailLink(
      String email, String emailLink);
  Future<void> sendPasswordResetEmail(String email);
  Future<void> confirmSignUp(String user, String code);
}
