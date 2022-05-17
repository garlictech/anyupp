import 'package:flutter/material.dart';

import 'add_payment_method_widget.dart';

Future showAddPaymentMethodBottomSheet(BuildContext context) {
  return showModalBottomSheet(
    context: context,
    isDismissible: true,
    enableDrag: true,
    isScrollControlled: true,
    elevation: 4.0,
    backgroundColor: Colors.transparent,
    builder: (context) {
      return AddPaymentMethodWidget();
    },
  );
}
