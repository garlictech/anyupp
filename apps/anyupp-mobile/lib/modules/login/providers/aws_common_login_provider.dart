import '/core/core.dart';
import '/shared/auth.dart';

import 'common_login_provider_interface.dart';

class AwsCommonLoginProvider implements ICommonLoginProvider {
  final IAuthProvider _provider;
  final CognitoService _service;

  AwsCommonLoginProvider(this._provider, this._service);

  @override
  Future<void> logoutFromBackend() async {
    try {
      await _service.signOut();
      await _provider.clearUserSession();
    } on Exception catch (e) {
      log.e('logoutFromBackend().error=$e');
      rethrow;
    }
  }
}
