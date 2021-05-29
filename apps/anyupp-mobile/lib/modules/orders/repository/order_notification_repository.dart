import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/utils/local_notifications_util.dart';
import 'package:fa_prev/shared/utils/order_status_preferences.dart';
import 'package:flutter/material.dart';

class OrderNotificationService {

  void checkIfShowOrderStatusNotification(BuildContext context, List<Order> orders) async {
    orders.forEach((order) async {
      String currentStatus = order.statusLog[order.statusLog.length - 1].status;
      // print('***** checkIfShowOrderStatusNotification()=${order.id}, status=$currentStatus');

      String previousStatus = await getOrderStatusPref(order.id);

      if (previousStatus == null || (currentStatus != null && previousStatus != currentStatus)) {
        await setOrderStatusPref(order.id, currentStatus);
      }

      if (previousStatus != null) {
        if (currentStatus == 'processing' && previousStatus == 'placed') {
          print('***** checkIfShowOrderStatusNotification().showProcessingNotif()');
          showNotification(
            context,
            'Message from AnyUpp!',
            'Your order is being processed.',
            MainNavigation(
              pageIndex: 2,
            ),
          );
        }

        if (currentStatus == 'ready' && previousStatus == 'processing') {
          print('***** checkIfShowOrderStatusNotification().showReadyNotif()=${order.paymentMethod}');

          if (order.paymentMethod.method == 'inapp') {
            showNotification(
              context,
              'Message from AnyUpp!',
              'Your order is ready! Tap here to Pay it!',
              PaymentScreen(
                orders: [order],
              ),
            );
          } else {
            showNotification(
              context,
              'Message from AnyUpp!',
              'Your order is ready!',
              MainNavigation(
                pageIndex: 2,
              ),
            );
          }
        }
      }
    });
  }
}
