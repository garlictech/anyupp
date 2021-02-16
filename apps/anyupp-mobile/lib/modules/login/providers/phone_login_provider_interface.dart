abstract class IPhoneLoginProvider {
  Future<void> signInWithPhone(String phoneNumber, bool linkAccount);

  Future<void> validateSMSCodeWithPhone(String verificationId, String smsCode);
}
