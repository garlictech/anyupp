import 'package:fa_prev/shared/auth.dart';
import 'package:firebase_auth/firebase_auth.dart';

abstract class IUserProvider {
  Stream<User> getAuthenticatedUserProfileStream();
  Future<User> getAuthenticatedUserProfile();
  // TODO ez nem fuggetlen!
  Future<FirebaseUser> getCurrentFirebaseUser();
  Future<bool> saveUserProfile(User user);
  // TODO ez nem fuggetlen!
  Future<void> createFirebaseUser(FirebaseUser firebaseUser, String displayName);
  // TODO ez nem fuggetlen!
  Future<void> createOrUpdateFirebaseUser(String uid, User user);

  Future<void> logoutUser();
}
