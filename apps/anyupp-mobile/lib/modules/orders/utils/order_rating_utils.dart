import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

bool shouldDisplayRating(Order order, GeoUnit? unit) {
  if (unit == null || (unit.ratingPolicy == null && unit.tipPolicy == null)) {
    return false;
  }
  var status = order.statusLog[order.statusLog.length - 1];
  if (status.status != OrderStatus.served) {
    return false;
  }

  if (order.paymentMode.method != PaymentMethod.inapp) {
    return false;
  }

  return true;
}
