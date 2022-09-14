import '/models/User.dart';
import '/shared/user-details/user_details.dart';

class UserDetailsRepository implements IUserDetailsProvider {
  final IUserDetailsProvider _userDetailsProvider;

  UserDetailsRepository(this._userDetailsProvider);

  @override
  Future<User?> getUserDetails() {
    return _userDetailsProvider.getUserDetails();
  }
}
