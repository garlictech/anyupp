import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

typedef OnPaymentMethodSelected = void Function(StripePaymentMethod method);

showSelectStripePaymentDialog(BuildContext context, {OnPaymentMethodSelected onItemSelected}) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  SchedulerBinding.instance.addPostFrameCallback((_) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (BuildContext context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12.0),
        ),
        elevation: 0.0,
        backgroundColor: theme.background,
        child: SelectStripePaymentMethodWidget(
          onItemSelected: (StripePaymentMethod method)  {
            print('showSelectStripePaymentDialog().method=$method');
            if (onItemSelected != null) {
              onItemSelected(method);
            }
            Nav.pop();
          } ,
        ),
      ),
    );
  });
}
