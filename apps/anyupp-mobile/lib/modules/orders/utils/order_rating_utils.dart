import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

bool shouldDisplayRating(Order order, GeoUnit? unit) {
  print('shouldDisplayRating()');
  if (unit == null || (unit.ratingPolicies == null && unit.tipPolicy == null)) {
    print('shouldDisplayRating().false1');
    return false;
  }
  var status = order.statusLog[order.statusLog.length - 1];
  if (status.status != OrderStatus.served) {
    print('shouldDisplayRating().false2');
    return false;
  }

  if (order.paymentMode.method != PaymentMethod.inapp) {
    print('shouldDisplayRating().false2');
    return false;
  }
  print('shouldDisplayRating().true');

  return true;
}
