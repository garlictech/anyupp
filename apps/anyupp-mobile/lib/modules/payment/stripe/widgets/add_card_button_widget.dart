import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';

class AddCardButtonWidget extends StatelessWidget {
  final Function _startStripePayment;
  AddCardButtonWidget(this._startStripePayment);
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        padding: EdgeInsets.all(15.0),
        child: SizedBox(
          width: double.infinity,
          height: 50.0,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8.0),
              ),
              primary: theme.primary,
            ),
            onPressed: () => _startStripePayment(),
            child: Text(
              trans(context, 'payment.manageCard.add_card'),
              style: Fonts.satoshi(
                fontSize: 16,
                color: theme.secondary0,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
