import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/graphql/generated/anyupp-api.dart' hide PaymentMethod;
import 'package:fa_prev/modules/main/bloc/main_navigation_bloc.dart';
import 'package:fa_prev/modules/main/bloc/main_navigation_event.dart';
import 'package:fa_prev/modules/payment/stripe/bloc/stripe_payment_bloc.dart';
import 'package:fa_prev/modules/payment/stripe/bloc/stripe_payment_events.dart';
import 'package:fa_prev/modules/payment/stripe/bloc/stripe_payment_state.dart';
import 'package:fa_prev/modules/payment/stripe/widgets/new_card_payment_widget.dart';
import 'package:fa_prev/modules/payment/stripe/widgets/select_payment_method_widget.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:fa_prev/shared/widgets/tab_bar_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class StripePaymentScreen extends StatefulWidget {
  final String? orderId;
  final UserInvoiceAddress? invoiceAddress;
  final int tabIndex;

  const StripePaymentScreen({this.orderId, this.invoiceAddress, this.tabIndex = 0});

  @override
  _StripePaymentScreenState createState() => _StripePaymentScreenState();
}

class _StripePaymentScreenState extends State<StripePaymentScreen> {
  @override
  void initState() {
    getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<StripePaymentBloc, StripePaymentState>(
      listener: (context, state) {
        if (state is StripeOperationSuccess) {
          final scaffold = ScaffoldMessenger.of(context);
          scaffold.showSnackBar(SnackBar(
            content: Text(trans('payment.stripe.payment_success')),
          ));
          Nav.pop();
          getIt<MainNavigationBloc>().add(DoMainNavigation(pageIndex: 2));
        }
        if (state is StripeError) {
          Nav.pop();
        }
      },
      child: BlocBuilder<StripePaymentBloc, StripePaymentState>(
        builder: (context, state) {
          if (state is StripePaymentMethodsList) {
            int initialIndex = 1;
            if (state.data != null && state.data!.isEmpty) {
              initialIndex = 0;
            }
            return TabBarWidget(
              NewCardPaymentWidget(
                orderId: widget.orderId,
                invoiceAddress: widget.invoiceAddress,
              ),
              SelectStripePaymentMethodWidget(
                showPaymentButton: true,
                orderId: widget.orderId,
                userInvoiceAddress: widget.invoiceAddress,
              ),
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
