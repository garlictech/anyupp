import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:fa_prev/shared/widgets/tab_bar_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class StripePaymentMethodsScreen extends StatefulWidget {
  @override
  _StripePaymentMethodsScreenState createState() => _StripePaymentMethodsScreenState();
}

class _StripePaymentMethodsScreenState extends State<StripePaymentMethodsScreen> {
  int selectedItem = 0;
  int? initialIndex;
  @override
  void initState() {
    super.initState();
    getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<StripePaymentBloc, StripePaymentState>(
      listener: (context, state) {
        if (state is StripeCardCreated) {
          showSuccessDialog(
            context,
            trans("payment.manageCard.success"),
            trans("payment.manageCard.card_added"),
          );
          getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
        }
        if (state is StripeError) {
          Nav.pop();
        }
      },
      child: BlocBuilder<StripePaymentBloc, StripePaymentState>(
        builder: (context, StripePaymentState state) {
          int initialIndex = 1;
          if (state is StripePaymentMethodsList) {
            if (state.data != null && state.data!.isEmpty) {
              initialIndex = 0;
            }
            return TabBarWidget(
              StripeAddPaymentMethodWidget(),
              SelectStripePaymentMethodWidget(),
              trans('payment.stripe.new_card'),
              trans('payment.stripe.saved_cards'),
              tabIndex: initialIndex,
            );
          }
          return Scaffold(body: CenterLoadingWidget());
        },
      ),
    );
  }
}
