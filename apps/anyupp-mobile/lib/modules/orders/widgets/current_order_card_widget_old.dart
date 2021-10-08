import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/widgets/transaction_info_widget.dart';
import 'package:flutter/material.dart';

import 'order_simple_list_item_widget.dart';
import 'order_status_footer.dart';

class CurrentOrderCardWidgetOld extends StatelessWidget {
  const CurrentOrderCardWidgetOld({
    required this.order,
  });

  final Order order;

  @override
  Widget build(BuildContext context) {
    var state = getIt<UnitSelectBloc>().state;
    if (!(state is UnitSelected)) {
      throw CartException(code: CartException.UNKNOWN_ERROR, message: 'Unit can\'t be null');
    }

    return InkWell(
      onTap: () => Nav.to(OrderDetailsScreen(
        order: order,
        unit: state.unit,
      )),
      child: Container(
        margin: const EdgeInsets.only(
          top: 16.0,
          left: 12.0,
          right: 12.0,
        ),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(
            14.0,
          ),
          border: Border.all(width: 1.5, color: theme.secondary16),
          color: theme.secondary0,
        ),
        child: Container(
          padding: EdgeInsets.all(0.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              _buildOrderHeader(context, order),
              _buildDivider(context),
              OrderStatusFooter(order: order),
              // status == OrderStatus.ready ? _buildPayButtonWidget(context) : _buildTotalPrice(context, order),
              _buildTotalPrice(context, order),
              ..._buildOrderItemList(context, order),
              if (order.transaction?.receipt != null || order.transaction?.invoice != null)
                TransactionInfoWidget(order.transaction!),
              _buildPayButtonIfNeeded(context, order),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPayButtonIfNeeded(BuildContext context, Order order) {
    StatusLog status = order.statusLog[order.statusLog.length - 1];
    // print('_buildPayButtonIfNeeded().status=$status, payment=${order.paymentMode}');
    bool needButton = (status.status == 'none' && order.paymentMode.method == PaymentMethod.inapp);

    if (!needButton) {
      return Container();
    }

    return Container(
      height: 70.0,
      padding: EdgeInsets.only(
        // top: 21.0,
        left: 14.0,
        right: 14.0,
        bottom: 14.0,
      ),
      width: double.infinity,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          primary: theme.primary,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        child: Text(trans(context, 'payment.title')),
        onPressed: () => showSelectPaymentMethodBottomSheet(context, order.id),
      ),
    );
  }

  Widget _buildOrderHeader(BuildContext context, Order order) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(12.0),
          topRight: Radius.circular(12.0),
        ),
        color: theme.secondary12,
      ),
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
            '${order.orderNum}',
            style: Fonts.satoshi(
              fontSize: 12,
              color: theme.secondary,
            ),
          ),
          Text(
            order.getFormattedDate(),
            style: Fonts.satoshi(
              fontSize: 12,
              color: theme.secondary,
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildOrderItemList(BuildContext context, Order order) {
    List<Widget> results = [];
    for (int i = 0; i < order.items.length; i++) {
      OrderItem item = order.items[i];
      results.add(
        OrderSimpleListItemWidget(orderItem: item),
      );

      if (i < order.items.length - 1) {
        results.add(_buildDivider(context));
      }
    }

    return results;
  }

  Widget _buildTotalPrice(BuildContext context, Order order) {
    return Container(
      padding: EdgeInsets.only(
        top: 12.0,
        bottom: 20.0,
        left: 20.0,
        right: 20.0,
      ),
      color: theme.secondary12,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            trans(context, 'orders.totalCost'),
            style: Fonts.satoshi(
              fontSize: 16,
              color: theme.secondary,
              fontWeight: FontWeight.w700,
            ),
          ),
          Text(
            formatCurrency(order.sumPriceShown.priceSum, order.items[0].priceShown.currency),
            style: Fonts.satoshi(
              fontSize: 16,
              color: theme.secondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider(BuildContext context) {
    return Divider(
      color: theme.secondary64.withOpacity(0.4),
      height: 2.0,
    );
  }
}
