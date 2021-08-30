import 'phone_login_provider_interface.dart';

class AwsPhoneLoginProvider implements IPhoneLoginProvider {
  @override
  Future<void> signInWithPhone(String phoneNumber, bool linkAccount) {
    throw UnimplementedError();
  }

  @override
  Future<void> validateSMSCodeWithPhone(String verificationId, String smsCode) {
    throw UnimplementedError();
  }
}
