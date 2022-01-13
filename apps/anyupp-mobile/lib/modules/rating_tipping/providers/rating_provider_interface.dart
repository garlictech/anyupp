import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';

abstract class IRatingProvider {
  Future<bool> rateAndTipOrder(
    String orderId,
    int? rating,
    String? paymentMethodId,
    TipType? tipType,
    double? tip,
  );

  Future<bool> rateOrder(
    String orderId,
    int? rating,
  );

  Future<bool> tipOrder(
    String orderId,
    String? paymentMethodId,
    TipType? tipType,
    double? tip,
  );
}
