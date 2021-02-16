import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:firebase_auth/firebase_auth.dart';

abstract class ICommonLoginProvider {
  
  Future<User> signInWithCredentialAndUpdateFirebaseUser(AuthCredential credential, User user);

  Future<void> linkAccountToFirebaseUser(String email, AuthCredential credential);

  Future<void> linkCredentialsToFirebaseUser(AuthCredential credential, User user);

  Future<void> unlinkProviderToFirebaseUser(LoginMethod method);
}
