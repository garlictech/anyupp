import '/core/theme/theme.dart';
import '/modules/payment/stripe/bloc/stripe_payment_bloc.dart';
import '/modules/payment/stripe/bloc/stripe_payment_state.dart';
import '/shared/locale.dart';
import '/shared/widgets/loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class PaymentButtonWidget extends StatelessWidget {
  final Function _startStripePayment;
  PaymentButtonWidget(this._startStripePayment);
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<StripePaymentBloc, StripePaymentState>(
      builder: (context, state) {
        bool isLoading = state is StripePaymentLoading;
        if (isLoading) {
          FocusScope.of(context).unfocus();
        }
        return Container(
          padding: EdgeInsets.all(15.0),
          child: SizedBox(
            width: double.infinity,
            height: 50.0,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(40.0),
                ),
                primary: theme.button,
              ),
              onPressed: isLoading ? null : () => _startStripePayment(),
              child: isLoading
                  ? CenterLoadingWidget(
                      size: 20.0,
                      color: theme.buttonText,
                    )
                  : Text(
                      trans(context, 'orders.stripepay'),
                      style: Fonts.satoshi(
                        fontSize: 16,
                        color: theme.buttonText,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
            ),
          ),
        );
      },
    );
  }
}
