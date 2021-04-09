import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fa_prev/shared/nav.dart';

class StripePaymentMethodsScreen extends StatefulWidget {
  @override
  _StripePaymentMethodsScreenState createState() => _StripePaymentMethodsScreenState();
}

class _StripePaymentMethodsScreenState extends State<StripePaymentMethodsScreen> {
  @override
  void initState() {
    super.initState();
    getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Payment methods"),
        actions: <Widget>[
          IconButton(
            icon: Icon(
              Icons.add,
              color: Colors.white,
            ),
            onPressed: () {
              Nav.to(StripeAddPaymentMethodScreen());
            },
          )
        ],
      ),
      body: BlocBuilder<StripePaymentBloc, StripePaymentState>(
        builder: (context, StripePaymentState state) {
          if (state is StripePaymentMethodsList) {
            if (state.data == null) {
              return NoPaymentMethodsWidget();
            }
            return StripePaymentMethodListWidget(methods: state.data ?? []);
          }
          if (state is StripeError) {
            return CommonErrorWidget(error: state.code, description: state.message);
          }
          if (state is StripePaymentLoading) {
            return CenterLoadingWidget();
          }
          return NoPaymentMethodsWidget();
        },
      ),
    );
  }
}
