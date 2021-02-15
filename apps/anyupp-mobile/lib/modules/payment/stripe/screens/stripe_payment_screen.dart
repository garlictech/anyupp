import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lottie/lottie.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/orders/model/placed_order.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';

class StripePaymentScreen extends StatefulWidget {
  final String chainId;
  final String unitId;
  final String userId;
  final PlacedOrder order;
  final double sum;

  const StripePaymentScreen({Key key, this.chainId, this.unitId, this.userId, this.order, this.sum}) : super(key: key);

  @override
  _StripePaymentScreenState createState() => _StripePaymentScreenState();
}

class _StripePaymentScreenState extends State<StripePaymentScreen> {
  StripeCard _cardData;
  GlobalKey<FormState> _formKey;
  CardForm _form;
  bool _saveCard = false;

  _StripePaymentScreenState() {
    _cardData = StripeCard(number: '5555555555554444', expMonth: 12, expYear: 23, cvc: '111', last4: '4444');
    _form = CardForm(
      card: _cardData,
    );
    // _cardData = _form.card;
    _formKey = _form.formKey;
  }

  @override
  void initState() {
    super.initState();
    getIt<StripePaymentBloc>().add(ResetStripePaymentState());
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: theme.background,
      statusBarIconBrightness: Brightness.dark,
    ));

    return SafeArea(
      child: Scaffold(
          appBar: _buildAppBar(context),
          body: BlocListener<StripePaymentBloc, StripePaymentState>(
            listener: (BuildContext context, StripePaymentState state) {
              print('StripePaymentScreen.listener().state=$state');
              if (state is StripeOperationSuccess) {
                final scaffold = Scaffold.of(context);
                scaffold.showSnackBar(SnackBar(
                  content: const Text('Payment Success!'),
                  action: SnackBarAction(
                      label: 'Close',
                      onPressed: () {
                        scaffold.hideCurrentSnackBar();
                        Nav.pop();
                      }),
                ));
              }
            },
            child: BlocBuilder<StripePaymentBloc, StripePaymentState>(
              builder: (context, StripePaymentState state) {
                if (state is StripeOperationSuccess) {
                  return _buildPaymentSuccess(context);
                }

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
                return _buildPaywithCardForm(context, state);
              },
            ),
          )),
    );
  }

  Widget _buildPaywithCardForm(BuildContext context, StripePaymentState state) {
    return SingleChildScrollView(
      physics: BouncingScrollPhysics(),
      child: Column(
        children: [
          this._form,
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
                    print('Save card=$_saveCard');
                  });
                },
              ),
              InkWell(
                onTap: () {
                  setState(() {
                    _saveCard = !_saveCard;
                    print('Save card=$_saveCard');
                  });
                },
                child: Text(
                  'Save card for later use',
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    color: theme.text,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          _buildPayButton(context, state),
        ],
      ),
    );
  }

  Widget _buildPayButton(BuildContext context, StripePaymentState state) {
    bool isLoading = state is StripePaymentLoading;

    return Container(
      padding: EdgeInsets.all(15.0),
      child: SizedBox(
        width: double.infinity,
        height: 50.0,
        child: RaisedButton(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8.0),
            side: BorderSide(
              color: theme.indicator,
            ),
          ),
          onPressed: isLoading ? null : () => _startStripePayment(),
          color: theme.indicator,
          textColor: theme.text2,
          child: isLoading
              ? CenterLoadingWidget(
                  color: theme.highlight,
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
        'Pay with Stripe',
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
                color: theme.border2,
              ),
            ),
            child: IconButton(
              icon: Icon(
                Icons.add,
                color: theme.text,
              ),
              tooltip: 'Add new card',
              // onPressed: () => Nav.to(StripeAddPaymentMethodScreen()),
              onPressed: () => showSelectStripePaymentDialog(context, onItemSelected: (StripePaymentMethod method) {
                print('Selected payment method=$method');
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

  Widget _buildPaymentSuccess(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Lottie.asset(
            'assets/animations/26421-payment-succesful.json',
            width: 300,
            height: 300,
            fit: BoxFit.fill,
          ),
        ],
      ),
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
    getIt<StripePaymentBloc>().add(StartStripePaymentWithNewCardEvent(
      chainId: widget.chainId,
      unitId: widget.unitId,
      userId: widget.userId,
      stripeCard: this._cardData,
    ));

    // TODO ezt majd visszatenni
    // if (_formKey.currentState.validate()) {
    //   _formKey.currentState.save();
    //   getIt<StripePaymentBloc>().add(StartStripePaymentWithNewCardEvent(
    //     chainId: widget.chainId,
    //     unitId: widget.unitId,
    //     userId: widget.userId,
    //     stripeCard: this._cardData,
    //   ));
    // }
  }
}
