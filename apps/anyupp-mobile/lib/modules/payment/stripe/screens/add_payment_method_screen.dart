import 'package:flutter/material.dart';
import 'package:stripe_sdk/src/models/card.dart';
import 'package:stripe_sdk/src/ui/widgets/card_form.dart';

class StripeAddPaymentMethodScreen extends StatefulWidget {
  @override
  _StripeAddPaymentMethodScreenState createState() => _StripeAddPaymentMethodScreenState();
}

class _StripeAddPaymentMethodScreenState extends State<StripeAddPaymentMethodScreen> {
  StripeCard _cardData;
  GlobalKey<FormState> _formKey;
  CardForm _form;

  // Future<IntentResponse> setupIntent;

  _StripeAddPaymentMethodScreenState() {
    _form = CardForm();
    _cardData = _form.card;
    _formKey = _form.formKey;
  }

  @override
  void initState() {
    // if (widget._useSetupIntent) setupIntent = widget._createSetupIntent();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Add payment method'),
          actions: <Widget>[
            IconButton(
              icon: Icon(Icons.check),
              onPressed: () async {
                if (_formKey.currentState.validate()) {
                  _formKey.currentState.save();

                  showProgressDialog(context);

                  // var paymentMethod = await this.widget._stripe.api.createPaymentMethodFromCard(_cardData);
                  // if (this.widget._useSetupIntent) {
                  //   final createSetupIntentResponse = await this.setupIntent;
                  //   var setupIntent = await this
                  //       .widget
                  //       ._stripe
                  //       .confirmSetupIntent(createSetupIntentResponse.clientSecret, paymentMethod['id']);

                  //hideProgressDialog(context);
                  // if (setupIntent['status'] == 'succeeded') {
                  //   /// A new payment method has been attached, so refresh the store.
                  //   // ignore: unawaited_futures
                  //   widget._paymentMethodStore.refresh();
                  //   Navigator.pop(context, true);
                  //   return;
                  // }
                  //} else {
                  //paymentMethod = await widget._paymentMethodStore.attachPaymentMethod(paymentMethod['id']);
                  //   hideProgressDialog(context);
                  //   Navigator.pop(context, true);
                  //   return;
                  // }
                  Navigator.pop(context, false);
                }
              },
            )
          ],
        ),
        body: _form);
  }

  void hideProgressDialog(BuildContext context) {
    Navigator.pop(context);
  }

  void showProgressDialog(BuildContext context) {
    showDialog(
        context: context, barrierDismissible: false, builder: (context) => Center(child: CircularProgressIndicator()));
  }
}
