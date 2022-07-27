import '/graphql/generated/crud-api.graphql.dart';
import '/models.dart';
import '/modules/rating_tipping/providers/rating_provider_interface.dart';

class RatingRepository {
  final IRatingProvider _provider;

  const RatingRepository(this._provider);

  Future<bool> rateOrder(String orderId, OrderRating rating) {
    return _provider.rateOrder(orderId, rating);
  }

  Future<bool> tipOrder(String orderId, TipType? tipType, double? tip) {
    return _provider.tipOrder(orderId, tipType, tip);
  }

  Future<bool> noTipOrder(String orderId) {
    return _provider.noTipOrder(orderId);
  }
}
