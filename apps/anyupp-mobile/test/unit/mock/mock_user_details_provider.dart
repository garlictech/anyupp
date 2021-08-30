import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/User.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';

import 'mock_data.dart';

class MockUserDetailsProvider implements IUserDetailsProvider {
  final IAuthProvider _authProvider;

  MockUserDetailsProvider(this._authProvider);

  @override
  Future<User> getUserDetails() async {
    User? user = await _authProvider.getAuthenticatedUserProfile();
    return MOCK_USER(user!.id);
  }
}
