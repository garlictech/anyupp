import '/modules/cart/cart.dart';
import 'package:flutter/material.dart';

Future showAddInvoiceDataBottomSheet(BuildContext context) {
  // final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  return showModalBottomSheet(
    context: context,
    isDismissible: true,
    enableDrag: true,
    isScrollControlled: true,
    elevation: 4.0,
    backgroundColor: Colors.transparent,
    builder: (context) {
      return AddInvoiceDataWidget();
    },
  );
}
