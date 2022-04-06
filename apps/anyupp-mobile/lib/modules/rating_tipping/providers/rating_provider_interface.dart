import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/models.dart';

abstract class IRatingProvider {
  Future<bool> rateOrder(
    String orderId,
    OrderRating rating,
  );

  Future<bool> tipOrder(
    String orderId,
    TipType? tipType,
    double? tip,
  );

  Future<bool> noTipOrder(
    String orderId,
  );
}
