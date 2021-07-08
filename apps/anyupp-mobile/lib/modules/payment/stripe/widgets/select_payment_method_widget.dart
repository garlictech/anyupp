import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/modules/payment/stripe/widgets/payment_button_widget.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class SelectStripePaymentMethodWidget extends StatefulWidget {
  final OnPaymentMethodSelected onItemSelected;
  final String orderId;
  final UserInvoiceAddress userInvoiceAddress;

  const SelectStripePaymentMethodWidget(
      {Key key, this.orderId, this.userInvoiceAddress, this.onItemSelected})
      : super(key: key);

  @override
  _SelectStripePaymentMethodWidgetState createState() =>
      _SelectStripePaymentMethodWidgetState();
}

class _SelectStripePaymentMethodWidgetState
    extends State<SelectStripePaymentMethodWidget> {
  // StripePaymentMethod _selectedCard;
  int selectedItem = 0;

  @override
  void initState() {
    super.initState();
    print('SelectStripePaymentMethodWidget.initState()');
    getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 16, horizontal: 16),
      height: MediaQuery.of(context).size.height *
          0.76, // 76 percent of the screen height
      child: LayoutBuilder(
        builder: (_, constrains) {
          return Container(
            height: constrains.maxHeight,
            child: Column(
              // mainAxisAlignment: MainAxisAlignment.spaceBetween,
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                Expanded(child: Center(child: _buildPaymentMethodList(context))),
                // Spacer(),
                SizedBox(height: 8),
                BlocBuilder<StripePaymentBloc, StripePaymentState>(
                  builder: (context, state) {
                    if (state is StripePaymentMethodsList) {
                      if (state.data != null && state.data.isNotEmpty) {
                        return PaymentButtonWidget(() {
                          getIt<StripePaymentBloc>()
                              .add(StartStripePaymentWithExistingCardEvent(
                            orderId: widget.orderId,
                            paymentMethodId: state.data[selectedItem].id,
                            invoiceAddress: widget.userInvoiceAddress,
                          ));
                        });
                      } else {
                        return Container();
                      }
                    }
                    return Container();
                  },
                ),
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
                setState(() {
                  selectedItem = state.data.indexOf(method);
                });

                // widget.onItemSelected(method);
              },
              selected: selectedItem,
            ),
          );
        }
        if (state is StripeError) {
          return CommonErrorWidget(
              error: state.code, description: state.message);
        }
        if (state is StripePaymentLoading) {
          return CenterLoadingWidget();
        }
        return NoPaymentMethodsWidget();
      },
    );
  }
}
