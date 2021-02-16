import 'package:firebase_auth_platform_interface/firebase_auth_platform_interface.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';

class LoginRepository implements ICommonLoginProvider, IPhoneLoginProvider, ISocialLoginProvider, IEmailLoginProvider {
  final IUserProvider _userProvider;
  final ICommonLoginProvider _commonLoginProvider;
  final ISocialLoginProvider _socialLoginProvider;
  final IPhoneLoginProvider _phoneLoginProvider;
  final IEmailLoginProvider _emailLoginProvider;

  LoginRepository(
    this._userProvider,
    this._commonLoginProvider,
    this._socialLoginProvider,
    this._emailLoginProvider,
    this._phoneLoginProvider,
  );

  Future<void> signInWithPhone(String phoneNumber, bool linkAccount) async {
    return _phoneLoginProvider.signInWithPhone(phoneNumber, linkAccount);
  }

  Future<void> validateSMSCodeWithPhone(String verificationId, String smsCode) async {
    return _phoneLoginProvider.validateSMSCodeWithPhone(verificationId, smsCode);
  }

  @override
  Future<bool> get appleSignInAvailable => _socialLoginProvider.appleSignInAvailable;

  @override
  bool isFederated(LoginMethod method) {
    return _socialLoginProvider.isFederated(method);
  }

  @override
  Future<ProviderLoginResponse> signInAnonymously() {
    return _socialLoginProvider.signInAnonymously();
  }

  @override
  Future<ProviderLoginResponse> signInWithApple() {
    return _socialLoginProvider.signInWithApple();
  }

  @override
  Future<ProviderLoginResponse> signInWithFacebook() {
    return _socialLoginProvider.signInWithFacebook();
  }

  @override
  Future<ProviderLoginResponse> signInWithGoogle() {
    return _socialLoginProvider.signInWithGoogle();
  }

  @override
  Future<ProviderLoginResponse> signInWithProvider(LoginMethod method) {
    return _socialLoginProvider.signInWithProvider(method);
  }

  @override
  Future<List<LoginMethod>> fetchSignInMethodsForEmail(String email) {
    return _socialLoginProvider.fetchSignInMethodsForEmail(email);
  }

  @override
  Future<User> signInWithCredentialAndUpdateFirebaseUser(Object credential, User user) {
    return _commonLoginProvider.signInWithCredentialAndUpdateFirebaseUser(credential, user);
  }

  @override
  Future<void> linkAccountToFirebaseUser(String email, AuthCredential credential) {
    return _commonLoginProvider.linkAccountToFirebaseUser(email, credential);
  }

  @override
  Future<void> linkCredentialsToFirebaseUser(AuthCredential credential, User user) {
    return _commonLoginProvider.linkCredentialsToFirebaseUser(credential, user);
  }

  @override
  Future<void> unlinkProviderToFirebaseUser(LoginMethod method) {
    return _commonLoginProvider.unlinkProviderToFirebaseUser(method);
  }

  @override
  Future<String> get email => _emailLoginProvider.email;

  @override
  Future<bool> isSignInWithEmailLink(String emailLink) {
    return _emailLoginProvider.isSignInWithEmailLink(emailLink);
  }

  @override
  Future<ProviderLoginResponse> loginWithEmailAndPassword(String email, String password) {
    return _emailLoginProvider.loginWithEmailAndPassword(email, password);
  }

  @override
  Future<ProviderLoginResponse> registerUserWithEmailAndPassword(String email, String password) {
    return _emailLoginProvider.registerUserWithEmailAndPassword(email, password);
  }

  @override
  Future<void> sendSignInLinkToEmail(String email) {
    return _emailLoginProvider.sendSignInLinkToEmail(email);
  }

  @override
  Future<ProviderLoginResponse> signInWithEmailLink(String email, String emailLink) {
    return _emailLoginProvider.signInWithEmailLink(email, emailLink);
  }

    /// Logout the user from the Firebase and all Social platforms
  Future<void> logout() async {
    return Future.wait([
      (await SharedPreferences.getInstance()).clear(),
      _userProvider.logoutUser(),
      _socialLoginProvider.logout(),
    ]);
  }

  @override
  Future<void> sendPasswordResetEmail(String email) {
    return _emailLoginProvider.sendPasswordResetEmail(email);
  }
}
