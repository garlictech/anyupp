import 'package:firebase_database/firebase_database.dart';

import 'package:fa_prev/shared/affiliate.dart';

class AffiliateFirebaseProvider implements IAffiliateProvider {

  final DatabaseReference _dbRef;

  AffiliateFirebaseProvider(this._dbRef);

  @override
  Stream<Affiliate> getCurrentAffiliateStream() {
    return _dbRef
        .child('affiliate')
        .onValue
        .map((event) => event.snapshot.value)
        .map((value) => Affiliate.fromMap(value));
  }
}
