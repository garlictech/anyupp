import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models/User.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';

class AwsUserDetailsProvider implements IUserDetailsProvider {
  final IAuthProvider _authProvider;

  AwsUserDetailsProvider(this._authProvider);

  @override
  Future<User> getUserDetails() async {
    User user = await _authProvider.getAuthenticatedUserProfile();

    var result = await GQL.amplify.execute(GetUserQueryQuery(
        variables: GetUserQueryArguments(
      userId: user.id,
    )));

    // QueryResult result = await GQL.amplify.executeQuery(
    //   query: QUERY_GET_USER_BY_ID,
    //   variables: {'userId': user.id},
    // );

    if (result.data == null || result.data.getUser == null) {
      return null;
    }
    print('getUserDetails().data=${result.data}');
    return User.fromJson(result.data.getUser.toJson());
  }
}
