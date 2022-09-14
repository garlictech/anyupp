import '/shared/nav.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';

class PaymentSuccessWidget extends StatusWidget {
  final VoidCallback? onPressed;

  PaymentSuccessWidget({this.onPressed})
      : super(
          icon: 'assets/icons/success_order.svg',
          message: 'orders.sendOrderSuccess.title',
          description: 'orders.sendOrderSuccess.description',
          expanded: true,
          buttonText: 'common.ok2',
          onPressed: () {
            if (onPressed != null) {
              onPressed();
            }
            Nav.pop();
          },
        );
}
