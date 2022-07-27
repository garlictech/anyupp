import '/models.dart';

abstract class IUserProvider {
  Stream<User> getAuthenticatedUserProfileStream();
  Future<User> getAuthenticatedUserProfile();
  Future<bool> saveUserProfile(User user);
  Future<void> logoutUser();
}
