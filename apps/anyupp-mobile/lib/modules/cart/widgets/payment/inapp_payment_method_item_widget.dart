import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';

class InappPaymentMethodItemWidget extends StatelessWidget {
  final PaymentMethodExt? selectedPaymentMethod;
  final ValueChanged<PaymentMethodExt?>? onChanged;

  const InappPaymentMethodItemWidget({
    Key? key,
    this.selectedPaymentMethod,
    this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<StripePaymentBloc, StripePaymentState>(
      builder: (context, state) {
        if (state is StripePaymentMethodsList) {
          if (state.data == null || state.data!.isEmpty) {
            return PaymentMethodListItemWidget(
              icon: 'assets/icons/payment-stripe.svg',
              titleKey: 'payment.method.inAppPayment',
              descriptionKey: 'payment.method.inAppPaymentDesc',
              value: PaymentMethodExt(method: PaymentMethod.inapp),
              selected: selectedPaymentMethod,
              onChanged: (value) {
                if (onChanged != null) {
                  this.onChanged!(value);
                }
                showAddPaymentMethodBottomSheet(context);
              },
            );
          }

          return Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ListView.separated(
                shrinkWrap: true,
                itemCount: state.data!.length,
                separatorBuilder: (context, index) => Divider(
                  height: 1.0,
                  color: theme.secondary16,
                ),
                itemBuilder: (context, index) {
                  StripePaymentMethod method = state.data![index];
                  return ListTile(
                    onTap: () {
                      if (onChanged != null) {
                        onChanged!(PaymentMethodExt(
                            method: PaymentMethod.inapp, cardId: method.id));
                      }
                    },
                    contentPadding: EdgeInsets.only(right: 12.0, left: 16.0),
                    title: Text(
                      '${method.brand} **** ${method.last4}',
                      style: Fonts.satoshi(
                        color: theme.secondary,
                        fontSize: 16.0,
                      ),
                    ),
                    subtitle: Text(
                      '${method.expMonth}/${method.expYear}',
                      style: Fonts.satoshi(
                        color: theme.secondary40,
                        fontSize: 12.0,
                      ),
                    ),
                    leading: Padding(
                      padding: EdgeInsets.zero,
                      child: Container(
                        width: 44,
                        height: 32,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(4.0),
                          color: theme.secondary12,
                        ),
                        padding: EdgeInsets.symmetric(
                          horizontal: 7.0,
                          vertical: 4.0,
                        ),
                        child: (method.brand == 'mastercard' ||
                                method.brand == 'visa' ||
                                method.brand == 'maestro')
                            ? SvgPicture.asset(
                                'assets/icons/brand-${method.brand}.svg',
                                // height: 73.0,
                                // width: 73.0,
                                // fit: BoxFit.cover,
                              )
                            : Container(),
                      ),
                    ),
                    trailing: Theme(
                      data: Theme.of(context).copyWith(
                        unselectedWidgetColor:
                            theme.secondary16, // Radio disabled color
                      ),
                      child: Transform.scale(
                        scale: 1.5,
                        child: Radio<PaymentMethodExt>(
                          value: PaymentMethodExt(
                              method: PaymentMethod.inapp, cardId: method.id),
                          groupValue: selectedPaymentMethod,
                          onChanged: onChanged,
                          activeColor: theme.primary, // Radio selected color
                        ),
                      ),
                    ),
                  );
                },
              ),
              InkWell(
                onTap: () {
                  showAddPaymentMethodBottomSheet(context);
                },
                child: Padding(
                  padding: const EdgeInsets.only(
                    top: 16.0,
                    left: 16.0,
                    bottom: 24.0,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        trans(context, 'payment.method.addNewCard'),
                        style: Fonts.satoshi(
                          color: theme.primary,
                          fontSize: 16.0,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // SizedBox(
              //   height: 24.0,
              // ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Divider(
                  height: 1,
                  color: theme.secondary16,
                ),
              )
            ],
          );

          // return state.data.map((e) => Container()).toList();
        }

        return CenterLoadingWidget(
          size: 24,
        );
        // return Container();
      },
    );
  }
}
