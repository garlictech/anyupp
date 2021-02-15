import 'package:fa_prev/shared/affiliate.dart';

class AffiliateRepository {

  final IAffiliateProvider _provider;

  AffiliateRepository(this._provider);

   Stream<Affiliate> getCurrentAffiliateStream() {
    return _provider.getCurrentAffiliateStream();
  }
}
