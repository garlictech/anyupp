import 'package:fa_prev/models/User.dart';
import 'user_provider_interface.dart';

class AwsUserProvider implements IUserProvider {

  @override
  Future<User> getAuthenticatedUserProfile() {
    // TODO: implement getAuthenticatedUserProfile
    throw UnimplementedError();
  }

  @override
  Stream<User> getAuthenticatedUserProfileStream() {
    // TODO: implement getAuthenticatedUserProfileStream
    throw UnimplementedError();
  }

  @override
  Future<void> logoutUser() {
    // TODO: implement logoutUser
    throw UnimplementedError();
  }

  @override
  Future<bool> saveUserProfile(User user) {
    // TODO: implement saveUserProfile
    throw UnimplementedError();
  }
}
