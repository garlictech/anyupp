import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models/User.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class AwsUserDetailsProvider implements IUserDetailsProvider {
  final IAuthProvider _authProvider;

  AwsUserDetailsProvider(this._authProvider);

  @override
  Future<User> getUserDetails() async {
    User user = await _authProvider.getAuthenticatedUserProfile();

    QueryResult result = await GQL.amplify.executeQuery(
      query: QUERY_GET_USER_BY_ID,
      variables: {'userId': user.id},
    );

    if (result.data == null || result.data['getUser'] == null) {
      return null;
    }

    return User.fromJson(result.data);
  }
}
