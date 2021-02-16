import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/login/providers/common_login_provider_interface.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/services.dart';

class FirebasePhoneLoginProvider implements IPhoneLoginProvider {

  final IUserProvider _firebaseUserProvider;
  final FirebaseAuth _firebaseAuth;
  final ICommonLoginProvider _commonLoginProvider;

  FirebasePhoneLoginProvider(this._firebaseAuth, this._firebaseUserProvider, this._commonLoginProvider);

  String _phoneNumber;

  @override
  Future<void> signInWithPhone(String phoneNumber, bool linkAccount) {
    print('***** signInWithPhone()=$phoneNumber, linkAccount=$linkAccount');
    _phoneNumber = phoneNumber;
    return _firebaseAuth.verifyPhoneNumber(
      phoneNumber: _phoneNumber,
      timeout: Duration(minutes: 2),
      verificationCompleted: (AuthCredential phoneAuthCredential) async {
        print('**** signInWithPhone.verificationCompleted().linkAccount=$linkAccount');
        try {
          if (!linkAccount) {
            // Create user
            print('**** signInWithPhone.verificationCompleted().createUser()');
            await _createUserFromPhoneWithCredentials(phoneAuthCredential, _phoneNumber);
            getIt<LoginBloc>().add(PhoneLoginSuccess());
          } else {
            // Link credential to existing user
            print('**** signInWithPhone.verificationCompleted().linkCredential()=$phoneNumber');
            await _linkUserWithPhoneToExistingUser(phoneAuthCredential, _phoneNumber);
            getIt<LoginBloc>().add(PhoneLoginSuccess());
          }
        } on PlatformException catch (pe) {
          print('**** signInWithPhone.verificationCompleted().PlatformException()=$pe');
          getIt<LoginBloc>().add(LoginErrorOccured(pe.code, pe.message));
        }
      },
      verificationFailed: (AuthException error) {
        print('**** signInWithPhone.verificationFailed()=$error');
        getIt<LoginBloc>().add(LoginErrorOccured(error.code, error.message));
      },
      codeSent: (String verificationId, [int forceResendingToken]) {
        print('**** signInWithPhone.codeSent()=$verificationId, phoneNumber=$_phoneNumber');
        getIt<LoginBloc>().add(LoginWithPhoneSMSCodeArrived(verificationId, _phoneNumber));
      },
      codeAutoRetrievalTimeout: (String verificationId) {
        print('**** signInWithPhone.codeAutoRetrievalTimeout()=$verificationId');
        getIt<LoginBloc>().add(LoginErrorOccured(LoginException.LOGIN_PHONE_SMS_TIMEOUT, verificationId));
      },
    );
  }

  @override
  Future<void> validateSMSCodeWithPhone(String verificationId, String smsCode) async {
    if (_phoneNumber == null) {
      throw PlatformException(
          code: 'PHONE_NUMBER_EMPTY', message: 'Phone number must be set before call validateSMSCodeWithPhone()');
    }
    var phoneAuthCredential = PhoneAuthProvider.getCredential(verificationId: verificationId, smsCode: smsCode);
    await _createUserFromPhoneWithCredentials(phoneAuthCredential, _phoneNumber);
  }

  Future<void> _createUserFromPhoneWithCredentials(AuthCredential credentials, String username) async {
    AuthResult authResult = await _firebaseAuth.signInWithCredential(credentials);
    await _firebaseUserProvider.createOrUpdateFirebaseUser(
        authResult.user.uid,
        User(
          id: authResult.user.uid,
          name: username,
          login: LoginMethod.PHONE,
        ));
  }

  Future<void> _linkUserWithPhoneToExistingUser(AuthCredential credentials, String username) async {
    print('_linkUserWithPhoneToExistingUser()=$username');
    User user = User(
      name: username,
      login: LoginMethod.PHONE,
    );
    await _commonLoginProvider.linkCredentialsToFirebaseUser(credentials, user);
  }
}
