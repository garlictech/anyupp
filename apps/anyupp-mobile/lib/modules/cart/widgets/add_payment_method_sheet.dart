import 'package:flutter/material.dart';

import 'add_payment_method_widget.dart';

Future showAddPaymentMethodBottomSheet(BuildContext context) {
  // final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  return showModalBottomSheet(
    context: context,
    isDismissible: true,
    // shape: RoundedRectangleBorder(
    //   borderRadius: BorderRadius.only(
    //     topLeft: Radius.circular(16.0),
    //     topRight: Radius.circular(16.0),
    //   ),
    // ),
    enableDrag: true,
    isScrollControlled: true,
    elevation: 4.0,
    backgroundColor: Colors.transparent,
    builder: (context) {
      return AddPaymentMethodWidget();
      // return DraggableScrollableSheet(
      //   initialChildSize: 0.5,
      //   maxChildSize: 0.8,
      //   minChildSize: 0.3,
      //   expand: false,
      //   builder: (context, scrollController) {
      //     return AddPaymentMethodWidget();
      //   },
      // );
    },
  );
}
