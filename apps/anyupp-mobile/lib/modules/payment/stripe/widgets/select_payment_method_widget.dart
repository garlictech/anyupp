import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/shared/locale.dart';

class SelectStripePaymentMethodWidget extends StatefulWidget {
  final OnPaymentMethodSelected onItemSelected;

  const SelectStripePaymentMethodWidget({Key key, this.onItemSelected}) : super(key: key);

  @override
  _SelectStripePaymentMethodWidgetState createState() => _SelectStripePaymentMethodWidgetState();
}

class _SelectStripePaymentMethodWidgetState extends State<SelectStripePaymentMethodWidget> {
  StripePaymentMethod _selectedCard;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(8.0),
      height: 480.0,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            padding: EdgeInsets.only(top: 12.0),
            child: _buildPaymentMethodList(context),
          ),
          Container(
            //height: 57.0,
            padding: EdgeInsets.all(8.0),
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.all(Radius.zero),
              border: Border.all(
                width: 1.5,
                color: theme.border,
              ),
            ),
            child: TextButton(
              style: TextButton.styleFrom(
                backgroundColor: Colors.transparent,
                padding: EdgeInsets.all(8.0),
              ),
              onPressed: widget.onItemSelected == null
                  ? () => Nav.pop()
                  : () {
                      Nav.pop();
                      widget.onItemSelected(_selectedCard);
                    },
              child: Text(
                trans('common.select'),
                style: GoogleFonts.poppins(
                  fontSize: 14.0,
                  color: theme.text,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentMethodList(BuildContext context) {
    return BlocBuilder<StripePaymentBloc, StripePaymentState>(
      builder: (context, StripePaymentState state) {
        print('SelectStripePaymentMethodWidget.state=$state');
        if (state is StripePaymentMethodsList) {
          if (state.data == null) {
            return NoPaymentMethodsWidget();
          }
          return StripePaymentMethodListWidget(
            methods: state.data ?? [],
            onItemSelected: (StripePaymentMethod method) {
              print('SelectStripePaymentMethodWidget.Card selected=$method');
              setState(() {
                _selectedCard = method;
              });
            },
          );
        }
        if (state is StripeError) {
          return CommonErrorWidget(error: state.code, description: state.message);
        }
        if (state is StripePaymentLoading) {
          return CenterLoadingWidget();
        }
        return NoPaymentMethodsWidget();
      },
    );
  }
}
