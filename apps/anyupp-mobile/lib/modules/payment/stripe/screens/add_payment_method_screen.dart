import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:fa_prev/shared/widgets/loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:stripe_sdk/src/ui/widgets/card_form.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';
import 'package:fa_prev/shared/locale.dart';

class StripeAddPaymentMethodScreen extends StatefulWidget {
  @override
  _StripeAddPaymentMethodScreenState createState() => _StripeAddPaymentMethodScreenState();
}

class _StripeAddPaymentMethodScreenState extends State<StripeAddPaymentMethodScreen> {
  StripeCard _cardData = StripeCard();
  GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  CardForm _form;

  _StripeAddPaymentMethodScreenState();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    _form = CardForm(
      card: _cardData,
      formKey: _formKey,
      displayAnimatedCard: true,
      cardNumberErrorText: trans('payment.cardFields.card_number.validationError'),
      cardNumberDecoration: InputDecoration(
        labelText: trans('payment.cardFields.card_number.label'),
        hintText: trans('payment.cardFields.card_number.hint'),
      ),
      cardExpiryErrorText: trans('payment.cardFields.expiry.validationError'),
      cardExpiryDecoration: InputDecoration(
        labelText: trans('payment.cardFields.expiry.label'),
        hintText: trans('payment.cardFields.expiry.hint'),
      ),
      cardCvcErrorText: trans('payment.cardFields.cvc.validationError'),
      cardCvcDecoration: InputDecoration(
        labelText: trans('payment.cardFields.cvc.label'),
        hintText: trans('payment.cardFields.cvc.hint'),
      ),
      // cardDecoration: BoxDecoration(
      //   color: theme.indicator,
      // ),
    );

    return Scaffold(
      appBar: AppBar(
        title: Text('Add payment method'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.check),
            onPressed: () async {
              if (_formKey.currentState.validate()) {
                _formKey.currentState.save();
                print('saving card=$_cardData');
                print('saving card=${_cardData.cvc}');
                print('saving card=${_cardData.number}');
                getIt<StripePaymentBloc>().add(CreateStripeCardEvent(_cardData, null));
                // Nav.pop();
              }
            },
          )
        ],
      ),
      body: BlocListener<StripePaymentBloc, StripePaymentState>(
        listener: (BuildContext context, StripePaymentState state) {
          if (state is StripeOperationSuccess) {
            // Navigate away in case of an empty cart. The cart gets deleted after the order has been created
            Nav.pop();
          } else if (state is StripeError) {
            showErrorDialog(context, state.code, state.message, onClose: () => Nav.pop());
          }
        },
        child: BlocBuilder<StripePaymentBloc, StripePaymentState>(builder: (context, StripePaymentState state) {
          if (state is StripePaymentLoading) {
            return _buildLoadingWidget(context);
          }
          return _buildAddCardForm(context);
        }),
      ),
    );
  }

  Widget _buildAddCardForm(BuildContext context) {
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
        context: context, barrierDismissible: false, builder: (context) => Center(child: CircularProgressIndicator()));
  }
}
