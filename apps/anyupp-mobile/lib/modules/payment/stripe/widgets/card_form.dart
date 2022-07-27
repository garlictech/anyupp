import 'package:awesome_card/credit_card.dart';
import '/core/core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

/// Basic form to add or edit a credit card, with complete validation.
class CardFormWidget extends StatefulWidget {
  CardFormWidget(
      {Key? key,
      formKey,
      card,
      this.cardNumberDecoration,
      this.cardNumberTextStyle,
      this.cardExpiryDecoration,
      this.cardExpiryTextStyle,
      this.cardCvcDecoration,
      this.cardCvcTextStyle,
      this.cardNumberErrorText,
      this.cardExpiryErrorText,
      this.cardCvcErrorText,
      this.cardDecoration,
      this.postalCodeDecoration,
      this.postalCodeTextStyle,
      this.postalCodeErrorText,
      this.displayPostalCode = false,
      this.displayAnimatedCard = !kIsWeb && false})
      : card = card ?? StripeCard(),
        formKey = formKey ?? GlobalKey(),
        super(key: key);

  final GlobalKey<FormState> formKey;
  final StripeCard card;
  final bool displayAnimatedCard;
  final InputDecoration? cardNumberDecoration;
  final TextStyle? cardNumberTextStyle;
  final InputDecoration? cardExpiryDecoration;
  final TextStyle? cardExpiryTextStyle;
  final InputDecoration? cardCvcDecoration;
  final TextStyle? cardCvcTextStyle;
  final InputDecoration? postalCodeDecoration;
  final TextStyle? postalCodeTextStyle;
  final String? cardNumberErrorText;
  final String? postalCodeErrorText;
  final String? cardExpiryErrorText;
  final String? cardCvcErrorText;
  final Decoration? cardDecoration;
  final bool displayPostalCode;

  @override
  _CardFormWidgetState createState() => _CardFormWidgetState();
}

class _CardFormWidgetState extends State<CardFormWidget> {
  final StripeCard _validationModel = StripeCard();
  bool cvcHasFocus = false;

  @override
  Widget build(BuildContext context) {
    var cardExpiry = 'MM/YY';
    if (_validationModel.expMonth != null) {
      cardExpiry =
          "${_validationModel.expMonth}/${_validationModel.expYear ?? 'YY'}";
    }

    return Container(
      color: theme.secondary0,
      child: SingleChildScrollView(
        child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _getCreditCardView(cardExpiry),
              Form(
                key: widget.formKey,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                  ),
                  child: Column(
                    children: <Widget>[
                      Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        margin: const EdgeInsets.only(top: 16),
                        child: CardNumberFormField(
                          initialValue:
                              _validationModel.number ?? widget.card.number,
                          onChanged: (number) {
                            setState(() {
                              _validationModel.number = number;
                            });
                          },
                          validator: (text) => _validationModel.validateNumber()
                              ? null
                              : widget.cardNumberErrorText ??
                                  CardNumberFormField.defaultErrorText,
                          textStyle:
                              widget.cardNumberTextStyle ?? _defaultTextStyle,
                          onSaved: (text) => widget.card.number = text,
                          decoration: widget.cardNumberDecoration ??
                              CardNumberFormField.defaultDecoration,
                        ),
                      ),
                      Container(
                          padding: const EdgeInsets.symmetric(vertical: 8.0),
                          margin: const EdgeInsets.only(top: 8),
                          child: CardExpiryFormField(
                            initialMonth: _validationModel.expMonth ??
                                widget.card.expMonth,
                            initialYear:
                                _validationModel.expYear ?? widget.card.expYear,
                            onChanged: (int? month, int? year) {
                              setState(() {
                                _validationModel.expMonth = month;
                                _validationModel.expYear = year;
                              });
                            },
                            onSaved: (int? month, int? year) {
                              widget.card.expMonth = month;
                              widget.card.expYear = year;
                            },
                            validator: (text) => _validationModel.validateDate()
                                ? null
                                : widget.cardExpiryErrorText ??
                                    CardExpiryFormField.defaultErrorText,
                            textStyle:
                                widget.cardExpiryTextStyle ?? _defaultTextStyle,
                            decoration: widget.cardExpiryDecoration ??
                                CardExpiryFormField.defaultDecoration,
                          )),
                      Container(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        margin: const EdgeInsets.only(top: 8),
                        child: Focus(
                          onFocusChange: (value) =>
                              setState(() => cvcHasFocus = value),
                          child: CardCvcFormField(
                            initialValue:
                                _validationModel.cvc ?? widget.card.cvc,
                            onChanged: (text) =>
                                setState(() => _validationModel.cvc = text),
                            onSaved: (text) => widget.card.cvc = text,
                            validator: (text) => _validationModel.validateCVC()
                                ? null
                                : widget.cardCvcErrorText ??
                                    CardCvcFormField.defaultErrorText,
                            textStyle:
                                widget.cardCvcTextStyle ?? _defaultTextStyle,
                            decoration: widget.cardCvcDecoration ??
                                CardCvcFormField.defaultDecoration,
                          ),
                        ),
                      ),
                      if (widget.displayPostalCode == true)
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 8.0),
                          margin: const EdgeInsets.only(top: 8),
                          child: TextFormField(
                            keyboardType: TextInputType.number,
                            textInputAction: TextInputAction.done,
                            initialValue: _validationModel.postalCode ??
                                widget.card.postalCode,
                            onChanged: (text) => setState(
                                () => _validationModel.postalCode = text),
                            onSaved: (text) => widget.card.postalCode = text,
                            autofillHints: [AutofillHints.postalCode],
                            validator: (text) =>
                                _validationModel.isPostalCodeValid()
                                    ? null
                                    : widget.postalCodeErrorText ??
                                        'Invalid postal code',
                            style: widget.postalCodeTextStyle ??
                                TextStyle(color: Colors.black),
                            decoration: widget.postalCodeDecoration ??
                                InputDecoration(
                                    border: OutlineInputBorder(),
                                    labelText: 'Postal code'),
                          ),
                        )
                    ],
                  ),
                ),
              ),
            ]),
      ),
    );
  }

  Widget _getCreditCardView(String cardExpiry) {
    log.d('_getCreditCardView().theme.light=${theme.light}');
    if (!widget.displayAnimatedCard) return Padding(padding: EdgeInsets.zero);

    return Padding(
      padding: const EdgeInsets.only(top: 16.0),
      child: CreditCard(
        cardNumber: _validationModel.number ?? '',
        cardExpiry: cardExpiry,
        cvv: _validationModel.cvc ?? '',
        frontTextColor: theme.secondary0,
        backTextColor: theme.secondary0,
        frontBackground: widget.cardDecoration != null
            ? Container(
                width: double.maxFinite,
                height: double.maxFinite,
                decoration: widget.cardDecoration,
              )
            : theme.light
                ? _light()
                : _dark(),
        backBackground: theme.light ? _light() : _dark(),
        showBackSide: cvcHasFocus,
        showShadow: true,
      ),
    );
  }

  TextStyle get _defaultTextStyle => TextStyle(color: theme.secondary);

  Widget _light() {
    return Container(
      width: double.maxFinite,
      height: double.maxFinite,
      color: theme.secondary,
    );
  }

  Widget _dark() {
    return Container(
      width: double.maxFinite,
      height: double.maxFinite,
      color: theme.secondary40,
    );
  }
}
