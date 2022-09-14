import '/models.dart';
import '/graphql/generated/crud-api.dart';

bool shouldDisplayRating(Order order) {
  if (order.ratingPolicies == null && order.tipPolicy == null) {
    return false;
  }
  if (order.status != OrderStatus.served) {
    return false;
  }

  // if (order.paymentMode.method != PaymentMethod.inapp) {
  //   log.d('shouldDisplayRating().false2');
  //   return false;
  // }

  return true;
}

String getOrderStatusTitleKeyByPolicy(
  OrderPolicy? policy,
  OrderStatus status,
) {
  String key = 'orders.infos.status.${enumToString(status)!}.title';
  if ((policy == OrderPolicy.placeOnly ||
          policy == OrderPolicy.placeWithPaymentType) &&
      status != OrderStatus.none) {
    key = 'orders.infos.status.simplified.title';
  }

  return key;
}
