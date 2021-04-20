import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/models.dart';

abstract class IAuthProvider {
  Stream<User> getAuthenticatedUserProfileStream();
  Future<User> getAuthenticatedUserProfile();
  // Stream<AuthenticatedUser> get authenticatedUser;
  Future<void> cancel();
  Future<String> getAccessToken();
  Future<String> getIdToken();
  Future<void> clearUserSession();
  Future<void> setCredentials(User user, CognitoCredentials credentials);
}
