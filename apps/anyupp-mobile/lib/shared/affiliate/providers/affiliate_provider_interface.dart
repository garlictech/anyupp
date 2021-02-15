import 'package:fa_prev/shared/affiliate.dart';

abstract class IAffiliateProvider {
  Stream<Affiliate> getCurrentAffiliateStream();
}
