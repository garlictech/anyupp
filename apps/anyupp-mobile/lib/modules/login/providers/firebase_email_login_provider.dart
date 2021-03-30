
// TODO AWS REMOVED
// import 'package:fa_prev/modules/login/login.dart';
// import 'package:fa_prev/modules/login/providers/email_login_provider_interface.dart';
// import 'package:fa_prev/shared/auth.dart';
// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:flutter/services.dart';
// import 'package:shared_preferences/shared_preferences.dart';

// class FirebaseEmailLoginProvider implements IEmailLoginProvider {
//   final FirebaseAuth _firebaseAuth;
//   final IUserProvider _firebaseUserProvider;

//   FirebaseEmailLoginProvider(this._firebaseAuth, this._firebaseUserProvider);

//   @override
//   Future<ProviderLoginResponse> registerUserWithEmailAndPassword(String email, String password) async {
//     print('registerUserWithEmailAndPassword().start().email=$email');
//     try {
//       AuthResult authResult = await _firebaseAuth.createUserWithEmailAndPassword(email: email, password: password);
//       // print('registerUserWithEmailAndPassword().authResult=$authResult');

//       final User user = User(
//         id: authResult.user.uid,
//         name: _getNameFromEmailAddress(email),
//         login: LoginMethod.EMAIL,
//       );

//       await _firebaseUserProvider.createOrUpdateFirebaseUser(authResult.user.uid, user);

//       return ProviderLoginResponse(credential: null, user: user);
//     } on PlatformException catch (e) {
//       throw LoginException.fromPlatformException(e);
//     } on Exception catch (e) {
//       throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
//     }
//   }

//   @override
//   Future<ProviderLoginResponse> loginWithEmailAndPassword(String email, String password) async {
//     print('loginWithEmailAndPassword().start().email=$email');
//     try {
//       AuthResult authResult = await _firebaseAuth.signInWithEmailAndPassword(email: email, password: password);
//       // print('loginWithEmailAndPassword().authResult=$authResult');
//       final User user = User(
//         id: authResult.user.uid,
//         name: _getNameFromEmailAddress(email),
//         login: LoginMethod.EMAIL,
//       );
//       return ProviderLoginResponse(credential: null, user: user);
//     } on PlatformException catch (e) {
//       throw LoginException.fromPlatformException(e);
//     } on Exception catch (e) {
//       throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
//     }
//   }

//   @override
//   Future<void> sendSignInLinkToEmail(String email) async {
//     print('sendSignInLinkToEmail()=$email');
//     try {
//       SharedPreferences sp = await SharedPreferences.getInstance();
//       await sp.remove('auth_email');
//       await _firebaseAuth.sendSignInWithEmailLink(
//         email: email,
//         url: 'https://anyuppdev.page.link',
//         handleCodeInApp: true,
//         iOSBundleID: 'net.cyberg.anyupp',
//         androidPackageName: 'net.cyberg.anyupp',
//         androidInstallIfNotAvailable: true,
//         androidMinimumVersion: '1',
//       );
//       await sp.setString('auth_email', email);
//     } on PlatformException catch (e) {
//       throw LoginException.fromPlatformException(e);
//     } on Exception catch (e) {
//       throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
//     }
//   }

//   @override
//   Future<String> get email async => (await SharedPreferences.getInstance()).getString('auth_email');

//   @override
//   Future<bool> isSignInWithEmailLink(String emailLink) async {
//     return _firebaseAuth.isSignInWithEmailLink(emailLink);
//   }

//   @override
//   Future<ProviderLoginResponse> signInWithEmailLink(String email, String emailLink) async {
//     print('signInWithEmailLink().email=$email');
//     try {
//       AuthResult authResult = await _firebaseAuth.signInWithEmailAndLink(email: email, link: emailLink);
//       // print('signInWithEmailLink().success=$authResult');
//        final User user = User(
//         id: authResult.user.uid,
//         name: _getNameFromEmailAddress(email),
//         email: email,
//         login: LoginMethod.EMAIL,
//       );
//       await _firebaseUserProvider.createOrUpdateFirebaseUser(
//         authResult.user.uid,
//         user,
//       );
//       return ProviderLoginResponse(
//         credential: null,
//         user: user,
//       );

//     } on PlatformException catch (e) {
//       throw LoginException.fromPlatformException(e);
//     } on Exception catch (e) {
//       throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
//     }
//   }

//   @override
//   Future<void> sendPasswordResetEmail(String email) async {
//     print('sendPasswordResetEmail().email=$email');
//     try {
//       await _firebaseAuth.sendPasswordResetEmail(email: email);
//     } on PlatformException catch (e) {
//       throw LoginException.fromPlatformException(e);
//     } on Exception catch (e) {
//       throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
//     }
//   }

//   String _getNameFromEmailAddress(String email) {
//     return email.split('@')?.first;
//   }
// }
