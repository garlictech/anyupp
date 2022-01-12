import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/rating_tipping/rating_tipping.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/notifications/utils/notifications_utils.dart';
import 'package:fa_prev/shared/utils/order_status_preferences.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class OrderNotificationService {
  OrderStatus? _lastStatus;
  String? _lastId;

  void checkIfShowOrderStatusNotification(
    BuildContext context,
    List<Order> orders,
  ) async {
    // Schedule notifications if necessary for rating the order
    getIt.get<RatingOrderNotificationBloc>().add(
          CheckAndScheduleOrderRatingNotifications(
            orders,
          ),
        );

    orders.forEach((order) async {
      if (order.archived) {
        return;
      }
      OrderStatus currentStatus =
          order.statusLog[order.statusLog.length - 1].status;
      // print('***** checkIfShowOrderStatusNotification()=${order.id}, status=$currentStatus');

      OrderStatus? previousStatus = await getOrderStatusPref(order.id);
      // print('***** checkIfShowOrderStatusNotification()=$previousStatus');

      if (previousStatus == null || previousStatus != currentStatus) {
        await setOrderStatusPref(order.id, currentStatus);
      }

      if (previousStatus != null) {
        if (currentStatus == OrderStatus.processing &&
            previousStatus == OrderStatus.placed) {
          // print('***** checkIfShowOrderStatusNotification().showProcessingNotif()');
          if (!_checkNeedNotification(order.id, currentStatus)) {
            return;
          }

          showNotification(
            transEx(context, "notifications.messageFrom"),
            transEx(context, "notifications.orderProcessing"),
            MainNavigation(
              pageIndex: 2,
            ),
          );
          return;
        }

        if (currentStatus == OrderStatus.ready &&
            previousStatus == OrderStatus.processing) {
          // print('***** checkIfShowOrderStatusNotification().showReadyNotif()=${order.paymentMode}');
          if (!_checkNeedNotification(order.id, currentStatus)) {
            return;
          }
          showNotification(
            transEx(context, "notifications.messageFrom"),
            transEx(context, "notifications.orderReady"),
            MainNavigation(
              pageIndex: 2,
            ),
          );
        }
      }
    });
  }

  bool _checkNeedNotification(String id, OrderStatus currentStatus) {
    if (id == _lastId && currentStatus == _lastStatus) {
      return false;
    }
    _lastId = id;
    _lastStatus = currentStatus;
    return true;
  }
}
