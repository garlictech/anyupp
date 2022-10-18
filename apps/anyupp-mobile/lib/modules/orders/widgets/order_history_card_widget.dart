import 'package:anyupp/models/ProductComponent.dart';

import '/models.dart';
import '/shared/locale.dart';
import '/core/theme/theme.dart';
import '/shared/utils/format_utils.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';

import '/modules/orders/orders.dart';

import 'order_simple_list_item_widget.dart';
import '/graphql/generated/crud-api.dart';

class OrderHistoryCard extends StatelessWidget {
  final Order order;
  final List<ProductComponent> productComponents;

  const OrderHistoryCard({
    required this.productComponents,
    required this.order,
  });

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
          color: theme.secondary40,
        ),
        color: theme.secondary0,
      ),
      child: Container(
        padding: EdgeInsets.all(0.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            _buildOrderHeader(context),
            _buildDivider(context),
            ..._buildOrderItemList(context),
            if (order.transaction != null)
              TransactionInfoWidget(order.transaction!),
            _buildFooter(context),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider(BuildContext context) {
    return Divider(
      color: theme.secondary64.withOpacity(0.4),
      height: 1.5,
    );
  }

  Widget _buildOrderHeader(BuildContext context) {
    OrderStatus status = order.status;

    return ClipRect(
      child: Banner(
        message: trans(context, 'orders.status.${enumToString(status)!}'),
        location: BannerLocation.topEnd,
        color: status == OrderStatus.rejected ? Colors.red : Colors.green,
        textStyle: Fonts.satoshi(
          color: Colors.white,
          fontSize: 8.0,
        ),
        child: Container(
          decoration: BoxDecoration(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(14.0),
                topRight: Radius.circular(14.0),
              ),
              color: theme.secondary12),
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
              Padding(
                padding: const EdgeInsets.only(
                  right: 20.0,
                ),
                child: Text(
                  order.getFormattedDate(),
                  style: Fonts.satoshi(
                    fontSize: 12,
                    color: theme.secondary,
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
      OrderItem orderItem = order.items[i];
      results.add(
        OrderSimpleListItemWidget(
            orderItem: orderItem, productComponents: productComponents),
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
        color: theme.secondary12,
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
            style: Fonts.satoshi(
              fontSize: 16,
              color: theme.secondary,
              fontWeight: FontWeight.w700,
            ),
          ),
          Text(
            formatCurrency(order.sumPriceShown.priceSum,
                order.items[0].priceShown.currency),
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
}
