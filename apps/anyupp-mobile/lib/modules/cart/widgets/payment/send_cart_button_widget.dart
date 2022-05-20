import 'dart:io';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SendCartButtonWidget extends StatelessWidget {
  final Cart cart;
  final PaymentMethodExt? selectedPaymentMethod;
  final ValueChanged<bool> onLoading;
  final VoidCallback onPressed;
  const SendCartButtonWidget({
    Key? key,
    required this.cart,
    this.selectedPaymentMethod,
    required this.onLoading,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<StripePaymentBloc, StripePaymentState>(
      builder: (context, state) {
        bool loading = state is StripePaymentLoading;
        bool isPaymentMethodSelected = selectedPaymentMethod != null &&
            ((selectedPaymentMethod!.method == PaymentMethod.inapp &&
                    selectedPaymentMethod!.cardId != null) ||
                selectedPaymentMethod!.method == PaymentMethod.card ||
                selectedPaymentMethod!.method == PaymentMethod.cash);

        return Container(
          height: 90.0,
          padding: EdgeInsets.only(
            top: 21.0,
            left: 14.0,
            right: 14.0,
            bottom: 14.0,
          ),
          margin: EdgeInsets.only(bottom: Platform.isIOS ? 20 : 0),
          width: double.infinity,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              primary: theme.button,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(40),
              ),
            ),
            child: loading
                ? CenterLoadingWidget(
                    color: theme.buttonText,
                    size: 20.0,
                    strokeWidth: 2.0,
                  )
                : Stack(
                    children: [
                      Positioned.fill(
                        child: Align(
                          alignment: Alignment.center,
                          child: Text(
                            trans(context, 'payment.sendOrder'),
                            style: Fonts.satoshi(
                              fontSize: 18,
                              color: theme.buttonText,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                      Positioned.fill(
                        child: Align(
                          alignment: Alignment.centerRight,
                          child: cart.isPlaceEmpty
                              ? SvgPicture.asset(
                                  'assets/icons/qr_code_scanner.svg',
                                  color: theme.buttonText,
                                )
                              : Icon(
                                  Icons.arrow_forward,
                                  color: theme.buttonText,
                                ),
                        ),
                      )
                    ],
                  ),
            onPressed: isPaymentMethodSelected
                ? () async {
                    if (!loading) {
                      // log.d(
                      //     'StartPayment._selectedPaymentMethod=$selectedPaymentMethod, invoce=${wantsInvoice ? address : null}');
                      onLoading(true);
                      onPressed();
                    }
                  }
                : null,
          ),
        );
      },
    );
  }
}
