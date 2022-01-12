import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/modules/rating_tipping/providers/rating_provider_interface.dart';

class RatingRepository {
  final IRatingProvider _provider;

  const RatingRepository(this._provider);

  Future<bool> rateAndTipOrder(
    String orderId,
    int? rating,
    String? paymentMethodId,
    TipType? tipType,
    double? tip,
  ) {
    return _provider.rateAndTipOrder(
        orderId, rating, paymentMethodId, tipType, tip);
  }

  Future<bool> rateOrder(String orderId, int? rating) {
    return _provider.rateOrder(orderId, rating);
  }

  Future<bool> tipOrder(
      String orderId, String? paymentMethodId, TipType? tipType, double? tip) {
    return _provider.tipOrder(orderId, paymentMethodId, tipType, tip);
  }
}
