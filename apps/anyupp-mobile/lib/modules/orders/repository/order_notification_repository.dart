import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/utils/local_notifications_util.dart';
import 'package:fa_prev/shared/utils/order_status_preferences.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class OrderNotificationService {
  void checkIfShowOrderStatusNotification(BuildContext context, List<Order> orders) async {
    orders.forEach((order) async {
      OrderStatus currentStatus = order.statusLog[order.statusLog.length - 1].status;
      // print('***** checkIfShowOrderStatusNotification()=${order.id}, status=$currentStatus');

      OrderStatus? previousStatus = await getOrderStatusPref(order.id);
      // print('***** checkIfShowOrderStatusNotification()=$previousStatus');

      if (previousStatus == null || previousStatus != currentStatus) {
        await setOrderStatusPref(order.id, currentStatus);
      }

      if (previousStatus != null) {
        if (currentStatus == OrderStatus.processing && previousStatus == OrderStatus.placed) {
          print('***** checkIfShowOrderStatusNotification().showProcessingNotif()');
          showNotification(
            context,
            transEx(context, "notifications.messageFrom"),
            transEx(context, "notifications.orderProcessing"),
            MainNavigation(
              pageIndex: 2,
            ),
          );
        }

        if (currentStatus == OrderStatus.ready && previousStatus == OrderStatus.processing) {
          print('***** checkIfShowOrderStatusNotification().showReadyNotif()=${order.paymentMode}');

          showNotification(
            context,
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
}
