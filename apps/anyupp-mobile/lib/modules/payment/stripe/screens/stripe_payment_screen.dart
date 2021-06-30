import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lottie/lottie.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

class StripePaymentScreen extends StatefulWidget {
  final String orderId;
  final UserInvoiceAddress invoiceAddress;

  const StripePaymentScreen({Key key, this.orderId, this.invoiceAddress}) : super(key: key);

  @override
  _StripePaymentScreenState createState() => _StripePaymentScreenState();
}

class _StripePaymentScreenState extends State<StripePaymentScreen> {
  StripePaymentMethod _paymentMethod;
  GlobalKey<FormState> _formKey;
  bool _saveCard = false;
  CardForm _form;

  _StripePaymentScreenState() {
    _formKey = GlobalKey<FormState>();
  }

  @override
  void initState() {
    super.initState();
    getIt<StripePaymentBloc>().add(ResetStripePaymentState());
  }

  @override
  Widget build(BuildContext context) {
    this._form = CardForm(
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
    );
    this._formKey = _form.formKey;
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: theme.background,
      statusBarIconBrightness: Brightness.dark,
    ));

    return SafeArea(
      child: Scaffold(
          appBar: _buildAppBar(context),
          body: BlocListener<StripePaymentBloc, StripePaymentState>(
            listener: (BuildContext context, StripePaymentState state) {
              if (state is StripeOperationSuccess) {
                final scaffold = ScaffoldMessenger.of(context);
                scaffold.showSnackBar(SnackBar(
                  content: Text(trans('payment.stripe.payment_success')),
                  // action: SnackBarAction(
                  //     label: 'Close',
                  //     onPressed: () {
                  //       scaffold.hideCurrentSnackBar();
                  //       // Nav.pop();
                  //     }),
                ));
                Nav.pop();
                getIt<MainNavigationBloc>().add(DoMainNavigation(pageIndex: 2));
                //Nav.replace(MainNavigation(pageIndex: 2));
              }
            },
            child: BlocBuilder<StripePaymentBloc, StripePaymentState>(
              builder: (context, StripePaymentState state) {
                // if (state is StripeOperationSuccess) {
                //   return _buildPaymentSuccess(context);
                // }

                if (state is StripeError) {
                  return _buildPaymentFailed(context, state.code, state.message);
                }
                // if (state is StripePaymentMethodsList) {
                //   return _buildPaymentMethodsList(state.data);
                // }
                // if (state is StripeError) {
                //   return CommonErrorWidget(error: state.code, description: state.message);
                // }
                // if (state is StripePaymentLoading) {
                //   return CenterLoadingWidget();
                // }
                return Column(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Expanded(child: Center(child: _buildPaymentMethodForm(context, state))),
                    _buildPayButton(context, state),
                  ],
                );
              },
            ),
          )),
    );
  }

  Widget _buildPaymentMethodForm(BuildContext context, StripePaymentState state) {
    bool enabled = true;
    if (state is StripePaymentLoading) {
      enabled = false;
    }
    Widget child = SingleChildScrollView(
      physics: BouncingScrollPhysics(),
      child: Column(
        children: [
          _paymentMethod == null
              ? this._form
              : PaymentMethodCardWidget(
                  method: _paymentMethod,
                ),
          if (_paymentMethod == null)
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Checkbox(
                  activeColor: theme.border2,
                  checkColor: theme.highlight,
                  value: _saveCard,
                  onChanged: (value) {
                    setState(() {
                      _saveCard = value;
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
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      color: theme.text,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
        ],
      ),
    );

    return enabled
        ? child
        : IgnorePointer(
            child: child,
          );
  }

  Widget _buildPayButton(BuildContext context, StripePaymentState state) {
    bool isLoading = state is StripePaymentLoading;

    return Container(
      padding: EdgeInsets.all(15.0),
      child: SizedBox(
        width: double.infinity,
        height: 50.0,
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8.0),
              // side: BorderSide(
              // //  color: theme.indicator,
              // ),
            ),
            primary: theme.indicator,
          ),
          onPressed: isLoading ? null : () => _startStripePayment(),
          child: isLoading
              ? CenterLoadingWidget(
                  size: 20.0,
                )
              : Text(
                  trans('orders.stripepay'),
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    color: theme.text2,
                    fontWeight: FontWeight.w500,
                  ),
                ),
        ),
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return AppBar(
      leading: Container(
        padding: EdgeInsets.only(
          left: 8.0,
          top: 4.0,
          bottom: 4.0,
        ),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              width: 1,
              color: theme.border2,
            ),
          ),
          child: BackButton(
            onPressed: () => Nav.pop(),
            color: theme.text,
          ),
        ),
      ),
      elevation: 0.0,
      iconTheme: IconThemeData(
        color: theme.text, //change your color here
      ),
      backgroundColor: theme.background,
      title: Text(
        trans('payment.stripe.title'),
        style: GoogleFonts.poppins(color: theme.text),
      ),
      actions: <Widget>[
        Container(
          padding: EdgeInsets.only(
            top: 4.0,
            bottom: 4.0,
          ),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                width: 1,
                // color: theme.border2,
              ),
            ),
            child: IconButton(
              icon: Icon(
                Icons.credit_card,
                color: theme.text,
              ),
              tooltip: trans('payment.stripe.add_card_tooltip'),
              // onPressed: () => Nav.to(StripeAddPaymentMethodScreen()),
              onPressed: () => showSelectStripePaymentDialog(context, onItemSelected: (StripePaymentMethod method) {
                // print('Selected payment method=$method');
                setState(() {
                  _paymentMethod = method;
                });
              }),
            ),
          ),
        ),
        SizedBox(
          width: 15.0,
        ),
      ],
    );
  }

  Widget _buildPaymentFailed(BuildContext context, String code, String message) {
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
    print('_startStripePayment().cart=${_form.card}');
    if (_paymentMethod != null) {
      getIt<StripePaymentBloc>().add(StartStripePaymentWithExistingCardEvent(
        orderId: widget.orderId,
        paymentMethodId: _paymentMethod.id,
        invoiceAddress: widget.invoiceAddress,
      ));
    } else {
      if (_formKey.currentState.validate()) {
        _formKey.currentState.save();
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
