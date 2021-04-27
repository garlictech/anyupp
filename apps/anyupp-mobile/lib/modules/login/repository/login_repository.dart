import 'package:shared_preferences/shared_preferences.dart';
import 'package:fa_prev/modules/login/login.dart';

class LoginRepository implements ISocialLoginProvider, IEmailLoginProvider {
  final ICommonLoginProvider _commonLoginProvider;
  final ISocialLoginProvider _socialLoginProvider;
  final IEmailLoginProvider _emailLoginProvider;

  LoginRepository(
    this._commonLoginProvider,
    this._socialLoginProvider,
    this._emailLoginProvider,
  );

  @override
  Future<bool> get appleSignInAvailable =>
      _socialLoginProvider.appleSignInAvailable;

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
  Future<String> get email => _emailLoginProvider.email;

  @override
  Future<ProviderLoginResponse> loginWithEmailAndPassword(
      String email, String password) {
    return _emailLoginProvider.loginWithEmailAndPassword(email, password);
  }

  @override
  Future<bool> registerUserWithEmailAndPassword(
      String userEmail, String userPhone, String email, String password) {
    return _emailLoginProvider.registerUserWithEmailAndPassword(
        userEmail, userPhone, email, password);
  }

  /// Logout the user from the backend and all Social platforms
  Future<void> logout() async {
    return Future.wait([
      (await SharedPreferences.getInstance()).clear(),
      _commonLoginProvider.logoutFromBackend(),
      _socialLoginProvider.logout(),
    ]);
  }

  @override
  Future<bool> sendPasswordResetEmail(String email) {
    return _emailLoginProvider.sendPasswordResetEmail(email);
  }

  @override
  Future<bool> confirmSignUp(String user, String code) {
    return _emailLoginProvider.confirmSignUp(user, code);
  }

  @override
  Future<bool> resendConfirmationCode(String user) {
    return _emailLoginProvider.resendConfirmationCode(user);
  }

  @override
  Future<bool> confirmPassword(
      String userName, String code, String newPassword) {
    return _emailLoginProvider.confirmPassword(userName, code, newPassword);
  }
}
