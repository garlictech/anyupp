import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
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
  // StripePaymentMethod _selectedCard;

  @override
  void initState() {
    super.initState();
    print('SelectStripePaymentMethodWidget.initState()');
    getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 16, horizontal: 0),
      height: MediaQuery.of(context).size.height * 0.76, // 76 percent of the screen height
      child: LayoutBuilder(
        builder: (_, constrains){
          return Container(
            height: constrains.maxHeight,
            child: Column(
            // mainAxisAlignment: MainAxisAlignment.spaceBetween,
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Expanded(child: _buildPaymentMethodList(context)),
              // Spacer(),
              SizedBox(height: 8),
              _buildSelectPaymentMethodButton(),
            ],
        ),
          );

        },
      ),
      // child: Stack(
      //   // mainAxisAlignment: MainAxisAlignment.spaceBetween,
      //   children: [
      //     SingleChildScrollView(
      //       physics: BouncingScrollPhysics(),
      //       child: Container(
      //         padding: EdgeInsets.only(top: 12.0),
      //         child: _buildPaymentMethodList(context),
      //       ),
      //     ),
      //     Positioned(
      //       bottom: 8.0,
      //       left: 8.0,
      //       right: 8.0,
      //       child: _buildSelectPaymentMethodButton(),
      //     ),
      //   ],
      // ),
    );
  }

  Widget _buildSelectPaymentMethodButton() {
    return Container(
      //height: 57.0,
      padding: EdgeInsets.all(0.0),
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.zero,
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
        onPressed: () => Nav.pop(),
        child: Text(
          trans('common.close'),
          style: GoogleFonts.poppins(
            fontSize: 14.0,
            color: theme.text,
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentMethodList(BuildContext context) {
    return BlocBuilder<StripePaymentBloc, StripePaymentState>(
      builder: (context, StripePaymentState state) {
        // print('SelectStripePaymentMethodWidget.state=$state');
        if (state is StripePaymentMethodsList) {
          if (state.data == null || state.data.isEmpty) {
            return SingleChildScrollView(child: NoPaymentMethodsWidget());
          }
          return SingleChildScrollView(
            child: StripePaymentMethodListWidget(
              methods: state.data ?? [],
              onItemSelected: (StripePaymentMethod method) {
                print('SelectStripePaymentMethodWidget.Card selected=$method');
                widget.onItemSelected(method);
              },
            ),
          );
        }
        if (state is StripeError) {
          return CommonErrorWidget(error: state.code, description: state.message);
        }
        if (state is StripePaymentLoading) {
          return  CenterLoadingWidget();
        }
        return NoPaymentMethodsWidget();
      },
    );
  }
}
