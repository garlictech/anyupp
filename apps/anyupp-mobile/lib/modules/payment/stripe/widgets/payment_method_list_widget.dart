import 'dart:ffi';

import 'package:awesome_card/awesome_card.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

class StripePaymentMethodListWidget extends StatelessWidget {

  final OnPaymentMethodSelected onItemSelected;

  final List<StripeCard> methods;

  const StripePaymentMethodListWidget({Key key, this.methods, this.onItemSelected}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AnimationLimiter(
      child: RefreshIndicator(
        onRefresh: () async => getIt<StripePaymentBloc>().add(PaymentMethodListEvent()),
        child: ListView.builder(
          itemCount: methods.length,
          scrollDirection: Axis.vertical,
          physics: BouncingScrollPhysics(),
          itemBuilder: (context, position) {
            return AnimationConfiguration.staggeredList(
              position: position,
              duration: const Duration(milliseconds: 375),
              child: SlideAnimation(
                verticalOffset: 50.0,
                child: FadeInAnimation(
                  child: _buildPaymentMethodCard(methods[position]),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildPaymentMethodCard(StripeCard payment) {
    bool isVisa = payment.brand == 'mastercard';
    return Container(
      padding: EdgeInsets.only(bottom: 8.0),
      child: InkWell(
        onTap: () => null,// onItemSelected != null ? onItemSelected(StripePaymentMethod.fromStripe(payment)) : nullptr,
        child: CreditCard(
            cardNumber: '**** **** **** ${payment.last4}',
            cardExpiry: '${payment.expYear}/${payment.expMonth}',
            // TODO majd ki kene tolteni valamivel
            bankName: 'Bank neve,ha lesz',
            cardHolderName: 'Kártya neve, ha lesz',
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
}
