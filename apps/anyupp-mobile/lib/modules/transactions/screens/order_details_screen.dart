import 'package:auto_size_text/auto_size_text.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets/app_bar.dart';
import 'package:fa_prev/shared/widgets/loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

class OrderDetailsScreen extends StatelessWidget {
  OrderDetailsScreen();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar:
            appBar(theme, onBackButtonPressed: () => Nav.pop(), title: trans(context, 'profile.transactions.details')),
        // The appBar head text
        backgroundColor: theme.background,
        body: BlocBuilder<OrderBloc, BaseOrderState>(
          builder: (context, state) {
            if (state is OrderDetailLoadedState) {
              return _buildLoadedOrderDetails(context, state.order!);
            }

            return CenterLoadingWidget();
          },
        ));
  }

  Widget _buildLoadedOrderDetails(context, Order order) {
    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            margin: const EdgeInsets.only(
              top: 16.0,
              left: 12.0,
              right: 12.0,
            ),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(
                14.0,
              ),
              border: Border.all(
                width: 1.5,
                color: theme.border2,
              ),
              color: theme.background,
            ),
            child: Container(
              padding: EdgeInsets.all(0.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.start,
                children: <Widget>[
                  _buildOrderHeader(context, order),
                  _buildDivider(context),
                  _buildOrderDeatails(context, order),
                  _buildFooter(context, order),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider(BuildContext context) {
    return Divider(
      color: theme.disabled.withOpacity(0.4),
      height: 1.5,
    );
  }

  Widget _buildOrderHeader(BuildContext context, Order order) {
    return ClipRect(
      child: Container(
        decoration: BoxDecoration(
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(14.0),
              topRight: Radius.circular(14.0),
            ),
            color: theme.background2),
        padding: EdgeInsets.only(
          top: 14.0,
          bottom: 14.0,
          left: 20.0,
          right: 20.0,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Padding(
              padding: const EdgeInsets.only(
                right: 20.0,
              ),
              child: Text(
                order.getFormattedDate(),
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: theme.text,
                ),
              ),
            ),
            RichText(
              textAlign: TextAlign.center,
              text: TextSpan(
                children: [
                  TextSpan(
                    text: order.orderNum,
                    style: GoogleFonts.poppins(
                      fontSize: 14.0,
                      color: Color(0x993C2F2F),
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildOrderDeatails(BuildContext context, Order order) {
    List<Widget> itemRows = [];
    for (OrderItem item in order.items) {
      itemRows.add(
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Row(
            //mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                flex: 5,
                child: AutoSizeText(
                  getLocalizedText(context, item.productName),
                  style: GoogleFonts.poppins(
                    //fontSize: 14,
                    color: theme.text,
                  ),
                  maxLines: 1,
                ),
              ),
              SizedBox(
                width: 20,
              ),
              Expanded(
                flex: 1,
                child: AutoSizeText(
                  formatCurrency(item.sumPriceShown.priceSum, item.priceShown.currency),
                  style: GoogleFonts.poppins(
                    //fontSize: 14,
                    color: theme.text,
                  ),
                  maxLines: 1,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.only(
        top: 20.0,
        bottom: 20.0,
        left: 20.0,
        right: 20.0,
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: itemRows),
    );
  }

  Widget _buildFooter(BuildContext context, Order order) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(14.0),
          bottomRight: Radius.circular(14.0),
        ),
        color: theme.background2,
      ),
      padding: EdgeInsets.only(
        top: 12.0,
        bottom: 20.0,
        left: 20.0,
        right: 20.0,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            trans(context, 'orders.totalCost'),
            style: GoogleFonts.poppins(
              fontSize: 16,
              color: theme.text,
              fontWeight: FontWeight.w700,
            ),
          ),
          Text(
            formatCurrency(order.sumPriceShown.priceSum, order.sumPriceShown.currency),
            style: GoogleFonts.poppins(
              fontSize: 16,
              color: theme.text,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
