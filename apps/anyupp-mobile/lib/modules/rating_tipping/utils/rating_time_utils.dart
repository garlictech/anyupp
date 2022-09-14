import '/app-config.dart';
import '/models.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '/graphql/generated/crud-api.graphql.dart';

Duration calculateNotificationScheduleDelay(Order order, DateTime now) {
  return order.updatedAt.add(AppConfig.ratingNotificationTimer).difference(now);
}

bool isNeedScheduleNotification(
  Order order,
  DateTime now,
  SharedPreferences prefs,
) {
  if (order.paymentMode.method != PaymentMethod.inapp &&
      (order.ratingPolicies == null ||
          order.ratingPolicies?.isEmpty == true ||
          order.rating != null)) {
    return false;
  }

  bool isInScheduleTime =
      now.difference(order.updatedAt) < AppConfig.ratingNotificationTimer;
  if (order.status == OrderStatus.served && isInScheduleTime) {
    bool alreadyScheduled =
        prefs.getBool('rating_schedule_${order.id}') ?? false;
    return !alreadyScheduled;
  }
  return false;
}
