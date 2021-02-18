import 'package:fa_prev/shared/auth.dart';

abstract class IAuthProvider {
  Stream<User> getAuthenticatedUserProfileStream();
  Future<User> getAuthenticatedUserProfile();
  // Stream<AuthenticatedUser> get authenticatedUser;
  Future<void> cancel();
}
