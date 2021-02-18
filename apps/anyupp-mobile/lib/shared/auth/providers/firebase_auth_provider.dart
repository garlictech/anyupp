import 'package:fa_prev/shared/utils/firebase_model_mapper.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:rxdart/rxdart.dart';

import 'package:fa_prev/shared/auth.dart';

class FirebaseAuthProvider implements IAuthProvider {
  final FirebaseAuth _firebaseAuth;
  final DatabaseReference _db;

  FirebaseAuthProvider(this._firebaseAuth, this._db);

  Stream<User> getAuthenticatedUserProfileStream() {
     return _firebaseAuth.currentUser().asStream().where((firebaseUser) => firebaseUser != null).switchMap((firebaseUser) => _db
        .reference()
        .child('users')
        .child(firebaseUser.uid)
        .onValue
        .map((event) => event.snapshot)
        .map(FirebaseModelMapper.snapshotToUser));
  }

  Future<User> getAuthenticatedUserProfile() async {
    FirebaseUser firebaseUser = await _firebaseAuth.currentUser();

    if (firebaseUser != null) {
      final User user =
          await _db.child('users').child(firebaseUser.uid).once().then(FirebaseModelMapper.snapshotToUser);

      if (firebaseUser.isAnonymous) {
        user.name = 'Anonymous';
      }
      return user;
    }
    return Future.value(null);
  }

  @override
  Future<void> cancel() async {
    // Nothing 
  }
}
