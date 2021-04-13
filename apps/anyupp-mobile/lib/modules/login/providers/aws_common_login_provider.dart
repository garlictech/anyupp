import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/shared/auth.dart';

import 'common_login_provider_interface.dart';
class AwsCommonLoginProvider implements ICommonLoginProvider {

  final IAuthProvider _provider;

  AwsCommonLoginProvider(this._provider);

  @override
  Future<void> logoutFromBackend() async {
    // try {
    //   CognitoService service = getIt<CognitoService>();
    //   CognitoUser user = await service.currentUser;
    //   print('logoutFromBackend().user=$user');
    //   await user?.signOut();
    //   await user?.globalSignOut();
    // } on Exception catch (e) {
    try {
      await _provider.clearUserSession();
      return Amplify.Auth.signOut();
    } on AuthException catch (e) {
      print('logoutFromBackend().error=$e');
      rethrow;
    }
  }
}
