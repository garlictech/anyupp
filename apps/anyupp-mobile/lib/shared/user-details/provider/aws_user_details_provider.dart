import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/graphql/graphql.dart';
import '/models/User.dart';
import '/modules/login/login.dart';
import '/shared/auth/auth.dart';
import '/shared/user-details/user_details.dart';

class AwsUserDetailsProvider implements IUserDetailsProvider {
  final IAuthProvider _authProvider;

  AwsUserDetailsProvider(this._authProvider);

  @override
  Future<User?> getUserDetails() async {
    User? user = await _authProvider.getAuthenticatedUserProfile();
    if (user == null) {
      throw LoginException(
          code: LoginException.INVALID_CREDENTIALS,
          message: 'No user logged in. User is null.');
    }

    var result = await GQL.amplify.execute(GetUserQueryQuery(
        variables: GetUserQueryArguments(
      userId: user.id,
    )));

    if (result.data == null || result.data?.getUser == null) {
      return null;
    }

    if (result.hasErrors) {
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
    }

    log.d('getUserDetails().data=${result.data}');
    return User.fromJson(result.data!.getUser!.toJson());
  }
}
