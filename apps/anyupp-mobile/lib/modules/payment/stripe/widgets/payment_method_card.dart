import 'package:awesome_card/awesome_card.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/material.dart';

import 'select_payment_method_dialog.dart';

class PaymentMethodCardWidget extends StatelessWidget {
  final StripePaymentMethod method;
  final OnPaymentMethodSelected onItemSelected;

  const PaymentMethodCardWidget({Key key, this.method, this.onItemSelected}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool isVisa = method.brand == 'visa';
    return Container(
      padding: EdgeInsets.only(bottom: 8.0),
      child: InkWell(
        onTap: () => onItemSelected != null ? onItemSelected(method) : null,
        child: CreditCard(
            cardNumber: '**** **** **** ${method.last4}',
            cardExpiry: _getExpirityDateString(method),
            bankName: method.country,
            cardHolderName: method.brand,
            cvv: '',
            frontBackground: isVisa ? CardBackgrounds.black : CardBackgrounds.white,
            frontTextColor: isVisa ? Colors.white : Colors.black,
            backBackground: isVisa ? CardBackgrounds.white : CardBackgrounds.black,
            showBackSide: false,
            showShadow: true,
            cardType: isVisa ? CardType.visa : CardType.masterCard),
      ),
    );
  }

  
  String _getExpirityDateString(StripePaymentMethod payment) {
    String year = payment.expYear.toString().substring(2);
    String month = payment.expMonth < 10 ? '0${payment.expMonth}' : '${payment.expMonth}';
    return  '$year/$month';
  }
}
