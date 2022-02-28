import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

bool shouldDisplayRating(Order order) {
  if (order.ratingPolicies == null && order.tipPolicy == null) {
    return false;
  }
  var status = order.statusLog[order.statusLog.length - 1];
  if (status.status != OrderStatus.served) {
    return false;
  }

  // if (order.paymentMode.method != PaymentMethod.inapp) {
  //   print('shouldDisplayRating().false2');
  //   return false;
  // }

  return true;
}
