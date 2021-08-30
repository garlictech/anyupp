import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/payment/stripe/bloc/stripe_payment_bloc.dart';
import 'package:fa_prev/modules/payment/stripe/bloc/stripe_payment_state.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets/loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

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
                  borderRadius: BorderRadius.circular(8.0),
                ),
                primary: theme.indicator,
              ),
              onPressed: isLoading ? null : () => _startStripePayment(),
              child: isLoading
                  ? CenterLoadingWidget(
                      size: 20.0,
                    )
                  : Text(
                      trans(context, 'orders.stripepay'),
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        color: theme.text2,
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
