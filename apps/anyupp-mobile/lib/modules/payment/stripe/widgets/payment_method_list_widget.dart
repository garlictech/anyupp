import 'package:carousel_slider/carousel_slider.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:flutter/material.dart';

class StripePaymentMethodListWidget extends StatelessWidget {
  final OnPaymentMethodSelected onItemSelected;
  final int selected;

  final List<StripePaymentMethod> methods;

  const StripePaymentMethodListWidget({
    required this.methods,
    required this.onItemSelected,
    required this.selected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 16, horizontal: 16),
      child: LayoutBuilder(builder: (context, constrains) {
        return Container(
          height: constrains.maxHeight,
          child: CarouselSlider.builder(
            itemCount: methods.length,
            options: CarouselOptions(
              onPageChanged: (index, reason) => onItemSelected(methods[index]),
              viewportFraction: 0.45,
              scrollDirection: Axis.vertical,
              enlargeCenterPage: false,
              enableInfiniteScroll: false,
              initialPage: selected,
              autoPlay: false,
              scrollPhysics: BouncingScrollPhysics(),
            ),
            itemBuilder: (context, index, position) {
              return PaymentMethodCardWidget(
                selected: position == selected,
                method: methods[position],
                onItemSelected: onItemSelected,
              );
            },
          ),
        );
      }),
    );
  }
}
