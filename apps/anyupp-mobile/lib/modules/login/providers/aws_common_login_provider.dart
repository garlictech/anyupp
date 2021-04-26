import 'package:fa_prev/shared/auth.dart';

import 'common_login_provider_interface.dart';
class AwsCommonLoginProvider implements ICommonLoginProvider {

  final IAuthProvider _provider;
  final CognitoService _service;

  AwsCommonLoginProvider(this._provider, this._service);

  @override
  Future<void> logoutFromBackend() async {
    try {
      await _provider.clearUserSession();
      await _service.signOut();
    } on Exception catch (e) {
      print('logoutFromBackend().error=$e');
      rethrow;
    }
  }
}
