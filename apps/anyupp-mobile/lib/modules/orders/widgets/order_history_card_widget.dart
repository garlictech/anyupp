import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:fa_prev/modules/orders/orders.dart';
import 'order_simple_list_item_widget.dart';

class OrderHistoryCard extends StatelessWidget {
  final PlacedOrder order;

  const OrderHistoryCard({Key key, this.order}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
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
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            _buildOrderHeader(context),
            _buildDivider(context),
            ..._buildOrderItemList(context),
            _buildFooter(context),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider(BuildContext context) {
    return Divider(
      color: theme.disabled.withOpacity(0.4),
      height: 1.5,
    );
  }

  Widget _buildOrderHeader(BuildContext context) {
    var statusKeys = order.statusLog.keys.toList()..sort();
    String status = order.statusLog[statusKeys.last].status;

    return ClipRect(
      child: Banner(
        message: trans(context, 'orders.status.$status'),
        location: BannerLocation.topEnd,
        color: status == OrderStatus.REJECTED ? Colors.red : Colors.green,
        textStyle: GoogleFonts.poppins(
          color: Colors.white,
          fontSize: 13.0,
        ),
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
              Text(
                '${order.id}',
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: theme.text,
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(
                  right: 20.0,
                ),
                child: Text(
                  DF_SHORT.format(order.created),
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: theme.text,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> _buildOrderItemList(BuildContext context) {
    List<Widget> results = [];
    for (var i = 0; i < order.items.length; i++) {
      Item orderItem = order.items[i];
      results.add(
        OrderSimpleListItemWidget(orderItem: orderItem),
      );

      if (i < order.items.length - 1) {
        results.add(
          Padding(
            padding: const EdgeInsets.only(
              left: 20.0,
              right: 20.0,
            ),
            child: _buildDivider(context),
          ),
        );
      }
    }

    return results;
  }

  Widget _buildFooter(BuildContext context) {
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
            formatCurrency(order.sumPriceShown.priceSum, order.items[0].priceShown.currency),
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
