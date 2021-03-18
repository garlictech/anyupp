import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/core/theme/theme.dart';

class NoPaymentMethodsWidget extends StatefulWidget {
  @override
  _NoPaymentMethodsWidgetState createState() => _NoPaymentMethodsWidgetState();
}

class _NoPaymentMethodsWidgetState extends State<NoPaymentMethodsWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Image.asset(
              'assets/images/no-favorites-icon.png',
              width: 128.0,
              fit: BoxFit.fitWidth,
            ),
            SizedBox(
              height: 60.0,
            ),
            Text(
              'To payment methods saved...',
              style: GoogleFonts.poppins(
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
                color: theme.text,
              ),
            )
          ],
        ),
      ),
    );
  }
}
