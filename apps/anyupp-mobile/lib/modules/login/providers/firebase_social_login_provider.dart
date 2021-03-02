
// TODO AWS REMOVED
// import 'package:apple_sign_in/apple_sign_in.dart';
// import 'package:fa_prev/modules/login/login.dart';
// import 'package:fa_prev/shared/auth.dart';
// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:flutter/services.dart';
// import 'package:flutter_login_facebook/flutter_login_facebook.dart';
// import 'package:google_sign_in/google_sign_in.dart';

// class FirebaseSocialLoginProvider implements ISocialLoginProvider {
//   // TODO ezt kivinni ENV-be
//   static const String FACEBOOK_API_ROOT = 'https://graph.facebook.com/v2.12/me';
//   static const String FACEBOOK_FIELDS = 'name,first_name,last_name,email,picture';

//   final IUserProvider _firebaseUserProvider;
//   final FirebaseCommonLoginProvider _firebaseCommonProvider;
//   final FirebaseAuth _firebaseAuth;
//   final GoogleSignIn _googleSignIn;
//   final FacebookLogin _facebookLogin;

//   FirebaseSocialLoginProvider(this._firebaseAuth, this._googleSignIn, this._facebookLogin, this._firebaseUserProvider,
//       this._firebaseCommonProvider);

//   @override
//   Future<ProviderLoginResponse> signInWithProvider(LoginMethod method) async {
//     ProviderLoginResponse response;
//     if (method == LoginMethod.FACEBOOK) {
//       response = await signInWithFacebook();
//     } else if (method == LoginMethod.GOOGLE) {
//       response = await signInWithGoogle();
//     } else if (method == LoginMethod.APPLE) {
//       response = await signInWithApple();
//     }
//     if (response == null) {
//       throw LoginException(
//           code: LoginException.CODE,
//           subCode: LoginException.ERROR_LOGIN_INVALID_PROVIDER,
//           message: 'The given provider($method) is not a Social provider!');
//     }

//     try {
//       await _firebaseCommonProvider.signInWithCredentialAndUpdateFirebaseUser(response.credential, response.user);
//     } on LoginException catch (le) {
//       print('*** FirebaseSocialLoginProvider().federated.loginexception=${le.subCode}');
//       // --- Handle Account linking!
//       if (le.subCode == LoginException.ERROR_ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL) {
//         final existingMethods = await fetchSignInMethodsForEmail(response.user.email);
//         print('*** FirebaseSocialLoginProvider().federated.existingMethods=$existingMethods');
//         // yield NeedAccountLinking(loginResponse.credential, existingMethods);
//         return response;
//       }
//       rethrow;
//     } on Exception catch (e) {
//       print('*** FirebaseSocialLoginProvider().federated.exception=$e');
//        throw LoginException.fromException(LoginException.UNKNOWN_ERROR, e);
//     }

//     return response;
//   }

//   @override
//   Future<ProviderLoginResponse> signInWithGoogle() async {
//     try {
//       final GoogleSignInAccount googleUser = await _googleSignIn.signIn();
//       if (googleUser == null) {
//         //--- User cancel the login
//         throw LoginException(
//             code: LoginException.CODE, subCode: LoginException.LOGIN_CANCELLED_BY_USER, message: 'User cancelled');
//       }
//       final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
//       final AuthCredential credential = GoogleAuthProvider.getCredential(
//         accessToken: googleAuth.accessToken,
//         idToken: googleAuth.idToken,
//       );
//       return ProviderLoginResponse(
//         credential: credential,
//         user: User(
//           email: googleUser.email,
//           name: googleUser.displayName,
//           profileImage: googleUser.photoUrl,
//           login: LoginMethod.GOOGLE,
//         ),
//       );
//     } on LoginException {
//       rethrow;
//     } on PlatformException catch (error) {
//       throw LoginException.fromPlatformException(error);
//     } on Exception catch (error) {
//       throw LoginException.fromException(LoginException.UNKNOWN_ERROR, error);
//     }
//   }

//   @override
//   Future<ProviderLoginResponse> signInWithFacebook() async {
//     try {
//       print('**** signInWithFacebook().start()');
//       final loginResult = await _facebookLogin.logIn(permissions: [
//         FacebookPermission.publicProfile,
//         FacebookPermission.email,
//       ]);
//       print('**** signInWithFacebook().facebookLoginResult=$loginResult');
//       if (loginResult.status == FacebookLoginStatus.cancel) {
//         throw LoginException(
//             code: LoginException.CODE, subCode: LoginException.LOGIN_CANCELLED_BY_USER, message: 'User cancelled');
//       }

//       if (loginResult.status == FacebookLoginStatus.error) {
//         throw LoginException(
//             code: LoginException.CODE, subCode: LoginException.FACEBOOK_LOGIN_ERROR, message: loginResult.error);
//       }

//       final AuthCredential credential = FacebookAuthProvider.getCredential(
//         accessToken: loginResult.accessToken.token,
//       );
//       print('**** signInWithFacebook().credential=$credential');

//       print('**** signInWithFacebook().getProfile().start()');
//       final FacebookUserProfile profile = await _facebookLogin.getUserProfile();
//       print('**** signInWithFacebook().getProfile(): $profile');
//       final String email = await _facebookLogin.getUserEmail();
//       print('**** signInWithFacebook().email(): $email');
//       final String profileImageUrl = await _facebookLogin.getProfileImageUrl(width: 100);
//       print('**** signInWithFacebook().profileImageUrl(): $profileImageUrl');

//       return ProviderLoginResponse(
//         credential: credential,
//         user: User(
//           email: email,
//           name: profile.name,
//           profileImage: profileImageUrl,
//           login: LoginMethod.FACEBOOK,
//         ),
//       );
//     } on LoginException {
//       rethrow;
//     } on PlatformException catch (error) {
//       throw LoginException.fromPlatformException(error);
//     } on Exception catch (error) {
//       throw LoginException.fromException(LoginException.UNKNOWN_ERROR, error);
//     }
//   }

//   @override
//   Future<ProviderLoginResponse> signInWithApple() async {
//     try {
//       final AuthorizationResult appleResult = await AppleSignIn.performRequests([
//         AppleIdRequest(requestedScopes: [Scope.email, Scope.fullName])
//       ]);

//       if (appleResult.error != null) {
//         throw LoginException(
//           code: LoginException.CODE,
//           subCode: 'APPLE_LOGIN_${appleResult.error.code}',
//           message: appleResult.error.localizedFailureReason,
//           details: appleResult.error.localizedDescription,
//         );
//       }

//       if (appleResult?.credential == null) {
//         throw LoginException(code: LoginException.CODE, subCode: LoginException.APPLE_LOGIN_NO_CREDENTIAL);
//       }

//       final AuthCredential credential = OAuthProvider(providerId: 'apple.com').getCredential(
//         accessToken: String.fromCharCodes(appleResult.credential.authorizationCode),
//         idToken: String.fromCharCodes(appleResult.credential.identityToken),
//       );

//       final AppleIdCredential appleCredential = appleResult.credential;

//       final String name = (appleCredential.fullName != null && appleCredential.fullName.familyName != null
//               ? '${appleCredential.fullName.familyName} ${appleCredential.fullName.givenName}'
//               : appleCredential.email) ??
//           'Apple User';
//       print('Apple login:$name');

//       return ProviderLoginResponse(
//         credential: credential,
//         user: User(
//           email: appleCredential.email,
//           name: name,
//           login: LoginMethod.APPLE,
//         ),
//       );
//     } on PlatformException catch (error) {
//       throw LoginException.fromPlatformException(error);
//     } on Exception catch (error) {
//       throw LoginException.fromException(LoginException.UNKNOWN_ERROR, error);
//     }
//   }

//   @override
//   Future<ProviderLoginResponse> signInAnonymously() async {
//     try {
//       AuthResult authResult = await _firebaseAuth.signInAnonymously();
//       final User user = User(
//         id: authResult.user.uid,
//         name: 'Anonymous',
//         login: LoginMethod.ANONYMOUS,
//       );
//       await _firebaseUserProvider.createOrUpdateFirebaseUser(
//         authResult.user.uid,
//         user,
//       );
//       return ProviderLoginResponse(
//         credential: null,
//         user: user,
//       );
//     } on PlatformException catch (error) {
//       throw LoginException.fromPlatformException(error);
//     } on Exception catch (error) {
//       throw LoginException.fromException(LoginException.UNKNOWN_ERROR, error);
//     }
//   }

//   /// Get all the  used sign in methods in the firebase for the user (list of facebook.com, google.com, apple.com etc...)
//   @override
//   Future<List<LoginMethod>> fetchSignInMethodsForEmail(String email) async {
//     if (email == null) {
//       // Should be anonymous
//       return [];
//     }

//     List<String> existingProviders = await _firebaseAuth.fetchSignInMethodsForEmail(email: email);
//     print('**** fetchSignInMethodsForEmail().existingProviders=$existingProviders');
//     List<LoginMethod> existingMethods = existingProviders?.map((provider) {
//       return LoginMethodUtils.stringToMethod(provider);
//     })?.toList();

//     existingMethods ??= List<LoginMethod>(); // Set empty List instead of null

//     return existingMethods;
//   }

//   /// Return true if the login method is federated login (facebook, google or apple)
//   @override
//   bool isFederated(LoginMethod method) {
//     return method == LoginMethod.APPLE || method == LoginMethod.FACEBOOK || method == LoginMethod.GOOGLE;
//   }

//   /// Logout the user from the Firebase and all Social platforms
//   @override
//   Future<void> logout() async {
//     return Future.wait([
//       _googleSignIn.signOut(),
//       _facebookLogin.logOut(),
//     ]);
//   }

//   /// Check if the Apple login is available on the device
//   @override
//   Future<bool> get appleSignInAvailable => AppleSignIn.isAvailable();
// }
