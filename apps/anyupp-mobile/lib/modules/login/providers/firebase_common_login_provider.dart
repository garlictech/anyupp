
// TODO AWS REMOVED
// import 'package:fa_prev/modules/login/login.dart';
// import 'package:fa_prev/shared/auth.dart';
// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:flutter/services.dart';


// class FirebaseCommonLoginProvider implements ICommonLoginProvider {
//   final IUserProvider _userProvider;
//   final FirebaseAuth _firebaseAuth;

//   FirebaseCommonLoginProvider(this._firebaseAuth, this._userProvider);

//   // Create or Update the User data in Firebase (Update only merge the changes)
//   Future<void> createOrUpdateFirebaseUser(String uid, User user) async {
//     return _userProvider.createOrUpdateFirebaseUser(uid, user);
//   }

  
//   // Sign in with the given credentials into the Firebase and Update the the user's data
//   @override
//   Future<User> signInWithCredentialAndUpdateFirebaseUser(AuthCredential credential, User user) async {
//     print('**** signInWithCredentialAndUpdateFirebaseUser().start().user=$user, credential=$credential');
//     try {
//       AuthResult firebaseResult = await _firebaseAuth.signInWithCredential(credential);
//       print('**** signInWithCredentialAndUpdateFirebaseUser().firebaseResult=$firebaseResult');
//       await _userProvider.createOrUpdateFirebaseUser(firebaseResult.user.uid, user);
//       print('**** signInWithCredentialAndUpdateFirebaseUser().firebaseUser.created()');
//       return user;
//     } on PlatformException catch (error) {
//       print('***** signInWithCredentialAndUpdateFirebaseUser.PlatformException=$error');
//       throw LoginException.fromPlatformException(error);
//     } on Exception catch (error) {
//       print('***** signInWithCredentialAndUpdateFirebaseUser.Exception=$error');
//       throw LoginException.fromException(LoginException.UNKNOWN_ERROR, error);
//     }
//   }



//   /// Current logged in user in Firebase
//   Future<FirebaseUser> _currentFirebaseUser() async {
//     return _firebaseAuth.currentUser();
//   }
  
//   /// Link the given credential to the current Firebase user's account. Email used for email-validation.
//   @override
//   Future<void> linkAccountToFirebaseUser(String email, AuthCredential credential) async {
//     FirebaseUser firebaseUser = await _currentFirebaseUser();
//     if (firebaseUser?.email == email) {
//       await firebaseUser.linkWithCredential(credential);
//       return;
//     }
//     throw LoginException(
//         code: LoginException.CODE,
//         subCode: LoginException.ERROR_ACCOUNT_LINK_EMAIL_NOT_MATCH,
//         message: 'The given email address not match to the Firebase user email');
//   }

//   /// Link the given credential to the current Firebase user's account. Email used for email-validation.
//   @override
//   Future<void> linkCredentialsToFirebaseUser(AuthCredential credential, User user) async {
//     FirebaseUser firebaseUser = await _currentFirebaseUser();
//     bool isAnonymous = firebaseUser.isAnonymous;
//     print(
//         '***** linkCredentialsToFirebaseUser().user1=${firebaseUser.providerId}, displayName:${firebaseUser.displayName}, email:${firebaseUser.email}');
//     await firebaseUser.linkWithCredential(credential);
//     firebaseUser = await _currentFirebaseUser();
//     print(
//         '***** linkCredentialsToFirebaseUser().user2=${firebaseUser.providerId}, displayName:${firebaseUser.displayName}, email:${firebaseUser.email}');
//     if (isAnonymous) {
//       await _userProvider.createOrUpdateFirebaseUser(firebaseUser.uid, user);
//     }
//   }

//   /// Link the given credential to the current Firebase user's account. Email used for email-validation.
//   @override
//   Future<void> unlinkProviderToFirebaseUser(LoginMethod method) async {
//     FirebaseUser firebaseUser = await _currentFirebaseUser();
//     await firebaseUser.unlinkFromProvider(LoginMethodUtils.methodToString(method));
//   }

// }
