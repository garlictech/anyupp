import '/graphql/generated/crud-api.graphql.dart';
import '/models.dart';
import '/modules/rating_tipping/providers/rating_provider_interface.dart';

class MockRatingProvider implements IRatingProvider {
  @override
  Future<bool> rateOrder(String orderId, OrderRating rating) async {
    return true;
  }

  @override
  Future<bool> tipOrder(String orderId, TipType? tipType, double? tip) async {
    return true;
  }

  @override
  Future<bool> noTipOrder(String orderId) async {
    return true;
  }
}
