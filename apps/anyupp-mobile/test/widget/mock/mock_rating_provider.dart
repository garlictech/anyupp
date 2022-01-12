import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/modules/rating_tipping/providers/rating_provider_interface.dart';

class MockRatingProvider implements IRatingProvider {
  @override
  Future<bool> rateAndTipOrder(String orderId, int? rating,
      String? paymentMethodId, TipType? tipType, double? tip) async {
    return true;
  }

  @override
  Future<bool> rateOrder(String orderId, int? rating) async {
    return true;
  }

  @override
  Future<bool> tipOrder(String orderId, String? paymentMethodId,
      TipType? tipType, double? tip) async {
    return true;
  }
}
