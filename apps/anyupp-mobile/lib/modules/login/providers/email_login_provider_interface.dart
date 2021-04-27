import 'package:fa_prev/modules/login/login.dart';

abstract class IEmailLoginProvider {
  Future<bool> registerUserWithEmailAndPassword(
      String userEmail, String userPhone, String email, String password);
  Future<ProviderLoginResponse> loginWithEmailAndPassword(
      String email, String password);
  Future<String> get email;
  Future<void> sendPasswordResetEmail(String email);
  Future<bool> confirmSignUp(String user, String code);
  Future<bool> resendConfirmationCode(String user);
}
