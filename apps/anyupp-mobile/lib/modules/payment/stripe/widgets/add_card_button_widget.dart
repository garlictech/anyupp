import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AddCardButtonWidget extends StatelessWidget {
  final Function _startStripePayment;
  AddCardButtonWidget(this._startStripePayment);
  @override
  Widget build(BuildContext context) {
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
              onPressed: () => _startStripePayment(),
              child: Text(
                      trans(context, 'payment.manageCard.add_card'),
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        color: theme.text2,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
            ),
          ),
        );
  }

}
