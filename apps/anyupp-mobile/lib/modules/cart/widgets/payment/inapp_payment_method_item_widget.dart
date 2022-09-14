import '/core/core.dart';
import '/core/theme/theme.dart';
import '/graphql/generated/crud-api.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/payment/stripe/stripe.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

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
                physics: BouncingScrollPhysics(),
                separatorBuilder: (context, index) => Divider(
                  height: 1.0,
                  color: theme.secondary16,
                ),
                itemBuilder: (context, index) {
                  StripePaymentMethod method = state.data![index];
                  return CardListTileWidget(
                    method: method,
                    onTap: () {
                      if (onChanged != null) {
                        onChanged!(PaymentMethodExt(
                            method: PaymentMethod.inapp, cardId: method.id));
                      }
                    },
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
                          activeColor: theme.highlight, // Radio selected color
                        ),
                      ),
                    ),
                  );
                },
              ),
              AddNewPaymentMethodTextLinkWidget(),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Divider(
                  height: 1,
                  color: theme.secondary16,
                ),
              )
            ],
          );
        }

        return CenterLoadingWidget(
          size: 24,
        );
      },
    );
  }
}
