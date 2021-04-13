import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify.dart';

import 'common_login_provider_interface.dart';

class CognitoSignOutOptions extends SignOutOptions {
  Map<String, dynamic> serializeAsMap() {
    return {
      
    };
  }
}
class AwsCommonLoginProvider implements ICommonLoginProvider {
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

      return Amplify.Auth.signOut();
    } on AuthException catch (e) {
      print('logoutFromBackend().error=$e');
      rethrow;
    }
  }
}
