import 'package:fa_prev/models.dart';

abstract class IUserDetailsProvider {

  Future<User> getUserDetails();
}
