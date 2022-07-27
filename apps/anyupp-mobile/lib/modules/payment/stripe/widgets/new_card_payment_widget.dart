import '/core/core.dart';
import '/models.dart';
import '/modules/payment/stripe/stripe.dart';
import '/shared/locale.dart';
import '/shared/utils/form_style_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lottie/lottie.dart';

class NewCardPaymentWidget extends StatefulWidget {
  final String? orderId;
  final UserInvoiceAddress? invoiceAddress;

  const NewCardPaymentWidget({
    this.orderId,
    this.invoiceAddress,
  });

  @override
  _NewCardPaymentWidgetState createState() => _NewCardPaymentWidgetState();
}

class _NewCardPaymentWidgetState extends State<NewCardPaymentWidget> {
  StripePaymentMethod? _paymentMethod;
  GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  bool _saveCard = false;
  late CardFormWidget _form;

  _NewCardPaymentWidgetState();

  @override
  void initState() {
    super.initState();
    // getIt<StripePaymentBloc>().add(ResetStripePaymentState());
  }

  @override
  Widget build(BuildContext context) {
    this._form = CardFormWidget(
      displayAnimatedCard: true,
      formKey: _formKey,
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
    // SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    //   statusBarColor: theme.secondary0,
    //   statusBarIconBrightness: Brightness.dark,
    // ));

    return BlocBuilder<StripePaymentBloc, StripePaymentState>(
      builder: (context, StripePaymentState state) {
        if (state is StripeError) {
          return _buildPaymentFailed(context, state.code, state.message);
        }
        return Column(
          children: [
            Expanded(child: _buildPaymentMethodForm(context, state)),
            PaymentButtonWidget(_startStripePayment)
          ],
        );
      },
    );
  }

  Widget _buildPaymentMethodForm(
      BuildContext context, StripePaymentState state) {
    bool enabled = true;
    if (state is StripePaymentLoading) {
      enabled = false;
    }
    Widget child = SingleChildScrollView(
      physics: BouncingScrollPhysics(),
      child: Container(
        color: theme.secondary0,
        child: Column(
          children: [
            this._form,
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Checkbox(
                  activeColor: theme.highlight,
                  // focusColor: theme.secondary,
                  hoverColor: theme.secondary0,
                  //         inactiveTrackColor: theme.secondary64,
                  // activeColor: theme.secondary40,
                  checkColor: theme.secondary0,
                  fillColor: MaterialStateColor.resolveWith((states) {
                    if (states.isEmpty) {
                      return theme.secondary;
                    }
                    var state = states.first;
                    switch (state) {
                      case MaterialState.selected:
                        return theme.highlight;
                      default:
                        return theme.secondary;
                    }
                  }),
                  value: _saveCard,
                  onChanged: (value) {
                    setState(() {
                      _saveCard = value == null ? false : value;
                    });
                  },
                ),
                InkWell(
                  onTap: () {
                    setState(() {
                      _saveCard = !_saveCard;
                    });
                  },
                  child: Text(
                    trans('payment.stripe.save_card'),
                    style: Fonts.satoshi(
                      fontSize: 16,
                      color: theme.secondary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );

    return enabled
        ? child
        : IgnorePointer(
            child: child,
          );
  }

  Widget _buildPaymentFailed(
      BuildContext context, String code, String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Lottie.asset(
            'assets/animations/10448-payment-failed-error.json',
            width: 300,
            height: 300,
            fit: BoxFit.fill,
          ),
        ],
      ),
    );
  }

  void _startStripePayment() {
    log.d('_startStripePayment().cart=${_form.card}');
    if (_paymentMethod != null) {
      getIt<StripePaymentBloc>().add(StartStripePaymentWithExistingCardEvent(
        orderId: widget.orderId,
        paymentMethodId: _paymentMethod!.id!,
        invoiceAddress: widget.invoiceAddress,
      ));
    } else {
      if (_formKey.currentState != null && _formKey.currentState!.validate()) {
        _formKey.currentState!.save();
        getIt<StripePaymentBloc>().add(StartStripePaymentWithNewCardEvent(
          orderId: widget.orderId,
          stripeCard: _form.card,
          saveCard: this._saveCard,
          invoiceAddress: widget.invoiceAddress,
        ));
      }
    }
  }
}
