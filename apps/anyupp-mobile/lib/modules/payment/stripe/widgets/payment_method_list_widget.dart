import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

class StripePaymentMethodListWidget extends StatelessWidget {
  final OnPaymentMethodSelected onItemSelected;
  final int selected;

  final List<StripePaymentMethod> methods;

  const StripePaymentMethodListWidget(
      {Key key, this.methods, this.onItemSelected, this.selected})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: AnimationLimiter(
        child: ListView.builder(
          shrinkWrap: true,
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
                  child: PaymentMethodCardWidget(
                    selected: position == selected,
                    method: methods[position],
                    onItemSelected: onItemSelected,
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
