import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/cart/widgets/invoice_form_bottom_sheet.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:url_launcher/url_launcher.dart';

void showSelectPaymentMethodBottomSheet(BuildContext context) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  showModalBottomSheet(
    context: context,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(16.0),
        topRight: Radius.circular(16.0),
      ),
    ),
    enableDrag: true,
    isScrollControlled: true,
    elevation: 4.0,
    backgroundColor: theme.background,
    builder: (context) {
      return PaymentMethodSelectionBottomSheetWidget();
    },
  );
}

class PaymentMethodSelectionBottomSheetWidget extends StatefulWidget {
  @override
  _PaymentMethodSelectionBottomSheetWidgetState createState() =>
      _PaymentMethodSelectionBottomSheetWidgetState();
}

class _PaymentMethodSelectionBottomSheetWidgetState
    extends State<PaymentMethodSelectionBottomSheetWidget> {
  static const int PAYMENT_UNKNOWN = -1;
  static const int PAYMENT_INAPP = 0;
  static const int PAYMENT_CASH = 1;
  static const int PAYMENT_CARD = 2;
  bool wantsInvoce = false;

  int _selectedPaymentMethod = PAYMENT_UNKNOWN;

  @override
  Widget build(BuildContext context) {
    return BlocListener<CartBloc, BaseCartState>(
      listener: (BuildContext context, BaseCartState state) {
        if (state is EmptyCartState) {
          // Navigate away in case of an empty cart. The cart gets deleted after the order has been created
          Nav.pop();
          Nav.replace(MainNavigation(pageIndex: 2));
          _showDialog(context);
        } else if (state is CartErrorState) {
          Nav.pop();
        }
      },
      child: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, state) {
          if (state is UnitSelected) {
            print('Unit selected=${state.unit}');
            return _buildPaymentMethodList(context, state.unit);
          }

          return CenterLoadingWidget();
        },
      ),
    );
  }

  Widget _buildPaymentMethodList(BuildContext context, GeoUnit unit) {
    return Wrap(
      alignment: WrapAlignment.start,
      direction: Axis.horizontal,
      // crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.only(
            top: 19.0,
          ),
          child: Center(
            child: Text(
              trans('payment.choose'),
              style: GoogleFonts.poppins(
                fontSize: 16,
                color: theme.text,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ),
        Container(
          padding: EdgeInsets.only(
            top: 18.0,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // if (unit.paymentModes != null && unit.paymentModes.contains('INAPP'))
              _buildSelectPaymentMethodBottomSheetRadioItem(
                  context,
                  trans('payment.method.inAppPayment'),
                  "assets/icons/simplepay-logo.svg",
                  PAYMENT_INAPP,
                  createSimplePaymentInfo()),
              if (unit.paymentModes != null &&
                  unit.paymentModes.contains('CASH'))
                _buildSelectPaymentMethodBottomSheetRadioItem(
                    context,
                    trans('payment.method.cash'),
                    "assets/icons/cash_on_delivery_icon.svg",
                    PAYMENT_CASH),
              if (unit.paymentModes != null &&
                  unit.paymentModes.contains('CARD'))
                _buildSelectPaymentMethodBottomSheetRadioItem(
                    context,
                    trans('payment.method.creditCard'),
                    "assets/icons/credit_card_icon.svg",
                    PAYMENT_CARD),
              Padding(
                padding: const EdgeInsets.all(14),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      trans('payment.paymentInfo.invoicing.want_invoice'),
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        color: theme.text,
                        fontWeight: FontWeight.w500,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    Switch(
                        activeColor: theme.highlight,
                        value: wantsInvoce,
                        onChanged: (value) {
                          setState(() {
                            this.wantsInvoce = value;
                          });
                        })
                  ],
                ),
              )
            ],
          ),
        ),
        _buildSendCartButton(context, unit),
      ],
    );
  }

  Widget _buildSendCartButton(BuildContext context, GeoUnit unit) {
    return BlocBuilder<CartBloc, BaseCartState>(builder: (context, state) {
      bool loading = state is CartLoadingState;
      Widget buttonChild = Text(
        trans('payment.sendOrder'),
        style: GoogleFonts.poppins(
          fontSize: 18,
          color: theme.text2,
          fontWeight: FontWeight.w700,
        ),
      );
      if (loading) {
        buttonChild = CenterLoadingWidget(
          color: theme.highlight,
          size: 20.0,
          strokeWidth: 2.0,
        );
      } else if (wantsInvoce) {
        buttonChild = Text(
          trans('payment.paymentInfo.invoicing.invoice_info'),
          style: GoogleFonts.poppins(
            fontSize: 18,
            color: theme.text2,
            fontWeight: FontWeight.w700,
          ),
        );
      }

      return Container(
        height: 90.0,
        padding: EdgeInsets.only(
          top: 21.0,
          left: 14.0,
          right: 14.0,
          bottom: 14.0,
        ),
        width: double.infinity,
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            primary: theme.indicator,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          child: buttonChild,
          onPressed: (_selectedPaymentMethod != PAYMENT_UNKNOWN)
              ? () {
                  if (!loading) {
                    String payMentMethod = _getPaymentMethodNameFromNumberValue(
                        _selectedPaymentMethod);
                    if (wantsInvoce) {
                      showInvoiceFormBottomSheet(context, payMentMethod);
                    } else {
                      BlocProvider.of<CartBloc>(context).add(CreateAndSendOrder(
                        unit,
                        payMentMethod,
                      ));
                    }
                  }
                }
              : null,
        ),
      );
    });
  }

  String _getPaymentMethodNameFromNumberValue(int value) {
    switch (value) {
      case PAYMENT_INAPP:
        return 'INAPP';
      case PAYMENT_CASH:
        return 'CASH';
      case PAYMENT_CARD:
        return 'CARD';
      default:
        return 'UNKNOWN';
    }
  }

  Widget _buildSelectPaymentMethodBottomSheetRadioItem(
      BuildContext context, String title, String icon, int value,
      [Widget info]) {
    final isSelected = _selectedPaymentMethod == value;
    return InkWell(
      onTap: () {
        setState(() {
          _selectedPaymentMethod = value;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(
          top: 12.0,
          left: 12.0,
          right: 12.0,
        ),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14.0),
          border: Border.all(
            width: 1.5,
            color: isSelected ? theme.indicator : theme.border,
          ),
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Padding(
                  padding: EdgeInsets.only(
                    top: 13.0,
                    bottom: 14,
                    left: 16.0,
                    right: 6.0,
                  ),
                  child: SvgPicture.asset(
                    icon,
                    height: 73.0,
                    width: 73.0,
                  ),
                ),
                Expanded(
                  child: Text(
                    '$title',
                    style: GoogleFonts.poppins(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w600,
                      color: theme.text,
                    ),
                  ),
                ),
                Theme(
                  data: Theme.of(context).copyWith(
                    unselectedWidgetColor: theme.border, // Radio disabled color
                  ),
                  child: Container(
                    padding: EdgeInsets.only(
                      right: 10.0,
                    ),
                    child: Transform.scale(
                      scale: 1.5,
                      child: Radio<int>(
                        value: value,
                        groupValue: _selectedPaymentMethod,
                        onChanged: (int value) {
                          setState(() {
                            _selectedPaymentMethod = value;
                          });
                        },
                        activeColor: theme.indicator, // Radio selected color
                      ),
                    ),
                  ),
                ),
              ],
            ),
            if (isSelected && info != null) ...[info, SizedBox(height: 14.0)]
          ],
        ),
      ),
    );
  }

  void _showDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) {
        return SimpleDialog(
          children: <Widget>[
            Padding(
              padding: EdgeInsets.fromLTRB(0.0, 20.0, 0.0, 20.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  SizedBox(
                    width: 64.0,
                    height: 64.0,

                    // Check mark animation
                    child: SuccessAnimationWidget(),
                  ),

                  // Display message to the user
                  Padding(
                    padding: const EdgeInsets.only(top: 30.0),
                    child: Text(
                      trans('payment.orderPlaced'),
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 15.0,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  )
                ],
              ),
            )
          ],
        );
      },
    );
  }

  Widget createSimplePaymentInfo() {
    return RichText(
      textAlign: TextAlign.center,
      text: TextSpan(
        children: [
          TextSpan(
            text: trans('payment.paymentInfo.simplePay.prefix') + '\n',
            style: GoogleFonts.poppins(
              fontSize: 12.0,
              color: theme.text,
            ),
          ),
          TextSpan(
            text: trans('payment.paymentInfo.simplePay.paymentInfo'),
            style: GoogleFonts.poppins(
              fontSize: 12.0,
              decoration: TextDecoration.underline,
              color: theme.text,
            ),
            recognizer: TapGestureRecognizer()
              ..onTap = () {
                launch(getPaymentInfoLink(context));
              },
          ),
          TextSpan(
              text: ', ',
              style: GoogleFonts.poppins(
                fontSize: 12.0,
                color: theme.text,
              )),
          TextSpan(
            text: trans('dataTransfer.title'),
            style: GoogleFonts.poppins(
              fontSize: 12.0,
              decoration: TextDecoration.underline,
              color: theme.text,
            ),
            recognizer: TapGestureRecognizer()
              ..onTap = () => showSimpleDialog(context),
          ),
        ],
      ),
    );
  }
}

String getPaymentInfoLink(BuildContext context) {
  switch (Localizations.localeOf(context).languageCode) {
    case 'hu':
      return 'http://simplepartner.hu/PaymentService/Fizetesi_tajekoztato.pdf';
      break;
    default:
      return 'http://simplepartner.hu/PaymentService/Payment_information.pdf';
  }
}
