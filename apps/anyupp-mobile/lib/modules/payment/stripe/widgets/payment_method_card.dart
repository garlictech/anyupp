import 'package:awesome_card/awesome_card.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

import 'select_payment_method_dialog.dart';

class PaymentMethodCardWidget extends StatelessWidget {
  final StripePaymentMethod method;
  final OnPaymentMethodSelected onItemSelected;
  final bool selected;

  const PaymentMethodCardWidget(
      {Key key, this.method, this.onItemSelected, this.selected})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool isVisa = method.brand == 'visa';
    return
        //   padding: EdgeInsets.all(3.0),
        Wrap(
          children: [
            Container(
              decoration: selected
                  ? BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        width: 5,
                        color: theme.highlight,
                      ),
                    )
                  : null,
              child: InkWell(
                  onTap: () => onItemSelected != null ? onItemSelected(method) : null,
                  onLongPress: () {
                    showMenu(
                      // onSelected: () => setState(() => imageList.remove(index))}
                      position: RelativeRect.fromLTRB(100, 100, 100, 100),
                      items: <PopupMenuEntry>[
                        PopupMenuItem(
              value: 1,
              child: Row(
                children: <Widget>[
                  Icon(Icons.delete),
                  Text("Delete"),
                ],
              ),
                        )
                      ],
                      context: context,
                    );
                  },
                  child: Column(
                    children: [
                      SizedBox(height: 20,),
                      CreditCard(

                        cardNumber: '**** **** **** ${method.last4}',
                        cardExpiry: _getExpirityDateString(method),
                        bankName: method.name ?? '-',
                        cardHolderName: ' ', //method.brand,
                        cvv: '',
                        frontBackground:
                            isVisa ? CardBackgrounds.black : CardBackgrounds.white,
                        frontTextColor: isVisa ? Colors.white : Colors.black,
                        backBackground:
                            isVisa ? CardBackgrounds.white : CardBackgrounds.black,
                        showBackSide: false,
                        showShadow: true,
                        cardType: _getCardTypeFromString(
                            method.brand), // isVisa ? CardType.visa : CardType.masterCard,
                      ),
                      SizedBox(height: 20,),
                    ],
                  ),
                ),
            ),
          ],
        );
  }

  String _getExpirityDateString(StripePaymentMethod payment) {
    String year = payment.expYear.toString().substring(2);
    String month =
        payment.expMonth < 10 ? '0${payment.expMonth}' : '${payment.expMonth}';
    return '$year/$month';
  }

  CardType _getCardTypeFromString(String cardType) {
    return CardType.values.firstWhere(
        (element) =>
            'CardType.${cardType}'.toLowerCase() ==
            element.toString().toLowerCase(),
        orElse: () => CardType.other);
  }
}
