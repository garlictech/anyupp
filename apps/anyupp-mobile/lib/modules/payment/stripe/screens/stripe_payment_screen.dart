import 'package:fa_prev/models/UserInvoiceAddress.dart';
import 'package:fa_prev/modules/payment/stripe/screens/payment_methods_screen.dart';
import 'package:fa_prev/modules/payment/stripe/widgets/new_card_payment_widget.dart';
import 'package:fa_prev/modules/payment/stripe/widgets/select_payment_method_widget.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets/tab_bar_widget.dart';
import 'package:flutter/material.dart';

class StripePaymentScreen extends StatefulWidget {
  final String orderId;
  final UserInvoiceAddress invoiceAddress;
  final int tabIndex;

  const StripePaymentScreen(
      {Key key, this.orderId, this.invoiceAddress, this.tabIndex = 0})
      : super(key: key);

  @override
  _StripePaymentScreenState createState() => _StripePaymentScreenState();
}

class _StripePaymentScreenState extends State<StripePaymentScreen> {
  @override
  Widget build(BuildContext context) {
    return TabBarWidget(
        NewCardPaymentWidget(
          orderId: widget.orderId,
          invoiceAddress: widget.invoiceAddress,
        ),
        SelectStripePaymentMethodWidget(
          orderId: widget.orderId,
          userInvoiceAddress: widget.invoiceAddress,
        ),
        trans('payment.stripe.new_card'),
        trans('payment.stripe.saved_cards'));
  }
}
