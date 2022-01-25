import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/rating_tipping/providers/rating_provider_interface.dart';

class MockRatingProvider implements IRatingProvider {
  @override
  Future<bool> rateOrder(String orderId, OrderRating rating) async {
    return true;
  }

  @override
  Future<bool> tipOrder(String orderId, TipType? tipType, double? tip) async {
    return true;
  }
}
