import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models/User.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';

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
