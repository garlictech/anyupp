import '/core/core.dart';
import '/modules/cart/cart.dart';
import '/modules/payment/stripe/stripe.dart';
import '/shared/locale.dart';
import '/shared/nav.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

class AddPaymentMethodWidget extends StatefulWidget {
  const AddPaymentMethodWidget({Key? key}) : super(key: key);

  @override
  _AddPaymentMethodWidgetState createState() => _AddPaymentMethodWidgetState();
}

class _AddPaymentMethodWidgetState extends State<AddPaymentMethodWidget> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _cardNumberController = TextEditingController();
  final TextEditingController _expDateController = TextEditingController();
  final TextEditingController _cvvNumberController = TextEditingController();

  final StripeCard _card = StripeCard();
  bool _showErrorMessage = false;

  List<FocusNode> _focusNodes = [
    FocusNode(),
    FocusNode(),
    FocusNode(),
  ];

  @override
  void initState() {
    _focusNodes.forEach((node) {
      node.addListener(() {
        setState(() {});
      });
    });
    super.initState();
  }

  @override
  void dispose() {
    _focusNodes.forEach((node) {
      node.removeListener(() {});
    });
    _cardNumberController.dispose();
    _expDateController.dispose();
    _cvvNumberController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<StripePaymentBloc, StripePaymentState>(
      listener: (context, state) {
        if (state is StripeCardCreated) {
          Nav.pop();
          return;
        }
        if (state is StripeError) {
          getIt.get<StripePaymentBloc>().add(PaymentMethodListEvent());
          showErrorDialog(
            context,
            trans('payment.stripe.errors.${state.code}.title'),
            trans('payment.stripe.errors.${state.code}.message'),
          );
          return;
        }
      },
      child: Container(
        // padding: MediaQuery.of(context).viewInsets,
        margin: EdgeInsets.only(top: 64.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(16.0),
            topRight: Radius.circular(16.0),
          ),
          color: theme.secondary0,
        ),

        padding: EdgeInsets.only(
          top: 16.0,
          left: 16.0,
          right: 16.0,
          // bottom: 16.0,
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Form(
          key: _formKey,
          child: Theme(
            data: ThemeData().copyWith(
              scaffoldBackgroundColor: Colors.white,
              colorScheme: ThemeData().colorScheme.copyWith(
                    primary: theme.secondary,
                  ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    height: 4.0,
                    width: 40.0,
                    margin: const EdgeInsets.only(bottom: 16.0),
                    decoration: BoxDecoration(
                      color: theme.secondary16,
                      borderRadius: const BorderRadius.all(
                        Radius.circular(8.0),
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: 24.0),
                  child: Text(
                    trans('payment.newCard.title'),
                    style: Fonts.satoshi(
                      fontSize: 24.0,
                      fontWeight: FontWeight.w700,
                      color: theme.secondary,
                    ),
                  ),
                ),
                FormTextFieldWidget(
                  controller: _cardNumberController,
                  // focusNode: _focusNodes[0],
                  labelKey: 'payment.newCard.hint.card_number',
                  icon: Icons.credit_card_outlined,
                  autofocus: true,
                  border: BorderRadius.only(
                    topRight: Radius.circular(16.0),
                    bottomRight: Radius.circular(0.0),
                    topLeft: Radius.circular(16.0),
                    bottomLeft: Radius.circular(0.0),
                  ),
                  keyboardType: TextInputType.number,
                  mask: MaskTextInputFormatter(
                    mask: '#### #### #### ####',
                    filter: {"#": RegExp('[0-9]')},
                  ),
                  onSaved: (value) {
                    setState(() {
                      _card.number = value?.replaceAll(' ', '');
                    });
                    log.d('Card number=${_card.number}');
                  },
                  validator: (value) {
                    _card.number = value?.replaceAll(' ', '');
                    log.d(
                        'Validate card: , ${_card.number} = ${_card.validateNumber()}');
                    return _card.validateNumber() ? null : '';
                  },
                ),
                Flex(
                  direction: Axis.horizontal,
                  children: [
                    Flexible(
                      flex: 1,
                      child: FormTextFieldWidget(
                        controller: _expDateController,
                        // focusNode: _focusNodes[1],
                        labelKey: 'payment.newCard.hint.expiry',
                        icon: Icons.event_outlined,
                        border: BorderRadius.only(
                          topRight: Radius.circular(0.0),
                          bottomRight: Radius.circular(0.0),
                          topLeft: Radius.circular(0.0),
                          bottomLeft: Radius.circular(16.0),
                        ),
                        keyboardType: TextInputType.number,
                        mask: MaskTextInputFormatter(
                          mask: '##/##',
                          filter: {"#": RegExp('[0-9]')},
                        ),
                        onSaved: (value) {
                          log.d('ExpDate.value=');
                          if (value == null ||
                              value.isEmpty ||
                              !value.contains('/')) {
                            return;
                          }
                          List<String> expDate = value.split('/');
                          if (expDate.length != 2) {
                            return;
                          }

                          setState(() {
                            _card.expMonth = int.tryParse(expDate[0]);
                            _card.expYear = int.tryParse(expDate[1]);
                          });
                          log.d(
                              'Card exp date=${_card.expMonth}/${_card.expYear}');
                        },
                        validator: (value) {
                          if (value == null ||
                              value.isEmpty ||
                              !value.contains('/')) {
                            return '';
                          }
                          List<String> expDate = value.split('/');
                          if (expDate.length != 2) {
                            return '';
                          }

                          _card.expMonth = int.tryParse(expDate[0]);
                          _card.expYear = int.tryParse(expDate[1]);
                          log.d(
                              'Validate expdate: , ${_card.expMonth}/${_card.expYear} = ${_card.validateDate()}');
                          return _card.validateDate() ? null : '';
                        },
                      ),
                    ),
                    Flexible(
                      flex: 1,
                      child: FormTextFieldWidget(
                        controller: _cvvNumberController,
                        // focusNode: _focusNodes[2],
                        labelKey: 'payment.newCard.hint.cvc',
                        icon: Icons.lock,
                        border: BorderRadius.only(
                          topRight: Radius.circular(0.0),
                          bottomRight: Radius.circular(16.0),
                          topLeft: Radius.circular(0.0),
                          bottomLeft: Radius.circular(0.0),
                        ),
                        keyboardType: TextInputType.number,
                        mask: MaskTextInputFormatter(
                          mask: '###',
                          filter: {"#": RegExp('[0-9]')},
                        ),
                        onSaved: (value) {
                          log.d('CVC.value=');
                          setState(() {
                            _card.cvc = value;
                          });
                        },
                        validator: (value) {
                          _card.cvc = value;
                          log.d(
                              'Validate cvc: , ${_card.cvc} = ${_card.validateCVC()}');
                          return _card.validateCVC() ? null : '';
                        },
                      ),
                    ),
                  ],
                ),
                Expanded(
                  child: BlocBuilder<StripePaymentBloc, StripePaymentState>(
                    builder: (context, state) {
                      if (state is StripePaymentLoading) {
                        return CenterLoadingWidget();
                      }
                      return Container();
                    },
                  ),
                ),
                if (_showErrorMessage)
                  Container(
                    margin: EdgeInsets.only(bottom: 16.0),
                    child: PaymentErrorWidget(
                      messageKey: 'payment.newCard.warning',
                      onTap: () => setState(() {
                        _showErrorMessage = false;
                      }),
                    ),
                  ),
                Container(
                  height: 56.0,
                  width: double.infinity,
                  margin: EdgeInsets.only(bottom: 16.0),
                  child: ElevatedButton(
                    onPressed: () => _validateAndSaveCard(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.button,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(40),
                      ),
                    ),
                    child: Text(
                      //trans(context, "cart.addToCart").toUpperCase(),
                      trans('payment.newCard.saveCard'),
                      style: Fonts.satoshi(
                        fontSize: 16.0,
                        fontWeight: FontWeight.w700,
                        color: theme.buttonText,
                      ),
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _validateAndSaveCard() {
    log.d('_validateAndSaveCard()');
    setState(() {
      _showErrorMessage = false;
    });
    if (_formKey.currentState?.validate() == true) {
      _formKey.currentState!.save();
      _card.number = _cardNumberController.text;
      setState(() {
        FocusScope.of(context).unfocus();
      });
      log.d('_validateAndSaveCard().VALID');
      getIt<StripePaymentBloc>().add(CreateStripeCardEvent(_card, ''));
    } else {
      log.d('_validateAndSaveCard().INVALID');
      setState(() {
        _showErrorMessage = true;
      });
    }
  }
}
