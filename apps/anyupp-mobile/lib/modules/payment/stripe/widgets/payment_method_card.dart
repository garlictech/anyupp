import 'package:awesome_card/awesome_card.dart';
import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/payment/stripe/bloc/stripe_payment_bloc.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets/common_confirm_dialog.dart';
import 'package:flutter/material.dart';

import 'select_payment_method_dialog.dart';

class PaymentMethodCardWidget extends StatelessWidget {
  final StripePaymentMethod method;
  final OnPaymentMethodSelected onItemSelected;
  final bool selected;

  const PaymentMethodCardWidget({
    required this.method,
    required this.onItemSelected,
    this.selected = false,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      children: [
        Stack(
          children: [
            Container(
              decoration: selected
                  ? BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        width: 2,
                        color: theme.primary,
                      ),
                    )
                  : null,
              child: Column(
                mainAxisSize: MainAxisSize.max,
                children: [
                  SizedBox(
                    height: 20,
                  ),
                  CreditCard(
                    cardNumber: '**** **** **** ${method.last4}',
                    cardExpiry: _getExpirityDateString(method),
                    bankName: '',
                    cardHolderName: ' ', //method.brand,
                    cvv: '',
                    frontBackground: Container(
                      width: double.maxFinite,
                      height: double.maxFinite,
                      color: theme.secondary0,
                    ),
                    frontTextColor: theme.secondary,
                    backBackground: CardBackgrounds.white,
                    showBackSide: false,
                    showShadow: true,
                    cardType: _getCardTypeFromString(method.brand!), // isVisa ? CardType.visa : CardType.masterCard,
                  ),
                  SizedBox(
                    height: 20,
                  ),
                ],
              ),
            ),

            Positioned(
              left: 35,
              top: 35,
              child: GestureDetector(
                onTap: () async {
                  await showConfirmDialog(context,
                      onConfirm: () => getIt<StripePaymentBloc>().add(DeleteStripeCardEvent(method.id!)),
                      title: trans(context, "payment.manageCard.are_you_sure"),
                      message: trans(context, "payment.manageCard.card_will_delete"),
                      cancelText: trans(context, "payment.manageCard.cancel"),
                      confirmText: trans(context, "payment.manageCard.delete"));
                },
                child: Container(
                    height: 40,
                    width: 40,
                    child: Icon(
                      Icons.delete,
                      color: theme.secondary,
                      // color: isVisa ? Colors.white : Colors.black,
                    )),
              ),
            ),
            //    )
            //  : Container()
          ],
        ),
      ],
    );
  }

  String _getExpirityDateString(StripePaymentMethod payment) {
    String year = payment.expYear.toString().substring(2);
    String month = payment.expMonth < 10 ? '0${payment.expMonth}' : '${payment.expMonth}';
    return '$year/$month';
  }

  CardType _getCardTypeFromString(String cardType) {
    return CardType.values.firstWhere(
        (element) => 'CardType.${cardType}'.toLowerCase() == element.toString().toLowerCase(),
        orElse: () => CardType.other);
  }
}
