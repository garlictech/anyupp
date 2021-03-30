import 'package:fa_prev/shared/affiliate/model/affiliate_model.dart';
import 'package:fa_prev/shared/affiliate/utils/aws_dummy_utils.dart';

import 'affiliate_provider_interface.dart';

class AwsAffiliateProvider implements IAffiliateProvider {
  @override
  Stream<Affiliate> getCurrentAffiliateStream() async* {
    // TODO AWS
    // return null;// AwsDummyUtils.single<Affiliate>();
    yield null;
  }
}
