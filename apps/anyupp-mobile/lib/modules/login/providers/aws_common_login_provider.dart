import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/auth/auth.dart';

import 'common_login_provider_interface.dart';

class AwsCommonLoginProvider implements ICommonLoginProvider {
  
  @override
  Future<void> logoutFromBackend() async {
    try {
      CognitoService service = getIt<CognitoService>();
      CognitoUser user = await service.currentUser;
      print('logoutFromBackend().user=$user');
      await user?.signOut();
      await user?.globalSignOut();
    } on Exception catch (e) {
      print('logoutFromBackend().error=$e');
      rethrow;
    }
  }
}
