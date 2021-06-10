import 'package:fa_prev/models/User.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';

class UserDetailsRepository implements IUserDetailsProvider {

  final IUserDetailsProvider _userDetailsProvider;

  UserDetailsRepository(this._userDetailsProvider);

  @override
  Future<User> getUserDetails() {
    return _userDetailsProvider.getUserDetails();
  }
}
