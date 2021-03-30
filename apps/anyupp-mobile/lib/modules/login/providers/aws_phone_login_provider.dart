import 'phone_login_provider_interface.dart';

class AwsPhoneLoginProvider implements IPhoneLoginProvider {
  @override
  Future<void> signInWithPhone(String phoneNumber, bool linkAccount) {
      // TODO: implement signInWithPhone
      throw UnimplementedError();
    }
  
    @override
    Future<void> validateSMSCodeWithPhone(String verificationId, String smsCode) {
    // TODO: implement validateSMSCodeWithPhone
    throw UnimplementedError();
  }
}
