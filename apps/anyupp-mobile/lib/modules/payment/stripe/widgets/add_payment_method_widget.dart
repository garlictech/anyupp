import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/form_style_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:fa_prev/shared/widgets/loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

class StripeAddPaymentMethodWidget extends StatefulWidget {
  @override
  _StripeAddPaymentMethodWidgetState createState() =>
      _StripeAddPaymentMethodWidgetState();
}

class _StripeAddPaymentMethodWidgetState
    extends State<StripeAddPaymentMethodWidget> {
  StripeCard _cardData = StripeCard();
  GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late CardFormWidget _form;

  _StripeAddPaymentMethodWidgetState();

  @override
  Widget build(BuildContext context) {
    return BlocListener<StripePaymentBloc, StripePaymentState>(
      listener: (BuildContext context, StripePaymentState state) {},
      child: BlocBuilder<StripePaymentBloc, StripePaymentState>(
          builder: (context, StripePaymentState state) {
        if (state is StripePaymentLoading) {
          return _buildLoadingWidget(context);
        }
        return Container(
          // color: theme.secondary,
          child: Column(
            children: [
              Expanded(child: _buildAddCardForm(context)),
              AddCardButtonWidget(() async {
                if (_formKey.currentState != null &&
                    _formKey.currentState!.validate()) {
                  _formKey.currentState!.save();
                  // log.d('saving card=$_cardData');
                  // log.d('saving card=${_cardData.cvc}');
                  // log.d('saving card=${_cardData.number}');
                  getIt<StripePaymentBloc>()
                      .add(CreateStripeCardEvent(_cardData, ''));
                  // Nav.pop();
                }
              })
            ],
          ),
        );
      }),
    );
  }

  Widget _buildAddCardForm(BuildContext context) {
    _form = CardFormWidget(
      card: _cardData,
      formKey: _formKey,
      displayAnimatedCard: true,
      cardNumberErrorText:
          trans('payment.cardFields.card_number.validationError'),
      cardNumberDecoration: createFormFieldDecoration(
        theme: theme,
        labelText: trans('payment.cardFields.card_number.label'),
        hintText: trans('payment.cardFields.card_number.hint'),
      ),
      cardExpiryErrorText: trans('payment.cardFields.expiry.validationError'),
      cardExpiryDecoration: createFormFieldDecoration(
        theme: theme,
        labelText: trans('payment.cardFields.expiry.label'),
        hintText: trans('payment.cardFields.expiry.hint'),
      ),
      cardCvcErrorText: trans('payment.cardFields.cvc.validationError'),
      cardCvcDecoration: createFormFieldDecoration(
        theme: theme,
        labelText: trans('payment.cardFields.cvc.label'),
        hintText: trans('payment.cardFields.cvc.hint'),
      ),
      displayPostalCode: false,
    );
    return Container(
      padding: EdgeInsets.only(top: 12.0),
      child: SingleChildScrollView(
        physics: BouncingScrollPhysics(),
        child: _form,
      ),
    );
  }

  Widget _buildLoadingWidget(BuildContext context) {
    return CenterLoadingWidget();
  }

  void hideProgressDialog(BuildContext context) {
    Navigator.pop(context);
  }

  void showProgressDialog(BuildContext context) {
    showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => Center(child: CircularProgressIndicator()));
  }
}
