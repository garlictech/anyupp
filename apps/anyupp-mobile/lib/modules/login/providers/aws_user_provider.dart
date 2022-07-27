import '/models/User.dart';
import 'user_provider_interface.dart';

class AwsUserProvider implements IUserProvider {
  @override
  Future<User> getAuthenticatedUserProfile() {
    throw UnimplementedError();
  }

  @override
  Stream<User> getAuthenticatedUserProfileStream() {
    throw UnimplementedError();
  }

  @override
  Future<void> logoutUser() {
    throw UnimplementedError();
  }

  @override
  Future<bool> saveUserProfile(User user) {
    throw UnimplementedError();
  }
}
