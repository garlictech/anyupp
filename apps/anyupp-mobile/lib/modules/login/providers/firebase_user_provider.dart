import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:rxdart/rxdart.dart';

import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/utils/firebase_model_mapper.dart';

class FirebaseUserProvider implements IUserProvider {
  // TODO use constructor with depInjection
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseDatabase _db = FirebaseDatabase.instance;

  @override
  Stream<User> getAuthenticatedUserProfileStream() {
    return _auth.currentUser().asStream().where((firebaseUser) => firebaseUser != null).switchMap((firebaseUser) => _db
        .reference()
        .child('users')
        .child(firebaseUser.uid)
        .onValue
        .map((event) => event.snapshot)
        .map(FirebaseModelMapper.snapshotToUser));
  }

  @override
  Future<User> getAuthenticatedUserProfile() async {
    FirebaseUser firebaseUser = await _auth.currentUser();

    if (firebaseUser != null) {
      final User user =
          await _db.reference().child('users').child(firebaseUser.uid).once().then(FirebaseModelMapper.snapshotToUser);

      if (firebaseUser.isAnonymous) {
        user.name = 'Anonymous';
      }
      return user;
    }
    return Future.value(null);
  }

  @override
  Future<FirebaseUser> getCurrentFirebaseUser() {
    return _auth.currentUser();
  }

  @override
  Future<bool> saveUserProfile(User user) {
    var userMap = user.toMap();
    return _db.reference().child('users').child(user.id).set(userMap);
  }

  @override
  Future<void> createFirebaseUser(FirebaseUser firebaseUser, String displayName) async {
    return _db
        .reference()
        .child('users')
        .child(firebaseUser.uid)
        .set(FirebaseModelMapper.firebaseUserToDBUser(firebaseUser, displayName));
  }

  @override
  Future<void> createOrUpdateFirebaseUser(String uid, User user) async {
    print('***** createOrUpdateFirebaseUser().uid=$uid, user=$user');
    return _db.reference().child('users').child(uid).update(user.toMap());
  }

  @override
  Future<void> logoutUser() async {
    return _auth.signOut();
  }
}
