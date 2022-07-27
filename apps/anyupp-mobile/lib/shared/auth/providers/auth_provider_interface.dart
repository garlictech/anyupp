import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import '/models.dart';

abstract class IAuthProvider {
  Stream<User?> getAuthenticatedUserProfileStream();
  Future<User?> getAuthenticatedUserProfile();
  Future<void> cancel();
  Future<String?> getAccessToken();
  Future<String?> getIdToken();
  Future<void> clearUserSession();
  Future<User?> loginWithCognitoSession(CognitoUserSession session, String username);
}
