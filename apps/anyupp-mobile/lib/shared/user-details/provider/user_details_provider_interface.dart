import '/models.dart';

abstract class IUserDetailsProvider {
  Future<User?> getUserDetails();
}
