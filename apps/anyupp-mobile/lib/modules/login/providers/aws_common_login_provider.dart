import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify.dart';

import 'common_login_provider_interface.dart';

class AwsCommonLoginProvider implements ICommonLoginProvider {
  
  @override
  Future<void> logoutFromBackend() {
    try {
      return Amplify.Auth.signOut();
    } on AuthException catch (e) {
      print(e.message);
      rethrow;
    }
  }
}
